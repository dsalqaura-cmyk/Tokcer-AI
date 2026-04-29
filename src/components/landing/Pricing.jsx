import React from 'react';
import { useLandingTranslation } from '../../hooks/useLandingTranslation.js';

const Pricing = ({ onOpenWaitlist }) => {
  const { t } = useLandingTranslation();

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-zinc-800 relative">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tighter">
          {t('pricingComingSoonTitle')}
        </h2>
        <p className="text-zinc-400 mt-4 text-base font-normal max-w-md mx-auto">
          {t('pricingComingSoonDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative">
        {/* Glow effect background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className="w-full h-full rounded-full bg-orange-600/5 blur-[120px]"></div>
        </div>

        {/* Card 1 - Starter */}
        <div className="relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 flex flex-col items-center text-center gap-6 hover:border-zinc-700 transition-all group shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <iconify-icon icon="solar:star-linear" className="text-2xl text-zinc-400"></iconify-icon>
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Starter</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-black text-white uppercase tracking-tighter">Gratis</span>
            </div>
            <p className="text-[10px] text-zinc-600 font-bold mt-2 uppercase tracking-widest">Sangat Terbatas</p>
          </div>
          <div className="w-full space-y-3 text-left">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                <iconify-icon icon="solar:check-circle-bold" className="text-zinc-800 shrink-0"></iconify-icon>
                <span>Feature {i} Included</span>
              </div>
            ))}
          </div>
          <button onClick={() => onOpenWaitlist('starter')} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-zinc-700">Pilih Starter</button>
        </div>

        {/* Card 2 - Pro */}
        <div className="relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 flex flex-col items-center text-center gap-6 hover:border-zinc-700 transition-all group shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <iconify-icon icon="solar:box-linear" className="text-2xl text-zinc-400"></iconify-icon>
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Pro Edition</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-[10px] font-black text-zinc-600 mb-1">RP</span>
              <span className="text-3xl font-black text-white tracking-tighter">999</span>
              <span className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">/BLN</span>
            </div>
          </div>
          <div className="w-full space-y-3 text-left">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                <iconify-icon icon="solar:check-circle-bold" className="text-orange-500 shrink-0"></iconify-icon>
                <span>Pro Feature {i}</span>
              </div>
            ))}
          </div>
          <button onClick={() => onOpenWaitlist('pro')} className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-lg">Beli Paket</button>
        </div>

        {/* Card 3 - Elite */}
        <div className="relative bg-orange-950/20 backdrop-blur-md border border-orange-500/30 rounded-3xl p-8 flex flex-col items-center text-center gap-6 hover:border-orange-500/50 transition-all group shadow-2xl scale-105 z-10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>
          <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/30">
            <iconify-icon icon="solar:crown-bold" className="text-2xl text-white"></iconify-icon>
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Elite Edition</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-[10px] font-black text-orange-800 mb-1">RP</span>
              <span className="text-3xl font-black text-white tracking-tighter">1.499</span>
              <span className="text-orange-600 text-[10px] font-black tracking-widest uppercase">/BLN</span>
            </div>
          </div>
          <div className="w-full space-y-3 text-left">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 text-xs text-zinc-300 font-medium">
                <iconify-icon icon="solar:check-circle-bold" className="text-orange-500 shrink-0"></iconify-icon>
                <span>Elite Privilege {i}</span>
              </div>
            ))}
          </div>
          <button onClick={() => onOpenWaitlist('elite')} className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-600/20 transition-all">Dapatkan Akses</button>
        </div>

        {/* Card 4 - Ultimate */}
        <div className="relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 flex flex-col items-center text-center gap-6 hover:border-zinc-700 transition-all group shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <iconify-icon icon="solar:magic-stick-3-bold" className="text-2xl text-zinc-400"></iconify-icon>
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Ultimate Edition</p>
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-zinc-600 line-through tracking-tighter">Rp 2.499K</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-[10px] font-black text-zinc-600 mb-1">RP</span>
                <span className="text-3xl font-black text-white tracking-tighter">2.000</span>
                <span className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">/BLN</span>
              </div>
            </div>
          </div>
          <div className="w-full space-y-3 text-left">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                <iconify-icon icon="solar:check-circle-bold" className="text-orange-500 shrink-0"></iconify-icon>
                <span>Ultimate Feature {i}</span>
              </div>
            ))}
          </div>
          <button onClick={() => onOpenWaitlist('ultimate')} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-zinc-700">Pilih Ultimate</button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
