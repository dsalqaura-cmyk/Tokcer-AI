import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase.js';

const TikTokMockAuth = () => {
  const navigate = useNavigate();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
      if (session) setUser(session.user);
      else if (isAdmin) setUser({ id: 'admin-bypass', email: 'admin@tokcer-ai.com' });
    };
    getUser();
  }, []);

  const handleAuthorize = async () => {
    if (!user) return;
    setIsAuthorizing(true);
    
    // Simulasi Delay Sinkronisasi (3 detik)
    setTimeout(async () => {
      try {
        // Daftarkan toko simulasi ke database
        const mockShop = {
          user_id: user.id,
          platform: 'tiktok',
          shop_name: 'TikTok Demo Store ' + Math.floor(Math.random() * 100),
          shop_id: 'TTK' + Math.floor(10000 + Math.random() * 90000),
          sync_status: 'active'
        };

        const { error } = await supabase.from('marketplace_connections').insert([mockShop]);
        if (error) throw error;

        setIsSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        alert("Error during simulation: " + err.message);
        setIsAuthorizing(false);
      }
    }, 3000);
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
          
          <h1 className="text-2xl font-bold text-center text-zinc-900 mb-2">Authorize Tokcer AI</h1>
          <p className="text-sm text-center text-zinc-500">Connecting to TikTok Shop Seller Center</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {!isSuccess ? (
            <>
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
                      <div className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center text-emerald-500 shrink-0">
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

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAuthorize}
                  disabled={isAuthorizing}
                  className="w-full py-4 bg-[#FE2C55] hover:bg-[#E11D48] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FE2C55]/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isAuthorizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <span>Authorize & Connect</span>
                  )}
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  disabled={isAuthorizing}
                  className="w-full py-4 bg-white hover:bg-zinc-50 text-zinc-500 border border-zinc-200 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                <iconify-icon icon="solar:check-read-bold" className="text-4xl text-white"></iconify-icon>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Authorization Success!</h2>
              <p className="text-sm text-zinc-500">Redirecting you back to Tokcer AI Dashboard...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-center">
          <p className="text-[10px] text-zinc-400">
            By clicking Authorize, you agree to TikTok Shop's Terms of Service and Tokcer AI's Privacy Policy. 
            You can revoke this access at any time from your TikTok Shop Seller Center.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TikTokMockAuth;
