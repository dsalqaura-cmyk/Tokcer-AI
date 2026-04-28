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
  // REAL DATA CALCULATION (Same as in Dashboard.jsx)
  let totalRevenue = 0;
  const now = new Date();
  
  if (timeFilter === 'Hari Ini') {
    const today = now.toISOString().split('T')[0];
    totalRevenue = orders.filter(o => o.order_date.startsWith(today)).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  } else if (timeFilter === 'Bulan Ini') {
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    totalRevenue = orders.filter(o => {
      const d = new Date(o.order_date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  } else if (timeFilter.includes('Bulan Terakhir')) {
    const months = parseInt(timeFilter);
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    totalRevenue = orders.filter(o => new Date(o.order_date) >= cutoff).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  }

  const estimasiOmzet = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
  const estimasiProfit = `Rp ${(totalRevenue * 0.2).toLocaleString('id-ID')}`;

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.order_date.startsWith(today));
  const todayRev = todayOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const totalRev = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const healthScore = products.length > 0 
      ? Math.round((products.filter(p => p.stock > 0).length / products.length) * 100) 
      : 100;

  // Last 7 Days Aggregation
  const labels = [];
  const dailyOmzet = [];
  const dailyProfit = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));
    
    const dayOrders = orders.filter(o => o.order_date.startsWith(dateStr));
    const revenue = dayOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    dailyOmzet.push(revenue / 1000); // in K
    dailyProfit.push((revenue * 0.2) / 1000); // 20% margin in K
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

      {/* Row 1: Top Metrics Grid (4 columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Revenue Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-orange-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('revenue')}</div>
          <div className="text-2xl font-semibold text-white tracking-tight">Rp {totalRev.toLocaleString('id-ID')}</div>
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <div className="text-[10px] text-zinc-500 mb-1">{t('revenueToday')}</div>
            <div className="text-base font-semibold text-orange-500">Rp {todayRev.toLocaleString('id-ID')}</div>
          </div>
        </div>

        {/* Profit Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-emerald-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-2">Est. Profit</div>
          <div className="text-2xl font-semibold text-white tracking-tight">Rp {(totalRev * 0.2).toLocaleString('id-ID')}</div>
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <div className="text-[10px] text-zinc-500 mb-1">Profit Hari Ini</div>
            <div className="text-base font-semibold text-emerald-400">Rp {(todayRev * 0.2).toLocaleString('id-ID')}</div>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('convRate')}</div>
          <div className="text-2xl font-semibold text-white tracking-tight">3.8%</div>
          <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wider">Status</span>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Good</span>
          </div>
        </div>

        {/* Shop Health Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-rose-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-2">Shop Health</div>
          <div className="text-2xl font-semibold text-white tracking-tight">{healthScore}%</div>
          <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wider">Stock</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${healthScore < 100 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {healthScore < 100 ? 'Alert' : 'Safe'}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Analytics & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart & Profit - 2/3 width */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
            <div>
              <div className="text-xs font-medium text-zinc-400 mb-1">{t('estProfit')} ({t(timeFilter)})</div>
              <div className="text-3xl font-semibold text-white tracking-tight">{estimasiProfit}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-zinc-400 mb-1">{t('totOmzet')} ({t(timeFilter)})</div>
              <div className="text-xl font-semibold text-zinc-300">{estimasiOmzet}</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm mb-8">
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
              {/* Y-Axis labels */}
              <div className="absolute -left-2 inset-y-0 flex flex-col justify-between text-[8px] text-zinc-600 font-mono py-2">
                <span>{Math.round(maxVal)}k</span>
                <span>{Math.round(maxVal * 0.75)}k</span>
                <span>{Math.round(maxVal * 0.5)}k</span>
                <span>{Math.round(maxVal * 0.25)}k</span>
                <span>0</span>
              </div>

              {dailyOmzet.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20 pointer-events-none">
                    Omzet: Rp {Math.round(val * 1000).toLocaleString('id-ID')}
                  </div>
                  
                  {/* Omzet Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm transition-all duration-500" 
                    style={{ height: `${(val / maxVal) * 100}%` }}
                  ></div>
                  
                  <span className="text-[10px] text-zinc-500 font-medium">{labels[idx]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel: Notifications */}
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
