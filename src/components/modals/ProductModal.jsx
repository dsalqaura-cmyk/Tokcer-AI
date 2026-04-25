import React from 'react';

const ProductModal = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-zinc-900 w-full max-w-md p-6 md:p-8 rounded-2xl shadow-2xl border border-zinc-800 m-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <iconify-icon icon="solar:close-circle-linear" className="text-2xl"></iconify-icon>
        </button>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/30 border border-orange-900/50 mb-4">
            <span className="text-[10px] font-medium text-orange-500 uppercase tracking-widest">
              {t('inventory')}
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-white tracking-tight">{t('addProduct')}</h3>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            {t('newProductDesc')}
          </p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); alert(t('simulatedAlert')); onClose(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('productName')}</label>
            <input type="text" required placeholder={t('productNamePlaceholder')} className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('sku')}</label>
              <input type="text" required placeholder={t('skuPlaceholder')} className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('initialStock')}</label>
              <input type="number" required placeholder="0" className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('price')} (Rp)</label>
            <input type="number" required placeholder={t('pricePlaceholder')} className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-500 transition-all shadow-md mt-6 border border-orange-500">
            {t('saveProduct')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
