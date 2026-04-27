import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { useLandingTranslation } from '../../hooks/useLandingTranslation';

const WaitlistModal = ({ isOpen, onClose }) => {
  const { t } = useLandingTranslation();
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
            phone: registrationData.phone
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
              tokens: 10, // Berikan 10 token gratis untuk user baru
              platforms: platforms,
              tiktok_link: registrationData.tiktok_link,
              shopee_link: registrationData.shopee_link,
              tokopedia_link: registrationData.tokopedia_link,
              instagram_link: registrationData.instagram_link
            }
          ]);

        if (profileError) console.error("Profile creation error:", profileError);
      }

      // 3. Keep Waitlist Data (for legacy tracking if needed)
      await supabase.from('waitlist').insert([registrationData]);

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus(null);
        e.target.reset();
      }, 3000);

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
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/30 border border-orange-900/50 mb-4">
            <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            </span>
            <span className="text-[10px] font-medium text-orange-500 uppercase tracking-widest">
              {t('wlBadge')}
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-white tracking-tight">{t('wlTitle')}</h3>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            {t('wlDesc')}
          </p>
        </div>
        
        {status === 'success' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <iconify-icon icon="solar:check-circle-bold" className="text-2xl"></iconify-icon>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">{t('wlSuccessTitle')}</h4>
            <p className="text-sm text-zinc-400">{t('wlSuccessDesc')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status && typeof status === 'string' && status !== 'success' && (
              <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-lg text-sm text-center">
                {status}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {t('wlFullName')} <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="nama" required placeholder="Andi M." className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {t('wlPhone')} <span className="text-rose-500">*</span>
                </label>
                <input type="tel" name="phone" required placeholder="0812xxxx" className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                {t('wlEmail')} <span className="text-rose-500">*</span>
              </label>
              <input type="email" name="email" required placeholder="andi@gmail.com" className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {t('wlPassword')} <span className="text-rose-500">*</span>
                </label>
                <input type="password" name="password" required placeholder="••••••" className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {t('wlConfirmPassword')} <span className="text-rose-500">*</span>
                </label>
                <input type="password" name="confirm_password" required placeholder="••••••" className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {t('wlAffId')} <span className="text-zinc-500 font-normal">{t('wlOptional')}</span>
                </label>
                <input type="text" name="affiliate_id" placeholder="TKC-001" className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {t('wlBusinessType')} <span className="text-zinc-500 font-normal">{t('wlOptional')}</span>
                </label>
                <input type="text" name="business_type" placeholder="Fashion" className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  TikTok Link
                </label>
                <input type="text" name="tiktok_link" placeholder="@user" className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Shopee Link
                </label>
                <input type="text" name="shopee_link" placeholder="shopee.co.id/toko" className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                {t('wlPlatformLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2 border border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-800 bg-zinc-800/50 transition-colors">
                  <input type="checkbox" name="platform[]" value="TikTok" className="rounded bg-zinc-900 border-zinc-600 text-orange-500 focus:ring-orange-500" />
                  <span className="text-sm text-zinc-300">TikTok Shop</span>
                </label>
                <label className="flex items-center gap-2 p-2 border border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-800 bg-zinc-800/50 transition-colors">
                  <input type="checkbox" name="platform[]" value="Shopee" className="rounded bg-zinc-900 border-zinc-600 text-orange-500 focus:ring-orange-500" />
                  <span className="text-sm text-zinc-300">Shopee</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 mt-4 border border-orange-500 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading && <iconify-icon icon="solar:spinner-linear" className="animate-spin text-lg"></iconify-icon>}
              {loading ? t('wlSubmitLoading') : t('wlSubmitBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
