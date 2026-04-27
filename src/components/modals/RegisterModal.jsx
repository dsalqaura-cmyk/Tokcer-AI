import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useLandingTranslation } from '../../hooks/useLandingTranslation';

const RegisterModal = ({ isOpen, onClose }) => {
  const { t } = useLandingTranslation();
  const navigate = useNavigate();
  const [showOtherPlatform, setShowOtherPlatform] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or error string

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');
    
    // Validations
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      setStatus(t('wlErrEmail'));
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      setStatus(t('wlErrPassword'));
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setStatus(t('wlErrMatch'));
      return;
    }

    const platforms = formData.getAll('platform[]');
    
    const registrationData = {
      nama: formData.get('nama'),
      email: email,
      phone: formData.get('phone'),
      affiliate_id: formData.get('affiliate_id') || null,
      business_type: formData.get('business_type') || null,
      platforms: platforms,
      platform_other: showOtherPlatform ? formData.get('platform_other') : null,
      tiktok_link: formData.get('tiktok_link') || null,
      instagram_link: formData.get('instagram_link') || null,
      shopee_link: formData.get('shopee_link') || null,
      tokopedia_link: formData.get('tokopedia_link') || null
    };

    try {
      // 1. Sign Up to Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: registrationData.nama,
            role: 'user'
          }
        }
      });

      if (authError) throw authError;

      // 2. Insert Profile Data
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: registrationData.nama,
              email: email,
              phone: registrationData.phone,
              business_type: registrationData.business_type,
              tokens: 10, // Give 10 free tokens
              platforms: platforms,
              tiktok_link: registrationData.tiktok_link,
              shopee_link: registrationData.shopee_link,
              tokopedia_link: registrationData.tokopedia_link,
              instagram_link: registrationData.instagram_link
            }
          ]);

        if (profileError) console.error("Profile creation error:", profileError);
      }

      setStatus('success');
      
      // Auto login and redirect after a short delay
      setTimeout(() => {
        onClose();
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error(error);
      if (error.message.includes('already registered')) {
        setStatus(t('wlErrDuplicate'));
      } else {
        setStatus(error.message || t('wlErrGeneral'));
      }
    } finally {
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
            <iconify-icon icon="solar:user-plus-linear" className="text-2xl text-orange-500"></iconify-icon>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">{t('wlTitle')}</h3>
          <p className="text-[10px] md:text-xs text-zinc-400 mt-1">{t('wlDesc')}</p>
        </div>
        
        {status === 'success' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-xl p-6 text-center animate-in zoom-in duration-300">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <iconify-icon icon="solar:check-circle-bold" className="text-2xl"></iconify-icon>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">{t('wlSuccessTitle')}</h4>
            <p className="text-sm text-zinc-400">{t('wlSuccessDesc')}</p>
            <p className="text-xs text-orange-500 mt-4 animate-pulse">Redirecting to dashboard...</p>
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
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('wlPassword')}</label>
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('wlConfirmPassword')}</label>
                <input 
                  type="password" 
                  name="confirm_password"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
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
              {loading ? t('wlSubmitLoading') : t('wlSubmitBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
