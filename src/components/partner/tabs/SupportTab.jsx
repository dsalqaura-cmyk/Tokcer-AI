import React from 'react';

const SupportTab = ({ 
  t, 
  supportTab, 
  setSupportTab, 
  supportForm, 
  setSupportForm, 
  handleSupportSubmit, 
  handleIdeaSubmit 
}) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">{t('supportTitle')}</h2>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">{t('supportDesc')}</p>
      </div>

      {/* Sub-tabs for Support */}
      <div className="flex justify-center">
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
          <button 
            onClick={() => setSupportTab('report')}
            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${supportTab === 'report' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <iconify-icon icon="solar:shield-warning-bold-duotone" className="mr-2"></iconify-icon>
            {t('reportBug')}
          </button>
          <button 
            onClick={() => setSupportTab('vision')}
            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${supportTab === 'vision' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <iconify-icon icon="solar:lightbulb-bold-duotone" className="mr-2"></iconify-icon>
            {t('suggestFeature')}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-amber-400"></div>
        
        {supportTab === 'report' ? (
          <form className="space-y-8" onSubmit={handleSupportSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('category')}</label>
              <div className="relative">
                <select 
                  value={supportForm.category}
                  onChange={(e) => setSupportForm({...supportForm, category: e.target.value})}
                  className="w-full appearance-none bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white outline-none"
                >
                  <option value="data">{t('catData')}</option>
                  <option value="login">{t('catLogin')}</option>
                  <option value="commission">{t('catComm')}</option>
                  <option value="bug">{t('catBug')}</option>
                </select>
                <iconify-icon icon="solar:alt-arrow-down-bold" className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"></iconify-icon>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('description')}</label>
              <textarea 
                rows="4"
                required
                value={supportForm.description}
                onChange={(e) => setSupportForm({...supportForm, description: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white outline-none resize-none"
                placeholder={t('descPlaceholder')}
              ></textarea>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('uploadMedia')}</label>
              <div className="relative group/upload">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setSupportForm({...supportForm, screenshot: e.target.files[0]})}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-zinc-800 group-hover/upload:border-orange-500/30 rounded-3xl p-10 flex flex-col items-center justify-center transition-all bg-white/[0.01] group-hover/upload:bg-orange-500/[0.02]">
                  <iconify-icon icon="solar:camera-bold-duotone" className="text-3xl text-orange-500 mb-2"></iconify-icon>
                  <span className="text-[10px] font-bold text-zinc-400">{supportForm.screenshot ? supportForm.screenshot.name : t('uploadPrompt')}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl transition-all">
              {t('submitReport')}
            </button>
          </form>
        ) : (
          <form className="space-y-8" onSubmit={handleIdeaSubmit}>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] px-1">{t('visionPrompt')}</label>
              <textarea 
                rows="6"
                required
                className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-3xl px-6 py-5 text-sm text-white outline-none resize-none leading-relaxed"
                placeholder={t('visionPlaceholder')}
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl transition-all">
              {t('submitIdea')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupportTab;
