import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useLandingTranslation } from '../../hooks/useLandingTranslation';

const RegisterModal = ({ isOpen, onClose }) => {
  const { t } = useLandingTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or error string

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const nama = formData.get('nama');
    const phone = formData.get('phone');
    const affiliate_id = formData.get('affiliate_id');
    const business_type = formData.get('business_type');
    const platforms = formData.getAll('platform[]');
    
    // Validations
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      setStatus(t('wlErrEmail'));
      return;
    }

    try {
      // Magic Link Registration/Login
      // Jika email belum ada, Supabase akan membuat user baru
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          data: {
            full_name: nama,
            phone: phone,
            role: 'user',
            affiliate_id: affiliate_id,
            business_type: business_type,
            platforms: platforms
          },
          emailRedirectTo: window.location.origin + '/dashboard',
        }
      });

      if (error) throw error;

      setStatus('success');
      
      // We don't redirect immediately because they need to click the link in their email
    } catch (error) {
      console.error(error);
      setStatus(error.message || t('wlErrGeneral'));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-zinc-900 w-full max-w-md p-6 md:p-8 rounded-2xl shadow-2xl border border-zinc-800 m-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <iconify-icon icon="solar:close-circle-linear" className="text-2xl"></iconify-icon>
        </button>
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-orange-950/50 rounded-xl flex items-center justify-center border border-orange-900/50 mx-auto mb-4">
            <iconify-icon icon="solar:magic-stick-3-linear" className="text-2xl text-orange-500"></iconify-icon>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">{t('wlTitle')}</h3>
          <p className="text-[10px] md:text-xs text-zinc-400 mt-1">Cukup masukkan email, kami akan kirimkan link akses instan.</p>
        </div>
        
        {status === 'success' ? (
          <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-6 text-center animate-in zoom-in duration-300">
            <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <iconify-icon icon="solar:letter-opened-bold" className="text-2xl"></iconify-icon>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Cek Email Anda!</h4>
            <p className="text-sm text-zinc-400">Kami telah mengirimkan link masuk ke email Anda. Silakan klik link tersebut untuk menuju ke Dashboard.</p>
            <button 
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-zinc-800 text-white text-sm font-bold hover:bg-zinc-700 transition-all"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status && typeof status === 'string' && status !== 'success' && (
              <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-lg text-sm text-center">
                {status}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('wlFullName')}</label>
                <input 
                  type="text" 
                  name="nama"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="Andi Pratama"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('wlPhone')}</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="0812..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('wlEmail')}</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('wlAffId')} (Optional)</label>
                <input 
                  type="text" 
                  name="affiliate_id"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="ID001"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('wlBusinessType')} (Optional)</label>
                <input 
                  type="text" 
                  name="business_type"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="Fashion"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-400">{t('wlPlatformLabel')}</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-3 border border-zinc-800 rounded-xl cursor-pointer hover:bg-orange-500/5 transition-all group">
                  <input type="checkbox" name="platform[]" value="TikTok" className="rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500" />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200">TikTok Shop</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-zinc-800 rounded-xl cursor-pointer hover:bg-orange-500/5 transition-all group">
                  <input type="checkbox" name="platform[]" value="Shopee" className="rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500" />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200">Shopee</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-xl text-sm font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-lg mt-2 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading && <iconify-icon icon="solar:spinner-linear" className="animate-spin text-lg"></iconify-icon>}
              {loading ? "MENGIRIM LINK..." : t('wlSubmitBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
