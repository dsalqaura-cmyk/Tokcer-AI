import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useLandingTranslation } from '../../hooks/useLandingTranslation.js';
import { sendRegistrationConfirmation } from '../../utils/email.js';

const RegisterModal = ({ isOpen, onClose, selectedPlan }) => {
  const { t } = useLandingTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    email: '',
    business_type: '',
    platforms: [],
    plan: selectedPlan?.id || 'ultimate',
    billing_cycle: 'Monthly',
    id_affiliator: '',
    payment_proof: null
  });

  // Sync plan if selectedPlan changes
  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => ({ 
        ...prev, 
        plan: selectedPlan.id,
        billing_cycle: selectedPlan.cycle || 'Monthly'
      }));
    }
  }, [selectedPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, payment_proof: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('loading');

    try {
      const { nama, whatsapp, email, business_type, platforms, plan, billing_cycle, id_affiliator, payment_proof } = formData;
      
      const planValue = plan || selectedPlan?.id || 'ultimate';

      // 1. Upload payment proof if exists
      let paymentProofUrl = null;
      if (payment_proof) {
        const fileExt = payment_proof.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `registration/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, payment_proof);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);
        
        paymentProofUrl = publicUrl;
      }

      // 2. Insert into clients table
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          shop_name: nama,
          email: email,
          whatsapp: whatsapp,
          plan: planValue,
          billing_cycle: billing_cycle,
          business_type: business_type,
          platforms: platforms,
          ref: id_affiliator || 'Direct Web',
          payment_proof_url: paymentProofUrl,
          status: 'pending'
        }]);

      if (error) throw error;
      
      // 3. Kirim Email Konfirmasi Otomatis (WAITED for Debug)
      // Menggunakan Logic yang sama dengan Partner
      await sendRegistrationConfirmation({ email, nama, plan: planValue });

      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden relative shadow-2xl animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <iconify-icon icon="solar:close-circle-bold" className="text-2xl"></iconify-icon>
        </button>

        <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {status === 'success' ? (
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-6 text-center animate-in zoom-in duration-300">
              <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <iconify-icon icon="solar:shield-check-bold" className="text-2xl"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pendaftaran Terkirim! (VERSI TERBARU)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Data Anda sedang dalam proses verifikasi oleh tim Tokcer AI. Detail akun dan instruksi login akan kami kirimkan ke email Anda segera.
              </p>
              <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-zinc-800 text-white text-sm font-bold hover:bg-zinc-700 transition-all"
              >
                Tutup
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <iconify-icon icon="solar:user-plus-bold" className="text-2xl"></iconify-icon>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Daftar Sekarang</h2>
                <p className="text-zinc-400">Lengkapi data Anda untuk mendapatkan akses ke dashboard.</p>
              </div>

              {status !== 'loading' && typeof status === 'string' && status !== 'idle' && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-500 text-sm">
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input 
                      required
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Contoh: Budi Santoso"
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-5 py-3 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">No. Telp / WhatsApp</label>
                    <input 
                      required
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      type="tel" 
                      placeholder="0812..."
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-5 py-3 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Aktif</label>
                  <input 
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    placeholder="email@anda.com"
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-5 py-3 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Pilih Paket Layanan</label>
                  <select 
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-5 py-3 text-white focus:border-orange-500/50 transition-all outline-none"
                  >
                    <option value="starter">Starter Edition (Gratis)</option>
                    <option value="pro">Pro Edition</option>
                    <option value="elite">Elite Edition</option>
                    <option value="ultimate">Ultimate Edition</option>
                  </select>
                </div>

                {formData.plan !== 'starter' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Siklus Pembayaran</label>
                      <select 
                        name="billing_cycle"
                        value={formData.billing_cycle}
                        onChange={handleChange}
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-5 py-3 text-white focus:border-orange-500/50 transition-all outline-none"
                      >
                        <option value="Monthly">Bulanan</option>
                        <option value="Yearly">Tahunan (Hemat 15%)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Upload Bukti Bayar</label>
                      <div className="relative group">
                        <input 
                          required
                          type="file" 
                          onChange={handleFileChange}
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full bg-zinc-800/50 border border-zinc-700 border-dashed rounded-xl px-5 py-3 text-zinc-500 group-hover:border-orange-500/50 transition-all flex items-center gap-3">
                          <iconify-icon icon="solar:camera-bold" className="text-lg"></iconify-icon>
                          <span className="text-sm">{formData.payment_proof ? formData.payment_proof.name : 'Pilih file gambar...'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">ID Affiliator (Optional)</label>
                    <input 
                      name="id_affiliator"
                      value={formData.id_affiliator}
                      onChange={handleChange}
                      type="text" 
                      placeholder="ID001"
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-5 py-3 text-white placeholder:text-zinc-600 focus:border-orange-500/50 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Jenis Usaha (Optional)</label>
                    <input 
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Fashion"
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-5 py-3 text-white placeholder:text-zinc-600 focus:border-orange-500/50 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Platform Jualan Saat Ini</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['TikTok Shop', 'Shopee', 'Instagram', 'Lainnya'].map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handlePlatformToggle(platform)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all ${
                          formData.platforms.includes(platform)
                            ? 'bg-orange-500/10 border-orange-500/50 text-orange-500'
                            : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          formData.platforms.includes(platform) ? 'bg-orange-500 border-orange-500' : 'border-zinc-600'
                        }`}>
                          {formData.platforms.includes(platform) && <iconify-icon icon="solar:check-read-bold" className="text-[10px] text-white"></iconify-icon>}
                        </div>
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-orange-600 text-white font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <iconify-icon icon="solar:spinner-bold" className="animate-spin text-xl"></iconify-icon>
                    ) : (
                      <>
                        Daftar Sekarang
                        <iconify-icon icon="solar:alt-arrow-right-bold" className="group-hover:translate-x-1 transition-transform"></iconify-icon>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
