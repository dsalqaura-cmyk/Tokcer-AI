import React from 'react';

const MarketIntelTab = ({ 
  t, 
  lang, 
  platformFilter, 
  setShowPlatformDropdown, 
  showPlatformDropdown, 
  setPlatformFilter, 
  viralTopics, 
  fetchGlobalMarketTrends, 
  trendCustomInput, 
  setTrendCustomInput, 
  setTrendSampleKey, 
  setTrendCustomResult, 
  isSearchingTrend, 
  setTrendPrompt, 
  handleAnalyzeTrend, 
  isTrendAnalyzing, 
  trendSampleKey, 
  trendResult, 
  liveSummary 
}) => {
  // Trigger fetch on load
  React.useEffect(() => {
    if (viralTopics.length === 0) fetchGlobalMarketTrends();
  }, [viralTopics.length, fetchGlobalMarketTrends]);

  return (
    <div className="relative z-10 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">{t('marketIntelTitle')}</h2>
          <p className="text-sm text-zinc-400 mt-1">{t('monitorShop')}</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <div 
            onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
            className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
          >
            <div className="flex items-center gap-2">
              <iconify-icon icon="solar:filter-linear" className="text-orange-500"></iconify-icon>
              {platformFilter === 'all' ? t('allPlatforms') : platformFilter}
            </div>
            <iconify-icon icon={showPlatformDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="sm:ml-2 text-zinc-500"></iconify-icon>
          </div>
          {showPlatformDropdown && (
            <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
              {[['all', t('allPlatforms')], ['TikTok', 'TikTok Shop'], ['Shopee', 'Shopee'], ['Tokopedia', 'Tokopedia']].map(([val, label]) => (
                <div
                  key={val}
                  onClick={() => { setPlatformFilter(val); setShowPlatformDropdown(false); }}
                  className={`px-4 py-2 text-xs cursor-pointer flex items-center gap-2 transition-colors ${platformFilter === val ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                >
                  {val === 'TikTok' && <iconify-icon icon="ri:tiktok-fill" className="text-sm"></iconify-icon>}
                  {val === 'Shopee' && <iconify-icon icon="simple-icons:shopee" className="text-sm text-orange-500"></iconify-icon>}
                  {val === 'Tokopedia' && <iconify-icon icon="solar:shop-2-linear" className="text-sm text-teal-400"></iconify-icon>}
                  {val === 'all' && <iconify-icon icon="solar:widget-linear" className="text-sm text-orange-400"></iconify-icon>}
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Radar Trend AI - Sample Data */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <iconify-icon icon="solar:radar-linear" className="text-white text-xl"></iconify-icon>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{t('trendRadarAI')}</h3>
            <p className="text-[10px] text-zinc-500">Sample data — powered by AI Market Intelligence</p>
          </div>
        </div>

        {/* Manual Search Input */}
        <div className="mb-5">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">🔍 {lang === 'id' ? 'Cari Kategori / Niche Manual' : 'Search Custom Category / Niche'}</div>
          <div className="flex gap-2">
            <div className={`flex-1 flex items-center gap-2 bg-black border rounded-xl px-3 py-2.5 transition-all ${
              isSearchingTrend ? 'border-indigo-500/50 ring-1 ring-indigo-500/30' : 'border-zinc-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30'
            }`}>
              <iconify-icon icon="solar:magnifer-linear" className="text-zinc-500 text-base shrink-0"></iconify-icon>
              <input
                type="text"
                value={trendCustomInput}
                onChange={(e) => { setTrendCustomInput(e.target.value); if (e.target.value) { setTrendSampleKey(null); setTrendCustomResult(null); } }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && trendCustomInput.trim()) {
                     setTrendPrompt(trendCustomInput.trim());
                     handleAnalyzeTrend();
                  }
                }}
                placeholder={lang === 'id' ? 'Ketik kategori produk... (tekan Enter)' : 'Type product category... (press Enter)'}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
              />
              {trendCustomInput && (
                <button onClick={() => { setTrendCustomInput(''); setTrendCustomResult(null); }} className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  <iconify-icon icon="solar:close-circle-linear" className="text-base"></iconify-icon>
                </button>
              )}
            </div>
            <button
              onClick={() => {
                 if (!trendCustomInput.trim()) return;
                 setTrendPrompt(trendCustomInput.trim());
                 handleAnalyzeTrend();
              }}
              disabled={!trendCustomInput.trim() || isTrendAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shrink-0"
            >
              {isTrendAnalyzing ? (
                <iconify-icon icon="solar:spinner-linear" className="text-base animate-spin"></iconify-icon>
              ) : (
                <iconify-icon icon="solar:radar-linear" className="text-base"></iconify-icon>
              )}
              {lang === 'id' ? 'Analisa' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-zinc-800"></div>
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{lang === 'id' ? 'atau pilih contoh' : 'or choose sample'}</span>
          <div className="flex-1 h-px bg-zinc-800"></div>
        </div>

        {/* Sample Category Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { key: 'running', label: '👟 Sepatu Lari' },
            { key: 'skincare', label: '✨ Skincare Pria' },
            { key: 'thrifting', label: '👔 Outfit Thrifting' },
            { key: 'gadget', label: '🎮 Gadget Gaming' },
            { key: 'supplement', label: '💊 Suplemen Kesehatan' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { 
                setTrendSampleKey(trendSampleKey === key ? null : key); 
                if(trendSampleKey !== key) {
                  setTrendPrompt(label);
                  handleAnalyzeTrend();
                }
              }}
              className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${
                trendSampleKey === key
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-indigo-500 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* AI Result Rendering */}
        {(() => {
          let d = {
              trend: 'Data analisis belum tersedia.',
              demo: 'Data analisis belum tersedia.',
              top5: ['Memuat...'],
              risk: 'Data analisis belum tersedia.',
              strategy: 'Data analisis belum tersedia.'
          };
          
          // Use AI result if available
          if (trendResult) {
            try {
              // Try to parse JSON from AI response
              const cleanJson = trendResult.replace(/```json|```/g, '').trim();
              const aiData = JSON.parse(cleanJson);
              d = { ...d, ...aiData };
            } catch (e) {
              console.error("AI Parse Error:", e);
              // Fallback to trendResult as string if parsing fails
              return <div className="text-xs text-zinc-400 p-4 bg-zinc-800 rounded-xl whitespace-pre-wrap">{trendResult}</div>;
            }
          } else if (!isTrendAnalyzing) return null;

          return (
            <div className="space-y-4 border-t border-zinc-800 pt-5 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">🔥 Tren Terkini</p>
                  <p className="text-sm text-zinc-200">{d.trend}</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">🎯 Target Demografi</p>
                  <p className="text-sm text-zinc-200">{d.demo}</p>
                </div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">💡 Top 5 Produk Potensial</p>
                <div className="space-y-1.5">
                  {Array.isArray(d.top5) ? d.top5.map((item, i) => (
                    <p key={i} className="text-sm text-zinc-200">{item}</p>
                  )) : <p className="text-sm text-zinc-200">{d.top5}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-600/10 border border-rose-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">⚠️ Risiko</p>
                  <p className="text-sm text-zinc-200">{d.risk}</p>
                </div>
                <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">🚀 Strategi</p>
                  <p className="text-sm text-zinc-200">{d.strategy}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest flex items-center gap-2">
                <iconify-icon icon="solar:fire-bold" className="text-orange-500"></iconify-icon>
                {t('weeklyViralTopics')}
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">LIVE FEED</span>
            </div>
            <div className="space-y-4">
              {(viralTopics.length > 0 ? viralTopics : [
                { topic: 'Old Money Aesthetic', platform: 'TikTok', trend_percent: '+142%', color_class: 'text-zinc-300' },
                { topic: 'Skincare Barrier Repair', platform: 'Shopee', trend_percent: '+85%', color_class: 'text-orange-500' },
                { topic: 'Eco-friendly Home Living', platform: 'Tokopedia', trend_percent: '+64%', color_class: 'text-teal-400' },
              ]).map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-xl animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center ${t.color_class || (t.platform === 'TikTok' ? 'text-zinc-300' : t.platform === 'Shopee' ? 'text-orange-500' : 'text-teal-400')}`}>
                      <iconify-icon icon={t.platform === 'TikTok' ? 'ri:tiktok-fill' : t.platform === 'Shopee' ? 'simple-icons:shopee' : 'solar:shop-2-linear'}></iconify-icon>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{t.topic}</div>
                      <div className="text-[10px] text-zinc-500 capitalize">{t.platform} Trends</div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-emerald-500">{t.trend_percent}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest flex items-center gap-2">
                <iconify-icon icon="solar:chart-line-up-bold" className="text-indigo-500"></iconify-icon>
                {t('liveDataSampling')}
              </h3>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20"></div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-5">
                  <iconify-icon icon="solar:graph-bold" className="text-4xl text-indigo-400"></iconify-icon>
                </div>
                <p className="text-[11px] text-indigo-300 font-bold mb-1 uppercase tracking-wider">{t('aiSummary')}</p>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  {liveSummary || (lang === 'id' 
                    ? '"Menganalisis tren pasar terbaru untuk bisnis Anda..." '
                    : '"Analyzing latest market trends for your business..." ')
                  }
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500">{t('marketConfidence')}</span>
                  <span className="text-emerald-500 font-bold">88%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1">
                  <div className="bg-indigo-500 h-1 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelTab;
