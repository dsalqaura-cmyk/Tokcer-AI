import React from 'react';

const AcademyTab = ({ 
  t 
}) => {
  const academyItems = [
    { title: 'ClosingMastery', icon: 'solar:videocamera-record-bold-duotone', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'ContentBank', icon: 'solar:gallery-bold-duotone', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'AdsFramework', icon: 'solar:graph-bold-duotone', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'ProductKnowledge', icon: 'solar:reorder-bold-duotone', color: 'text-orange-500', bg: 'bg-orange-500/10' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">{t('academyTitle')}</h2>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">{t('academyDesc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {academyItems.map((item, idx) => (
          <div key={idx} className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-8 rounded-[32px] cursor-not-allowed opacity-70">
            <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 grayscale opacity-50`}>
              <iconify-icon icon={item.icon} className={`text-3xl ${item.color}`}></iconify-icon>
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">{t('academy' + item.title)}</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mb-6">{t('academy' + item.title + 'Desc')}</p>
            <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
              <iconify-icon icon="solar:lock-bold"></iconify-icon> COMING SOON
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademyTab;
