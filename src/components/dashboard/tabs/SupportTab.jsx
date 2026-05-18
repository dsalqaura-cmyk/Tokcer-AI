import React, { useState } from 'react';

const SupportTab = ({ 
  t, 
  lang,
  profile,
  supportSubmitted, 
  setSupportSubmitted, 
  setActiveMenu, 
  supportType, 
  setSupportType, 
  handleSupportSubmit, 
  supportTitle, 
  setSupportTitle, 
  supportDesc, 
  setSupportDesc, 
  supportFile, 
  handleFileChange, 
  supportFilePreview, 
  setSupportFile, 
  setSupportFilePreview, 
  isSubmittingSupport,
  userTickets = [],
  isFetchingUserTickets = false
}) => {
  const isDemo = (profile?.subscription_plan || '').toLowerCase() === 'demo';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: lang === 'id' ? 'Semua' : 'All', icon: 'solar:widget-linear' },
    { id: 'general', label: lang === 'id' ? 'Umum' : 'General', icon: 'solar:info-circle-linear' },
    { id: 'billing', label: lang === 'id' ? 'Pembayaran' : 'Billing', icon: 'solar:wallet-money-linear' },
    { id: 'technical', label: lang === 'id' ? 'Teknis' : 'Technical', icon: 'solar:settings-linear' },
    { id: 'account', label: lang === 'id' ? 'Akun' : 'Account', icon: 'solar:user-circle-linear' },
  ];

  const faqs = [
    { q: lang === 'id' ? 'Bagaimana cara menghubungkan toko TikTok?' : 'How to connect TikTok shop?', a: lang === 'id' ? 'Buka tab Integrasi, pilih TikTok, dan ikuti instruksi login oAuth.' : 'Go to Integration tab, select TikTok, and follow oAuth login instructions.', cat: 'technical' },
    { q: lang === 'id' ? 'Kapan omzet saya diperbarui?' : 'When is my revenue updated?', a: lang === 'id' ? 'Data diperbarui secara real-time setiap ada transaksi masuk dari platform.' : 'Data is updated in real-time for every incoming transaction from platforms.', cat: 'general' },
    { q: lang === 'id' ? 'Apakah data saya aman?' : 'Is my data secure?', a: lang === 'id' ? 'Ya, kami menggunakan enkripsi tingkat tinggi dan tidak menyimpan password toko Anda.' : 'Yes, we use high-level encryption and do not store your shop passwords.', cat: 'account' },
    { q: lang === 'id' ? 'Metode pembayaran apa yang tersedia?' : 'What payment methods are available?', a: lang === 'id' ? 'Kami mendukung Virtual Account, E-Wallet (OVO, Dana), dan Kartu Kredit.' : 'We support Virtual Account, E-Wallet (OVO, Dana), and Credit Cards.', cat: 'billing' },
  ];

  const filteredFaqs = faqs.filter(f => 
    (activeCategory === 'all' || f.cat === activeCategory) &&
    (f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (supportSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
          <iconify-icon icon="solar:check-circle-bold" className="text-5xl text-emerald-500"></iconify-icon>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('supportSuccess')}</h2>
        <p className="text-zinc-400 max-w-sm mb-8">{t('supportSuccessDesc')}</p>
        <button 
          onClick={() => { setSupportSubmitted(false); setActiveMenu('tab-dash'); }}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          {t('backToDashboard')}
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight">{t('supportCenter')}</h2>
        <p className="text-xs text-zinc-400 mt-1">{t('howCanWeHelp') || (lang === 'id' ? 'Temukan jawaban atau hubungi kami.' : 'Find answers or contact us.')}</p>
      </header>

      {/* === DEMO UPGRADE PRICING TABLE — Khusus Demo Account, hanya tampil di tab Pembayaran === */}
      {isDemo && activeCategory === 'billing' && (
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-orange-500/30 rounded-3xl p-6 md:p-8 shadow-xl shadow-orange-500/5 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <iconify-icon icon="solar:tag-price-bold-duotone" className="text-lg text-orange-500"></iconify-icon>
            </div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Informasi Harga Paket</span>
          </div>
          <h3 className="text-xl font-black text-white mb-1">Pilih Paket yang Sesuai Kebutuhanmu</h3>
          <p className="text-xs text-zinc-400 mb-8">Bandingkan fitur dan pilih paket terbaik untuk mengembangkan bisnis e-commerce Anda.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* === PAKET PRO === */}
            <div className="relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Pro Edition</p>
                <p className="text-3xl font-black text-white tracking-tight">Rp 499k<span className="text-sm font-medium text-zinc-500">/bln</span></p>
              </div>
              <div className="h-px bg-zinc-800"></div>
              <ul className="space-y-2.5 flex-1">
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span><b className="text-white">300 AI Credits</b> / bulan</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Simpan hingga <b className="text-white">10 SKU</b> HPP</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>AI Generator (Deskripsi & Video)</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Export Laporan CSV</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-400">
                  <iconify-icon icon="solar:close-circle-linear" className="text-zinc-600 text-base shrink-0"></iconify-icon>
                  <span className="text-zinc-600">Compare Mode HPP</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-400">
                  <iconify-icon icon="solar:close-circle-linear" className="text-zinc-600 text-base shrink-0"></iconify-icon>
                  <span className="text-zinc-600">Market Intel & Riset Tren</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-400">
                  <iconify-icon icon="solar:close-circle-linear" className="text-zinc-600 text-base shrink-0"></iconify-icon>
                  <span className="text-zinc-600">Bulk Import CSV</span>
                </li>
              </ul>
            </div>

            {/* === PAKET ELITE (RECOMMENDED) === */}
            <div className="relative bg-gradient-to-b from-orange-950/30 to-zinc-900/60 border-2 border-orange-500/60 rounded-2xl p-5 flex flex-col gap-4 shadow-lg shadow-orange-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-orange-500/30">⭐ PALING POPULER</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-1">Elite Edition</p>
                <p className="text-3xl font-black text-white tracking-tight">Rp 999k<span className="text-sm font-medium text-zinc-500">/bln</span></p>
              </div>
              <div className="h-px bg-orange-500/20"></div>
              <ul className="space-y-2.5 flex-1">
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span><b className="text-white">1.000 AI Credits</b> / bulan</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Simpan SKU <b className="text-white">Tanpa Batas</b></span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>AI Generator (Deskripsi & Video)</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Export Laporan CSV</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Compare Mode HPP</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Market Intel & Riset Tren</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-400">
                  <iconify-icon icon="solar:close-circle-linear" className="text-zinc-600 text-base shrink-0"></iconify-icon>
                  <span className="text-zinc-600">Bulk Import CSV</span>
                </li>
              </ul>
            </div>

            {/* === PAKET ULTIMATE === */}
            <div className="relative bg-gradient-to-b from-indigo-950/30 to-zinc-900/60 border border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Ultimate Edition</p>
                <p className="text-3xl font-black text-white tracking-tight">Rp 1.999k<span className="text-sm font-medium text-zinc-500">/bln</span></p>
              </div>
              <div className="h-px bg-indigo-500/20"></div>
              <ul className="space-y-2.5 flex-1">
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span><b className="text-white">Unlimited AI Credits</b></span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Simpan SKU <b className="text-white">Tanpa Batas</b></span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>AI Generator (Deskripsi & Video)</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Export Laporan CSV</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Compare Mode HPP</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span>Market Intel & Riset Tren</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0"></iconify-icon>
                  <span><b className="text-white">Bulk Import CSV</b></span>
                </li>
              </ul>
            </div>

          </div>

          <p className="text-center text-[10px] text-zinc-600 mt-6">Hubungi tim kami untuk informasi lebih lanjut dan proses pembayaran.</p>
        </div>
      )}
      {/* === END DEMO UPGRADE PRICING TABLE === */}




      {/* Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="relative">
          <iconify-icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xl"></iconify-icon>
          <input 
            type="text" 
            placeholder={t('searchHelp') || (lang === 'id' ? 'Cari bantuan...' : 'Search help...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">{t('categories')}</h3>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat.id 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <iconify-icon icon={cat.icon} className="text-lg"></iconify-icon>
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">{t('faq')}</h3>
          {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                {faq.q}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed ml-3.5">{faq.a}</p>
            </div>
          )) : (
            <div className="py-20 text-center bg-zinc-900 border border-zinc-800 rounded-2xl border-dashed">
              <iconify-icon icon="solar:document-text-linear" className="text-4xl text-zinc-700 mb-3"></iconify-icon>
              <p className="text-sm text-zinc-500 italic">{t('noResults')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-12 mb-6">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
          <iconify-icon icon="solar:pen-new-square-linear" className="text-xl text-orange-500"></iconify-icon>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{t('sendTicket') || (lang === 'id' ? 'Kirim Laporan' : 'Send Ticket')}</h3>
          <p className="text-[10px] text-zinc-500">{t('ticketDesc') || (lang === 'id' ? 'Ada masalah atau saran? Beritahu kami.' : 'Have an issue or suggestion? Let us know.')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bug Report Option */}
        <div 
          onClick={() => setSupportType('bug')}
          className={`cursor-pointer p-6 rounded-2xl border transition-all ${supportType === 'bug' ? 'bg-orange-950/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${supportType === 'bug' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            <iconify-icon icon="solar:danger-bold" className="text-2xl"></iconify-icon>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t('reportBug')}</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">{t('bugDesc')}</p>
        </div>

        {/* Feature Suggestion Option */}
        <div 
          onClick={() => setSupportType('feature')}
          className={`cursor-pointer p-6 rounded-2xl border transition-all ${supportType === 'feature' ? 'bg-orange-950/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${supportType === 'feature' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            <iconify-icon icon="solar:lightbulb-bold" className="text-2xl"></iconify-icon>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t('suggestFeature')}</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">{t('featureDesc')}</p>
        </div>
      </div>

      <form onSubmit={handleSupportSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
              {supportType === 'bug' ? t('bugTitleLabel') : t('featureTitleLabel')}
            </label>
            <input 
              type="text" 
              required
              value={supportTitle}
              onChange={(e) => setSupportTitle(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-600"
              placeholder={supportType === 'bug' ? t('bugTitlePlaceholder') : t('featureTitlePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
              {supportType === 'bug' ? t('bugDetailLabel') : t('featureDetailLabel')}
            </label>
            <textarea 
              required
              rows="5"
              value={supportDesc}
              onChange={(e) => setSupportDesc(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-600 resize-none"
              placeholder={supportType === 'bug' ? t('bugDetailPlaceholder') : t('featureDetailPlaceholder')}
            ></textarea>
          </div>

          {supportType === 'bug' && (
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
                {t('uploadScreenshot')}
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all">
                  <iconify-icon icon="solar:camera-linear" className="text-lg"></iconify-icon>
                  {supportFile ? supportFile.name : t('uploadScreenshot')}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                {supportFilePreview && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-700">
                    <img src={supportFilePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setSupportFile(null); setSupportFilePreview(null); }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <iconify-icon icon="solar:trash-bin-trash-bold" className="text-white"></iconify-icon>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmittingSupport}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white py-4 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isSubmittingSupport ? (
            <><iconify-icon icon="solar:spinner-linear" className="text-xl animate-spin"></iconify-icon> {t('sending')}</>
          ) : (
            <><iconify-icon icon="solar:send-square-bold" className="text-xl"></iconify-icon> {t('sendReport')}</>
          )}
        </button>
      </form>

      {/* 🔽 SECTION RIWAYAT TIKET/LAPORAN USER (ESTETIKA: DI BAWAH TOMBOL KIRIM) 🔽 */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <iconify-icon icon="solar:history-bold-duotone" className="text-xl text-orange-500"></iconify-icon>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">{lang === 'id' ? 'Status & Riwayat Laporan Anda' : 'Your Ticket Status & History'}</h3>
              <p className="text-[10px] text-zinc-500">{lang === 'id' ? 'Pantau penyelesaian aduan atau request fitur Anda secara real-time.' : 'Monitor the progress of your bug reports or feature requests in real-time.'}</p>
            </div>
          </div>
          <div className="bg-zinc-950 px-3.5 py-1.5 rounded-xl border border-zinc-800/80 flex items-center gap-2">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Total: {userTickets?.length || 0}</span>
          </div>
        </div>

        {isFetchingUserTickets ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <iconify-icon icon="solar:spinner-linear" className="text-3xl text-orange-500 animate-spin mb-3"></iconify-icon>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{lang === 'id' ? 'Memuat riwayat...' : 'Loading history...'}</p>
          </div>
        ) : userTickets && userTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {userTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 hover:border-zinc-700 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ticket.type === 'bug' ? 'bg-rose-500 animate-pulse' : 'bg-blue-400'}`}></span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight line-clamp-1">{ticket.title}</h4>
                    </div>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest shrink-0 ${
                      ticket.status === 'resolved' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : ticket.status === 'closed' || ticket.status === 'rejected'
                        ? 'bg-zinc-800 text-zinc-400 border border-zinc-750'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{ticket.description}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-zinc-900 text-[9px] font-bold text-zinc-500">
                  <span className="uppercase">TIPE: <span className={ticket.type === 'bug' ? 'text-rose-400' : 'text-blue-400'}>{ticket.type}</span></span>
                  <span>{new Date(ticket.created_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-zinc-950/60 rounded-2xl border border-dashed border-zinc-800">
            <iconify-icon icon="solar:notes-linear" className="text-3xl text-zinc-700 mb-3"></iconify-icon>
            <p className="text-xs text-zinc-500 font-medium">{lang === 'id' ? 'Belum ada laporan atau saran yang Anda kirim.' : 'You have not submitted any reports or suggestions yet.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTab;
