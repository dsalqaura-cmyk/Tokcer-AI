import React from 'react';
import { useLandingTranslation } from '../../hooks/useLandingTranslation';

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto relative">
        {/* Glow effect background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className="w-64 h-64 rounded-full bg-orange-600/10 blur-[80px]"></div>
        </div>

        {/* Card 1 - Starter */}
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-4 opacity-60 blur-[1px] select-none pointer-events-none overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500 uppercase tracking-wider">Soon</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
            <iconify-icon icon="solar:star-linear" className="text-2xl text-zinc-500"></iconify-icon>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400 mb-1">Starter</p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-3xl font-bold text-white">Rp ???</span>
              <span className="text-zinc-500 text-sm mb-1">/bln</span>
            </div>
          </div>
          <div className="w-full space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <iconify-icon icon="solar:check-circle-linear" className="text-zinc-600 shrink-0"></iconify-icon>
              <span>???</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <iconify-icon icon="solar:check-circle-linear" className="text-zinc-600 shrink-0"></iconify-icon>
              <span>???</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <iconify-icon icon="solar:check-circle-linear" className="text-zinc-600 shrink-0"></iconify-icon>
              <span>???</span>
            </div>
          </div>
        </div>

        {/* Card 2 - Pro (Featured) */}
        <div className="relative bg-gradient-to-br from-orange-950/60 to-zinc-900 border border-orange-800/60 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-4 opacity-60 blur-[1px] select-none pointer-events-none shadow-xl overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950/50 border border-orange-800/50 text-orange-400 uppercase tracking-wider">Popular</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-950/50 border border-orange-800/50 flex items-center justify-center">
            <iconify-icon icon="solar:crown-linear" className="text-2xl text-orange-500"></iconify-icon>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-400 mb-1">Pro</p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-3xl font-bold text-white">Rp ???</span>
              <span className="text-zinc-400 text-sm mb-1">/bln</span>
            </div>
          </div>
          <div className="w-full space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <iconify-icon icon="solar:check-circle-linear" className="text-orange-500/50 shrink-0"></iconify-icon>
              <span>???</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <iconify-icon icon="solar:check-circle-linear" className="text-orange-500/50 shrink-0"></iconify-icon>
              <span>???</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <iconify-icon icon="solar:check-circle-linear" className="text-orange-500/50 shrink-0"></iconify-icon>
              <span>???</span>
            </div>
          </div>
        </div>

        {/* Card 3 - Enterprise */}
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-4 opacity-60 blur-[1px] select-none pointer-events-none overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500 uppercase tracking-wider">Soon</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
            <iconify-icon icon="solar:buildings-3-linear" className="text-2xl text-zinc-500"></iconify-icon>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400 mb-1">Enterprise</p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-3xl font-bold text-white">Custom</span>
            </div>
          </div>
          <div className="w-full space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <iconify-icon icon="solar:check-circle-linear" className="text-zinc-600 shrink-0"></iconify-icon>
              <span>???</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <iconify-icon icon="solar:check-circle-linear" className="text-zinc-600 shrink-0"></iconify-icon>
              <span>???</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <iconify-icon icon="solar:check-circle-linear" className="text-zinc-600 shrink-0"></iconify-icon>
              <span>???</span>
            </div>
          </div>
        </div>

        {/* Overlay Coming Soon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
          <div className="bg-zinc-950/90 backdrop-blur-sm border border-zinc-800 rounded-2xl px-8 py-8 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/50 border border-orange-900/50 mb-5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              </span>
              <span className="text-[10px] font-medium text-orange-500 uppercase tracking-widest">
                {t('pricingComingSoonBadge')}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-3">
              {t('pricingComingSoonTitle')}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mb-6">
              {t('pricingComingSoonDesc')}
            </p>
            <button
              onClick={onOpenWaitlist}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-orange-500 transition-all hover:scale-105 active:scale-95 border border-orange-500"
            >
              {t('navWaitlist')}
              <iconify-icon icon="solar:arrow-right-linear" className="text-sm"></iconify-icon>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
