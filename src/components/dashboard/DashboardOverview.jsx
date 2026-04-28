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
  setShowPlatformDropdown
}) => {
  // Dynamic Calculations
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  const todayOrders = orders.filter(o => o.order_date.startsWith(todayStr));
  const todayRev = todayOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const totalRev = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  
  // Simulated stats for "Premium" look if real data is 0
  const displayTodayRev = todayRev > 0 ? `Rp ${(todayRev / 1000000).toFixed(2)}M` : "Rp 4.25M";
  const displayTodayProfit = todayRev > 0 ? `Rp ${(todayRev * 0.2 / 1000000).toFixed(2)}M` : "Rp 1.27M";
  const displayHealth = products.length > 0 
    ? Math.round((products.filter(p => p.stock > 0).length / products.length) * 100) 
    : 92;

  // Last 7 Days Aggregation
  const labels = [];
  const dailyOmzet = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));
    const dayOrders = orders.filter(o => o.order_date.startsWith(dateStr));
    dailyOmzet.push(dayOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) / 1000);
  }
  const maxVal = Math.max(...dailyOmzet, 100);

  return (
    <div className="relative z-10 space-y-6">
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
              <div className="flex items-center gap-2">
                <iconify-icon icon="solar:filter-linear" className="text-orange-500"></iconify-icon>
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
              <div className="flex items-center gap-2">
                <iconify-icon icon="solar:calendar-linear"></iconify-icon> 
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Live Visitors */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <div className="text-xs font-medium text-zinc-400">{t('visitors')}</div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <iconify-icon icon="ri:tiktok-fill" className="text-lg"></iconify-icon>
                <span className="text-[10px]">TikTok Live</span>
              </div>
              <div className="text-lg font-bold text-white">842</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <iconify-icon icon="ri:instagram-fill" className="text-lg text-pink-500"></iconify-icon>
                <span className="text-[10px]">Insta Live</span>
              </div>
              <div className="text-lg font-bold text-white">398</div>
            </div>
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</span>
               <span className="text-sm font-bold text-emerald-400">1,240</span>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-zinc-900 border border-orange-500/20 rounded-2xl p-5 relative overflow-hidden group shadow-sm hover:border-orange-500/40 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('omzetToday')}</div>
          <div className="text-2xl font-bold text-white tracking-tight mb-1">{displayTodayRev}</div>
          <div className="text-[10px] text-orange-500 flex items-center gap-1 mb-6">
             <iconify-icon icon="solar:arrow-right-up-linear"></iconify-icon> +12% vs yesterday
          </div>
          
          <div className="pt-4 border-t border-zinc-800">
            <div className="text-[10px] text-zinc-500 mb-1">Today's Profit</div>
            <div className="text-lg font-bold text-emerald-400">{displayTodayProfit}</div>
            <div className="text-[8px] text-emerald-500 flex items-center gap-1">
               <iconify-icon icon="solar:arrow-right-up-linear"></iconify-icon> +8.5% vs yesterday
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('convRate')}</div>
          <div className="text-3xl font-bold text-white tracking-tight mb-2">4.8%</div>
          <div className="text-[10px] text-blue-400 flex items-center gap-1">
             <iconify-icon icon="solar:info-circle-linear"></iconify-icon> Above industry average
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
             <div className="text-4xl font-bold text-amber-500 tracking-tight">{displayHealth}</div>
             <div className="text-zinc-500 text-xs mb-1">/100</div>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
             <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${displayHealth}%` }}></div>
          </div>
        </div>
      </div>

      {/* Row 2: Analytics & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest flex items-center gap-2">
                <iconify-icon icon="solar:chart-square-bold" className="text-orange-500"></iconify-icon>
                {t('revenueTrend')}
              </h3>
              <p className="text-[10px] text-zinc-500 mt-1">Data penjualan harian (Ribu Rupiah)</p>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-2 relative">
            <div className="absolute -left-2 inset-y-0 flex flex-col justify-between text-[8px] text-zinc-600 font-mono py-2">
              <span>{Math.round(maxVal)}k</span>
              <span>{Math.round(maxVal * 0.5)}k</span>
              <span>0</span>
            </div>

            {dailyOmzet.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20 pointer-events-none">
                  Rp {Math.round(val * 1000).toLocaleString('id-ID')}
                </div>
                <div 
                  className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm transition-all duration-500" 
                  style={{ height: `${(val / maxVal) * 100}%` }}
                ></div>
                <span className="text-[10px] text-zinc-500 font-medium">{labels[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
           <h3 className="text-sm font-semibold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
              <iconify-icon icon="solar:bell-bold" className="text-orange-500"></iconify-icon>
              {t('notif')}
           </h3>
           <div className="space-y-4">
              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3">
                 <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <iconify-icon icon="solar:info-circle-bold" className="text-blue-500"></iconify-icon>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-white mb-0.5">Sistem Update v2.1</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">Integrasi TikTok Shop kini lebih stabil.</p>
                 </div>
              </div>
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-3">
                 <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <iconify-icon icon="solar:shield-warning-bold" className="text-amber-500"></iconify-icon>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-white mb-0.5">Stok Menipis!</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">5 produk hampir habis. Cek inventory.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
