// Dummy comment untuk memicu rebuild Staging - Ujang 🚀
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import PartnerHeader from '../components/partner/PartnerHeader.jsx';
import PartnerSidebar from '../components/partner/PartnerSidebar.jsx';
import OnboardTab from '../components/partner/tabs/OnboardTab.jsx';
import SubscribersTab from '../components/partner/tabs/SubscribersTab.jsx';
import LeaderboardTab from '../components/partner/tabs/LeaderboardTab.jsx';
import PaymentTab from '../components/partner/tabs/PaymentTab.jsx';
import SupportTab from '../components/partner/tabs/SupportTab.jsx';
import ProfileTab from '../components/partner/tabs/ProfileTab.jsx';
import AcademyTab from '../components/partner/tabs/AcademyTab.jsx';
import CommissionSchemeTab from '../components/partner/tabs/CommissionSchemeTab.jsx';
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
  const [leaderboardFilter, setLeaderboardFilter] = useState('minggu_ini');
  const [totalPeriodClosings, setTotalPeriodClosings] = useState(0);

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
    const day = now.getDay(); // 0: Minggu, 1: Senin, ..., 6: Sabtu
    
    // Hitung mundur ke hari Sabtu terdekat sebelumnya
    const diffToSaturday = day === 6 ? 0 : -(day + 1);
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + diffToSaturday);
    saturday.setHours(0, 0, 0, 0);
    
    // Hari Jumat adalah Sabtu + 6 hari
    const friday = new Date(saturday);
    friday.setDate(saturday.getDate() + 6);
    friday.setHours(23, 59, 59, 999);
    
    return { saturday, friday };
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
        
        const { data: partner } = await supabase.from('partners').select('*').eq('id', currentUser.id).maybeSingle();
        const { data: subs } = await supabase.from('clients').select('*').eq('partner_id', currentUser.id).order('created_at', { ascending: false });
        const { data: payoutsData } = await supabase.from('payouts').select('*').eq('partner_id', currentUser.id).order('created_at', { ascending: false });

        if (partner) {
          setPartnerData({
            ...partner,
            activeUsers: (subs || []).filter(s => s.status === 'active').length,
            paymentHistory: (payoutsData || []).map(p => ({
              ...p,
              period: p.period || new Date(p.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
            }))
          });
          setProfileForm({
            fullName: partner.full_name || '',
            whatsapp: partner.whatsapp || '',
            bankName: partner.bank_name || '',
            bankAccount: partner.bank_account || ''
          });
        }

        setSubscribers(subs || []);

      } catch (err) {
        console.error("Fetch Data Error:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    let partnerSubscription = null;
    const init = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
        
        const targetUser = session?.user || (isAdmin ? { email: 'admin@tokcer-ai.com', id: '81c19c28-9614-4a6d-b2f2-b8244c0ced29' } : null);
        
        if (targetUser) {
          setUser(targetUser);
          await fetchData(targetUser);
          
          // 🏮 REAL-TIME SUBSCRIPTION (Section 3 Action Plan)
          partnerSubscription = supabase
            .channel(`partner_${targetUser.id}`)
            .on('postgres_changes', 
              { event: '*', schema: 'public', table: 'partners', filter: `id=eq.${targetUser.id}` }, 
              (payload) => setPartnerData(prev => ({ ...prev, ...payload.new }))
            )
            .subscribe();
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
    return () => {
      clearInterval(timer);
      if (partnerSubscription) supabase.removeChannel(partnerSubscription);
    };
  }, []);

  // 🏆 FETCH LEADERBOARD DATA (Dynamic Filters)
  const fetchLeaderboardData = async () => {
    try {
      let leaders = [];
      let totalClosings = 0;
      
      if (leaderboardFilter === 'minggu_ini' || leaderboardFilter === 'minggu_lalu') {
        const { saturday, friday } = getWeekInfo();
        let start, end;
        
        if (leaderboardFilter === 'minggu_ini') {
          start = saturday.toISOString();
          end = friday.toISOString();
        } else {
          const lastSaturday = new Date(saturday);
          lastSaturday.setDate(saturday.getDate() - 7);
          const lastFriday = new Date(friday);
          lastFriday.setDate(friday.getDate() - 7);
          start = lastSaturday.toISOString();
          end = lastFriday.toISOString();
        }
        
        const { data: clients } = await supabase
          .from('clients')
          .select('partner_id, plan')
          .eq('status', 'active')
          .gte('created_at', start)
          .lte('created_at', end);
          
        const partnerIds = [...new Set((clients || []).map(c => c.partner_id).filter(Boolean))];
        
        let partners = [];
        if (partnerIds.length > 0) {
          const { data } = await supabase
            .from('partners')
            .select('id, full_name, tier')
            .in('id', partnerIds);
          partners = data || [];
        }
        
        const partnersMap = {};
        partners.forEach(p => {
          partnersMap[p.id] = p;
        });
        
        const partnerScores = {};
        (clients || []).forEach(c => {
          if (!c.partner_id) return;
          const partner = partnersMap[c.partner_id];
          if (!partner) return;
          
          const price = c.plan === 'pro' ? 499000 : c.plan === 'elite' ? 999000 : c.plan === 'ultimate' ? 1999000 : 0;
          
          if (!partnerScores[c.partner_id]) {
            partnerScores[c.partner_id] = {
              full_name: partner.full_name,
              tier: partner.tier,
              total_omzet: 0,
              closings: 0
            };
          }
          partnerScores[c.partner_id].total_omzet += price;
          partnerScores[c.partner_id].closings += 1;
        });
        
        leaders = Object.values(partnerScores).sort((a, b) => b.total_omzet - a.total_omzet).slice(0, 10);
        totalClosings = clients ? clients.length : 0;
      } else if (leaderboardFilter === 'bulan_ini') {
        const now = new Date();
        // Bulan Ini (26 - 25)
        let start = new Date(now.getFullYear(), now.getMonth() - 1, 26);
        let end = new Date(now.getFullYear(), now.getMonth(), 25, 23, 59, 59, 999);
        
        if (now.getDate() >= 26) {
          start = new Date(now.getFullYear(), now.getMonth(), 26);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 25, 23, 59, 59, 999);
        }
        
        const { data: clients } = await supabase
          .from('clients')
          .select('partner_id, plan')
          .eq('status', 'active')
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString());
          
        const partnerIds = [...new Set((clients || []).map(c => c.partner_id).filter(Boolean))];
        
        let partners = [];
        if (partnerIds.length > 0) {
          const { data } = await supabase
            .from('partners')
            .select('id, full_name, tier')
            .in('id', partnerIds);
          partners = data || [];
        }
        
        const partnersMap = {};
        partners.forEach(p => {
          partnersMap[p.id] = p;
        });
        
        const partnerScores = {};
        (clients || []).forEach(c => {
          if (!c.partner_id) return;
          const partner = partnersMap[c.partner_id];
          if (!partner) return;
          
          const price = c.plan === 'pro' ? 499000 : c.plan === 'elite' ? 999000 : c.plan === 'ultimate' ? 1999000 : 0;
          
          if (!partnerScores[c.partner_id]) {
            partnerScores[c.partner_id] = {
              full_name: partner.full_name,
              tier: partner.tier,
              total_omzet: 0,
              closings: 0
            };
          }
          partnerScores[c.partner_id].total_omzet += price;
          partnerScores[c.partner_id].closings += 1;
        });
        
        leaders = Object.values(partnerScores).sort((a, b) => b.total_omzet - a.total_omzet).slice(0, 10);
        totalClosings = clients ? clients.length : 0;
      } else {
        // Semua Waktu (All-Time)
        const { data } = await supabase
          .from('partners')
          .select('full_name, total_omzet, tier')
          .not('full_name', 'is', null)
          .order('total_omzet', { ascending: false })
          .limit(10);
        leaders = data || [];
        totalClosings = 0; // Tidak dihitung untuk all-time
      }
      
      setLeaderboardData(leaders);
      setTotalPeriodClosings(totalClosings);
    } catch (err) {
      console.error("Fetch Leaderboard Error:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [leaderboardFilter]);


  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetUser = user;
      if (!targetUser || !targetUser.id) {
        throw new Error("Identitas Anda tidak terdeteksi. Mohon Logout lalu Login kembali.");
      }

      const rawPackage = onboardForm.package;
      let finalPlan = rawPackage;
      let billingCycle = 'Monthly';
      let amount = 0;
      let tokens = 0;

      // 1. Calculate Plan & Amount
      if (rawPackage.includes('_')) {
        const [plan, cycle] = rawPackage.split('_');
        finalPlan = plan;
        billingCycle = cycle.charAt(0).toUpperCase() + cycle.slice(1);
      } else if (rawPackage === 'starter') {
        finalPlan = 'starter';
        billingCycle = 'Monthly';
      }

      // Mapping Harga & Token (Sesuai Paket)
      const packageMap = {
        'starter': { price: 0, tokens: 100 },
        'pro_monthly': { price: 499000, tokens: 500000 },
        'pro_yearly': { price: 5489000, tokens: 6000000 },
        'elite_monthly': { price: 999000, tokens: 1000000 },
        'elite_yearly': { price: 10989000, tokens: 12000000 },
        'ultimate_monthly': { price: 1999000, tokens: 5000000 },
        'ultimate_yearly': { price: 21989000, tokens: 60000000 }
      };

      const selectedPkg = packageMap[rawPackage] || { price: 0, tokens: 0 };
      amount = selectedPkg.price;
      tokens = selectedPkg.tokens;

      let publicUrl = null;
      let midtransOrderId = null;
      let paymentUrl = null;

      // 2. FLOW MANUAL (TRANSFER)
      if (onboardForm.paymentMethod === 'transfer') {
        if (!onboardForm.paymentProof) throw new Error("Harap upload bukti pembayaran.");
        const file = onboardForm.paymentProof;
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `payment-proofs/${targetUser.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl: url } } = supabase.storage.from('payment-proofs').getPublicUrl(filePath);
        publicUrl = url;
      } 
      // 3. FLOW OTOMATIS (MIDTRANS)
      else {
        // Panggil Edge Function midtrans-init
        const { data: midtrans, error: midError } = await supabase.functions.invoke('midtrans-init', {
          body: {
            plan_name: finalPlan,
            amount: amount,
            tokens: tokens,
            is_sandbox: true, // Ubah ke false untuk Production
            user_data: {
              email: onboardForm.email,
              nama: onboardForm.shopName,
              phone: onboardForm.whatsapp
            }
          }
        });

        if (midError) throw new Error(`Midtrans Error: ${midError.message}`);
        
        midtransOrderId = midtrans.orderId;
        paymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${midtrans.token}`;
      }

      // 4. Catat ke Tabel Clients
      const { error: insertError } = await supabase.from('clients').insert([{
        partner_id: user.id === 'admin-bypass' ? null : user.id,
        shop_name: onboardForm.shopName,
        email: onboardForm.email,
        whatsapp: onboardForm.whatsapp,
        plan: finalPlan,
        billing_cycle: billingCycle,
        payment_method: onboardForm.paymentMethod,
        payment_proof_url: publicUrl,
        midtrans_order_id: midtransOrderId,
        payment_url: paymentUrl,
        status: onboardForm.paymentMethod === 'transfer' ? 'pending' : 'waiting_payment',
        ref: partnerData.full_name || 'Partner'
      }]);

      if (insertError) throw insertError;

      const successMsg = onboardForm.paymentMethod === 'transfer' 
        ? "Pendaftaran berhasil! Menunggu verifikasi admin." 
        : "Link pembayaran telah dikirim ke email calon user!";
      
      alert(successMsg);
      
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
      window.location.href = '/login';
    }
  };

  const renderContent = () => {
    const commonProps = { t, isSubmitting, formatCurrency };
    switch (activeMenu) {
      case 'onboard': return <OnboardTab {...commonProps} form={onboardForm} setForm={setOnboardForm} onSubmit={handleOnboardSubmit} />;
      case 'subscribers': return <SubscribersTab {...commonProps} subscribers={subscribers} />;
      case 'leaderboard': return <LeaderboardTab {...commonProps} data={leaderboardData} countdown={countdown} leaderboardFilter={leaderboardFilter} setLeaderboardFilter={setLeaderboardFilter} totalPeriodClosings={totalPeriodClosings} />;
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
      case 'commissionScheme': return <CommissionSchemeTab />;
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

