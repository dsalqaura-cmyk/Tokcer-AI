import React from 'react';

const AiStrategySection = ({ 
  t, 
  aiConfig, 
  setAiConfig, 
  handleSaveAiConfig, 
  isLoading, 
  aiLogs 
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-400"></div>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="font-black text-2xl text-white uppercase tracking-tight">{t('aiManagement')}</h3>
            <p className="text-sm text-zinc-500 font-medium mt-1">Configure system behavior and retrieval knowledge</p>
          </div>
          <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <iconify-icon icon="solar:magic-stick-bold-duotone" className="text-3xl text-blue-500"></iconify-icon>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Prompt */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('strictInstructions')}</label>
              <iconify-icon icon="solar:shield-keyhole-bold-duotone" className="text-blue-500"></iconify-icon>
            </div>
            <textarea 
              className="w-full h-64 bg-black/40 border border-zinc-800 focus:border-blue-500/50 rounded-3xl p-6 text-sm text-zinc-300 outline-none resize-none leading-relaxed font-mono"
              value={aiConfig.system_prompt}
              onChange={(e) => setAiConfig({...aiConfig, system_prompt: e.target.value})}
            ></textarea>
          </div>

          {/* RAG Knowledge Base */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('knowledgeBase')}</label>
              <iconify-icon icon="solar:library-bold-duotone" className="text-amber-500"></iconify-icon>
            </div>
            <textarea 
              className="w-full h-64 bg-black/40 border border-zinc-800 focus:border-amber-500/50 rounded-3xl p-6 text-sm text-zinc-300 outline-none resize-none leading-relaxed font-mono"
              placeholder="Input knowledge chunks here for RAG..."
              value={aiConfig.rag_knowledge_base}
              onChange={(e) => setAiConfig({...aiConfig, rag_knowledge_base: e.target.value})}
            ></textarea>
          </div>
        </div>

        {/* Resend API Key Integration */}
        <div className="mt-8 pt-8 border-t border-zinc-800/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <iconify-icon icon="solar:letter-bold-duotone" className="text-xl text-orange-500"></iconify-icon>
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Resend API Key Integration</label>
          </div>
          <input 
            type="password"
            className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-6 py-4 text-sm text-zinc-300 outline-none font-mono"
            placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxx"
            value={aiConfig.resend_api_key || ''}
            onChange={(e) => setAiConfig({...aiConfig, resend_api_key: e.target.value})}
          />
          <p className="text-[9px] text-zinc-600 mt-2 px-2 uppercase font-bold tracking-wider">Used for automatic welcome emails upon approval</p>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSaveAiConfig}
            disabled={isLoading}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'SAVING...' : t('saveConfig')}
          </button>
        </div>
      </div>

      {/* AI Logs */}
      <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 bg-zinc-950/50">
          <h3 className="font-black text-white uppercase tracking-tight">{t('aiLogs')}</h3>
        </div>
        <div className="p-8">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-4 pb-2">{t('user')}</th>
                <th className="px-4 pb-2">{t('task')}</th>
                <th className="px-4 pb-2 text-center">{t('credits')}</th>
                <th className="px-4 pb-2 text-right">{t('time')}</th>
              </tr>
            </thead>
            <tbody>
              {aiLogs.length > 0 ? aiLogs.map((log, i) => (
                <tr key={i} className="bg-zinc-950/50 hover:bg-zinc-800/50 transition-all group">
                  <td className="p-4 rounded-l-2xl border-l border-y border-zinc-800">
                    <div className="font-black text-white text-xs uppercase tracking-tight">{log.profiles?.full_name || 'System User'}</div>
                  </td>
                  <td className="p-4 border-y border-zinc-800">
                     <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{log.task_type} ({log.topic})</span>
                  </td>
                  <td className="p-4 border-y border-zinc-800 text-center">
                     <span className="bg-blue-600/10 text-blue-400 text-[10px] font-black px-3 py-1 rounded-lg">-{log.credits_spent} CR</span>
                  </td>
                  <td className="p-4 rounded-r-2xl border-r border-y border-zinc-800 text-right">
                     <span className="text-[10px] font-bold text-zinc-600 uppercase italic">{new Date(log.created_at).toLocaleTimeString()}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">No AI activity recorded yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AiStrategySection;
