import React from 'react';

const DashboardRevenue = ({ 
  t, 
  orders, 
  platformFilter, 
  setPlatformFilter, 
  showPlatformDropdown, 
  setShowPlatformDropdown,
  omzetTimeFilter,
  setOmzetTimeFilter,
  showOmzetTimeDropdown,
  setShowOmzetTimeDropdown,
  handleDownloadReport
}) => {
  return (
    <div className="relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">{t('revenue')}</h2>
          <p className="text-xs text-zinc-400 mt-1">{t('revenueDesc') || 'Detailed sales performance across multiple channels.'}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
          {/* Platform Filter Dropdown */}
          <div className="relative w-full sm:w-auto">
            <div
              onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
              className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-700 transition-colors w-full justify-between sm:justify-start"
            >
              <iconify-icon icon="solar:filter-linear" className="text-orange-500"></iconify-icon>
              {platformFilter === 'all' ? t('allPlatforms') : platformFilter}
              <iconify-icon icon={showPlatformDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="text-zinc-500"></iconify-icon>
            </div>
            {showPlatformDropdown && (
              <div className="absolute top-full right-0 mt-1 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
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

          {/* Time Filter Dropdown */}
          <div className="relative w-full sm:w-auto">
            <div
              onClick={() => setShowOmzetTimeDropdown(!showOmzetTimeDropdown)}
              className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-700 transition-colors w-full justify-between sm:justify-start"
            >
              <iconify-icon icon="solar:calendar-linear" className="text-orange-500"></iconify-icon>
              {omzetTimeFilter === 'all' ? t('omzetFilterAll') : t(`omzetFilter${omzetTimeFilter.charAt(0).toUpperCase() + omzetTimeFilter.slice(1)}`) || omzetTimeFilter}
              <iconify-icon icon={showOmzetTimeDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="text-zinc-500"></iconify-icon>
            </div>
            {showOmzetTimeDropdown && (
              <div className="absolute top-full right-0 mt-1 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                {[
                  ['all', t('omzetFilterAll')],
                  ['Today', t('omzetFilterToday')],
                  ['Yesterday', t('omzetFilterYesterday')],
                  ['Week', t('omzetFilterWeek')],
                  ['Month', t('omzetFilterMonth')],
                  ['2Month', t('omzetFilter2Month')],
                  ['3Month', t('omzetFilter3Month')],
                ].map(([val, label]) => (
                  <div
                    key={val}
                    onClick={() => { setOmzetTimeFilter(val); setShowOmzetTimeDropdown(false); }}
                    className={`px-4 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${omzetTimeFilter === val ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                  >
                    {label}
                    {omzetTimeFilter === val && <iconify-icon icon="solar:check-circle-bold" className="text-sm"></iconify-icon>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleDownloadReport} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm">
            <iconify-icon icon="solar:download-linear" className="text-base"></iconify-icon>
            {t('downloadReport')}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-orange-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('incomeToday')}</div>
          <div className="text-xl font-semibold text-white">Rp 4.250.000</div>
          <div className="text-[10px] text-orange-500 mt-2 flex items-center gap-1 font-medium">
            <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +5.2%
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-orange-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('activeOrders')}</div>
          <div className="text-xl font-semibold text-white">32 <span className="text-xs font-normal text-zinc-500 ml-1">{t('orders')}</span></div>
          <div className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1 font-medium">
            <iconify-icon icon="solar:clock-circle-linear"></iconify-icon> {t('processing')}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-amber-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('convRate')}</div>
          <div className="text-xl font-semibold text-amber-500">4.8%</div>
          <div className="text-[10px] text-amber-500 mt-2 flex items-center gap-1 font-medium">
            <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +1.2%
          </div>
        </div>
      </div>

      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 shadow-sm w-full">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-black text-[10px] font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                <th className="px-6 py-4">{t('orderId')}</th>
                <th className="px-6 py-4">{t('productSold')}</th>
                <th className="px-6 py-4">{t('platform')}</th>
                <th className="px-6 py-4 text-right">{t('amount')}</th>
                <th className="px-6 py-4 text-center">{t('status')}</th>
                <th className="px-6 py-4 text-right">{t('date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {orders.length > 0 ? orders.map((trx) => (
                <tr key={trx.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-zinc-500 uppercase">{trx.order_number}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{trx.customer_name || 'Customer'}</td>
                  <td className="px-6 py-4 text-xs text-zinc-400 capitalize">{trx.platform}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white text-right">Rp {trx.total_amount?.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                      trx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                      trx.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500 text-right">
                    {new Date(trx.order_date).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-zinc-600 italic">Belum ada riwayat transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardRevenue;
