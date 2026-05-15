import React, { useState } from 'react';
import { supabase } from '../../lib/supabase.js';

const DemoRegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    marketplace: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('demo_applications').insert([{
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        marketplace: formData.marketplace,
        status: 'pending'
      }]);

      if (error) throw error;

      // Kirim welcome email via RPC (server-side) agar tidak kena CORS block
      await supabase.rpc('rpc_send_demo_welcome', {
        p_email: formData.email,
        p_name: formData.name
      });

      setSuccess(true);
    } catch (err) {
      alert("Gagal mendaftar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
          <iconify-icon icon="solar:close-circle-bold" className="text-2xl"></iconify-icon>
        </button>

        {!success ? (
          <>
            <div className="mb-8">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <iconify-icon icon="solar:rocket-bold-duotone" className="text-2xl text-indigo-500"></iconify-icon>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">Register Demo Account</h2>
              <p className="text-zinc-400 text-sm">Dapatkan akses ke kalkulator HPP, Market Intel, dan AI Script Generator secara gratis.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nama Lengkap</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-white" placeholder="Contoh: Budi Santoso" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nomor Telepon / WA</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-white" placeholder="081234567890" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Aktif</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-white" placeholder="budi@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Marketplace Utama</label>
                <select required value={formData.marketplace} onChange={e => setFormData({...formData, marketplace: e.target.value})} className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-white">
                  <option value="" disabled>Pilih Marketplace Utama...</option>
                  <option value="Shopee">Shopee</option>
                  <option value="Tokopedia">Tokopedia</option>
                  <option value="TikTok Shop">TikTok Shop</option>
                  <option value="Lazada">Lazada</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <button disabled={loading} type="submit" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Daftar Sekarang <iconify-icon icon="solar:arrow-right-bold" className="text-lg"></iconify-icon></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <iconify-icon icon="solar:check-circle-bold" className="text-4xl text-emerald-500"></iconify-icon>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Registrasi Berhasil!</h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Permintaan akun demo Anda telah kami terima. Kami akan segera menghubungi Anda melalui Email/WhatsApp beserta kredensial login Anda setelah akun disetujui.
            </p>
            <button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-bold transition-all text-sm">
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoRegisterModal;
