import React from 'react';

const DashboardRevenue = ({ t, hasConnectedStore }) => {
  return (
    <div className="relative z-10 space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-semibold text-white tracking-tight">{t('revenueData')}</h2>
            {!hasConnectedStore && (
              <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] rounded-full font-bold uppercase tracking-wider">Mode Simulasi</span>
            )}
          </div>
          <p className="text-xs text-zinc-400">{t('revenueDesc')}</p>
        </div>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
          <iconify-icon icon="solar:download-linear" className="text-base"></iconify-icon> 
          {t('downloadReport')}
        </button>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('revenueToday')}</div>
          <div className="text-xl font-semibold text-white">Rp 4.250.000</div>
          <div className="text-[10px] text-orange-500 mt-2 flex items-center gap-1 font-medium">
            <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +5.2%
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('activeOrders')}</div>
          <div className="text-xl font-semibold text-white">32 <span className="text-xs font-normal text-zinc-500 ml-1">Orders</span></div>
          <div className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1 font-medium">
            <iconify-icon icon="solar:clock-circle-linear"></iconify-icon> {t('processing')}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <div className="text-xs font-medium text-zinc-400 mb-2">{t('conversionRate')}</div>
          <div className="text-xl font-semibold text-amber-500">4.8%</div>
          <div className="text-[10px] text-amber-500 mt-2 flex items-center gap-1 font-medium">
            <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +1.2%
          </div>
        </div>
      </div>

      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 shadow-sm w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-4 p-4 bg-black text-[10px] font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-4">{t('productSold')}</div>
            <div className="col-span-2">Platform</div>
            <div className="col-span-2 text-right">Nominal</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {[
              { id: '#TK-9921', product: 'Sepatu Sneakers A1', platform: 'TikTok', amount: 'Rp 350.000', status: t('completed'), sclass: 'bg-emerald-950/50 text-emerald-500 border-emerald-900/50' },
              { id: '#SP-8834', product: 'Kaos Polos Premium', platform: 'Shopee', amount: 'Rp 120.000', status: t('shipped'), sclass: 'bg-amber-950/50 text-amber-500 border-amber-900/50' },
              { id: '#TP-7712', product: 'Jaket Hoodie Urban', platform: 'Tokopedia', amount: 'Rp 450.000', status: t('completed'), sclass: 'bg-emerald-950/50 text-emerald-500 border-emerald-900/50' },
            ].map((order, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                <div className="col-span-2 font-mono text-xs text-zinc-500">{order.id}</div>
                <div className="col-span-4 font-medium text-white truncate">{order.product}</div>
                <div className="col-span-2 flex items-center gap-2">
                  {order.platform === 'TikTok' && <iconify-icon icon="ri:tiktok-fill" className="text-zinc-300"></iconify-icon>}
                  {order.platform === 'Shopee' && <iconify-icon icon="simple-icons:shopee" className="text-orange-500"></iconify-icon>}
                  {order.platform === 'Tokopedia' && <iconify-icon icon="solar:shop-2-linear" className="text-teal-500"></iconify-icon>}
                  {order.platform}
                </div>
                <div className="col-span-2 text-right text-white">{order.amount}</div>
                <div className="col-span-2 text-right flex justify-end">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${order.sclass}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRevenue;
