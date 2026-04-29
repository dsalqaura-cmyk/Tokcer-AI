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

  const [onboardForm, setOnboardForm] = useState({
    shopName: '',
    email: '',
    whatsapp: '',
    plan: 'pro',
    paymentMethod: 'transfer',
    paymentProof: null
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

  const fetchData = async (currentUser) => {
    if (!currentUser) return;
    try {
      // Fetch Partner Profile
      const { data: profile, error: profError } = await supabase
        .from('partners')
        .select('*')
        .or(`id.eq.${currentUser.id},email.eq.${currentUser.email}`)
        .maybeSingle();

      if (profError) console.error("Prof Error:", profError);

      // Fetch Clients
      const { data: clients, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('partner_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (profile || clients) {
        const active = (clients || []).filter(c => c.status === 'active').length;
        const totalCommission = (clients || []).filter(c => c.status === 'active').reduce((acc, curr) => acc + (curr.commission_amount || 0), 0);

        setPartnerData(prev => ({
          ...prev,
          id: profile?.referral_code || profile?.id?.slice(0, 8) || "-",
          name: profile?.full_name || currentUser.email,
          tier: profile?.tier || "Bronze",
          subscribers: clients || [],
          activeUsers: active,
          mtdPace: totalCommission
        }));
      }
    } catch (err) {
      console.error("Critical Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          await fetchData(session.user);
        } else {
          setLoading(false); // Stop loading if no session so it can kick to login
        }
      } catch (err) {
        console.error("Init Error:", err);
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-orange-500/30 rounded-full animate-spin-slow"></div>
        </div>
        <h2 className="text-orange-500 font-bold tracking-[0.3em] text-sm animate-pulse">TOKCER PARTNER</h2>
      </div>
    );
  }

  const t = (key) => partnerTranslations[lang][key] || key;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  };

  const getPlanBadge = (plan) => {
    switch(plan?.toLowerCase()) {
      case 'ultimate': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'elite': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'pro': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getRelativeTime = (date) => {
    if (!date) return '-';
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return lang === 'id' ? 'baru saja' : 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + (lang === 'id' ? ' menit lalu' : ' mins ago');
    return past.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-black text-white font-['Inter',sans-serif] overflow-hidden">
      <PartnerSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleLogout={handleLogout}
        t={t}
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden relative">
        <PartnerHeader 
          activeTab={activeTab} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          t={t}
          partnerData={partnerData}
          lang={lang}
          setLang={setLang}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeTab === 'onboard' && <OnboardTab t={t} onboardForm={onboardForm} setOnboardForm={setOnboardForm} isSubmitting={isSubmitting} />}
          {activeTab === 'subscribers' && (
            <SubscribersTab 
              t={t} 
              lang={lang} 
              partnerData={partnerData} 
              getPlanBadge={getPlanBadge} 
              getRelativeTime={getRelativeTime} 
              formatCurrency={formatCurrency} 
            />
          )}
          {activeTab === 'leaderboard' && <LeaderboardTab t={t} partnerData={partnerData} formatCurrency={formatCurrency} />}
          {activeTab === 'payment' && <PaymentTab t={t} partnerData={partnerData} formatCurrency={formatCurrency} />}
          {activeTab === 'support' && <SupportTab t={t} supportTab={supportTab} setSupportTab={setSupportTab} />}
          {activeTab === 'academy' && <AcademyTab t={t} />}
          {activeTab === 'profile' && <ProfileTab t={t} user={user} partnerData={partnerData} />}
        </div>
      </main>
    </div>
  );
};

export default PartnerDashboard;
