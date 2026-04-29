import React from 'react';

const LeaderboardTab = ({ 
  t, 
  lang, 
  partnerData, 
  leaderboardPeriod, 
  setLeaderboardPeriod, 
  countdown, 
  getWeekInfo, 
  getTierColor, 
  formatCurrency 
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white text-xl">
              <iconify-icon icon="solar:chart-square-bold-duotone"></iconify-icon>
            </div>
            <div>
              <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{t('mtdTracking')}</div>
              <div className="text-sm font-bold text-white">
                {formatCurrency(partnerData.mtdPace)} → <span className="text-orange-500">{t('projected')} {formatCurrency(partnerData.projectedEndMonth).split(',')[0]} {t('endMonth')}</span>
              </div>
            </div>
          </div>
          <div className="h-px w-full sm:h-10 sm:w-px bg-zinc-800"></div>
          <div className="text-center sm:text-right">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('nextChallenge')}</div>
            <div className="text-sm font-bold text-orange-400 italic">{t('whoIsTop')} 🚀</div>
          </div>
        </div>
        {/* Week info + Countdown */}
        <div className="border-t border-orange-500/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-bold text-zinc-300">
            <iconify-icon icon="solar:calendar-linear" className="text-orange-500 mr-1"></iconify-icon>
            {getWeekInfo().label}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mr-1">{lang === 'id' ? 'Berakhir:' : 'Ends in:'}</span>
            {[{v: countdown.days, u: 'd'}, {v: countdown.hours, u: 'h'}, {v: countdown.minutes, u: 'm'}, {v: countdown.seconds, u: 's'}].map(({v, u}, i) => (
              <React.Fragment key={u}>
                <div className="bg-black/60 border border-zinc-700 rounded-lg px-2 py-1 min-w-[36px] text-center">
                  <span className="text-sm font-black text-orange-400 font-mono">{String(v).padStart(2, '0')}</span>
                  <span className="text-[7px] font-bold text-zinc-500 ml-0.5">{u}</span>
                </div>
                {i < 3 && <span className="text-zinc-600 font-bold text-xs">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pt-4">
        <div className="text-left space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">{t('eliteRankings')}</h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{t('rankDesc')}</p>
        </div>
        <div className="relative group">
          <select 
            value={leaderboardPeriod}
            onChange={(e) => setLeaderboardPeriod(e.target.value)}
            className="appearance-none bg-zinc-900/50 border border-zinc-800 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl focus:outline-none focus:border-orange-500/50 transition-all cursor-pointer min-w-[180px]"
          >
            <option value="current">{t('weekCurrent')}</option>
            <option value="last">{t('weekLast')}</option>
            <option value="prev">{t('weekPrev')}</option>
          </select>
          <iconify-icon icon="solar:alt-arrow-down-bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none"></iconify-icon>
        </div>
      </div>

      <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="divide-y divide-zinc-800/50">
          {partnerData.leaderboard.map((item, index) => (
            <div key={item.id} className={`group flex items-center gap-4 sm:gap-6 px-6 sm:px-10 py-6 sm:py-8 hover:bg-white/[0.01] transition-all duration-300 ${item.id === partnerData.id ? 'bg-orange-600/5' : ''}`}>
              <div className="w-8 sm:w-12 flex justify-center text-2xl sm:text-3xl filter drop-shadow-lg">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : 
                  <span className="text-base sm:text-xl font-black text-zinc-600">{index + 1}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`text-sm sm:text-base font-black tracking-tight truncate ${item.id === partnerData.id ? 'text-orange-500' : 'text-white group-hover:text-orange-400'} transition-colors`}>
                    {item.name}
                  </div>
                  {item.id === partnerData.id && (
                    <span className="text-[7px] sm:text-[9px] bg-orange-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-black tracking-[0.1em] shadow-lg shadow-orange-600/20 flex-shrink-0">{t('you')}</span>
                  )}
                </div>
                <div className={`flex items-center gap-2 mt-1 sm:mt-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest ${getTierColor(item.tier)}`}>
                  <iconify-icon icon="solar:medal-star-bold-duotone" className="text-[10px] sm:text-xs"></iconify-icon>
                  <span className="truncate">{item.tier} Tier</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm sm:text-lg font-black text-emerald-400 font-mono tracking-tighter">{formatCurrency(item.omzet).split(',')[0]}</div>
                <div className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5 sm:mt-1 flex items-center justify-end gap-1 sm:gap-1.5">
                  <iconify-icon icon="solar:fire-bold" className="text-orange-500"></iconify-icon>
                  {item.closing} {t('successClosing').split(' ')[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;
