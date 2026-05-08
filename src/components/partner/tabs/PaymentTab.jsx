import React from 'react';

const PaymentTab = ({ 
  t, 
  partnerData, 
  formatCurrency 
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Stat Card: Saldo Komisi Berjalan */}
      <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/5 backdrop-blur-md border border-emerald-500/20 rounded-[32px] p-8 flex items-center justify-between shadow-2xl group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
            <iconify-icon icon="solar:wallet-bold-duotone" className="text-3xl text-emerald-500"></iconify-icon>
          </div>
          <div>
            <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Komisi Berjalan (Siap Cair)</div>
            <div className="text-2xl font-black text-white tracking-tight font-mono">{formatCurrency(partnerData?.total_omzet || 0)}</div>
          </div>
        </div>
        <div className="text-xs font-medium text-zinc-400">
          Akan ditransfer otomatis pada tanggal 25
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[32px] p-8 hover:border-orange-500/30 transition-all duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
              <iconify-icon icon="solar:bill-list-bold-duotone" className="text-2xl text-orange-500"></iconify-icon>
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{t('paymentHistory')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px] font-bold uppercase tracking-widest">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-800/50">
                  <th className="py-3">{t('period')}</th>
                  <th className="py-3">{t('status')}</th>
                  <th className="py-3 text-right text-emerald-400">{t('amount')}</th>
                </tr>
              </thead>
              <tbody className="text-zinc-200">
                {(partnerData?.paymentHistory || []).map((p, idx) => (
                  <tr key={idx} className="border-b border-zinc-900/30 group-hover:bg-white/[0.01]">
                    <td className="py-5">{p.period}</td>
                    <td className="py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        p.status === 'paid'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${p.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-5 text-right text-emerald-400 font-black font-mono text-xs">{formatCurrency(p.amount)}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="group bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[32px] p-8 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                <iconify-icon icon="solar:info-circle-bold-duotone" className="text-2xl text-orange-500"></iconify-icon>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{t('paymentInfo')}</h3>
            </div>
            <p className="text-xs leading-loose text-zinc-300 font-medium italic">
              "Komisi partner akan dibayarkan secara otomatis ke rekening Anda yang terdaftar pada tanggal 25 setiap bulannya. Tidak perlu mengajukan penarikan manual."
            </p>
            <div className="mt-8 pt-8 border-t border-zinc-800/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span>{t('cyclePeriod')}</span>
              <span className="text-white">{t('monthly')}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-amber-600/5 backdrop-blur-md border border-orange-500/20 rounded-[32px] p-8 flex items-center justify-between shadow-2xl group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <iconify-icon icon="solar:wallet-money-bold-duotone" className="text-3xl text-orange-500"></iconify-icon>
              </div>
              <div>
                <div className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">{t('bankStatus')}</div>
                <div className="text-base font-black text-white tracking-tight">{t('verified')} ✅</div>
              </div>
            </div>
            <iconify-icon icon="solar:check-circle-bold" className="text-emerald-400 text-3xl animate-pulse"></iconify-icon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTab;
