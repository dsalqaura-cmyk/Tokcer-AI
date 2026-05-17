import React, { useState } from 'react';

const OnboardTab = ({ 
  t, 
  form, 
  setForm, 
  onSubmit,
  isSubmitting,
  partnerData
}) => {
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">{t('onboardTitle')}</h2>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] max-w-lg mx-auto">{t('onboardDesc')}</p>
      </div>

      {/* GAP 5: Referral Link Card */}
      {partnerData?.referral_code && (
        <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/10 border border-orange-500/30 rounded-[32px] p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden group animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30 shrink-0 group-hover:scale-110 transition-transform">
              <iconify-icon icon="solar:link-bold-duotone" className="text-3xl text-orange-500"></iconify-icon>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Link Referral Anda</h3>
              <p className="text-zinc-400 text-xs mt-1 max-w-md">
                Bagikan link ini ke calon klien. Jika mereka mendaftar lewat link ini, otomatis akan masuk ke dalam jaringan Anda.
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-zinc-800 relative z-10">
            <input 
              type="text" 
              readOnly 
              value={`https://staging.tokcer-ai.com/register?ref=${partnerData.referral_code}`}
              className="bg-transparent text-zinc-300 text-xs px-3 py-2 outline-none w-full md:w-64 font-mono truncate"
            />
            <button 
              type="button"
              onClick={(e) => {
                navigator.clipboard.writeText(`https://staging.tokcer-ai.com/register?ref=${partnerData.referral_code}`);
                const btn = e.currentTarget;
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<iconify-icon icon="solar:check-circle-bold"></iconify-icon> Copied!';
                btn.classList.add('bg-emerald-500', 'text-white');
                btn.classList.remove('bg-zinc-800', 'text-zinc-400');
                setTimeout(() => {
                  btn.innerHTML = originalHtml;
                  btn.classList.remove('bg-emerald-500', 'text-white');
                  btn.classList.add('bg-zinc-800', 'text-zinc-400');
                }, 2000);
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-bold uppercase px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              <iconify-icon icon="solar:copy-bold"></iconify-icon>
              Salin
            </button>
          </div>
        </div>
      )}

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
                  <optgroup label="Monthly Plans (Bulanan) - Terkunci">
                    <option value="pro_monthly" disabled>Pro Edition (Locked / Segera Hadir)</option>
                    <option value="elite_monthly" disabled>Elite Edition (Locked / Segera Hadir)</option>
                    <option value="ultimate_monthly" disabled>Ultimate Edition (Locked / Segera Hadir)</option>
                  </optgroup>
                  <optgroup label="Yearly Plans (Tahunan) - Terkunci">
                    <option value="pro_yearly" disabled>Pro Edition (Locked / Segera Hadir)</option>
                    <option value="elite_yearly" disabled>Elite Edition (Locked / Segera Hadir)</option>
                    <option value="ultimate_yearly" disabled>Ultimate Edition (Locked / Segera Hadir)</option>
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

          {form.package !== 'starter' && (
            <>
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
            </>
          )}

          {/* Business Verification Checkbox */}
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-3 mt-8 mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="flex-shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  checked={isBusinessVerified}
                  onChange={(e) => setIsBusinessVerified(e.target.checked)}
                  className="w-4 h-4 rounded bg-black border-zinc-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-zinc-900" 
                />
              </div>
              <div className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed">
                Saya menyatakan bahwa toko yang saya jalankan sudah berstatus <span className="text-white font-bold">Akun Bisnis / Lolos Verifikasi</span> di marketplace terkait.
              </div>
            </label>
            
            {!isBusinessVerified && (
              <div className="flex items-start gap-2 text-[10px] text-amber-500/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                <iconify-icon icon="solar:danger-triangle-bold" className="text-sm flex-shrink-0 mt-0.5"></iconify-icon>
                <p><strong>Peringatan:</strong> Tanpa verifikasi bisnis, sistem beresiko tidak dapat menarik data toko secara otomatis. Centang kotak di atas untuk melanjutkan.</p>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !isBusinessVerified}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl shadow-orange-600/10 hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              form.package === 'starter' ? 'Daftarkan Akun (Gratis)' :
              form.paymentMethod === 'transfer' ? t('submitOnboard') : 'Generate Link & Kirim Email'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default OnboardTab;
