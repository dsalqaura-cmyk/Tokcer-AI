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
    name: "Loading...",
    tier: "-",
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
        .eq('id', session.user.id)
        .single();

      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('partner_id', session.user.id)
        .order('created_at', { ascending: false });

      if (profile) {
        setPartnerData(prev => ({
          ...prev,
          id: profile.affiliate_id || "-",
          name: profile.full_name || session.user.email,
          tier: profile.tier || "Bronze",
          subscribers: clients || []
        }));

        const active = (clients || []).filter(c => c.status === 'active').length;
        const cancelled = (clients || []).filter(c => c.status === 'cancelled').length;
        const totalCommission = (clients || []).filter(c => c.status === 'active').reduce((acc, curr) => acc + (curr.commission_amount || 0), 0);

        // Calculate Performance Bonus
        // Logic: > 10 clients = 5% bonus, > 50 clients = 10% bonus
        let bonus = 0;
        if (active > 50) {
          bonus = totalCommission * 0.10;
        } else if (active > 10) {
          bonus = totalCommission * 0.05;
        }

        // Fetch All Partners for Leaderboard
        const { data: allPartners } = await supabase.from('partners').select('*');
        const { data: allClients } = await supabase.from('clients').select('partner_id, commission_amount').eq('status', 'active');

        const leaderboardData = (allPartners || []).map(p => {
            const partnerClients = (allClients || []).filter(c => c.partner_id === p.id);
            const totalOmzet = partnerClients.reduce((acc, curr) => acc + (curr.commission_amount || 0), 0);
            return {
                id: p.id,
                name: p.full_name || 'Anonymous Partner',
                omzet: totalOmzet,
                closing: partnerClients.length,
                tier: p.tier || 'Bronze'
            };
        }).sort((a, b) => b.omzet - a.omzet);

        // Calculate Real Projection
        const now = new Date();
        const currentDay = now.getDate();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const projected = (totalCommission / (currentDay || 1)) * daysInMonth;

        setPartnerData(prev => ({
          ...prev,
          activeUsers: active,
          cancelledUsers: cancelled,
          mtdPace: totalCommission,
          projectedEndMonth: projected,
          performanceBonus: bonus,
          leaderboard: leaderboardData.slice(0, 10)
        }));
      }
    } catch (err) {
      console.error("Error fetching partner data:", err);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const getWeekInfo = () => {
    const now = new Date();
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now - jan1) / 86400000) + 1;
    const weekNum = Math.ceil((dayOfYear + jan1.getDay()) / 7);
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek - 1));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const label = `Week ${weekNum} · ${monday.getDate()}–${friday.getDate()} ${months[monday.getMonth()]} ${now.getFullYear()}`;
    const endOfFriday = new Date(friday);
    endOfFriday.setHours(23, 59, 59, 999);
    return { label, endOfFriday };
  };

  const getRelativeTime = (date) => {
    if (!date) return '-';
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) return lang === 'id' ? 'baru saja' : 'just now';
    const days = Math.floor(diffHours / 24);
    if (days === 1) return lang === 'id' ? '1 hari lalu' : '1 day ago';
    return lang === 'id' ? `${days} hari lalu` : `${days} days ago`;
  };

  const t = (key) => partnerTranslations[lang][key] || key;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('tokcer_lang', newLang);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPlanBadge = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'ultimate': return 'bg-orange-600 text-white border-orange-400 shadow-orange-600/20';
      case 'elite': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'pro': return 'bg-zinc-800 text-zinc-400 border-zinc-700';
      default: return 'bg-zinc-900 text-zinc-500 border-zinc-800';
    }
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
    if (!onboardForm.paymentProof) {
      alert(lang === 'id' ? 'Silakan upload bukti pembayaran!' : 'Please upload payment proof!');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Payment Proof
      const file = onboardForm.paymentProof;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      // 3. Insert Client Data
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

      alert(lang === 'id' ? 'Data aktivasi berhasil dikirim! Tim kami akan segera melakukan verifikasi.' : 'Activation data sent! Our team will verify it shortly.');
      setOnboardForm({
        shopName: '',
        email: '',
        whatsapp: '',
        plan: 'pro',
        paymentMethod: 'transfer',
        paymentProof: null
      });
      fetchData(); // Refresh list
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
      let screenshotUrl = null;

      // 1. Upload Screenshot if exists
      if (supportForm.screenshot) {
        const file = supportForm.screenshot;
        const fileExt = file.name.split('.').pop();
        const fileName = `partner-${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `support-attachments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('support-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('support-files')
          .getPublicUrl(filePath);
        
        screenshotUrl = publicUrl;
      }

      // 2. Insert Ticket
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: user.id, // Using user_id column for consistency
          type: 'bug',
          title: `Support: ${supportForm.category}`,
          description: supportForm.description,
          attachment_url: screenshotUrl,
          status: 'open',
          priority: 'medium'
        }]);

      if (error) throw error;

      alert(lang === 'id' ? 'Laporan bantuan telah terkirim.' : 'Support report sent.');
      setSupportForm({
        category: 'data',
        description: '',
        screenshot: null
      });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    const vision = e.target.elements[0].value;
    if (!vision) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          partner_id: user.id,
          category: 'feedback',
          description: vision,
          status: 'open',
          priority: 'low'
        }]);

      if (error) throw error;

      alert(lang === 'id' ? 'Ide brilian Anda telah kami simpan!' : 'Your brilliant idea has been saved!');
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
        return <LeaderboardTab t={t} lang={lang} partnerData={partnerData} leaderboardPeriod={leaderboardPeriod} setLeaderboardPeriod={setLeaderboardPeriod} countdown={countdown} getWeekInfo={getWeekInfo} getTierColor={getTierColor} formatCurrency={formatCurrency} />;
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
    <div className="min-h-screen bg-black text-white font-['Inter',sans-serif] selection:bg-orange-500 selection:text-white">
      <PartnerSidebar t={t} activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} lang={lang} toggleLang={toggleLang} handleLogout={handleLogout} />
      <PartnerHeader t={t} partnerData={partnerData} activeTab={activeTab} setActiveTab={setActiveTab} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <main className="max-w-7xl mx-auto p-6 md:p-10 relative">
        {renderContent()}
      </main>
      <footer className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center gap-4 border-t border-zinc-900/50 mt-10">
        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">
          Tokcer AI © 2026 — {t('advancedAnalytics')}
        </div>
      </footer>
    </div>
  );
};

export default PartnerDashboard;
