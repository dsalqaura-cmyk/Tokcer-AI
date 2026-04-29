import React from 'react';

const PaymentVerificationModal = ({ 
  t, 
  showModal, 
  setShowModal, 
  selectedClient, 
  handleApprove 
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 rounded-[2.5rem] max-w-md w-full p-10 border border-zinc-800 text-center">
        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">{t('confirmApproval')}</h2>
        <p className="text-sm text-zinc-500 mb-8 font-medium italic">{t('approveUpgrade')} {selectedClient?.shop_name || selectedClient?.name}?</p>
        <div className="flex gap-4">
          <button onClick={() => handleApprove(selectedClient)} className="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl">{t('confirm')}</button>
          <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-2xl">{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationModal;
