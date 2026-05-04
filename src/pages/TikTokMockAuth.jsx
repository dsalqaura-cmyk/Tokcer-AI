import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase.js';

const TikTokMockAuth = () => {
  const navigate = useNavigate();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState('login'); // 'login', 'info', 'scanning', 'result'
  const [discoveredShop, setDiscoveredShop] = useState(null);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
      if (session) setUser(session.user);
      else if (isAdmin) setUser({ id: 'admin-bypass', email: 'admin@tokcer-ai.com' });
    };
    getUser();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setStep('info');
    }, 1500);
  };

  const startScanning = () => {
    setStep('scanning');
    setTimeout(() => {
      setDiscoveredShop({
        name: 'Tokcer Official Store',
        id: 'TTK88' + Math.floor(1000 + Math.random() * 9000),
        region: 'Indonesia (ID)'
      });
      setStep('result');
    }, 2500);
  };

  const handleFinalize = async () => {
    if (!user || !discoveredShop) return;
    setIsAuthorizing(true);
    
    try {
      const { error } = await supabase.from('marketplace_connections').insert([{
        user_id: user.id,
        platform: 'tiktok',
        shop_name: discoveredShop.name,
        shop_id: discoveredShop.id,
        sync_status: 'active'
      }]);
      
      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      alert("Sync Error: " + err.message);
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-500">
        
        {/* Header Branding */}
        <div className="p-8 border-b border-zinc-100 bg-white">
          <div className="flex items-center justify-center gap-6 mb-8">
            <img src="/logo.png" alt="Tokcer AI" className="h-12 w-auto" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-[1px] bg-zinc-200"></div>
              <iconify-icon icon="solar:link-bold" className="text-xl text-zinc-300"></iconify-icon>
              <div className="w-10 h-[1px] bg-zinc-200"></div>
            </div>
            <div className="flex items-center gap-2">
              <iconify-icon icon="ri:tiktok-fill" className="text-4xl text-black"></iconify-icon>
              <span className="text-xl font-bold tracking-tight">TikTok <span className="font-normal text-zinc-400">Shop</span></span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-zinc-900 mb-2">
            {step === 'login' && "Log in to TikTok Shop"}
            {step === 'info' && "Authorize Tokcer AI"}
            {step === 'scanning' && "Connecting..."}
            {step === 'result' && !isSuccess && "Confirm Connection"}
            {isSuccess && "Sync Successful!"}
          </h1>
          <p className="text-sm text-center text-zinc-500 px-4">
             {step === 'login' && "Manage your shop and synchronize data with Tokcer AI."}
             {step === 'info' && "TikTok Shop Seller Center Request"}
             {step === 'scanning' && "Fetching shop information from TikTok..."}
             {step === 'result' && !isSuccess && "We found an authorized shop linked to your account."}
             {isSuccess && "Redirecting to your dashboard..."}
          </p>
        </div>

        {/* Content Area */}
        <div className="p-8 min-h-[350px] flex flex-col">
          {step === 'login' && (
             <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5">
                <div>
                   <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Phone / Email / Username</label>
                   <input 
                      type="text" 
                      required
                      value={loginData.identifier}
                      onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                      placeholder="Enter your TikTok Seller credentials"
                      className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:border-[#FE2C55] transition-all"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Password</label>
                   <input 
                      type="password" 
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:border-[#FE2C55] transition-all"
                   />
                </div>
                <div className="flex items-center justify-between py-2">
                   <button type="button" className="text-xs text-zinc-500 hover:text-black transition-colors font-medium">Forgot password?</button>
                   <button type="button" className="text-xs text-[#FE2C55] hover:underline font-bold">Log in with code</button>
                </div>
                <button 
                  type="submit"
                  disabled={isAuthorizing}
                  className="w-full py-4 bg-[#FE2C55] hover:bg-[#E11D48] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FE2C55]/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isAuthorizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Log in</span>
                  )}
                </button>
                <div className="text-center">
                   <p className="text-xs text-zinc-400">Don't have an account? <span className="text-[#FE2C55] font-bold cursor-pointer hover:underline">Sign up</span></p>
                </div>
             </form>
          )}

          {step === 'info' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                <span className="font-bold text-black">Tokcer AI</span> is requesting permission to access and manage your TikTok Shop data. This allows Tokcer AI to synchronize your products, orders, and operational metrics.
              </p>

              <div className="bg-zinc-50 rounded-xl p-6 mb-8 border border-zinc-100">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Permissions Requested:</h3>
                <div className="space-y-4">
                  {[
                    { icon: 'solar:box-bold', title: 'Product Management', desc: 'Read/write products, stock, and categories.' },
                    { icon: 'solar:bill-list-bold', title: 'Order & Fulfillment', desc: 'Manage orders, buyer details, and shipping.' },
                    { icon: 'solar:graph-bold', title: 'Shop Metrics', desc: 'Read business performance and analytics data.' },
                  ].map((p, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center text-[#FE2C55] shrink-0">
                        <iconify-icon icon={p.icon}></iconify-icon>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">{p.title}</h4>
                        <p className="text-xs text-zinc-500">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <button 
                  onClick={startScanning}
                  className="w-full py-4 bg-[#FE2C55] hover:bg-[#E11D48] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FE2C55]/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Authorize & Connect
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-4 bg-white hover:bg-zinc-50 text-zinc-500 border border-zinc-200 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 'scanning' && (
            <div className="flex-1 flex flex-col items-center justify-center py-12 animate-in fade-in duration-500">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#FE2C55] rounded-full animate-spin"></div>
                <div className="absolute inset-4 bg-zinc-50 rounded-full flex items-center justify-center">
                  <iconify-icon icon="ri:tiktok-fill" className="text-3xl text-black"></iconify-icon>
                </div>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-sm font-bold text-zinc-900">Scanning TikTok Shops...</div>
                <div className="text-xs text-zinc-400">Verifying access tokens & permissions</div>
              </div>
            </div>
          )}

          {step === 'result' && !isSuccess && (
            <div className="animate-in zoom-in-95 fade-in duration-500">
               <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 text-center">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                     <iconify-icon icon="ri:tiktok-fill" className="text-2xl text-black"></iconify-icon>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">{discoveredShop?.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded font-mono uppercase">{discoveredShop?.id}</span>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{discoveredShop?.region}</span>
                  </div>
               </div>

               <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                     <iconify-icon icon="solar:shield-check-bold" className="text-xl text-emerald-500"></iconify-icon>
                     <div className="text-xs text-zinc-600 leading-relaxed">
                        Shop verification successful. Token generated and ready for synchronization.
                     </div>
                  </div>
               </div>

               <button 
                  onClick={handleFinalize}
                  disabled={isAuthorizing}
                  className="w-full py-4 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isAuthorizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Syncing Data...</span>
                    </>
                  ) : (
                    <span>Confirm & Finish Setup</span>
                  )}
                </button>
            </div>
          )}

          {isSuccess && (
            <div className="flex-1 flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-6">
                <iconify-icon icon="solar:check-read-bold" className="text-4xl text-white"></iconify-icon>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Connected!</h2>
              <p className="text-sm text-zinc-500">Store added to your Tokcer AI account.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-center">
          <p className="text-[10px] text-zinc-400">
            Secure authorization powered by Tokcer AI & TikTok Shop Open Platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TikTokMockAuth;
