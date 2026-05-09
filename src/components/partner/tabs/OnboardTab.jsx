import React from 'react';

const OnboardTab = ({ 
  t, 
  form, 
  setForm, 
  onSubmit,
  isSubmitting
}) => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">{t('onboardTitle')}</h2>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] max-w-lg mx-auto">{t('onboardDesc')}</p>
      </div>

      <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-right from-orange-600 to-amber-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('shopName')}</label>
              <input 
                type="text" 
                required
                value={form.shopName}
                onChange={(e) => setForm({...form, shopName: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-700 transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                placeholder="e.g. Toko Makmur Jaya"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email</label>
              <input 
                type="email" 
                required
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-700 transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('whatsapp')}</label>
              <input 
                type="tel" 
                required
                value={form.whatsapp}
                onChange={(e) => setForm({...form, whatsapp: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-700 transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                placeholder="08123456789"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('plan')}</label>
              <div className="relative">
                <select 
                  value={form.package}
                  onChange={(e) => setForm({...form, package: e.target.value})}
                  className="w-full appearance-none bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all outline-none"
                >
                  <option value="starter">Starter Edition (Early Stage)</option>
                  <optgroup label="Monthly Plans (Bulanan)">
                    <option value="pro_monthly">Pro Edition (Rp 499.000/bln)</option>
                    <option value="elite_monthly">Elite Edition (Rp 999.000/bln)</option>
                    <option value="ultimate_monthly">Ultimate Edition (Rp 1.999.000/bln)</option>
                  </optgroup>
                  <optgroup label="Yearly Plans (Tahunan - Save 1 Month)">
                    <option value="pro_yearly">Pro Edition (Rp 5.489.000/thn)</option>
                    <option value="elite_yearly">Elite Edition (Rp 10.989.000/thn)</option>
                    <option value="ultimate_yearly">Ultimate Edition (Rp 21.989.000/thn)</option>
                  </optgroup>
                </select>
                <iconify-icon icon="solar:alt-arrow-down-bold" className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"></iconify-icon>
              </div>
              <div className="flex items-center gap-2 px-1 pt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  Total Bayar: <span className="text-white">
                    {(() => {
                      if (form.package.includes('starter')) return 'Gratis';
                      if (form.package === 'pro_monthly') return 'Rp 499.000';
                      if (form.package === 'pro_yearly') return 'Rp 5.489.000';
                      if (form.package === 'elite_monthly') return 'Rp 999.000';
                      if (form.package === 'elite_yearly') return 'Rp 10.989.000';
                      if (form.package === 'ultimate_monthly') return 'Rp 1.999.000';
                      if (form.package === 'ultimate_yearly') return 'Rp 21.989.000';
                      return '-';
                    })()}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('paymentMethod')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {['Transfer', 'QRIS', 'VA', 'CC', 'E-Wallet'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm({...form, paymentMethod: method.toLowerCase()})}
                  className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                    form.paymentMethod === method.toLowerCase()
                      ? "bg-orange-600/10 border-orange-600 text-orange-400"
                      : "bg-black/20 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {form.paymentMethod === 'transfer' ? (
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('paymentProof')}</label>
              <div className="relative group/upload">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setForm({...form, paymentProof: e.target.files[0]})}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-zinc-800 group-hover/upload:border-orange-500/30 rounded-3xl p-10 flex flex-col items-center justify-center transition-all bg-white/[0.01] group-hover/upload:bg-orange-500/[0.02]">
                  <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 group-hover/upload:scale-110 transition-transform">
                    <iconify-icon icon="solar:upload-bold-duotone" className="text-3xl text-orange-500"></iconify-icon>
                  </div>
                  <div className="text-xs font-bold text-zinc-300 mb-1">
                    {form.paymentProof ? (
                      <span className="text-orange-400">{t('uploadSuccess')} {form.paymentProof.name}</span>
                    ) : (
                      <span>{t('uploadPrompt')}</span>
                    )}
                  </div>
                  <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{t('uploadTypes')}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-orange-600/5 border border-orange-600/20 rounded-3xl p-6 flex items-center gap-4 animate-in zoom-in-95">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center shrink-0">
                <iconify-icon icon="solar:shield-check-bold-duotone" className="text-2xl text-orange-500"></iconify-icon>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase tracking-widest">Otomatisasi Midtrans Aktif</p>
                <p className="text-[10px] text-zinc-500 font-medium">
                  Sistem akan otomatis mengirimkan link pembayaran {
                    form.paymentMethod === 'qris' ? '& kode QRIS' : 
                    form.paymentMethod === 'va' ? '& kode Virtual Account' : 
                    form.paymentMethod === 'cc' ? '& link Credit Card' : 
                    form.paymentMethod === 'e-wallet' ? '& link E-Wallet' : ''
                  } ke email calon user. Tidak perlu upload bukti transfer.
                </p>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl shadow-orange-600/10 hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              form.paymentMethod === 'transfer' ? t('submitOnboard') : 'Generate Link & Kirim Email'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default OnboardTab;
