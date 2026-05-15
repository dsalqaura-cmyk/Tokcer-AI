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
    const [savedCount, setSavedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Demo expiry check — dihitung SEBELUM conditional return agar tidak melanggar Rules of Hooks
    const isDemoExpired = useMemo(() => {
        if (!profile) return false;
        const currentPlan = (profile.subscription_plan || 'starter').toLowerCase();
        if (currentPlan === 'demo' && profile.created_at) {
            const createdAt = new Date(profile.created_at);
            const now = new Date();
            const diffDays = Math.ceil(Math.abs(now - createdAt) / (1000 * 60 * 60 * 24));
            return diffDays > 14;
        }
        return false;
    }, [profile]);

    // Compare Mode States
    const [isCompareMode, setIsCompareMode] = useState(false);
    const [savedSkus, setSavedSkus] = useState([]);
    const [selectedSkuIds, setSelectedSkuIds] = useState([]);

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

                // Fetch saved SKU count
                const { count } = await supabase.from('sku_calculations').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);
                setSavedCount(count || 0);
            } else if (isAdminAuth) {
                setProfile({ subscription_plan: 'ultimate', tokens: 999999 });
                setSavedCount(0);
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

    const calculateSkuResults = (item) => {
        const hpp = Number(item.modal_beli || 0) + Number(item.biaya_packaging || 0) + Number(item.biaya_lain_lain || 0) + Number(item.biaya_ongkir_inbound || 0);
        const komisiP = Number(item.komisi_persen || 0);
        const adsP = Number(item.ads_persen || 0);
        const affP = Number(item.affiliator_persen || 0);
        const totalPersenFee = (komisiP + adsP + affP) / 100;
        
        const price = Number(item.harga_jual_aktual) || 0;
        const bep = (hpp + Number(item.logistik_flat || 0) + Number(item.admin_fee_flat || 0) + Number(item.diskon_voucher || 0)) / (1 - totalPersenFee);
        const recommendedPrice = (hpp + Number(item.logistik_flat || 0) + Number(item.admin_fee_flat || 0) + Number(item.diskon_voucher || 0)) / (1 - totalPersenFee - (Number(item.target_margin_persen || 20) / 100));

        const finalPrice = price || recommendedPrice;
        const platformFeeVal = (totalPersenFee * finalPrice) + Number(item.logistik_flat || 0) + Number(item.admin_fee_flat || 0);
        const profit = finalPrice - hpp - platformFeeVal - Number(item.diskon_voucher || 0);
        const margin = finalPrice > 0 ? (profit / finalPrice) * 100 : 0;
        const roi = hpp > 0 ? (profit / hpp) * 100 : 0;

        return {
            hpp,
            profit,
            margin,
            roi,
            bep,
            recommendedPrice,
            omzet: finalPrice * (item.estimasi_order_per_bulan || 200),
            netProfit: profit * (item.estimasi_order_per_bulan || 200)
        };
    };

    const fetchSavedSkus = async () => {
        if (!user) return;
        const { data, error } = await supabase.from('sku_calculations').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (!error && data) {
            setSavedSkus(data);
        }
    };

    const downloadSkuCSV = (skuData, calcResults) => {
        const rows = [
            ['Field', 'Value'],
            ['Nama SKU', skuData.sku_name],
            ['Platform', skuData.platform],
            ['Kategori', skuData.category],
            [''],
            ['=== INPUT BIAYA ===', ''],
            ['Modal Beli (Rp)', skuData.modal_beli],
            ['Biaya Packaging (Rp)', skuData.biaya_packaging],
            ['Biaya Lain-lain (Rp)', skuData.biaya_lain_lain],
            ['Biaya Inbound/Gudang (Rp)', skuData.biaya_ongkir_inbound],
            [''],
            ['=== BIAYA PLATFORM ===', ''],
            ['Komisi Platform (%)', skuData.komisi_persen],
            ['Logistik Flat (Rp)', skuData.logistik_flat],
            ['Ads (%)', skuData.ads_persen],
            ['Affiliator (%)', skuData.affiliator_persen],
            ['Admin Fee Flat (Rp)', skuData.admin_fee_flat],
            ['Diskon/Voucher (Rp)', skuData.diskon_voucher],
            [''],
            ['=== TARGET & HASIL ===', ''],
            ['Target Margin (%)', skuData.target_margin_persen],
            ['Harga Jual Aktual (Rp)', skuData.harga_jual_aktual],
            ['Estimasi Order/Bulan (pcs)', skuData.estimasi_order_per_bulan],
            [''],
            ['=== HASIL KALKULASI ===', ''],
            ['HPP per Unit (Rp)', Math.round(calcResults.hpp)],
            ['BEP Price (Rp)', Math.round(calcResults.bep)],
            ['Recommended Price (Rp)', Math.round(calcResults.recommendedPrice)],
            ['Net Profit per Unit (Rp)', Math.round(calcResults.profit)],
            ['Margin Bersih (%)', calcResults.margin.toFixed(2)],
            ['ROI (%)', calcResults.roi.toFixed(2)],
            ['Estimasi Omzet/Bulan (Rp)', Math.round(calcResults.omzet)],
            ['Estimasi Net Profit/Bulan (Rp)', Math.round(calcResults.netProfit)],
            [''],
            ['Tanggal Simpan', new Date().toLocaleDateString('id-ID')],
            ['Dibuat oleh', 'Tokcer AI - HPP & Margin Calculator'],
        ];

        const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `HPP_${(skuData.sku_name || 'SKU').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleSave = async () => {
        const plan = (profile?.subscription_plan || 'starter').toLowerCase();
        const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';

        if (!isAdmin && plan !== 'demo') {
            if (plan === 'starter') {
                alert("🏮 Fitur Simpan SKU hanya tersedia untuk paket PRO ke atas. Silakan upgrade paket Anda!");
                return;
            }
            if (plan === 'pro' && savedCount >= 10) {
                alert("⚠️ Limit SKU Tercapai! Paket PRO dibatasi maksimal 10 SKU. Upgrade ke ELITE untuk penyimpanan tanpa batas.");
                return;
            }
        }

        const skuData = {
            user_id: user?.id,
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
        };

        const { error } = await supabase.from('sku_calculations').insert([skuData]);

        if (error) {
            alert("Gagal menyimpan: " + error.message);
        } else {
            setSavedCount(prev => prev + 1);
            // Auto-download CSV setelah berhasil simpan
            downloadSkuCSV(skuData, calc);
            alert("✅ SKU Berhasil Disimpan & CSV sedang diunduh!");
        }
    };


    const handlePremiumFeature = (feature) => {
        const plan = (profile?.subscription_plan || 'starter').toLowerCase();
        const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
        if (isAdmin) { alert(`Feature ${feature} activated (Admin Mode)`); return; }

        const requirements = {
            'export': ['pro', 'elite', 'ultimate', 'demo'],
            'compare': ['elite', 'ultimate', 'demo'],
            'bulk': ['ultimate', 'demo']
        };

        if (!requirements[feature].includes(plan)) {
            const minPlan = requirements[feature][0].toUpperCase();
            alert(`⚠️ Fitur ini hanya tersedia untuk paket ${minPlan} ke atas. Silakan upgrade paket Anda!`);
            return;
        }

        if (feature === 'compare') {
            setIsCompareMode(true);
            fetchSavedSkus();
            return;
        }

        alert(`Feature ${feature} is coming soon for ${plan.toUpperCase()} users!`);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('tokcer_admin_auth');
        navigate('/login');
    };

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

    const plan = (profile?.subscription_plan || 'starter').toLowerCase();

    if (isDemoExpired) {
        return (
            <div className="flex h-screen bg-[#050505] text-white font-['Inter',sans-serif] items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md text-center shadow-2xl relative z-50">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <iconify-icon icon="solar:clock-circle-bold-duotone" className="text-3xl text-red-500"></iconify-icon>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Masa Percobaan Berakhir</h2>
                    <p className="text-zinc-400 text-sm mb-6">Masa aktif 14 hari akun Demo Anda telah berakhir. Terima kasih telah mencoba Tokcer AI! Silakan hubungi tim kami untuk konsultasi dan upgrade paket.</p>
                    <button onClick={handleLogout} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all text-sm w-full uppercase tracking-widest">Keluar Sistem</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050505] text-white font-['Inter',sans-serif] overflow-hidden">
            <Sidebar 
                t={t}
                activeMenu="tab-calculator"
                setActiveMenu={(menu) => navigate('/dashboard')}
                isSidebarOpen={false}
                setIsSidebarOpen={() => {}}
                lang={lang}
                setLang={() => {}}
                profile={profile}
                user={user}
                handleLogout={handleLogout}
            />
            
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header setIsSidebarOpen={() => {}} t={t} activeSection="HPP & Margin Calculator" />
                
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="max-w-6xl mx-auto space-y-8">
                        
                        {/* Title Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter uppercase text-white">HPP <span className="text-orange-500">& Margin</span> Explorer</h1>
                                <p className="text-zinc-500 text-sm font-medium mt-1 uppercase tracking-widest">Optimasi Profit Real-time Mei 2026</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={() => handlePremiumFeature('bulk')} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase rounded-lg hover:border-amber-500 transition-all flex items-center gap-2 group">
                                    <iconify-icon icon="solar:import-bold-duotone" className="text-amber-500"></iconify-icon>
                                    Bulk Import
                                    <span className="bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded text-[8px]">ULTIMATE</span>
                                </button>
                                <button onClick={() => handlePremiumFeature('export')} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase rounded-lg hover:border-blue-500 transition-all flex items-center gap-2">
                                    <iconify-icon icon="solar:export-bold-duotone" className="text-blue-500"></iconify-icon>
                                    Export CSV
                                    <span className="bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded text-[8px]">PRO</span>
                                </button>
                                <button onClick={handleSave} className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 flex items-center gap-2">
                                    <iconify-icon icon="solar:diskette-bold-duotone" className="text-xl"></iconify-icon>
                                    SIMPAN SKU
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {isCompareMode ? (
                                <div className="lg:col-span-12 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                                            <iconify-icon icon="solar:copy-bold-duotone" className="text-indigo-500"></iconify-icon>
                                            COMPARE MODE <span className="text-zinc-500 text-xs ml-2 uppercase font-medium tracking-widest">Side-by-Side Analysis</span>
                                        </h3>
                                        <button onClick={() => setIsCompareMode(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-800 transition-all">
                                            Kembali ke Kalkulator
                                        </button>
                                    </div>

                                    {/* Selection Bar */}
                                    <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Pilih SKU untuk Dibandingkan (Maks 4)</p>
                                        <div className="flex flex-wrap gap-3">
                                            {savedSkus.length === 0 && <p className="text-xs text-zinc-600">Belum ada SKU yang disimpan. Simpan SKU terlebih dahulu di kalkulator.</p>}
                                            {savedSkus.map(sku => (
                                                <button 
                                                    key={sku.id} 
                                                    onClick={() => {
                                                        if (selectedSkuIds.includes(sku.id)) {
                                                            setSelectedSkuIds(selectedSkuIds.filter(id => id !== sku.id));
                                                        } else if (selectedSkuIds.length < 4) {
                                                            setSelectedSkuIds([...selectedSkuIds, sku.id]);
                                                        }
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedSkuIds.includes(sku.id) ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                                                >
                                                    {sku.sku_name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comparison Table */}
                                    {selectedSkuIds.length > 0 && (
                                        <div className="overflow-x-auto pb-4 custom-scrollbar">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-[800px]">
                                                {selectedSkuIds.map(id => {
                                                    const sku = savedSkus.find(s => s.id === id);
                                                    const res = calculateSkuResults(sku);
                                                    return (
                                                        <div key={id} className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 space-y-6 relative group overflow-hidden">
                                                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => setSelectedSkuIds(selectedSkuIds.filter(sid => sid !== id))} className="text-zinc-500 hover:text-red-500 transition-colors">
                                                                    <iconify-icon icon="solar:close-circle-bold"></iconify-icon>
                                                                </button>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{sku.platform?.replace('_', ' ')}</p>
                                                                <h4 className="text-lg font-black text-white truncate">{sku.sku_name}</h4>
                                                            </div>

                                                            <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">HPP Unit</span>
                                                                    <span className="text-sm font-bold text-white">{formatRp(res.hpp)}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Margin</span>
                                                                    <span className={`text-sm font-black ${res.margin < 5 ? 'text-red-500' : 'text-emerald-400'}`}>{res.margin.toFixed(1)}%</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Profit/Unit</span>
                                                                    <span className={`text-sm font-black ${res.profit < 0 ? 'text-red-500' : 'text-white'}`}>{formatRp(res.profit)}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">ROI Modal</span>
                                                                    <span className="text-sm font-bold text-blue-400">{res.roi.toFixed(1)}%</span>
                                                                </div>
                                                            </div>

                                                            <div className="p-4 bg-black/40 rounded-2xl space-y-2">
                                                                <p className="text-[9px] font-black text-zinc-600 uppercase text-center">Estimasi Profit Bulanan</p>
                                                                <p className="text-xl font-black text-center text-emerald-400 tracking-tighter">{formatRp(res.netProfit)}</p>
                                                                <p className="text-[8px] text-zinc-700 text-center uppercase font-bold tracking-[0.2em]">{sku.estimasi_order_per_bulan} Units</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {selectedSkuIds.length === 0 && (
                                        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl">
                                            <iconify-icon icon="solar:chart-2-bold-duotone" className="text-4xl text-zinc-700 mb-2"></iconify-icon>
                                            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Pilih SKU untuk memulai analisis komparasi</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
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

                                        {/* Comparison / Feature Teaser */}
                                        <button onClick={() => handlePremiumFeature('compare')} className="w-full bg-zinc-900/40 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-6 flex items-center justify-between group hover:border-indigo-500/50 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                                    <iconify-icon icon="solar:copy-bold-duotone" className="text-2xl"></iconify-icon>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Bandingkan SKU</p>
                                                    <p className="text-[9px] text-zinc-500">Compare profit side-by-side</p>
                                                </div>
                                            </div>
                                            <span className="bg-indigo-500/20 text-indigo-500 px-2 py-0.5 rounded-md text-[8px] font-black uppercase">ELITE</span>
                                        </button>

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
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default HppCalculator;
