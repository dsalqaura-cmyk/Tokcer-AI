import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import Header from '../components/dashboard/Header.jsx';
import { dashboardTranslations } from '../locales/dashboardLocales.js';

const HppCalculator = () => {
    const navigate = useNavigate();
    const [lang] = useState(localStorage.getItem('tokcer_lang') || 'id');
    const t = (key) => dashboardTranslations[lang]?.[key] || key;

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [platformFees, setPlatformFees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form States
    const [skuName, setSkuName] = useState('');
    const [modalBeli, setModalBeli] = useState(0);
    const [biayaPackaging, setBiayaPackaging] = useState(0);
    const [biayaLain, setBiayaLain] = useState(0);
    const [biayaInbound, setBiayaInbound] = useState(0);

    const [platform, setPlatform] = useState('shopee');
    const [category, setCategory] = useState('umum');
    const [komisiOverride, setKomisiOverride] = useState(null);
    const [logistikFlat, setLogistikFlat] = useState(0);
    const [adsPersen, setAdsPersen] = useState(0);
    const [affiliatorPersen, setAffiliatorPersen] = useState(0);
    const [adminFeeFlat, setAdminFeeFlat] = useState(0);

    const [targetMargin, setTargetMargin] = useState(20);
    const [hargaJualAktual, setHargaJualAktual] = useState(0);
    const [diskonVoucher, setDiskonVoucher] = useState(0);
    const [estimasiOrder, setEstimasiOrder] = useState(200);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const isAdminAuth = localStorage.getItem('tokcer_admin_auth') === 'true';

            if (!session && !isAdminAuth) {
                navigate('/login');
                return;
            }
            
            if (session) {
                setUser(session.user);
                const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                setProfile(prof);
            } else if (isAdminAuth) {
                // Mock admin profile for calculator logic
                setProfile({ subscription_plan: 'ultimate', tokens: 999999 });
            }

            const { data: fees } = await supabase.from('platform_fees').select('*');
            setPlatformFees(fees || []);
            setIsLoading(false);
        };
        init();
    }, [navigate]);

    // Auto-fill fees when platform/category changes
    useEffect(() => {
        const feeConfig = platformFees.find(f => f.platform_name === platform && f.category_name === category);
        if (feeConfig) {
            setKomisiOverride(feeConfig.commission_percent);
            setLogistikFlat(feeConfig.logistics_fixed_fee);
        }
    }, [platform, category, platformFees]);

    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const calc = useMemo(() => {
        const hpp = Number(modalBeli) + Number(biayaPackaging) + Number(biayaLain) + Number(biayaInbound);
        const komisiP = Number(komisiOverride || 0);
        const adsP = Number(adsPersen);
        const affP = Number(affiliatorPersen);
        const totalPersenFee = (komisiP + adsP + affP) / 100;
        
        const price = Number(hargaJualAktual) || 0;
        
        // BEP Calc: (HPP + logistik + admin + diskon) / (1 - komisi% - ads% - affiliator%)
        const bep = (hpp + Number(logistikFlat) + Number(adminFeeFlat) + Number(diskonVoucher)) / (1 - totalPersenFee);
        
        // Recommended Price based on target margin
        const recommendedPrice = (hpp + Number(logistikFlat) + Number(adminFeeFlat) + Number(diskonVoucher)) / (1 - totalPersenFee - (Number(targetMargin) / 100));

        const finalPrice = price || recommendedPrice;
        const platformFeeVal = (totalPersenFee * finalPrice) + Number(logistikFlat) + Number(adminFeeFlat);
        const profit = finalPrice - hpp - platformFeeVal - Number(diskonVoucher);
        const margin = finalPrice > 0 ? (profit / finalPrice) * 100 : 0;
        const roi = hpp > 0 ? (profit / hpp) * 100 : 0;

        return {
            hpp,
            platformFeeVal,
            profit,
            margin,
            roi,
            bep,
            recommendedPrice,
            omzet: finalPrice * estimasiOrder,
            netProfit: profit * estimasiOrder
        };
    }, [modalBeli, biayaPackaging, biayaLain, biayaInbound, komisiOverride, adsPersen, affiliatorPersen, logistikFlat, adminFeeFlat, hargaJualAktual, diskonVoucher, targetMargin, estimasiOrder]);

    const handleSave = async () => {
        const plan = (profile?.subscription_plan || 'starter').toLowerCase();
        if (plan === 'starter') {
            alert("Upgrade to PRO to save your SKU calculations!");
            return;
        }

        const { error } = await supabase.from('sku_calculations').insert([{
            user_id: user.id,
            sku_name: skuName || 'Unnamed SKU',
            modal_beli: modalBeli,
            biaya_packaging: biayaPackaging,
            biaya_lain_lain: biayaLain,
            biaya_ongkir_inbound: biayaInbound,
            platform,
            category,
            komisi_persen: komisiOverride,
            logistik_flat: logistikFlat,
            ads_persen: adsPersen,
            affiliator_persen: affiliatorPersen,
            admin_fee_flat: adminFeeFlat,
            target_margin_persen: targetMargin,
            harga_jual_aktual: hargaJualAktual,
            diskon_voucher: diskonVoucher,
            estimasi_order_per_bulan: estimasiOrder
        }]);

        if (error) alert("Error saving: " + error.message);
        else alert("SKU Saved Successfully!");
    };

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="flex h-screen bg-[#050505] text-white font-['Inter',sans-serif] overflow-hidden">
            <Sidebar activeSection="tab-calculator" setActiveSection={() => navigate('/dashboard')} />
            
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header t={t} activeSection="HPP & Margin Calculator" />
                
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="max-w-6xl mx-auto space-y-8">
                        
                        {/* Title Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter uppercase text-white">HPP <span className="text-orange-500">& Margin</span> Explorer</h1>
                                <p className="text-zinc-500 text-sm font-medium mt-1 uppercase tracking-widest">Optimasi Profit Real-time Mei 2026</p>
                            </div>
                            <button onClick={handleSave} className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 flex items-center gap-2">
                                <iconify-icon icon="solar:diskette-bold-duotone" className="text-xl"></iconify-icon>
                                SIMPAN SKU
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Input Panel */}
                            <div className="lg:col-span-8 space-y-8">
                                
                                {/* Section A: Biaya Produksi */}
                                <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-50"></div>
                                    <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <iconify-icon icon="solar:box-bold-duotone"></iconify-icon>
                                        Section A: Biaya Produksi (HPP)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nama SKU</label>
                                            <input type="text" value={skuName} onChange={(e) => setSkuName(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none transition-all" placeholder="Contoh: Kaos Polos Premium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Modal Beli (Rp)</label>
                                            <input type="number" value={modalBeli} onChange={(e) => setModalBeli(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Packaging (Rp)</label>
                                            <input type="number" value={biayaPackaging} onChange={(e) => setBiayaPackaging(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Inbound Gudang (Rp/unit)</label>
                                            <input type="number" value={biayaInbound} onChange={(e) => setBiayaInbound(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between items-center">
                                        <span className="text-xs font-bold text-zinc-400 uppercase">Total HPP per Unit</span>
                                        <span className="text-xl font-black text-white tracking-tighter">{formatRp(calc.hpp)}</span>
                                    </div>
                                </div>

                                {/* Section B: Biaya Platform */}
                                <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50"></div>
                                    <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <iconify-icon icon="solar:shop-2-bold-duotone"></iconify-icon>
                                        Section B: Biaya Platform & Ads
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pilih Platform</label>
                                            <div className="flex gap-2 p-1 bg-black/40 border border-zinc-800 rounded-xl">
                                                {['shopee', 'tiktok_shop', 'website'].map(p => (
                                                    <button key={p} onClick={() => setPlatform(p)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${platform === p ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
                                                        {p.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Kategori Produk</label>
                                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all appearance-none capitalize">
                                                <option value="fashion">Fashion</option>
                                                <option value="elektronik">Elektronik</option>
                                                <option value="umum">Umum (Lainnya)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Komisi Platform (%)</label>
                                            <input type="number" value={komisiOverride || 0} onChange={(e) => setKomisiOverride(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Budgetting Ads (% Harga)</label>
                                            <input type="number" value={adsPersen} onChange={(e) => setAdsPersen(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Logistik Platform (Rp Flat)</label>
                                            <input type="number" value={logistikFlat} onChange={(e) => setLogistikFlat(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Komisi Affiliate (%)</label>
                                            <input type="number" value={affiliatorPersen} onChange={(e) => setAffiliatorPersen(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section C: Pricing Strategy */}
                                <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-50"></div>
                                    <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <iconify-icon icon="solar:calculator-bold-duotone"></iconify-icon>
                                        Section C: Strategi Harga Jual
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Harga Jual Aktual (Rp)</label>
                                            <input type="number" value={hargaJualAktual} onChange={(e) => setHargaJualAktual(e.target.value)} className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all font-bold text-emerald-400" placeholder="Kosongkan untuk auto-calc" />
                                            <p className="text-[9px] text-zinc-500 italic">Isi untuk hitung profit aktual, kosongkan untuk cari harga rekomendasi.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Target Margin Bersih (%)</label>
                                            <input type="number" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estimasi Order / Bulan</label>
                                            <input type="number" value={estimasiOrder} onChange={(e) => setEstimasiOrder(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Diskon Voucher (Rp/transaksi)</label>
                                            <input type="number" value={diskonVoucher} onChange={(e) => setDiskonVoucher(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Result Panel */}
                            <div className="lg:col-span-4 space-y-6">
                                
                                {/* Primary Result Card */}
                                <div className={`rounded-3xl p-8 border transition-all duration-500 ${calc.margin < 5 ? 'bg-red-950/20 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.1)]'}`}>
                                    <div className="space-y-1 mb-8">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Net Profit per Unit</p>
                                        <h2 className={`text-4xl font-black tracking-tighter ${calc.profit < 0 ? 'text-red-500' : 'text-white'}`}>{formatRp(calc.profit)}</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/40 border border-zinc-800/50 p-4 rounded-2xl">
                                            <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Margin Bersih</p>
                                            <p className={`text-lg font-black ${calc.margin < 5 ? 'text-red-500' : 'text-emerald-400'}`}>{calc.margin.toFixed(1)}%</p>
                                        </div>
                                        <div className="bg-black/40 border border-zinc-800/50 p-4 rounded-2xl">
                                            <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">ROI Modal</p>
                                            <p className="text-lg font-black text-blue-400">{calc.roi.toFixed(1)}%</p>
                                        </div>
                                    </div>

                                    {calc.profit < 0 && (
                                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
                                            <iconify-icon icon="solar:danger-bold" className="text-red-500 text-xl"></iconify-icon>
                                            <p className="text-[10px] font-bold text-red-500 uppercase leading-relaxed">Peringatan: Harga jual di bawah BEP. Anda rugi per transaksi!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Projections */}
                                <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 space-y-6">
                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Proyeksi Bulanan ({estimasiOrder} pcs)</h4>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-zinc-500 font-medium">Estimasi Omzet</span>
                                            <span className="text-sm font-bold text-white">{formatRp(calc.omzet)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-zinc-500 font-medium">Estimasi Profit</span>
                                            <span className="text-sm font-black text-emerald-400">{formatRp(calc.netProfit)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-zinc-800 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <span className="block text-[9px] font-black text-zinc-500 uppercase">BEP Price</span>
                                                <span className="text-xs font-bold text-orange-400">{formatRp(calc.bep)}</span>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <span className="block text-[9px] font-black text-zinc-500 uppercase">Rec. Price ({targetMargin}%)</span>
                                                <span className="text-xs font-bold text-emerald-400">{formatRp(calc.recommendedPrice)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Skenario */}
                                <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">Target Profit Goal</p>
                                    <div className="bg-black/60 border border-orange-500/20 p-5 rounded-2xl text-center">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Unit/Bulan untuk mencapai Rp 100jt NET</p>
                                        <p className="text-2xl font-black text-white tracking-tighter">
                                            {calc.profit > 0 ? Math.ceil(100000000 / calc.profit).toLocaleString() : '∞'} <span className="text-xs text-zinc-500 font-medium">PCS</span>
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default HppCalculator;
