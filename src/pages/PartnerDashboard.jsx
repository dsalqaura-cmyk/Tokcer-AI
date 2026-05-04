import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase.js';
import PartnerHeader from '../components/partner/PartnerHeader.jsx';
import PartnerSidebar from '../components/partner/PartnerSidebar.jsx';
import OnboardTab from '../components/partner/tabs/OnboardTab.jsx';
import SubscribersTab from '../components/partner/tabs/SubscribersTab.jsx';
import LeaderboardTab from '../components/partner/tabs/LeaderboardTab.jsx';
import PaymentTab from '../components/partner/tabs/PaymentTab.jsx';
import SupportTab from '../components/partner/tabs/SupportTab.jsx';
import ProfileTab from '../components/partner/tabs/ProfileTab.jsx';
import AcademyTab from '../components/partner/tabs/AcademyTab.jsx';
import { partnerTranslations } from '../locales/partnerLocales.js';

const PartnerDashboard = () => {
  console.log("💎 PartnerDashboard Mounting...");
  const [activeMenu, setActiveMenu] = useState('onboard'); // Simplified names
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(localStorage.getItem('tokcer_lang') || 'id');
  const [user, setUser] = useState(null);
  const [partnerData, setPartnerData] = useState({
    full_name: 'Partner',
    activeUsers: 0,
    paymentHistory: [] // Fallback for PaymentTab
  });
  const [subscribers, setSubscribers] = useState([]);
  const [onboardForm, setOnboardForm] = useState({
    shopName: '',
    email: '',
    whatsapp: '',
    package: 'starter',
    paymentMethod: 'transfer',
    paymentProof: null
  });
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    whatsapp: '',
    bankName: '',
    bankAccount: ''
  });
  const [supportActiveTab, setSupportActiveTab] = useState('report');
  const [bugForm, setBugForm] = useState({ category: 'bug', description: '', screenshot: null });
  const [ideaForm, setIdeaForm] = useState({ content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [countdown, setCountdown] = useState('');

  const navigate = useNavigate();
  const t = (key) => partnerTranslations[lang][key] || key;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  };


  const getTierColor = (tier) => {
    switch (String(tier).toLowerCase()) {
      case 'starter': return 'text-zinc-400';
      case 'pro': return 'text-blue-400';
      case 'elite': return 'text-purple-400';
      case 'ultimate': return 'text-orange-500';
      default: return 'text-orange-500';
    }
  };


  const getWeekInfo = () => {

    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(17, 0, 0, 0);

    return { monday, friday };
  };

  const updateCountdown = () => {
    const { friday } = getWeekInfo();
    const now = new Date();
    const diff = friday - now;

    if (diff <= 0) {
      setCountdown('00:00:00:00');
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdown(
      `${String(d).padStart(2, '0')}:${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    );
  };

    const fetchData = async (currentUser) => {
      if (!currentUser) return;
      try {
        setLoading(true);
        // 1. Fetch Partner Profile
        const { data: partner } = await supabase
          .from('partners')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();
        
        // 2. Fetch Clients (Subscribers)
        const { data: subs } = await supabase
          .from('clients')
          .select('*')
          .eq('partner_id', currentUser.id)
          .order('created_at', { ascending: false });
          
        const currentSubs = subs || [];
        setSubscribers(currentSubs);

        // 3. Calculate Stats
        const activeCount = currentSubs.filter(s => s.status === 'active').length;
        const cancelledCount = currentSubs.filter(s => s.status === 'cancelled').length;

        // 3.5 Fetch Payouts
        const { data: payoutsData } = await supabase
          .from('payouts')
          .select('*')
          .eq('partner_id', currentUser.id)
          .order('created_at', { ascending: false });
          
        const mappedPayouts = (payoutsData || []).map(p => ({
          ...p,
          period: p.period || new Date(p.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
        }));

        if (partner) {
          setPartnerData({
            ...partner,
            activeUsers: activeCount,
            paymentHistory: mappedPayouts
          });
          setProfileForm({
            fullName: partner.full_name || '',
            whatsapp: partner.whatsapp || '',
            bankName: partner.bank_name || '',
            bankAccount: partner.bank_account || ''
          });
        }

        // 4. Fetch Leaderboard
        const { data: leaders } = await supabase.from('partners')
          .select('full_name, total_omzet')
          .not('full_name', 'is', null)
          .order('total_omzet', { ascending: false })
          .limit(10);
        setLeaderboardData(leaders || []);
      } catch (err) {
        console.error("Fetch Data Error:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
        
        if (session) {
          setUser(session.user);
          await fetchData(session.user);
        } else if (isAdmin) {
          // Pintu Rahasia Admin: Masuk tanpa sesi Supabase tapi tetap pakai ID aslinya
          const adminUser = { 
            email: 'admin@tokcer-ai.com', 
            id: '81c19c28-9614-4a6d-b2f2-b8244c0ced29' 
          };
          setUser(adminUser);
          await fetchData(adminUser);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error("Init Error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);


  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetUser = user;
      if (!targetUser || !targetUser.id) {
        throw new Error("Identitas Anda tidak terdeteksi. Mohon Logout lalu Login kembali.");
      }

      if (!onboardForm.paymentProof) throw new Error("Harap upload bukti pembayaran.");

      const file = onboardForm.paymentProof;
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `payment-proofs/${targetUser.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('payment-proofs').getPublicUrl(filePath);

      const rawPackage = onboardForm.package;
      let finalPlan = rawPackage;
      let billingCycle = 'Monthly';

      if (rawPackage.includes('_')) {
        const [plan, cycle] = rawPackage.split('_');
        finalPlan = plan;
        billingCycle = cycle.charAt(0).toUpperCase() + cycle.slice(1);
      } else if (rawPackage === 'starter') {
        finalPlan = 'starter';
        billingCycle = 'Monthly';
      }

      const { error: insertError } = await supabase.from('clients').insert([{
        partner_id: user.id === 'admin-bypass' ? null : user.id,
        shop_name: onboardForm.shopName,
        email: onboardForm.email,
        whatsapp: onboardForm.whatsapp,
        plan: finalPlan,
        billing_cycle: billingCycle,
        payment_method: onboardForm.paymentMethod,
        payment_proof_url: publicUrl,
        status: 'pending',
        ref: partnerData.full_name || 'Partner'
      }]);

      if (insertError) throw insertError;

      alert("Pendaftaran toko berhasil! Menunggu verifikasi admin.");
      setOnboardForm({
        shopName: '',
        email: '',
        whatsapp: '',
        package: 'starter',
        paymentMethod: 'transfer',
        paymentProof: null
      });
      fetchData(targetUser);
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
      if (!user?.id) throw new Error("Sesi berakhir.");

      const { error } = await supabase.from('partners').update({
        full_name: profileForm.fullName,
        whatsapp: profileForm.whatsapp,
        bank_name: profileForm.bankName,
        bank_account: profileForm.bankAccount
      }).eq('id', user.id);
      
      if (error) throw error;
      alert("Profil diperbarui!");
      fetchData(user);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBugSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!user?.id) throw new Error("Sesi berakhir.");

      const { error } = await supabase.from('support_tickets').insert([{
        user_id: user.id === 'admin-bypass' ? null : user.id,
        type: bugForm.category || 'bug',
        description: bugForm.description,
        status: 'open',
        metadata: { source: 'partner_dashboard' }
      }]);

      if (error) throw error;
      alert("Laporan bug terkirim! Tim teknis kami akan segera memeriksa.");
      setBugForm({ category: 'bug', description: '', screenshot: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!user?.id) throw new Error("Sesi berakhir.");

      const { error } = await supabase.from('partner_ideas').insert([{
        partner_id: user.id === 'admin-bypass' ? null : user.id,
        title: 'Saran Fitur Baru',
        content: ideaForm.content,
        status: 'draft'
      }]);

      if (error) throw error;
      alert("Ide brilian Anda telah kami catat! Terima kasih atas masukannya.");
      setIdeaForm({ content: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLang = (l) => {
    setLang(l);
    localStorage.setItem('tokcer_lang', l);
  };

  const handleLogout = async () => {
    if(window.confirm(t('confirmLogout') || 'Logout?')) {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/login');
    }
  };

  const renderContent = () => {
    const commonProps = { t, isSubmitting, formatCurrency };
    switch (activeMenu) {
      case 'onboard': return <OnboardTab {...commonProps} form={onboardForm} setForm={setOnboardForm} onSubmit={handleOnboardSubmit} />;
      case 'subscribers': return <SubscribersTab {...commonProps} subscribers={subscribers} />;
      case 'leaderboard': return <LeaderboardTab {...commonProps} data={leaderboardData} countdown={countdown} />;
      case 'payment': return <PaymentTab {...commonProps} partnerData={partnerData} />;
      case 'support': return (
        <SupportTab 
          {...commonProps} 
          supportTab={supportActiveTab} 
          setSupportTab={setSupportActiveTab}
          supportForm={bugForm}
          setSupportForm={setBugForm}
          ideaForm={ideaForm}
          setIdeaForm={setIdeaForm}
          handleSupportSubmit={handleBugSubmit}
          handleIdeaSubmit={handleIdeaSubmit}
        />
      );
      case 'academy': return <AcademyTab {...commonProps} />;
      case 'profile': return (
        <ProfileTab 
          {...commonProps} 
          lang={lang}
          partnerData={partnerData}
          user={user}
          getTierColor={getTierColor}
          profileForm={profileForm} 
          setProfileForm={setProfileForm} 
          handleUpdateProfile={handleUpdateProfile} 
        />
      );
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-['Inter']">
      <PartnerSidebar 
        t={t} 
        activeTab={activeMenu} 
        setActiveTab={setActiveMenu} 
        isMobileMenuOpen={isSidebarOpen} 
        setIsMobileMenuOpen={setIsSidebarOpen} 
        lang={lang} 
        toggleLang={toggleLang} 
        handleLogout={handleLogout} 
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <PartnerHeader 
          t={t} 
          partnerData={partnerData} 
          activeTab={activeMenu} 
          setActiveTab={setActiveMenu} 
          setIsMobileMenuOpen={setIsSidebarOpen} 
        />
        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;

