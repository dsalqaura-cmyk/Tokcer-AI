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
  
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('current');
  const [supportTab, setSupportTab] = useState('report'); 
  const navigate = useNavigate();

  // Form States
  const [onboardForm, setOnboardForm] = useState({ shopName: '', email: '', whatsapp: '', plan: 'pro', paymentMethod: 'transfer', paymentProof: null });
  const [supportForm, setSupportForm] = useState({ category: 'data', description: '', screenshot: null });
  const [profileForm, setProfileForm] = useState({ fullName: '', whatsapp: '', email: '', bankName: '', bankAccount: '' });

  const [partnerData, setPartnerData] = useState({
    id: "-", name: "Partner", tier: "Bronze", activeUsers: 0, mtdPace: 0, projectedEndMonth: 0,
    subscribers: [], leaderboard: [], paymentHistory: []
  });

  const t = (key) => partnerTranslations[lang][key] || key;
  const formatCurrency = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
  const getPlanBadge = (p) => p?.toLowerCase() === 'ultimate' ? 'bg-orange-600 text-white border-orange-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700';
  const getRelativeTime = (d) => d ? "Baru saja" : "-";
  const getTierColor = (t) => t?.toLowerCase() === 'diamond' ? 'text-cyan-400' : 'text-orange-500';
  const getWeekInfo = () => ({ label: "Week 18 · 29 Apr - 3 May 2026", endOfFriday: new Date() });

  const fetchData = async (currentUser) => {
    if (!currentUser) return;
    try {
      // 1. Get Partner Profile
      const { data: profile } = await supabase.from('partners').select('*').eq('id', currentUser.id).maybeSingle();
      
      // 2. Get Clients
      const { data: clients } = await supabase.from('clients').select('*').eq('partner_id', currentUser.id).order('created_at', { ascending: false });

      if (profile) {
        setProfileForm({
          fullName: profile.full_name || '',
          whatsapp: profile.whatsapp || '',
          email: profile.email || currentUser.email,
          bankName: profile.bank_name || '',
          bankAccount: profile.bank_account || '',
        });
      }

      const activeCount = (clients || []).filter(c => c.status === 'active').length;
      const totalComm = (clients || []).filter(c => c.status === 'active').reduce((acc, curr) => acc + (curr.commission_amount || 0), 0);

      // Leaderboard Simulation
      const leaderboardData = [
        { id: '1', name: 'Elite Partner A', omzet: 45000000, closing: 12, tier: 'Diamond' },
        { id: '2', name: 'Partner B', omzet: 32000000, closing: 8, tier: 'Gold' },
        { id: currentUser.id, name: profile?.full_name || currentUser.email, omzet: totalComm, closing: activeCount, tier: profile?.tier || 'Bronze' }
      ].sort((a, b) => b.omzet - a.omzet);

      setPartnerData(prev => ({
        ...prev,
        id: profile?.affiliate_id || currentUser.id.slice(0,8),
        name: profile?.full_name || currentUser.email,
        tier: profile?.tier || "Bronze",
        subscribers: clients || [],
        activeUsers: activeCount,
        mtdPace: totalComm,
        leaderboard: leaderboardData
      }));
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await fetchData(session.user);
      }
      setLoading(false);
    };
    init();

    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setDate(now.getDate() + (5 - now.getDay()));
      target.setHours(23, 59, 59);
      const diff = target - now;
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Get fresh session but don't crash if getUser is slow
      const { data: { session } } = await supabase.auth.getSession();
      const authUser = session?.user || user;
      
      if (!authUser) throw new Error("Sesi berakhir, silakan login ulang.");
      if (!onboardForm.paymentProof) throw new Error("Harap upload bukti pembayaran.");

      const file = onboardForm.paymentProof;
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `${authUser.id}/${fileName}`;

      const { error: upErr } = await supabase.storage.from('payment-proofs').upload(filePath, file);
      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage.from('payment-proofs').getPublicUrl(filePath);

      const { error: insErr } = await supabase.from('clients').insert([{
        shop_name: onboardForm.shopName,
        email: onboardForm.email,
        whatsapp: onboardForm.whatsapp,
        plan: onboardForm.plan,
        payment_proof_url: publicUrl,
        partner_id: authUser.id,
        status: 'pending'
      }]);
      if (insErr) throw insErr;

      alert("Berhasil! Tim kami akan segera melakukan verifikasi.");
      fetchData(authUser);
      setOnboardForm({ shopName: '', email: '', whatsapp: '', plan: 'pro', paymentMethod: 'transfer', paymentProof: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authUser = session?.user || user;
      if (!authUser) throw new Error("Sesi tidak valid.");
      const { error } = await supabase.from('partners').update({
        full_name: profileForm.fullName,
        whatsapp: profileForm.whatsapp,
        bank_name: profileForm.bankName,
        bank_account: profileForm.bankAccount
      }).eq('id', authUser.id);
      if (error) throw error;
      alert("Profil diperbarui!");
      fetchData(authUser);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authUser = session?.user || user;
      if (!authUser) throw new Error("Sesi tidak valid.");
      const { error } = await supabase.from('support_tickets').insert([{
        user_id: authUser.id,
        type: 'bug',
        description: supportForm.description,
        status: 'open'
      }]);
      if (error) throw error;
      alert("Laporan terkirim!");
      setSupportForm({ category: 'data', description: '', screenshot: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-orange-500 font-black tracking-widest">TOKCER PARTNER...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-['Inter',sans-serif]">
      <PartnerSidebar t={t} activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} lang={lang} toggleLang={(l) => { setLang(l); localStorage.setItem('tokcer_lang', l); }} handleLogout={handleLogout} />
      <PartnerHeader t={t} partnerData={partnerData} activeTab={activeTab} setActiveTab={setActiveTab} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {activeTab === 'onboard' && <OnboardTab t={t} onboardForm={onboardForm} setOnboardForm={setOnboardForm} handleOnboardSubmit={handleOnboardSubmit} isSubmitting={isSubmitting} />}
        {activeTab === 'subscribers' && <SubscribersTab t={t} lang={lang} partnerData={partnerData} getPlanBadge={getPlanBadge} getRelativeTime={getRelativeTime} formatCurrency={formatCurrency} />}
        {activeTab === 'leaderboard' && <LeaderboardTab t={t} lang={lang} partnerData={partnerData} leaderboardPeriod={leaderboardPeriod} setLeaderboardPeriod={setLeaderboardPeriod} countdown={countdown} getWeekInfo={getWeekInfo} getTierColor={getTierColor} formatCurrency={formatCurrency} />}
        {activeTab === 'payment' && <PaymentTab t={t} partnerData={partnerData} formatCurrency={formatCurrency} />}
        {activeTab === 'support' && <SupportTab t={t} supportTab={supportTab} setSupportTab={setSupportTab} supportForm={supportForm} setSupportForm={setSupportForm} handleSupportSubmit={handleSupportSubmit} handleIdeaSubmit={() => {}} isSubmitting={isSubmitting} />}
        {activeTab === 'academy' && <AcademyTab t={t} />}
        {activeTab === 'profile' && <ProfileTab lang={lang} partnerData={partnerData} profileForm={profileForm} setProfileForm={setProfileForm} user={user} getTierColor={getTierColor} handleUpdateProfile={handleUpdateProfile} isSubmitting={isSubmitting} />}
      </main>
    </div>
  );
};

export default PartnerDashboard;
