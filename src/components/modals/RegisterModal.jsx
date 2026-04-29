import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useLandingTranslation } from '../../hooks/useLandingTranslation.js';

const RegisterModal = ({ isOpen, onClose }) => {
  const { t } = useLandingTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or error string
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [storeLinks, setStoreLinks] = useState({});

  if (!isOpen) return null;

  const handlePlatformToggle = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      const newLinks = { ...storeLinks };
      delete newLinks[platform];
      setStoreLinks(newLinks);
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleLinkChange = (platform, value) => {
    setStoreLinks({ ...storeLinks, [platform]: value });
  };

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
    
    // Validations
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      setStatus(t('wlErrEmail'));
      return;
    }

    if (selectedPlatforms.length === 0) {
        setLoading(false);
        setStatus("Pilih minimal satu platform jualan.");
        return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          data: {
            full_name: nama,
            phone: phone,
            role: 'user',
            affiliate_id: affiliate_id,
            business_type: business_type,
            platforms: selectedPlatforms,
            store_links: storeLinks
          },
          emailRedirectTo: window.location.origin + '/dashboard',
        }
      });

      if (error) throw error;
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus(error.message || t('wlErrGeneral'));
      setLoading(false);
    }
  };

  const platformOptions = [
    { id: 'TikTok', label: 'TikTok Shop', icon: 'ri:tiktok-fill' },
    { id: 'Shopee', label: 'Shopee', icon: 'simple-icons:shopee' },
    { id: 'Tokopedia', label: 'Tokopedia', icon: 'solar:shop-2-linear' },
    { id: 'Instagram', label: 'Instagram', icon: 'ri:instagram-fill' },
    { id: 'Other', label: 'Lainnya', icon: 'solar:menu-dots-bold' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-zinc-900 w-full max-w-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <iconify-icon icon="solar:close-circle-linear" className="text-2xl"></iconify-icon>
        </button>
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-orange-950/50 rounded-xl flex items-center justify-center border border-orange-900/50 mx-auto mb-4">
            <iconify-icon icon="solar:magic-stick-3-linear" className="text-2xl text-orange-500"></iconify-icon>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">{t('wlTitle')}</h3>
          <p className="text-[10px] md:text-xs text-zinc-400 mt-1">Lengkapi data Anda untuk mendapatkan akses ke dashboard.</p>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {status && typeof status === 'string' && status !== 'success' && (
              <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-lg text-sm text-center">
                {status}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('wlFullName')}</label>
                <input 
                  type="text" 
                  name="nama"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  placeholder="Andi Pratama"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('wlPhone')}</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  placeholder="0812..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('wlEmail')}</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('wlAffId')} (Optional)</label>
                <input 
                  type="text" 
                  name="affiliate_id"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  placeholder="ID001"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('wlBusinessType')} (Optional)</label>
                <input 
                  type="text" 
                  name="business_type"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  placeholder="Fashion"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('wlPlatformLabel')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {platformOptions.map((plat) => (
                  <div key={plat.id} className="space-y-2">
                    <label 
                        className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                            selectedPlatforms.includes(plat.id) 
                                ? 'bg-orange-600/10 border-orange-500/50 text-white shadow-sm' 
                                : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedPlatforms.includes(plat.id)}
                        onChange={() => handlePlatformToggle(plat.id)}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-orange-600 focus:ring-orange-500" 
                      />
                      <iconify-icon icon={plat.icon} className="text-lg"></iconify-icon>
                      <span className="text-xs font-medium">{plat.label}</span>
                    </label>
                  </div>
                ))}
              </div>

              {/* Dynamic Links Grid */}
              <div className="grid grid-cols-1 gap-4 mt-4">
                {selectedPlatforms.map(platId => {
                  const plat = platformOptions.find(p => p.id === platId);
                  return (
                    <div key={platId} className="animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 flex items-center gap-2">
                        <iconify-icon icon={plat.icon} className="text-orange-500"></iconify-icon>
                        Link Toko {plat.label}
                      </label>
                      <input 
                        type="url" 
                        required
                        className="w-full px-4 py-2 rounded-lg border border-zinc-800 bg-black text-white placeholder:text-zinc-700 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                        placeholder={`https://${plat.label.toLowerCase().replace(' ', '')}.com/tokoanda`}
                        value={storeLinks[platId] || ''}
                        onChange={(e) => handleLinkChange(platId, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-xl shadow-orange-950/20 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading && <iconify-icon icon="solar:spinner-linear" className="animate-spin text-lg"></iconify-icon>}
              {loading ? "MENGIRIM LINK..." : "REGISTER NOW"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
