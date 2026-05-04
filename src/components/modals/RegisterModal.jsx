import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { supabase } from '../../supabase';
import { useLandingTranslation } from '../../hooks/useLandingTranslation.js';
import { sendRegistrationConfirmation } from '../../utils/email.js';

const RegisterModal = ({ isOpen, onClose, selectedPlan }) => {
  const { t } = useLandingTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or error string
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [storeLinks, setStoreLinks] = useState({});
  const [paymentProof, setPaymentProof] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formPlan, setFormPlan] = useState(selectedPlan || 'starter');
  const [affiliateId, setAffiliateId] = useState(localStorage.getItem('tokcer_affiliate_id') || '');

  // Sync formPlan when selectedPlan prop changes (e.g., user clicks from Pricing card)
  useEffect(() => {
    if (selectedPlan) {
      setFormPlan(selectedPlan);
    }
  }, [selectedPlan]);

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
    const billing_cycle = formData.get('billing_cycle') || 'Monthly';
    const planValue = selectedPlan || formPlan || 'starter';
    console.log("📝 Registering with plan:", planValue, "Cycle:", billing_cycle); // Log untuk debug
    
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
      let proofUrl = null;
      if (planValue !== 'starter' && paymentProof) {
        setIsUploading(true);
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `direct-payments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, paymentProof);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);
        
        proofUrl = publicUrl;
      }

      const refValue = affiliate_id || affiliateId || 'Direct Web';

      const { data, error } = await supabase
        .from('clients')
        .insert([{
          shop_name: nama,
          email: email,
          whatsapp: phone,
          plan: planValue,
          billing_cycle: billing_cycle,
          business_type: business_type,
          platforms: selectedPlatforms,
          ref: refValue,
          status: 'pending',
          payment_proof_url: proofUrl,
          metadata: { store_links: storeLinks, affiliate_id: affiliate_id || affiliateId }
        }]);

      if (error) throw error;
      
      // Email sekarang dikirim otomatis oleh DATABASE TRIGGER (Server-side)
      // Jadi tidak butuh fetch dari frontend lagi (Anti-CORS)
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
    { id: 'Instagram', label: 'Instagram', icon: 'ri:instagram-fill' },
    { id: 'Other', label: 'Lainnya', icon: 'solar:menu-dots-bold' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-zinc-900 w-full max-w-xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-zinc-800 max-h-[92vh] overflow-y-auto custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
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
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pendaftaran Terkirim! (VERSI TERBARU)</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Data Anda sedang dalam proses verifikasi oleh tim Tokcer AI. Detail akun dan instruksi login akan kami kirimkan ke email Anda segera.
            </p>
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

            {!selectedPlan && (
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">PILIH PAKET LAYANAN</label>
                <select 
                  name="plan"
                  required
                  value={formPlan}
                  onChange={(e) => setFormPlan(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none"
                >
                  <option value="starter">Starter Edition</option>
                  <option value="pro">Pro Edition</option>
                  <option value="elite">Elite Edition</option>
                  <option value="ultimate">Ultimate Edition</option>
                </select>
              </div>
            )}

            {formPlan !== 'starter' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">SIKLUS PEMBAYARAN</label>
                    <select 
                      name="billing_cycle"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none"
                    >
                      {(() => {
                        const prices = {
                          pro: 499000,
                          elite: 999000,
                          ultimate: 1999000
                        };
                        const price = prices[formPlan];
                        if (!price) {
                          return (
                            <>
                              <option value="Monthly">Bulanan (Monthly)</option>
                              <option value="Yearly">Tahunan (Yearly)</option>
                            </>
                          );
                        }
                        return (
                          <>
                            <option value="Monthly">Bulanan (Rp {price.toLocaleString('id-ID')})</option>
                            <option value="Yearly">Tahunan (Rp {(price * 11).toLocaleString('id-ID')})</option>
                          </>
                        );
                      })()}
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <p className="text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest font-bold">Upload Bukti Bayar</p>
                    <div className="relative group/proof">
                      <input 
                        type="file" 
                        accept="image/*"
                        required
                        onChange={(e) => setPaymentProof(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border border-zinc-700 rounded-lg px-4 py-2 flex items-center gap-3 bg-zinc-800 hover:border-orange-500/50 transition-all">
                        <iconify-icon icon="solar:camera-add-bold" className="text-lg text-orange-500"></iconify-icon>
                        <span className="text-xs text-zinc-400 truncate">
                          {paymentProof ? paymentProof.name : "Pilih File Gambar..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('wlAffId')} (Optional)</label>
                <input 
                  type="text" 
                  name="affiliate_id"
                  defaultValue={affiliateId}
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
