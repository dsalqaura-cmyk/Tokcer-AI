import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import logo from '../assets/logo.png';

const Login = () => {
  const [lang, setLang] = useState(localStorage.getItem('tokcer_lang') || 'id');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'partner'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const translations = {
    id: {
      loginTitle: isRegister ? "Daftar Akun Baru" : "Login Dashboard",
      loginDesc: isRegister ? "Mulai kelola tokomu dengan AI." : "Masuk untuk kelola tokomu.",
      emailLabel: "Email Akses",
      passwordLabel: "Password",
      fullNameLabel: "Nama Lengkap",
      forgotPass: "Lupa Password?",
      loginBtn: isRegister ? "Daftar Sekarang" : "Masuk ke Sistem",
      loggingIn: isRegister ? "Mendaftar..." : "Masuk...",
      asUser: "Sebagai User",
      asPartner: "Sebagai Partner",
      asAdmin: "Sebagai Admin",
      noAccount: "Belum punya akun?",
      haveAccount: "Sudah punya akun?",
      signUp: "Daftar di sini",
      signIn: "Login di sini",
    },
    en: {
      loginTitle: isRegister ? "Create New Account" : "Dashboard Login",
      loginDesc: isRegister ? "Start managing your shop with AI." : "Sign in to manage your shop.",
      emailLabel: "Access Email",
      passwordLabel: "Password",
      fullNameLabel: "Full Name",
      forgotPass: "Forgot Password?",
      loginBtn: isRegister ? "Sign Up Now" : "Sign In",
      loggingIn: isRegister ? "Signing up..." : "Signing in...",
      asUser: "As User",
      asPartner: "As Partner",
      asAdmin: "As Admin",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      signUp: "Sign up here",
      signIn: "Login here",
    }
  };

  const t = (key) => translations[lang][key] || key;

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('tokcer_lang', newLang);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (isRegister) {
      // Handle Sign Up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
      } else {
        alert(lang === 'id' ? 'Registrasi berhasil! Silakan login.' : 'Registration successful! Please login.');
        setIsRegister(false);
        setLoading(false);
      }
      return;
    }

    // Handle Admin Total Bypass
    if (email === 'admin@tokcer-ai.com' && password === 'Dind@1983') {
      localStorage.setItem('tokcer_admin_auth', 'true');
      setLoading(false);
      if (role === 'admin') navigate('/admin');
      else if (role === 'partner') navigate('/partner-dashboard');
      else navigate('/dashboard');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      if (role === 'admin') navigate('/admin');
      else if (role === 'partner') navigate('/partner-dashboard');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative">
      <div className="fixed inset-0 -z-10 h-[100vh] w-full bg-black bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
        <button 
          onClick={() => toggleLang('id')}
          className={`px-3 py-1.5 text-[10px] font-bold rounded ${lang === 'id' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
        >
          ID
        </button>
        <button 
          onClick={() => toggleLang('en')}
          className={`px-3 py-1.5 text-[10px] font-bold rounded ${lang === 'en' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
        >
          EN
        </button>
      </div>

      <div className="absolute top-6 left-6 lg:fixed">
        <Link to="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Tokcer AI" className="h-6 md:h-8 w-auto" />
        </Link>
      </div>

      <div className="relative bg-zinc-900 w-full max-w-[calc(100%-2rem)] md:max-w-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-zinc-800 my-20">
        <div className="mb-6 md:mb-8 text-center">
          <div className="w-12 h-12 bg-orange-950/50 rounded-xl flex items-center justify-center border border-orange-900/50 mx-auto mb-4">
            <iconify-icon icon={isRegister ? "solar:user-plus-linear" : "solar:user-linear"} className="text-2xl text-orange-500"></iconify-icon>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">{t('loginTitle')}</h3>
          <p className="text-[10px] md:text-xs text-zinc-400 mt-1">{t('loginDesc')}</p>
        </div>
        
        {/* Role Switcher */}
        <div className="flex bg-black rounded-xl p-1 mb-6 border border-zinc-800">
          <button 
            onClick={() => setRole('user')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all ${role === 'user' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
          >
            <iconify-icon icon="solar:shop-linear"></iconify-icon>
            {t('asUser')}
          </button>
          <button 
            onClick={() => setRole('partner')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all ${role === 'partner' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
          >
            <iconify-icon icon="solar:hand-stars-linear"></iconify-icon>
            {t('asPartner')}
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all ${role === 'admin' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
          >
            <iconify-icon icon="solar:shield-user-linear"></iconify-icon>
            {t('asAdmin')}
          </button>
        </div>
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('fullNameLabel')}</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                placeholder="Andi Pratama"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('emailLabel')}</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
              placeholder="admin@tokoanda.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-zinc-400">{t('passwordLabel')}</label>
              {!isRegister && (
                <a href="#" className="text-[10px] font-medium text-orange-500 hover:text-orange-400 transition-colors">{t('forgotPass')}</a>
              )}
            </div>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-500 transition-all shadow-md mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <iconify-icon icon="solar:spinner-linear" className="animate-spin text-lg"></iconify-icon>}
            {loading ? t('loggingIn') : t('loginBtn')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 mb-3">
            {isRegister ? t('haveAccount') : t('noAccount')}
          </p>
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="w-full py-2.5 rounded-xl border border-zinc-800 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-500/5 transition-all"
          >
            {isRegister ? t('signIn') : t('signUp')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
