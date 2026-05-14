import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TikTokCallback = () => {
  const [status, setStatus] = useState('Mengotorisasi...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const authCode = params.get('code') || params.get('auth_code');
        const state = params.get('state');

        if (!authCode) {
          setStatus('Gagal: Kode otorisasi tidak ditemukan.');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setStatus('Sesi habis. Silakan login kembali.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // TODO: Nanti kita buat Edge Function 'tiktok-exchange-token' untuk menukar authCode
        // Sementara kita simpan dulu code-nya ke database sebagai tanda connected
        const { error } = await supabase
          .from('connected_stores')
          .upsert({
            user_id: session.user.id,
            platform: 'tiktok',
            store_name: 'TikTok Shop (Pending Sync)',
            status: 'connected',
            access_token: authCode // Placeholder before token exchange is implemented
          }, { onConflict: 'user_id, platform' });

        if (error) throw error;

        setStatus('Berhasil terhubung ke TikTok Shop! Mengalihkan...');
        setTimeout(() => navigate('/dashboard'), 2000);

      } catch (err) {
        console.error('TikTok Callback Error:', err);
        setStatus(`Gagal: ${err.message}`);
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#111] p-8 rounded-3xl border border-zinc-800 text-center max-w-md w-full">
        <iconify-icon icon="ri:tiktok-fill" className="text-6xl text-white mb-6 animate-pulse"></iconify-icon>
        <h2 className="text-xl font-black text-white mb-2 tracking-wide">TikTok Shop Integrator</h2>
        <p className="text-zinc-400 text-sm">{status}</p>
        <div className="mt-8 w-8 h-8 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default TikTokCallback;
