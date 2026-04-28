import React from 'react';

const DashboardOverview = ({ 
  t, 
  orders, 
  products, 
  timeFilter, 
  setTimeFilter, 
  showFilterDropdown, 
  setShowFilterDropdown,
  platformFilter,
  setPlatformFilter,
  showPlatformDropdown,
  setShowPlatformDropdown,
  profile
}) => {
  // --- REAL DATA CALCULATIONS ---
  const now = new Date();
  
  // 1. Filter by Platform
  const platformFilteredOrders = platformFilter === 'all' 
    ? orders 
    : orders.filter(o => (o.platform || '').toLowerCase() === platformFilter.toLowerCase());

  // 2. Filter by Time
  const getFilteredOrdersByTime = (data, filter) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (filter === 'Hari Ini') {
      const todayStr = today.toISOString().split('T')[0];
      return data.filter(o => o.order_date.startsWith(todayStr));
    } else if (filter === 'Bulan Ini') {
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();
      return data.filter(o => {
        const d = new Date(o.order_date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
    } else if (filter.includes('Bulan Terakhir')) {
      const months = parseInt(filter);
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - months);
      return data.filter(o => new Date(o.order_date) >= cutoff);
    }
    return data;
  };

  const filteredOrders = getFilteredOrdersByTime(platformFilteredOrders, timeFilter);

  // 3. Metrics Calculation
  const totalRev = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const totalProfit = totalRev * 0.2; // Assuming 20% margin

  // 4. Conversion Rate (Real: 0% since no visitor data)
  const convRate = 0; 

  // 5. Health Score (Always use all products for a holistic view)
  const healthScore = products.length > 0 
    ? Math.round((products.filter(p => p.stock > 0).length / products.length) * 100) 
    : 0;

  // 6. Recent Transactions (Always last 3 regardless of filter, for better UX)
  const recentTransactions = [...platformFilteredOrders]
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
    .slice(0, 3);

  // 7. Low Stock Alerts
  const lowStockProducts = products
    .filter(p => p.stock < 20)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 3);

  const formatIDR = (val) => {
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(2)}M`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const getFilterLabel = () => {
    if (timeFilter === 'Hari Ini') return 'Today';
    if (timeFilter === 'Bulan Ini') return 'This Month';
    return timeFilter;
  };

  return (
    <div className="relative z-10 space-y-6 pb-12 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">{t('overview')}</h2>
          <p className="text-xs text-zinc-400 mt-1">{t('monitorShop')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto z-50">
          {/* Platform Filter */}
          <div className="relative w-full sm:w-auto">
            <div
              onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
              className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <iconify-icon icon="solar:filter-linear" className="text-orange-500 text-sm"></iconify-icon>
                {platformFilter === 'all' ? t('allPlatforms') : platformFilter}
              </div>
              <iconify-icon icon={showPlatformDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="sm:ml-2 text-zinc-500"></iconify-icon>
            </div>
            {showPlatformDropdown && (
              <div className="absolute top-full left-0 sm:right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-[60] py-1 overflow-hidden">
                {[['all', t('allPlatforms')], ['TikTok', 'TikTok Shop'], ['Shopee', 'Shopee'], ['Tokopedia', 'Tokopedia']].map(([val, label]) => (
                  <div
                    key={val}
                    onClick={() => { setPlatformFilter(val); setShowPlatformDropdown(false); }}
                    className={`px-4 py-2 text-xs cursor-pointer flex items-center gap-2 transition-colors ${platformFilter === val ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                  >
                    {val === 'TikTok' && <iconify-icon icon="ri:tiktok-fill" className="text-sm"></iconify-icon>}
                    {val === 'Shopee' && <iconify-icon icon="simple-icons:shopee" className="text-sm text-orange-500"></iconify-icon>}
                    {val === 'Tokopedia' && <iconify-icon icon="solar:shop-2-linear" className="text-sm text-teal-400"></iconify-icon>}
                    {val === 'all' && <iconify-icon icon="solar:widget-linear" className="text-sm text-orange-400"></iconify-icon>}
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Period Filter */}
          <div className="relative w-full sm:w-auto">
            <div 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <iconify-icon icon="solar:calendar-linear" className="text-sm text-orange-500"></iconify-icon> 
                {t(timeFilter)}
              </div>
              <iconify-icon icon={showFilterDropdown ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="sm:ml-2 text-zinc-400"></iconify-icon>
            </div>
            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-[60] overflow-hidden">
                <div className="py-1">
                  {['Hari Ini', 'Bulan Ini', '1 Bulan Terakhir', '2 Bulan Terakhir', '3 Bulan Terakhir'].map((option) => (
                    <div 
                      key={option}
                      onClick={() => {
                        setTimeFilter(option);
                        setShowFilterDropdown(false);
                      }}
                      className={`px-4 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${timeFilter === option ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                    >
                      {t(option)}
                      {timeFilter === option && <iconify-icon icon="solar:check-circle-bold" className="text-sm"></iconify-icon>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Row 1: Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Live Visitors Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <div className="text-xs font-medium text-zinc-400">Live Visitors</div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <iconify-icon icon="ri:tiktok-fill" className="text-lg"></iconify-icon>
                <span className="text-[10px]">TikTok Live</span>
              </div>
              <div className="text-lg font-bold text-white">0</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <iconify-icon icon="ri:instagram-fill" className="text-lg text-pink-500"></iconify-icon>
                <span className="text-[10px]">Insta Live</span>
              </div>
              <div className="text-lg font-bold text-white">0</div>
            </div>
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</span>
               <span className="text-sm font-bold text-zinc-600">0</span>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group shadow-sm hover:border-orange-500/30 transition-all">
          <div className="text-xs font-medium text-zinc-400 mb-2">Revenue ({getFilterLabel()})</div>
          <div className="text-2xl font-bold text-white tracking-tight mb-1">{formatIDR(totalRev)}</div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-1 mb-6">
             <iconify-icon icon="solar:info-circle-linear"></iconify-icon> Filtered data
          </div>
          
          <div className="pt-4 border-t border-zinc-800">
            <div className="text-[10px] text-zinc-500 mb-1">Profit ({getFilterLabel()})</div>
            <div className={`text-lg font-bold ${totalProfit > 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>{formatIDR(totalProfit)}</div>
            <div className="text-[8px] text-zinc-500 flex items-center gap-1">
               <iconify-icon icon="solar:info-circle-linear"></iconify-icon> Estimated 20% margin
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group shadow-sm hover:border-blue-500/30 transition-all">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('convRate')}</div>
          <div className={`text-3xl font-bold tracking-tight mb-2 ${convRate > 0 ? 'text-white' : 'text-zinc-600'}`}>{convRate}%</div>
          <div className="text-[10px] text-zinc-600 flex items-center gap-1">
             <iconify-icon icon="solar:info-circle-linear"></iconify-icon> Based on active visitors
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-medium text-zinc-400 flex items-center gap-2">
              {t('healthTitle')}
              <iconify-icon icon="solar:shield-check-bold" className="text-amber-500"></iconify-icon>
            </div>
          </div>
          <div className="flex items-end gap-2 mb-4">
             <div className={`text-4xl font-bold tracking-tight ${healthScore > 0 ? 'text-amber-500' : 'text-zinc-600'}`}>{healthScore}</div>
             <div className="text-zinc-500 text-xs mb-1">/100</div>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
             <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${healthScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart Section */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <div className="text-xs font-medium text-zinc-400 mb-1">Estimated Profit ({getFilterLabel()})</div>
              <div className="text-3xl font-bold text-white tracking-tight">{formatIDR(totalProfit)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-zinc-400 mb-1">Total Revenue ({getFilterLabel()})</div>
              <div className="text-xl font-semibold text-zinc-300">{formatIDR(totalRev)}</div>
            </div>
          </div>

          <div className="relative h-64 w-full pt-4">
             {/* Chart Visual Simulation - Using 4 bars to represent the filtered period */}
             <div className="absolute inset-x-0 bottom-8 flex items-end justify-between h-48 px-8 border-b border-zinc-800 border-dashed">
                {[1,2,3,4].map((v, i) => (
                   <div key={i} className="flex flex-col items-center gap-2 w-16 group relative h-full justify-end">
                      <div 
                        className="w-8 bg-orange-600/40 rounded-t-sm group-hover:bg-orange-500 transition-all duration-500 relative"
                        style={{ height: totalRev > 0 ? `${(totalRev * (0.1 + i*0.1) / (totalRev * 0.5)) * 100}%` : '10%' }}
                      >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full border border-black shadow-lg shadow-emerald-400/20" style={{ marginTop: '-4px' }}></div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">Pt {v}</span>
                   </div>
                ))}
             </div>
             {/* Legend */}
             <div className="flex items-center gap-4 mt-12 text-[10px]">
                <div className="flex items-center gap-1.5 text-zinc-400">
                   <div className="w-3 h-3 bg-orange-600 rounded-sm"></div>
                   Revenue
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                   <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                   Profit
                </div>
             </div>
          </div>
        </div>

        {/* System Notifications Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                 <iconify-icon icon="solar:bell-bold" className="text-orange-500 text-sm"></iconify-icon>
                 System Notifications
              </h3>
           </div>
           <div className="space-y-4">
              <div className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                 <div className="flex justify-between items-start mb-1.5">
                    <p className="text-xs font-bold text-white">AI Generator Quota</p>
                    <span className="text-[8px] text-zinc-500">Just now</span>
                 </div>
                 <p className="text-[10px] text-zinc-400 leading-relaxed">
                    You have {profile?.tokens || 0} content generations left this month.
                 </p>
              </div>
              <div className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                 <div className="flex justify-between items-start mb-1.5">
                    <p className="text-xs font-bold text-white">TikTok Shop Integration</p>
                    <span className="text-[8px] text-zinc-500">2 hrs ago</span>
                 </div>
                 <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Your TikTok Shop API token will expire in 3 days. Renew now.
                 </p>
              </div>
              <div className="p-4 bg-orange-600/5 border border-orange-600/20 rounded-xl hover:border-orange-600/40 transition-colors">
                 <div className="flex justify-between items-start mb-1.5">
                    <p className="text-xs font-bold text-orange-500">Special Promo</p>
                    <span className="text-[8px] text-orange-900">1 day ago</span>
                 </div>
                 <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Upgrade to Ultimate to unlock unlimited Market Intel features.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Row 3: Transactions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
              <button className="text-[10px] font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest transition-colors">View All</button>
           </div>
           <div className="space-y-4">
              {recentTransactions.length > 0 ? recentTransactions.map((trx, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                      <iconify-icon 
                        icon={(trx.platform || '').toLowerCase() === 'tiktok' ? 'ri:tiktok-fill' : (trx.platform || '').toLowerCase() === 'shopee' ? 'simple-icons:shopee' : 'solar:shop-2-linear'} 
                        className={`text-xl ${(trx.platform || '').toLowerCase() === 'shopee' ? 'text-orange-500' : 'text-zinc-400'}`}
                      ></iconify-icon>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{trx.customer_name || 'Customer'}</p>
                      <p className="text-[10px] text-zinc-500">#{trx.id?.slice(0, 8).toUpperCase()} • {trx.platform}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-white">Rp {Number(trx.total_amount).toLocaleString('id-ID')}</div>
                </div>
              )) : (
                <div className="py-8 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                   <iconify-icon icon="solar:wallet-linear" className="text-3xl text-zinc-700 mb-2"></iconify-icon>
                   <p className="text-xs text-zinc-500 italic">No recent transactions</p>
                </div>
              )}
           </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white">Low Stock Alerts</h3>
              <button className="text-[10px] font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest transition-colors">Manage Inventory</button>
           </div>
           <div className="space-y-4">
              {lowStockProducts.length > 0 ? lowStockProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50 group hover:border-orange-500/30 transition-all">
                  <div>
                    <p className="text-xs font-bold text-white mb-0.5 group-hover:text-orange-500 transition-colors">{prod.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">SKU: {prod.sku || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold mb-1 ${prod.stock <= 0 ? 'text-rose-500' : 'text-amber-500'}`}>{prod.stock} Pcs</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                      prod.stock <= 0 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {prod.stock <= 0 ? 'Out of Stock' : 'Running Low'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                   <iconify-icon icon="solar:box-bold" className="text-3xl text-zinc-700 mb-2"></iconify-icon>
                   <p className="text-xs text-zinc-500 italic">Stock is safe and healthy</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
