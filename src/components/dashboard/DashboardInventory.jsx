import React from 'react';

const DashboardInventory = ({ 
  t, 
  products, 
  setShowProductModal 
}) => {
  return (
    <div className="relative z-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight">{t('inventory')} & Catalog</h2>
        <button onClick={() => setShowProductModal(true)} className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
          <iconify-icon icon="solar:add-circle-linear" className="text-base"></iconify-icon> 
          {t('addProduct')}
        </button>
      </header>
      
      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 shadow-sm w-full">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-12 gap-4 p-4 bg-black text-xs font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
              <div className="col-span-5">{t('productSold')}</div>
              <div className="col-span-3">{t('sku')}</div>
              <div className="col-span-2 text-right">{t('stock')}</div>
              <div className="col-span-2 text-right">{t('status')}</div>
            </div>
            <div className="divide-y divide-zinc-800">
              {products.length > 0 ? products.map((p) => (
                <div key={p.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800/50 transition-colors">
                  <div className="col-span-5 flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-orange-500 transition-colors border border-zinc-700 shrink-0">
                      <iconify-icon icon="solar:box-linear" className="text-xl"></iconify-icon>
                    </div>
                    <span className="font-medium text-white truncate">{p.name}</span>
                  </div>
                  <div className="col-span-3 text-zinc-500 font-mono text-xs bg-zinc-800 w-fit px-2 py-1 rounded border border-zinc-700 truncate">{p.sku || 'NO-SKU'}</div>
                  <div className="col-span-2 text-right text-white">{p.stock}</div>
                  <div className="col-span-2 text-right flex justify-end">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-medium uppercase tracking-wider shrink-0 ${p.stock > 10 ? 'bg-orange-950/50 text-orange-500 border border-orange-900/50' : 'bg-rose-950/50 text-rose-500 border border-rose-900/50'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 10 ? 'bg-orange-500' : 'bg-rose-500 animate-pulse'}`}></div> 
                      {p.stock > 10 ? t('optimal') : t('runningLow')}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-zinc-600 italic">Belum ada data produk.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardInventory;
