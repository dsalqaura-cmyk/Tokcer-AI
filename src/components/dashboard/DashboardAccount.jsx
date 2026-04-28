import React from 'react';

const DashboardAccount = ({ 
  t, 
  lang, 
  securityMessage, 
  handleUpdatePassword, 
  newPassword, 
  setNewPassword, 
  confirmPassword, 
  setConfirmPassword, 
  isUpdatingPassword 
}) => {
  return (
    <div className="relative z-10 animate-in fade-in duration-500 max-w-md">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight">{t('accountSecurity')}</h2>
        <p className="text-xs text-zinc-400 mt-1">
          {lang === 'id' ? 'Atur password Anda untuk akses lebih mudah.' : 'Set your password for easier access.'}
        </p>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-950/50 flex items-center justify-center border border-orange-900/50">
            <iconify-icon icon="solar:lock-password-linear" className="text-xl text-orange-500"></iconify-icon>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{lang === 'id' ? 'Ubah Password' : 'Change Password'}</h3>
            <p className="text-[10px] text-zinc-500">{lang === 'id' ? 'Gunakan kombinasi yang kuat.' : 'Use a strong combination.'}</p>
          </div>
        </div>

        {securityMessage.text && (
          <div className={`p-3 rounded-lg mb-6 text-xs text-center border ${
            securityMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-rose-500/10 border-rose-500/50 text-rose-500'
          }`}>
            {securityMessage.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('passwordLabel')} Baru</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Konfirmasi Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isUpdatingPassword}
            className="w-full bg-orange-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-orange-500 transition-all flex justify-center items-center gap-2"
          >
            {isUpdatingPassword ? <iconify-icon icon="solar:spinner-linear" className="animate-spin text-lg"></iconify-icon> : null}
            {isUpdatingPassword ? 'SAVING...' : 'SAVE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardAccount;
