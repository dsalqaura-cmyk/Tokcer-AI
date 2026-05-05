import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase.js';

const UserQuickViewModal = ({ 
  t, 
  showUserStats, 
  setShowUserStats 
}) => {
  const [stats, setStats] = useState({ omzet: 0, orders: 0, health: 100 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showUserStats?.id) {
      const fetchUserStats = async () => {
        setLoading(true);
        try {
          const { data: ords } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('user_id', showUserStats.id);
            
          const totalOrders = ords?.length || 0;
          const totalOmzet = (ords || []).reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
          
          let healthScore = 100;
          if (showUserStats.status !== 'active') healthScore = 40;
          
          setStats({
            omzet: totalOmzet,
            orders: totalOrders,
            health: healthScore
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchUserStats();
    }
  }, [showUserStats]);

  if (!showUserStats) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
       <div className="bg-zinc-900 rounded-[2.5rem] max-w-4xl w-full p-10 border border-zinc-800 relative">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{showUserStats.shop_name || showUserStats.name || 'User'} {t('details')}</h2>
                <button onClick={() => setShowUserStats(null)} className="text-zinc-500 hover:text-white transition-all">
                    <iconify-icon icon="solar:close-circle-bold" className="text-3xl"></iconify-icon>
                </button>
            </div>
            {loading ? (
                <div className="text-center text-zinc-500 py-10">Loading data...</div>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center">
                        <p className="text-zinc-600 text-[10px] font-black uppercase mb-2">{t('revenue')}</p>
                        <p className="text-xl font-black text-white">Rp {new Intl.NumberFormat('id-ID').format(stats.omzet)}</p>
                    </div>
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center">
                        <p className="text-zinc-600 text-[10px] font-black uppercase mb-2">{t('healthScore')}</p>
                        <p className={`text-xl font-black ${stats.health >= 80 ? 'text-green-500' : 'text-amber-500'}`}>{stats.health}%</p>
                    </div>
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center">
                        <p className="text-zinc-600 text-[10px] font-black uppercase mb-2">{t('orders')}</p>
                        <p className="text-xl font-black text-white">{stats.orders}</p>
                    </div>
                </div>
            )}
       </div>
    </div>
  );
};

export default UserQuickViewModal;
