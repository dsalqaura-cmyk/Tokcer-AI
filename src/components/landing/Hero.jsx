import React from 'react';
import DashboardPreview from './DashboardPreview';
import { useLandingTranslation } from '../../hooks/useLandingTranslation';

const Hero = () => {
  const { t } = useLandingTranslation();

  return (
    <header className="relative pt-28 pb-16 md:pt-32 md:pb-24 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-orange-500 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          </span>
          <span className="text-xs font-medium text-zinc-300 uppercase tracking-widest">{t('heroBadge')}</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight tracking-tighter">
          {t('heroTitle1')}<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">{t('heroTitle2')}</span>
        </h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          {t('heroDesc')}
        </p>
      </div>

      <div id="dashboard" className="max-w-6xl mx-auto relative group z-10">
        <DashboardPreview />
      </div>
    </header>
  );
};

export default Hero;
