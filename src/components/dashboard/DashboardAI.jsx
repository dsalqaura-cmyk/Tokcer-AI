import React from 'react';

const DashboardAI = ({
  t,
  lang,
  aiInput,
  setAiInput,
  aiFormat,
  setAiFormat,
  isGeneratingAI,
  aiResult,
  handleGenerateAI,
  trendCustomInput,
  setTrendCustomInput,
  isSearchingTrend,
  trendSampleKey,
  setTrendSampleKey,
  setTrendCustomResult,
  trendCustomResult,
  handleAnalyzeTrend
}) => {
  return (
    <div className="relative z-10 space-y-8 animate-in fade-in duration-700">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
          AI Content Generator
          <span className="bg-orange-950/50 text-orange-500 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-medium border border-orange-900/50">Beta</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-2">{t('aiDesc')}</p>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <iconify-icon icon="solar:radar-linear" className="text-white text-xl"></iconify-icon>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{t('trendRadarAI')}</h3>
            <p className="text-[10px] text-zinc-500">Sample data - powered by AI Market Intelligence</p>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{lang === 'id' ? 'Cari Kategori / Niche Manual' : 'Search Custom Category / Niche'}</div>
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
              onClick={handleAnalyzeTrend}
              disabled={!trendCustomInput.trim() || isSearchingTrend}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shrink-0"
            >
              {isSearchingTrend ? (
                <iconify-icon icon="solar:spinner-linear" className="text-base animate-spin"></iconify-icon>
              ) : (
                <iconify-icon icon="solar:radar-linear" className="text-base"></iconify-icon>
              )}
              {lang === 'id' ? 'Analisa' : 'Analyze'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-zinc-800"></div>
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{lang === 'id' ? 'atau pilih contoh' : 'or choose sample'}</span>
          <div className="flex-1 h-px bg-zinc-800"></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { key: 'running', label: '👟 Sepatu Lari' },
            { key: 'skincare', label: '🧴 Skincare Pria' },
            { key: 'thrifting', label: '👕 Outfit Thrifting' },
            { key: 'gadget', label: '🎮 Gadget Gaming' },
            { key: 'supplement', label: '💊 Suplemen Kesehatan' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setTrendSampleKey(trendSampleKey === key ? null : key); setTrendCustomInput(''); setTrendCustomResult(null); }}
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

        {trendCustomResult && !trendSampleKey && (() => {
          const query = trendCustomResult;
          return (
            <div className="space-y-4 border-t border-zinc-800 pt-5 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 mb-1">
                <iconify-icon icon="solar:radar-linear" className="text-indigo-400 text-base"></iconify-icon>
                <span className="text-sm font-semibold text-white">Analisis: <span className="text-indigo-400">{query}</span></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">🔥 Tren Terkini</p>
                  <p className="text-sm text-zinc-200">Kategori <strong className="text-white">{query}</strong> menunjukkan pertumbuhan signifikan di marketplace Indonesia. Permintaan meningkat terutama di TikTok Shop & Shopee dalam 3 bulan terakhir.</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">👥 Target Demografi</p>
                  <p className="text-sm text-zinc-200">Segmen utama berusia 18–35 tahun, aktif di media sosial. Perilaku pembelian didorong oleh konten video dan ulasan produk autentik.</p>
                </div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">📈 Top 5 Produk Potensial</p>
                <div className="space-y-1.5">
                  {[
                    `1. Produk ${query} varian terlaris (best-seller)`,
                    `2. Bundle/paket hemat kategori ${query}`,
                    `3. Versi premium / upgrade dari ${query}`,
                    `4. Aksesori & pelengkap ${query}`,
                    `5. Edisi limited / kolaborasi brand ${query}`,
                  ].map((item, i) => (
                    <p key={i} className="text-sm text-zinc-200">{item}</p>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-600/10 border border-rose-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">⚠️ Risiko</p>
                  <p className="text-sm text-zinc-200">Persaingan harga ketat dari penjual lain. Pastikan diferensiasi produk melalui kualitas, packaging, atau layanan purna jual yang unggul.</p>
                </div>
                <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">💡 Strategi</p>
                  <p className="text-sm text-zinc-200">Manfaatkan konten video TikTok untuk edukasi produk. Aktifkan program Flash Sale Shopee di akhir pekan. Optimalkan foto produk untuk SEO marketplace.</p>
                </div>
              </div>
            </div>
          );
        })()}

        {trendSampleKey && (() => {
          const sampleData = {
            running: {
              trend: '🔥 Naik 35% di TikTok Shop. Kategori lari outdoor & trail running jadi favorit.',
              demo: '👥 Pria 18-35 thn, komunitas lari, gym-goer. Aktif di TikTok & Shopee.',
              top5: ['1. Sepatu Trail Running ringan', '2. Insole anti-blister', '3. Kaus kaki kompresi', '4. Sepatu road running wanita', '5. Sandal recovery post-run'],
              risk: '⚠️ Banyak seller baru masuk, margin tipis di Shopee. Fokus diferensiasi di TikTok.',
              strategy: '💡 Buat konten "Before & After" performa lari. Kolaborasi micro-influencer komunitas lari.',
            },
            skincare: {
              trend: '🔥 Tren pria makin peduli kulit. Produk moisturizer & sunscreen pria naik 28%.',
              demo: '👥 Pria 20-40 thn, pekerja kantoran & mahasiswa. Aktif di TikTok & Instagram.',
              top5: ['1. Moisturizer ringan SPF30', '2. Serum Vitamin C pria', '3. Facial wash oil control', '4. Toner eksfoliasi', '5. Eye cream anti-kantung'],
              risk: '⚠️ Brand Korea masih dominasi. Perlu keunggulan harga atau formula lokal yang terbukti.',
              strategy: '💡 Konten edukasi "skincare routine pria 3 langkah" sangat viral. Bundling starter kit.',
            },
            thrifting: {
              trend: '🔥 "Vintage aesthetic" & "Y2K fashion" masih kuat. Pencarian naik 40% di Tokopedia.',
              demo: '👥 Gen Z 16-25 thn, mahasiswa. Budget sensitif tapi fashion-conscious.',
              top5: ['1. Kemeja flanel vintage', '2. Jaket denim second', '3. Celana cargo oversize', '4. Kaos band retro', '5. Bucket hat & aksesoris retro'],
              risk: '⚠️ Kualitas tidak konsisten bisa bikin return tinggi. Foto produk harus sangat detail.',
              strategy: '💡 "GRWM thrift haul" di TikTok paling efektif. Live selling malam hari boost konversi.',
            },
            gadget: {
              trend: '🔥 Gaming mobile & PC peripheral naik 22%. Aksesori HP gaming paling dicari.',
              demo: '👥 Pria 15-28 thn, gamer & content creator. Loyal brand tapi price-sensitive.',
              top5: ['1. Controller gamepad Bluetooth', '2. Cooling fan HP gaming', '3. Headset gaming under 300k', '4. Stand HP lipat portabel', '5. Power bank 20.000mAh fast charge'],
              risk: '⚠️ Produk KW banyak beredar, reputasi toko krusial. Garansi jadi pembeda utama.',
              strategy: '💡 Review & unboxing di YouTube Shorts + TikTok. Bundle dengan aksesoris relevan.',
            },
            supplement: {
              trend: '🔥 Kesadaran kesehatan post-COVID masih tinggi. Vitamin C, D & Omega-3 paling populer.',
              demo: '👥 Semua usia, terutama 25-50 thn. Wanita lebih dominan sebagai pembeli keluarga.',
              top5: ['1. Vitamin C 1000mg effervescent', '2. Multivitamin anak', '3. Kolagen minuman', '4. Probiotik digestive', '5. Suplemen mata lutein'],
              risk: '⚠️ Regulasi BPOM ketat. Pastikan semua produk terdaftar. Klaim berlebihan bisa kena suspend.',
              strategy: '💡 Konten edukasi manfaat vs testimoni. Bundling paket keluarga meningkatkan AOV.',
            },
          };
          const d = sampleData[trendSampleKey];
          return (
            <div className="space-y-4 border-t border-zinc-800 pt-5 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">🔥 Tren Terkini</p>
                  <p className="text-sm text-zinc-200">{d.trend}</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">👥 Target Demografi</p>
                  <p className="text-sm text-zinc-200">{d.demo}</p>
                </div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">📈 Top 5 Produk Potensial</p>
                <div className="space-y-1.5">
                  {d.top5.map((item, i) => (
                    <p key={i} className="text-sm text-zinc-200">{item}</p>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-600/10 border border-rose-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">⚠️ Risiko</p>
                  <p className="text-sm text-zinc-200">{d.risk}</p>
                </div>
                <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">💡 Strategi</p>
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
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <iconify-icon icon="solar:fire-bold" className="text-orange-500"></iconify-icon>
              {t('weeklyViralTopics')}
            </h3>
            <div className="space-y-4">
              {[
                { topic: 'Old Money Aesthetic', platform: 'TikTok', trend: '+142%', color: 'text-zinc-300' },
                { topic: 'Skincare Barrier Repair', platform: 'Shopee', trend: '+85%', color: 'text-orange-500' },
                { topic: 'Eco-friendly Home Living', platform: 'Tokopedia', trend: '+64%', color: 'text-teal-400' },
              ].map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center ${topic.color}`}>
                      <iconify-icon icon={topic.platform === 'TikTok' ? 'ri:tiktok-fill' : topic.platform === 'Shopee' ? 'simple-icons:shopee' : 'solar:shop-2-linear'}></iconify-icon>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{topic.topic}</div>
                      <div className="text-[10px] text-zinc-500">{topic.platform} Trends</div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-emerald-500">{topic.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-2xl bg-orange-600/10 flex items-center justify-center border border-orange-500/20 relative">
            <iconify-icon icon="solar:magic-stick-3-bold-duotone" className="text-orange-500 text-3xl"></iconify-icon>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{t('readyToGenerate')}</h3>
            <p className="text-xs text-zinc-400 max-w-[280px] mx-auto leading-relaxed">{t('aiPromoDesc')}</p>
          </div>
          <div className="w-full space-y-4 relative z-10">
            <div className="bg-black border border-zinc-800 rounded-xl p-4 focus-within:border-orange-500 transition-all">
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={t('typeProductDesc')}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-zinc-600 resize-none"
                rows="3"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {['TikTok Video', 'Marketplace', 'Instagram Feed'].map((format) => (
                <button
                  key={format}
                  onClick={() => setAiFormat(format)}
                  className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                    aiFormat === format ? 'bg-orange-600 border-orange-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {format === 'TikTok Video' ? 'TikTok' : format === 'Marketplace' ? 'Market' : 'Insta'}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGeneratingAI || !aiInput.trim()}
              className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
            >
              {isGeneratingAI ? (
                <iconify-icon icon="solar:spinner-linear" className="text-lg animate-spin"></iconify-icon>
              ) : (
                <iconify-icon icon="solar:magic-stick-3-linear" className="text-lg"></iconify-icon>
              )}
              {t('generateMagicContent')}
            </button>
          </div>
        </div>
      </div>

      {aiResult && (
        <div id="ai-result" className="bg-zinc-900 border-2 border-orange-500/30 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <iconify-icon icon="solar:stars-bold" className="text-8xl text-orange-500"></iconify-icon>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
              <iconify-icon icon="solar:stars-bold" className="text-white text-xl"></iconify-icon>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">{t('magicResult')}</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">{aiFormat} Optimization</p>
            </div>
          </div>
          <div className="bg-black border border-zinc-800 rounded-2xl p-6 relative group">
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => { navigator.clipboard.writeText(aiResult); }}
                className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-orange-600 transition-all shadow-sm"
                title="Copy to Clipboard"
              >
                <iconify-icon icon="solar:copy-linear" className="text-lg"></iconify-icon>
              </button>
            </div>
            <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap pr-10">{aiResult}</p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-zinc-500 text-[10px] font-bold">
            <iconify-icon icon="solar:info-circle-linear" className="text-sm"></iconify-icon>
            {t('aiResultNotice')}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAI;
