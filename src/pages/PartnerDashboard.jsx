import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase.js';
import PartnerSidebar from '../components/partner/PartnerSidebar.jsx';
import PartnerHeader from '../components/partner/PartnerHeader.jsx';
import OnboardTab from '../components/partner/tabs/OnboardTab.jsx';
import SubscribersTab from '../components/partner/tabs/SubscribersTab.jsx';
import LeaderboardTab from '../components/partner/tabs/LeaderboardTab.jsx';
import PaymentTab from '../components/partner/tabs/PaymentTab.jsx';
import SupportTab from '../components/partner/tabs/SupportTab.jsx';
import AcademyTab from '../components/partner/tabs/AcademyTab.jsx';
import ProfileTab from '../components/partner/tabs/ProfileTab.jsx';
import { partnerTranslations } from '../locales/partnerLocales.js';

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('onboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('tokcer_lang') || 'id');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: 'Budi Santoso',
    whatsapp: '081234567890',
    email: 'budi.santoso@gmail.com',
    bankName: 'BCA',
    bankAccount: '1234567890',
  });
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('current');
  const [supportTab, setSupportTab] = useState('report'); 
  const navigate = useNavigate();

  // Form States
  const [onboardForm, setOnboardForm] = useState({
    shopName: '',
    email: '',
    whatsapp: '',
    plan: 'pro',
    paymentMethod: 'transfer',
    paymentProof: null
  });

  const [supportForm, setSupportForm] = useState({
    category: 'data',
    description: '',
    screenshot: null
  });

  const [partnerData, setPartnerData] = useState({
    id: "-",
    name: "Partner",
    tier: "Bronze",
    activeUsers: 0,
    cancelledUsers: 0,
    mtdPace: 0,
    projectedEndMonth: 0,
    subscribers: [],
    leaderboard: [],
    paymentHistory: []
  });

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('partners')
        .select('*')
        .or(`id.eq.${session.user.id},email.eq.${session.user.email}`)
        .maybeSingle();

      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('partner_id', session.user.id)
        .order('created_at', { ascending: false });

      if (profile || clients) {
        const active = (clients || []).filter(c => c.status === 'active').length;
        const totalCommission = (clients || []).filter(c => c.status === 'active').reduce((acc, curr) => acc + (curr.commission_amount || 0), 0);

        setPartnerData(prev => ({
          ...prev,
          id: profile?.affiliate_id || "-",
          name: profile?.full_name || session.user.email,
          tier: profile?.tier || "Bronze",
          subscribers: clients || [],
          activeUsers: active,
          mtdPace: totalCommission
        }));
      }
    } catch (err) {
      console.error("Error fetching partner data:", err);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Auth Error:", err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const t = (key) => partnerTranslations[lang][key] || key;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('tokcer_lang', newLang);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  };

  const getPlanBadge = (plan) => {
    switch(plan?.toLowerCase()) {
      case 'ultimate': return 'bg-orange-600 text-white border-orange-400 shadow-orange-600/20';
      case 'elite': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'pro': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const getRelativeTime = (date) => {
    if (!date) return '-';
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) return lang === 'id' ? 'baru saja' : 'just now';
    return Math.floor(diffHours / 24) + (lang === 'id' ? ' hari lalu' : ' days ago');
  };

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'diamond': return 'text-cyan-400';
      case 'platinum': return 'text-zinc-300';
      case 'gold': return 'text-amber-400';
      case 'silver': return 'text-zinc-400';
      default: return 'text-orange-500';
    }
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Sesi berakhir, silakan login ulang.");
      return;
    }
    if (!onboardForm.paymentProof) {
      alert(lang === 'id' ? 'Silakan upload bukti pembayaran!' : 'Please upload payment proof!');
      return;
    }

    setIsSubmitting(true);
    try {
      const file = onboardForm.paymentProof;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('clients')
        .insert([{
          shop_name: onboardForm.shopName,
          email: onboardForm.email,
          whatsapp: onboardForm.whatsapp,
          plan: onboardForm.plan,
          payment_method: onboardForm.paymentMethod,
          payment_proof_url: publicUrl,
          partner_id: user.id,
          status: 'pending',
          tier: onboardForm.plan === 'ultimate' ? 'Ultimate' : onboardForm.plan === 'elite' ? 'Elite' : 'Pro'
        }]);

      if (insertError) throw insertError;

      alert(lang === 'id' ? 'Berhasil! Tim kami akan segera memverifikasi.' : 'Success! Our team will verify soon.');
      setOnboardForm({ shopName: '', email: '', whatsapp: '', plan: 'pro', paymentMethod: 'transfer', paymentProof: null });
      fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('support_tickets').insert([{
        user_id: user.id,
        type: 'bug',
        title: `Support: ${supportForm.category}`,
        description: supportForm.description,
        status: 'open'
      }]);
      if (error) throw error;
      alert(lang === 'id' ? 'Laporan bantuan terkirim.' : 'Report sent.');
      setSupportForm({ category: 'data', description: '', screenshot: null });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    const vision = e.target.elements[0].value;
    if (!user || !vision) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('support_tickets').insert([{
        user_id: user.id,
        type: 'feedback',
        description: vision,
        status: 'open'
      }]);
      if (error) throw error;
      alert(lang === 'id' ? 'Ide disimpan!' : 'Idea saved!');
      e.target.reset();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'onboard':
        return <OnboardTab t={t} onboardForm={onboardForm} setOnboardForm={setOnboardForm} handleOnboardSubmit={handleOnboardSubmit} isSubmitting={isSubmitting} />;
      case 'subscribers':
        return <SubscribersTab t={t} lang={lang} partnerData={partnerData} getPlanBadge={getPlanBadge} getRelativeTime={getRelativeTime} formatCurrency={formatCurrency} />;
      case 'leaderboard':
        return <LeaderboardTab t={t} lang={lang} partnerData={partnerData} leaderboardPeriod={leaderboardPeriod} setLeaderboardPeriod={setLeaderboardPeriod} formatCurrency={formatCurrency} getTierColor={getTierColor} />;
      case 'payment':
        return <PaymentTab t={t} partnerData={partnerData} formatCurrency={formatCurrency} />;
      case 'support':
        return <SupportTab t={t} supportTab={supportTab} setSupportTab={setSupportTab} supportForm={supportForm} setSupportForm={setSupportForm} handleSupportSubmit={handleSupportSubmit} handleIdeaSubmit={handleIdeaSubmit} isSubmitting={isSubmitting} />;
      case 'academy':
        return <AcademyTab t={t} />;
      case 'profile':
        return <ProfileTab lang={lang} partnerData={partnerData} setPartnerData={setPartnerData} profileForm={profileForm} setProfileForm={setProfileForm} user={user} getTierColor={getTierColor} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
          <div className="text-orange-500 font-black uppercase tracking-[0.4em] animate-pulse">Tokcer Partner</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Inter',sans-serif]">
      <PartnerSidebar t={t} activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} lang={lang} toggleLang={toggleLang} handleLogout={handleLogout} />
      <PartnerHeader t={t} partnerData={partnerData} activeTab={activeTab} setActiveTab={setActiveTab} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <main className="max-w-7xl mx-auto p-6 md:p-10 relative">
        {renderContent()}
      </main>
      <footer className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center gap-4 border-t border-zinc-900/50 mt-10 text-center">
        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">
          Tokcer AI © 2026 — {t('advancedAnalytics')}
        </div>
      </footer>
    </div>
  );
};

export default PartnerDashboard;
