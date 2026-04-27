import React, { useState } from 'react';
import { supabase } from '../../supabase';

const DashboardAccount = ({ t, profile }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password tidak cocok!' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Password berhasil diperbarui! Anda sekarang bisa login menggunakan password.' });
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 space-y-6 animate-in fade-in duration-700">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Keamanan Akun</h2>
        <p className="text-xs text-zinc-400 mt-1">Atur password Anda untuk akses yang lebih mudah di masa mendatang.</p>
      </header>

      <div className="max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-950/50 flex items-center justify-center border border-orange-900/50">
              <iconify-icon icon="solar:lock-password-linear" className="text-xl text-orange-500"></iconify-icon>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ubah Password</h3>
              <p className="text-[10px] text-zinc-500">Gunakan kombinasi yang aman.</p>
            </div>
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg mb-6 text-xs text-center border ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
                : 'bg-rose-500/10 border-rose-500/50 text-rose-500'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Password Baru</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
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
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-orange-500 transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading && <iconify-icon icon="solar:spinner-linear" className="animate-spin text-lg"></iconify-icon>}
              {loading ? 'MENYIMPAN...' : 'SIMPAN PASSWORD'}
            </button>
          </form>
        </div>

        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <div className="flex gap-3">
                <iconify-icon icon="solar:info-circle-linear" className="text-blue-500 text-lg shrink-0"></iconify-icon>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Setelah Anda mengatur password, Anda dapat masuk ke akun Anda menggunakan alamat email dan password di halaman login tanpa harus menunggu email Magic Link.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAccount;
