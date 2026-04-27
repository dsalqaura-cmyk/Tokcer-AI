import React from 'react';

const DashboardInventory = ({ t }) => {
  const inventoryData = [
    { name: 'Sepatu Sneakers A1', sku: 'SS-A1-BLU', stock: 142, status: t('optimal') },
    { name: 'Kaos Polos Premium', sku: 'KP-PRM-BLK', stock: 12, status: t('runningLow') },
    { name: 'Jaket Hoodie Urban', sku: 'JH-URB-GRY', stock: 0, status: t('outOfStock') },
    { name: 'Celana Chino Slim', sku: 'CC-SLM-KHK', stock: 85, status: t('optimal') },
    { name: 'Topi Snapback Core', sku: 'TS-COR-WHT', stock: 5, status: t('runningLow') },
  ];

  return (
    <div className="relative z-10 space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight">{t('inventoryCatalog')}</h2>
        <button className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
          <iconify-icon icon="solar:add-circle-linear" className="text-base"></iconify-icon> 
          {t('addProduct')}
        </button>
      </header>
      
      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 shadow-sm w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-4 p-4 bg-black text-xs font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
            <div className="col-span-5">{t('productDetail')}</div>
            <div className="col-span-3">SKU</div>
            <div className="col-span-2 text-right">{t('remainingStock')}</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {inventoryData.map((p, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-orange-500 transition-colors border border-zinc-700">
                    <iconify-icon icon="solar:box-linear" className="text-xl"></iconify-icon>
                  </div>
                  <span className="font-medium text-white truncate">{p.name}</span>
                </div>
                <div className="col-span-3 text-zinc-500 font-mono text-xs bg-zinc-800 w-fit px-2 py-1 rounded border border-zinc-700 truncate">{p.sku}</div>
                <div className="col-span-2 text-right text-white">{p.stock}</div>
                <div className="col-span-2 text-right flex justify-end">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-medium uppercase tracking-wider shrink-0 ${p.status === t('optimal') ? 'bg-orange-950/50 text-orange-500 border border-orange-900/50' : p.status === t('runningLow') ? 'bg-amber-950/50 text-amber-500 border border-amber-900/50' : 'bg-rose-950/50 text-rose-500 border border-rose-900/50'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${p.status === t('optimal') ? 'bg-orange-500' : p.status === t('runningLow') ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></div> 
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardInventory;
