import React, { useState } from 'react';

const DashboardSupport = ({ 
  t, 
  lang,
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
  isSubmittingSupport 
}) => {
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
    </div>
  );
};

export default DashboardSupport;
