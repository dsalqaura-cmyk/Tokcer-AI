import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import logo from '../assets/logo.png';

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('onboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const [supportTab, setSupportTab] = useState('report'); // 'report' or 'vision'
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

      // 1. Fetch Partner Profile
      const { data: profile } = await supabase
        .from('partners')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // 2. Fetch Clients/Subscribers
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

        // Hitung statistik
        const active = (clients || []).filter(c => c.status === 'active').length;
        const cancelled = (clients || []).filter(c => c.status === 'cancelled').length;
        const totalCommission = (clients || []).filter(c => c.status === 'active').reduce((acc, curr) => acc + (curr.commission_amount || 0), 0);

        setPartnerData(prev => ({
          ...prev,
          activeUsers: active,
          cancelledUsers: cancelled,
          mtdPace: totalCommission
        }));
      }
    } catch (err) {
      console.error("Error fetching partner data:", err);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // Helper: get current ISO week number (Mon-Fri cycle)
  const getWeekInfo = () => {
    const now = new Date();
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now - jan1) / 86400000) + 1;
    const weekNum = Math.ceil((dayOfYear + jan1.getDay()) / 7);
    // Find Monday of current week
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // Mon=1
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek - 1));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const label = `Week ${weekNum} · ${monday.getDate()}–${friday.getDate()} ${months[monday.getMonth()]} ${now.getFullYear()}`;
    // End of Friday 23:59:59
    const endOfFriday = new Date(friday);
    endOfFriday.setHours(23, 59, 59, 999);
    return { label, endOfFriday };
  };

  // Helper: relative time for Last Closing
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

  const translations = {
    id: {
      onboard: "[+] Onboard",
      subscribers: "Subscribers",
      leaderboard: "Leaderboard",
      payment: "Pembayaran",
      logout: "Keluar",
      totalSubs: "Total Subscribers",
      activeUser: "Total User Aktif",
      cancelled: "Cancelled (Billed)",
      estCommission: "Est. Komisi MRR",
      customerList: "Daftar Pelanggan",
      shopName: "Nama Toko",
      plan: "Paket",
      status: "Status",
      commission: "Komisi",
      rank: "Peringkat",
      platform: "Platform",
      omzet: "Omzet",
      closing: "Closing",
      paymentInfo: "Info Pembayaran",
      paymentHistory: "Riwayat Pembayaran",
      partnerPortal: "Partner Portal",
      period: "Periode",
      amount: "Jumlah Komisi",
      paymentDesc: "Data komisi akan di-update setiap tanggal 25. Pastikan data rekening kamu sudah terverifikasi di profil utama.",
      officialNetwork: "Jaringan Resmi",
      tierLabel: "Tier",
      private: "Privat",
      mtdTracking: "Pelacakan MTD",
      projected: "proyeksi",
      endMonth: "akhir bulan",
      nextChallenge: "Tantangan Minggu Depan",
      whoIsTop: "Siapa Top 1?",
      eliteRankings: "Peringkat Elit",
      rankDesc: "Peringkat partner terbaik minggu ini",
      you: "KAMU",
      network: "Jaringan",
      successClosing: "Closing Berhasil",
      cyclePeriod: "Periode Siklus",
      monthly: "Bulanan (Tgl 25)",
      bankStatus: "Status Bank",
      verified: "TERVERIFIKASI",
      advancedAnalytics: "Analitik Partner Lanjutan",
      onboardTitle: "Onboarding Pelanggan Baru",
      onboardDesc: "Daftarkan pelanggan baru. Data akan diverifikasi admin sebelum akun diaktifkan.",
      whatsapp: "WhatsApp",
      paymentMethod: "Metode Pembayaran",
      paymentProof: "Upload Bukti Bayar",
      submitOnboard: "Daftarkan Sekarang",
      uploadSuccess: "File terpilih: ",
      noFile: "Belum ada file",
      selectPlan: "Pilih Paket",
      selectPayment: "Pilih Pembayaran",
      support: "Pusat Bantuan",
      vision: "Saran Fitur",
      academy: "Tokcer Academy",
      supportTitle: "Pusat Bantuan",
      supportDesc: "Laporkan kendala teknis atau berikan saran pengembangan fitur.",
      category: "Kategori",
      catData: "Kendala Input Data",
      catLogin: "Masalah Login",
      catComm: "Pertanyaan Komisi",
      catBug: "Lapor Bug Sistem",
      description: "Deskripsi",
      descPlaceholder: "Jelaskan detail kendala atau saran kamu...",
      uploadMedia: "Upload Media (Opsional)",
      submitReport: "Kirim Laporan",
      visionTitle: "Saran Pengembangan",
      visionDesc: "Bantu kami mengembangkan fitur yang kamu butuhkan.",
      visionPrompt: "Fitur apa yang bisa bantu kamu jualan lebih banyak?",
      submitIdea: "Kirim Ide",
      academyTitle: "Tokcer Academy",
      academyDesc: "Materi eksklusif untuk tingkatkan penjualan kamu.",
      profile: "Profil",
      history: "Riwayat",
      performanceBonus: "Bonus Performa",
      statusPending: "Pending",
      statusActive: "Active",
      statusPaid: "Paid",
      statusWarning: "Warning",
      statusCancel: "Cancel",
      planPro: "Pro Plan (Rp 499rb)",
      planElite: "Elite Plan (Rp 999rb)",
      planUltimate: "Ultimate Plan (Rp 1.499rb)",
      uploadPrompt: "Klik atau seret gambar untuk upload",
      uploadTypes: "JPG, PNG sampai 5MB",
      uploadMediaDesc: "Upload Media (Opsional)",
      submitIdea: "Kirim Ide",
      visionPrompt: "Fitur apa yang bisa bantu kamu jualan lebih banyak?",
      visionPlaceholder: "Contoh: Saya butuh materi konten harian...",
      academyTitle: "Tokcer Academy",
      academyDesc: "Materi eksklusif untuk tingkatkan penjualan kamu.",
      academyClosingMastery: "Closing Mastery",
      academyClosingMasteryDesc: "Video penanganan keberatan",
      academyContentBank: "Content Bank",
      academyContentBankDesc: "Foto, video, dan caption",
      academyAdsFramework: "Ads Framework",
      academyAdsFrameworkDesc: "Strategi traffic murah",
      academyProductKnowledge: "Product Knowledge",
      academyProductKnowledgeDesc: "Update fitur & pendalaman",
      academyAccess: "Akses Materi",
      weekCurrent: "Minggu Ini",
      weekLast: "Minggu Lalu",
      weekPrev: "Dua Minggu Lalu",
    },
    en: {
      onboard: "[+] Onboard",
      subscribers: "Subscribers",
      leaderboard: "Leaderboard",
      payment: "Payment",
      logout: "Logout",
      totalSubs: "Total Subscribers",
      activeUser: "Total Active Users",
      cancelled: "Cancelled (Billed)",
      estCommission: "Est. MRR Commission",
      customerList: "Customer List",
      shopName: "Shop Name",
      plan: "Plan",
      status: "Status",
      commission: "Commission",
      rank: "Rank",
      platform: "Platform",
      omzet: "Revenue",
      closing: "Closing",
      paymentInfo: "Payment Info",
      paymentHistory: "Payment History",
      partnerPortal: "Partner Portal",
      period: "Period",
      amount: "Commission Amount",
      paymentDesc: "Commission data is updated every 25th. Ensure your bank account data is verified in your main profile.",
      officialNetwork: "Official Network",
      tierLabel: "Tier",
      private: "Private",
      mtdTracking: "MTD Pace Tracking",
      projected: "projected",
      endMonth: "end of month",
      nextChallenge: "Next Week Challenge",
      whoIsTop: "Who is Top 1?",
      eliteRankings: "Elite Rankings",
      rankDesc: "Top partner rankings this week",
      you: "YOU",
      network: "Network",
      successClosing: "Successful Closing",
      cyclePeriod: "Cycle Period",
      monthly: "Monthly (25th)",
      bankStatus: "Bank Status",
      verified: "VERIFIED",
      advancedAnalytics: "Advanced Partner Analytics",
      onboardTitle: "New Customer Onboarding",
      onboardDesc: "Register new customers. Data will be verified by admin before account activation.",
      whatsapp: "WhatsApp",
      paymentMethod: "Payment Method",
      paymentProof: "Upload Payment Proof",
      submitOnboard: "Register Now",
      uploadSuccess: "File selected: ",
      noFile: "No file selected",
      selectPlan: "Select Plan",
      selectPayment: "Select Payment",
      support: "Support Center",
      vision: "Feature Suggestion",
      academy: "Tokcer Academy",
      supportTitle: "Support Center",
      supportDesc: "Report technical issues or provide feature suggestions.",
      category: "Category",
      catData: "Data Input Issue",
      catLogin: "Login Issue",
      catComm: "Commission Inquiry",
      catBug: "Report System Bug",
      description: "Description",
      descPlaceholder: "Explain your issue or suggestion in detail...",
      uploadMedia: "Upload Media (Optional)",
      submitReport: "Submit Report",
      visionTitle: "Feature Suggestion",
      visionDesc: "Help us build the features you need.",
      visionPrompt: "What features would help you sell more?",
      visionPlaceholder: "Example: I need daily content materials...",
      submitIdea: "Submit Idea",
      academyTitle: "Tokcer Academy",
      academyDesc: "Exclusive materials to boost your sales.",
      academyClosingMastery: "Closing Mastery",
      academyClosingMasteryDesc: "Objection handling videos",
      academyContentBank: "Content Bank",
      academyContentBankDesc: "Photos, videos, and captions",
      academyAdsFramework: "Ads Framework",
      academyAdsFrameworkDesc: "Cheap traffic strategies",
      academyProductKnowledge: "Product Knowledge",
      academyProductKnowledgeDesc: "Feature updates & deep dive",
      academyAccess: "Access Resource",
      profile: "Profile",
      history: "History",
      performanceBonus: "Performance Bonus",
      statusPending: "Pending",
      statusActive: "Active",
      statusPaid: "Paid",
      statusWarning: "Warning",
      statusCancel: "Cancel",
      planPro: "Pro Plan (Rp 499k)",
      planElite: "Elite Plan (Rp 999k)",
      planUltimate: "Ultimate Plan (Rp 1,499k)",
      uploadPrompt: "Click or drag image to upload",
      uploadTypes: "JPG, PNG up to 5MB",
      uploadMediaDesc: "Upload Media (Optional)",
      weekCurrent: "Current Week",
      weekLast: "Last Week",
      weekPrev: "Previous Week",
    }
  };

  const t = (key) => translations[lang][key] || key;

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('tokcer_lang', newLang);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
      
      if (session || isAdmin) {
        setUser(session?.user || { email: 'admin@tokcer-ai.com' });
      } else {
        navigate('/login');
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  // Countdown timer effect
  useEffect(() => {
    const tick = () => {
      const { endOfFriday } = getWeekInfo();
      const now = new Date();
      let diff = endOfFriday - now;
      if (diff < 0) diff = 0;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('tokcer_admin_auth');
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get current partner ID from session or use Admin bypass
      const { data: { session } } = await supabase.auth.getSession();
      const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
      let partnerId = session?.user?.id;

      // If Admin but no session, we need to find the Admin's ID in the DB
      if (!partnerId && isAdmin) {
        const { data: adminUser } = await supabase
          .from('partners')
          .select('id')
          .eq('affiliate_id', 'TKC-BOSS') // Kita asumsikan ini ID admin kita
          .single();
        partnerId = adminUser?.id;
      }

      if (!partnerId && !isAdmin) {
        alert(lang === 'id' ? 'Anda harus login sebagai partner!' : 'You must be logged in as a partner!');
        setLoading(false);
        return;
      }

      // 2. Prepare client data
      const clientData = {
        partner_id: partnerId,
        shop_name: onboardForm.shopName,
        email: onboardForm.email,
        whatsapp: onboardForm.whatsapp,
        plan: onboardForm.plan,
        payment_method: onboardForm.paymentMethod,
        // Untuk sementara paymentProof hanya simpan nama file, 
        // idealnya ini diupload ke Supabase Storage (kita bisa buat nanti)
        payment_proof_url: onboardForm.paymentProof ? onboardForm.paymentProof.name : null
      };

      // 3. Insert to Supabase
      const { error } = await supabase.from('clients').insert([clientData]);

      if (error) throw error;

      alert(lang === 'id' ? 'Pelanggan berhasil didaftarkan! Status: Pending Verifikasi.' : 'Client registered successfully! Status: Pending Verification.');
      
      // 4. Reset Form
      setOnboardForm({
        shopName: '',
        email: '',
        whatsapp: '',
        plan: 'pro',
        paymentMethod: 'transfer',
        paymentProof: null
      });
      
      // 5. Refresh data
      fetchData();

    } catch (err) {
      console.error(err);
      alert(lang === 'id' ? 'Gagal mendaftarkan pelanggan: ' + err.message : 'Failed to register client: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from('support_tickets').insert([{
        partner_id: session.user.id,
        category: supportForm.category,
        description: supportForm.description,
        screenshot_url: supportForm.screenshot ? supportForm.screenshot.name : null
      }]);
      if (error) throw error;
      alert("Support report submitted successfully!");
      setSupportForm({ category: 'data', description: '', screenshot: null });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    const ideaText = e.target.querySelector('textarea').value;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from('partner_ideas').insert([{
        partner_id: session.user.id,
        idea_text: ideaText
      }]);
      if (error) throw error;
      alert("Idea submitted!");
      e.target.reset();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

  const getTierColor = (tier) => {
    const colors = { Bronze: "text-amber-700", Silver: "text-zinc-400", Gold: "text-amber-500", Platinum: "text-indigo-400" };
    return colors[tier] || "text-zinc-400";
  };

  const getPlanBadge = (plan) => {
    const styles = { 
      Pro: "bg-orange-500/10 text-orange-500 border-orange-500/20", 
      Elite: "bg-orange-600/10 text-orange-600 border-orange-600/20", 
      Ultimate: "bg-amber-500/10 text-amber-500 border-amber-500/20" 
    };
    return styles[plan] || "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-orange-600/30 selection:text-orange-200 overflow-x-hidden">
      {/* Background Ornaments */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      {/* Top Navbar */}
      <nav className="fixed lg:sticky top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
              <img src={logo} alt="Tokcer AI" className="h-9 w-auto filter drop-shadow-[0_0_8px_rgba(234,88,12,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(234,88,12,0.5)] transition-all" />
            </div>
            <div className="h-5 w-px bg-zinc-800 mx-1 hidden sm:block"></div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 leading-none mb-1">
                {t('partnerPortal')}
              </span>
              <span className="text-[8px] font-bold text-orange-600 uppercase tracking-widest leading-none">{t('officialNetwork')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            {/* Language Toggle Desktop */}
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800 hidden md:flex">
              <button 
                onClick={() => toggleLang('id')}
                className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all ${lang === 'id' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
              >
                ID
              </button>
              <button 
                onClick={() => toggleLang('en')}
                className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all ${lang === 'en' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            <div className="flex flex-col items-end hidden xs:flex">
              <div className="text-sm font-bold text-white tracking-tight cursor-pointer hover:text-orange-400 transition-colors" onClick={() => setShowProfileModal(true)}>{partnerData.name}</div>
              <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] ${getTierColor(partnerData.tier)}`}>
                <span className="h-1 w-1 rounded-full bg-current"></span>
                {partnerData.tier}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="group relative p-2.5 bg-zinc-900/50 hover:bg-orange-500/10 border border-zinc-800 hover:border-orange-500/30 rounded-xl text-zinc-400 hover:text-orange-500 transition-all duration-300 hidden sm:flex"
              title={t('logout')}
            >
              <iconify-icon icon="solar:logout-3-bold-duotone" className="text-xl"></iconify-icon>
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-95"
              aria-label="Open Menu"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Menu</span>
              <iconify-icon icon="solar:hamburger-menu-bold-duotone" className="text-xl text-orange-500"></iconify-icon>
            </button>
          </div>
        </div>
      </nav>

      {/* Content Spacer for Fixed Navbar on Mobile */}
      <div className="h-20 lg:hidden"></div>

      {/* Mobile Menu Overlay - Moved OUTSIDE for safety */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[999] flex lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative w-72 max-w-[85%] bg-zinc-950 border-r border-zinc-800 flex flex-col h-full overflow-hidden animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-black/40 shrink-0">
              <img src={logo} alt="Tokcer AI" className="h-7 w-auto" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl text-zinc-400 hover:text-white">
                <iconify-icon icon="solar:close-circle-bold-duotone" className="text-2xl text-orange-500"></iconify-icon>
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
              <div className="mb-6 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 shrink-0">
                <p className="text-sm font-bold text-white tracking-tight cursor-pointer hover:text-orange-400 transition-colors" onClick={() => { setShowProfileModal(true); setIsMobileMenuOpen(false); }}>{partnerData.name}</p>
                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] ${getTierColor(partnerData.tier)} mt-1`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {partnerData.tier}
                </div>
              </div>

              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2 mb-2">Portal Menu</p>
              {['onboard', 'subscribers', 'leaderboard', 'payment', 'support', 'academy', 'profile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border shrink-0 ${
                    activeTab === tab 
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      : "text-zinc-400 bg-zinc-900/30 border-transparent hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <iconify-icon icon={
                    tab === 'onboard' ? 'solar:user-plus-bold-duotone' :
                    tab === 'subscribers' ? 'solar:users-group-rounded-bold-duotone' : 
                    tab === 'leaderboard' ? 'solar:ranking-bold-duotone' : 
                    tab === 'payment' ? 'solar:card-transfer-bold-duotone' :
                    tab === 'support' ? 'solar:chat-round-dots-bold-duotone' :
                    tab === 'vision' ? 'solar:lightbulb-bold-duotone' :
                    tab === 'profile' ? 'solar:user-id-bold-duotone' :
                    'solar:notebook-bold-duotone'
                  } className={`text-xl ${activeTab === tab ? 'text-orange-500' : 'text-zinc-500'}`}></iconify-icon>
                  {t(tab)}
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-zinc-800 bg-black/40 flex flex-col gap-4 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Language</span>
                <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
                  <button 
                    onClick={() => { toggleLang('id'); setIsMobileMenuOpen(false); }}
                    className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${lang === 'id' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    ID
                  </button>
                  <button 
                    onClick={() => { toggleLang('en'); setIsMobileMenuOpen(false); }}
                    className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${lang === 'en' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    EN
                  </button>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all uppercase tracking-[0.2em]"
              >
                <iconify-icon icon="solar:logout-2-linear" className="text-lg"></iconify-icon>
                {t('logout')}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Tab Navigation - Desktop */}
      <div className="hidden lg:block bg-black/40 backdrop-blur-md border-b border-zinc-800/50 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto no-scrollbar">
          {['onboard', 'subscribers', 'leaderboard', 'payment', 'support', 'academy', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all group whitespace-nowrap flex-shrink-0 ${
                activeTab === tab 
                  ? "text-orange-500"
                  : "text-zinc-500 hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <iconify-icon icon={
                  tab === 'onboard' ? 'solar:user-plus-bold-duotone' :
                  tab === 'subscribers' ? 'solar:users-group-rounded-bold-duotone' : 
                  tab === 'leaderboard' ? 'solar:ranking-bold-duotone' : 
                  tab === 'payment' ? 'solar:card-transfer-bold-duotone' :
                  tab === 'support' ? 'solar:chat-round-dots-bold-duotone' :
                  tab === 'vision' ? 'solar:lightbulb-bold-duotone' :
                  tab === 'profile' ? 'solar:user-id-bold-duotone' :
                  'solar:notebook-bold-duotone'
                } className={`text-lg ${activeTab === tab ? 'text-orange-500' : 'text-zinc-600 group-hover:text-zinc-300'}`}></iconify-icon>
                {t(tab)}
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-right from-orange-600 to-amber-400 rounded-full shadow-[0_-2px_10px_rgba(234,88,12,0.5)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10 relative">
        {activeTab === 'onboard' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-3 mb-10">
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">{t('onboardTitle')}</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] max-w-lg mx-auto">{t('onboardDesc')}</p>
            </div>

            <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-right from-orange-600 to-amber-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <form onSubmit={handleOnboardSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('shopName')}</label>
                    <input 
                      type="text" 
                      required
                      value={onboardForm.shopName}
                      onChange={(e) => setOnboardForm({...onboardForm, shopName: e.target.value})}
                      className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-700 transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                      placeholder="e.g. Toko Makmur Jaya"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={onboardForm.email}
                      onChange={(e) => setOnboardForm({...onboardForm, email: e.target.value})}
                      className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-700 transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('whatsapp')}</label>
                    <input 
                      type="tel" 
                      required
                      value={onboardForm.whatsapp}
                      onChange={(e) => setOnboardForm({...onboardForm, whatsapp: e.target.value})}
                      className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-700 transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                      placeholder="08123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('plan')}</label>
                    <div className="relative">
                      <select 
                        value={onboardForm.plan}
                        onChange={(e) => setOnboardForm({...onboardForm, plan: e.target.value})}
                        className="w-full appearance-none bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all outline-none"
                      >
                        <option value="pro">{t('planPro')}</option>
                        <option value="elite">{t('planElite')}</option>
                        <option value="ultimate">{t('planUltimate')}</option>
                      </select>
                      <iconify-icon icon="solar:alt-arrow-down-bold" className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"></iconify-icon>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('paymentMethod')}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {['Transfer', 'QRIS', 'VA', 'CC', 'E-Wallet'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setOnboardForm({...onboardForm, paymentMethod: method.toLowerCase()})}
                        className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          onboardForm.paymentMethod === method.toLowerCase()
                            ? "bg-orange-600/10 border-orange-600 text-orange-400"
                            : "bg-black/20 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('paymentProof')}</label>
                  <div className="relative group/upload">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setOnboardForm({...onboardForm, paymentProof: e.target.files[0]})}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-zinc-800 group-hover/upload:border-orange-500/30 rounded-3xl p-10 flex flex-col items-center justify-center transition-all bg-white/[0.01] group-hover/upload:bg-orange-500/[0.02]">
                      <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 group-hover/upload:scale-110 transition-transform">
                        <iconify-icon icon="solar:upload-bold-duotone" className="text-3xl text-orange-500"></iconify-icon>
                      </div>
                      <div className="text-xs font-bold text-zinc-300 mb-1">
                        {onboardForm.paymentProof ? (
                          <span className="text-orange-400">{t('uploadSuccess')} {onboardForm.paymentProof.name}</span>
                        ) : (
                          <span>{t('uploadPrompt')}</span>
                        )}
                      </div>
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{t('uploadTypes')}</div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl shadow-orange-600/10 hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  {t('submitOnboard')}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">{t('supportTitle')}</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">{t('supportDesc')}</p>
            </div>

            {/* Sub-tabs for Support */}
            <div className="flex justify-center">
              <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
                <button 
                  onClick={() => setSupportTab('report')}
                  className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${supportTab === 'report' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <iconify-icon icon="solar:shield-warning-bold-duotone" className="mr-2"></iconify-icon>
                  {t('reportBug')}
                </button>
                <button 
                  onClick={() => setSupportTab('vision')}
                  className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${supportTab === 'vision' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <iconify-icon icon="solar:lightbulb-bold-duotone" className="mr-2"></iconify-icon>
                  {t('suggestFeature')}
                </button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-amber-400"></div>
              
              {supportTab === 'report' ? (
                <form className="space-y-8" onSubmit={handleSupportSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('category')}</label>
                    <div className="relative">
                      <select 
                        value={supportForm.category}
                        onChange={(e) => setSupportForm({...supportForm, category: e.target.value})}
                        className="w-full appearance-none bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white outline-none"
                      >
                        <option value="data">{t('catData')}</option>
                        <option value="login">{t('catLogin')}</option>
                        <option value="commission">{t('catComm')}</option>
                        <option value="bug">{t('catBug')}</option>
                      </select>
                      <iconify-icon icon="solar:alt-arrow-down-bold" className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"></iconify-icon>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('description')}</label>
                    <textarea 
                      rows="4"
                      required
                      value={supportForm.description}
                      onChange={(e) => setSupportForm({...supportForm, description: e.target.value})}
                      className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white outline-none resize-none"
                      placeholder={t('descPlaceholder')}
                    ></textarea>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{t('uploadMedia')}</label>
                    <div className="relative group/upload">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setSupportForm({...supportForm, screenshot: e.target.files[0]})}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-zinc-800 group-hover/upload:border-orange-500/30 rounded-3xl p-10 flex flex-col items-center justify-center transition-all bg-white/[0.01] group-hover/upload:bg-orange-500/[0.02]">
                        <iconify-icon icon="solar:camera-bold-duotone" className="text-3xl text-orange-500 mb-2"></iconify-icon>
                        <span className="text-[10px] font-bold text-zinc-400">{supportForm.screenshot ? supportForm.screenshot.name : t('uploadPrompt')}</span>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl transition-all">
                    {t('submitReport')}
                  </button>
                </form>
              ) : (
                <form className="space-y-8" onSubmit={handleIdeaSubmit}>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] px-1">{t('visionPrompt')}</label>
                    <textarea 
                      rows="6"
                      required
                      className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-3xl px-6 py-5 text-sm text-white outline-none resize-none leading-relaxed"
                      placeholder={t('visionPlaceholder')}
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl transition-all">
                    {t('submitIdea')}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'academy' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">{t('academyTitle')}</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">{t('academyDesc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Closing Mastery', icon: 'solar:videocamera-record-bold-duotone', color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Objection handling videos' },
                { title: 'Content Bank', icon: 'solar:gallery-bold-duotone', color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Photos, videos, and captions' },
                { title: 'Ads Framework', icon: 'solar:graph-bold-duotone', color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Cheap traffic strategies' },
                { title: 'Product Knowledge', icon: 'solar:reorder-bold-duotone', color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Feature updates & deep dive' }
              ].map((item, idx) => (
                <div key={idx} className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-8 rounded-[32px] hover:border-orange-500/30 transition-all cursor-pointer">
                  <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <iconify-icon icon={item.icon} className={`text-3xl ${item.color}`}></iconify-icon>
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">{t('academy' + item.title.replace(' ', ''))}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mb-6">{t('academy' + item.title.replace(' ', '') + 'Desc')}</p>
                  <div className="flex items-center gap-2 text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                    {t('academyAccess')} <iconify-icon icon="solar:arrow-right-bold"></iconify-icon>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative group overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-5 rounded-2xl">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('totalSubs')}</div>
                <div className="text-3xl font-black text-white font-mono tracking-tighter">{partnerData.subscribers.length}</div>
              </div>
              <div className="relative group overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-5 rounded-2xl">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('activeUser')}</div>
                <div className="text-3xl font-black text-white font-mono tracking-tighter">{partnerData.activeUsers}</div>
              </div>
              <div className="relative group overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-5 rounded-2xl border-l-rose-500/50">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('cancelled')}</div>
                <div className="text-3xl font-black text-rose-500 font-mono tracking-tighter">{partnerData.cancelledUsers}</div>
              </div>
              <div className="relative group overflow-hidden bg-emerald-600/10 backdrop-blur-md border border-emerald-500/20 p-5 rounded-2xl">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">{t('performanceBonus')}</div>
                <div className="text-3xl font-black text-white font-mono tracking-tighter">Rp 0</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-8 h-0.5 bg-orange-600 rounded-full"></div>
                  {t('customerList')}
                </h3>
                <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 uppercase tracking-widest">
                  {t('private')} 🔒
                </span>
              </div>

              <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[32px] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-[0.25em] border-b border-zinc-800/50">
                        <th className="px-8 py-6">{t('shopName')}</th>
                        <th className="px-8 py-6">{t('plan')}</th>
                        <th className="px-8 py-6">{t('status')}</th>
                        <th className="px-8 py-6">{lang === 'id' ? 'Last Closing' : 'Last Closing'}</th>
                        <th className="px-8 py-6 text-right">{t('commission')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {partnerData.subscribers.map((s, idx) => (
                        <tr key={s.id} className={`group border-b border-zinc-900/50 hover:bg-white/[0.01] transition-all duration-300 ${idx === partnerData.subscribers.length - 1 ? 'border-none' : ''}`}>
                          <td className="px-4 sm:px-8 py-4 sm:py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-100 font-black text-[10px] sm:text-xs border border-zinc-700 group-hover:border-orange-500/50 transition-colors">
                                {s.shop_name?.charAt(0) || '?'}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-zinc-100 text-xs sm:text-sm truncate group-hover:text-white transition-colors">{s.shop_name}</span>
                                <span className="text-[8px] sm:text-[10px] text-zinc-400 font-medium truncate">{s.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-8 py-4 sm:py-6">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border shadow-sm ${getPlanBadge(s.plan)}`}>
                              {s.plan}
                            </span>
                          </td>
                          <td className="px-4 sm:px-8 py-4 sm:py-6">
                            <span className={`inline-flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border ${
                              s.status === 'active' || s.status === 'paid'
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                                : s.status === 'pending'
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : s.status === 'warning'
                                ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                : 'text-zinc-500 bg-zinc-800 border-zinc-700'
                            }`}>
                              <span className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${s.status === 'active' || s.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                              {t('status' + s.status.charAt(0).toUpperCase() + s.status.slice(1))}
                            </span>
                          </td>
                          <td className="px-4 sm:px-8 py-4 sm:py-6">
                            <span className={`text-[10px] sm:text-xs font-bold ${getRelativeTime(s.created_at) === (lang === 'id' ? 'baru saja' : 'just now') ? 'text-emerald-400' : 'text-zinc-400'}`}>
                              {getRelativeTime(s.created_at)}
                            </span>
                          </td>
                          <td className="px-4 sm:px-8 py-4 sm:py-6 text-right font-mono font-black text-zinc-100 text-[10px] sm:text-sm group-hover:text-emerald-300 transition-colors">
                            {formatCurrency(s.commission_amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white text-xl">
                    <iconify-icon icon="solar:chart-square-bold-duotone"></iconify-icon>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{t('mtdTracking')}</div>
                    <div className="text-sm font-bold text-white">
                      {formatCurrency(partnerData.mtdPace)} → <span className="text-orange-500">{t('projected')} {formatCurrency(partnerData.projectedEndMonth).split(',')[0]} {t('endMonth')}</span>
                    </div>
                  </div>
                </div>
                <div className="h-px w-full sm:h-10 sm:w-px bg-zinc-800"></div>
                <div className="text-center sm:text-right">
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('nextChallenge')}</div>
                  <div className="text-sm font-bold text-orange-400 italic">{t('whoIsTop')} 🚀</div>
                </div>
              </div>
              {/* Week info + Countdown */}
              <div className="border-t border-orange-500/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs font-bold text-zinc-300">
                  <iconify-icon icon="solar:calendar-linear" className="text-orange-500 mr-1"></iconify-icon>
                  {getWeekInfo().label}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mr-1">{lang === 'id' ? 'Berakhir:' : 'Ends in:'}</span>
                  {[{v: countdown.days, u: 'd'}, {v: countdown.hours, u: 'h'}, {v: countdown.minutes, u: 'm'}, {v: countdown.seconds, u: 's'}].map(({v, u}, i) => (
                    <React.Fragment key={u}>
                      <div className="bg-black/60 border border-zinc-700 rounded-lg px-2 py-1 min-w-[36px] text-center">
                        <span className="text-sm font-black text-orange-400 font-mono">{String(v).padStart(2, '0')}</span>
                        <span className="text-[7px] font-bold text-zinc-500 ml-0.5">{u}</span>
                      </div>
                      {i < 3 && <span className="text-zinc-600 font-bold text-xs">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pt-4">
              <div className="text-left space-y-1">
                <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">{t('eliteRankings')}</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{t('rankDesc')}</p>
              </div>
              <div className="relative group">
                <select 
                  value={leaderboardPeriod}
                  onChange={(e) => setLeaderboardPeriod(e.target.value)}
                  className="appearance-none bg-zinc-900/50 border border-zinc-800 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl focus:outline-none focus:border-orange-500/50 transition-all cursor-pointer min-w-[180px]"
                >
                  <option value="current">{t('weekCurrent')}</option>
                  <option value="last">{t('weekLast')}</option>
                  <option value="prev">{t('weekPrev')}</option>
                </select>
                <iconify-icon icon="solar:alt-arrow-down-bold" className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none"></iconify-icon>
              </div>
            </div>

            <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[40px] overflow-hidden shadow-2xl">
              <div className="divide-y divide-zinc-800/50">
                {partnerData.leaderboard.map((item, index) => (
                  <div key={item.id} className={`group flex items-center gap-4 sm:gap-6 px-6 sm:px-10 py-6 sm:py-8 hover:bg-white/[0.01] transition-all duration-300 ${item.id === partnerData.id ? 'bg-orange-600/5' : ''}`}>
                    <div className="w-8 sm:w-12 flex justify-center text-2xl sm:text-3xl filter drop-shadow-lg">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : 
                        <span className="text-base sm:text-xl font-black text-zinc-600">{index + 1}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`text-sm sm:text-base font-black tracking-tight truncate ${item.id === partnerData.id ? 'text-orange-500' : 'text-white group-hover:text-orange-400'} transition-colors`}>
                          {item.name}
                        </div>
                        {item.id === partnerData.id && (
                          <span className="text-[7px] sm:text-[9px] bg-orange-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-black tracking-[0.1em] shadow-lg shadow-orange-600/20 flex-shrink-0">{t('you')}</span>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 mt-1 sm:mt-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest ${getTierColor(item.tier)}`}>
                        <iconify-icon icon="solar:medal-star-bold-duotone" className="text-[10px] sm:text-xs"></iconify-icon>
                        <span className="truncate">{item.tier} Tier</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm sm:text-lg font-black text-emerald-400 font-mono tracking-tighter">{formatCurrency(item.omzet).split(',')[0]}</div>
                      <div className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5 sm:mt-1 flex items-center justify-end gap-1 sm:gap-1.5">
                        <iconify-icon icon="solar:fire-bold" className="text-orange-500"></iconify-icon>
                        {item.closing} {t('successClosing').split(' ')[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[32px] p-8 hover:border-orange-500/30 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                    <iconify-icon icon="solar:bill-list-bold-duotone" className="text-2xl text-orange-500"></iconify-icon>
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{t('paymentHistory')}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px] font-bold uppercase tracking-widest">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800/50">
                        <th className="py-3">{t('period')}</th>
                        <th className="py-3">{t('status')}</th>
                        <th className="py-3 text-right text-emerald-400">{t('amount')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-200">
                      {partnerData.paymentHistory.map((p, idx) => (
                        <tr key={idx} className="border-b border-zinc-900/30 group-hover:bg-white/[0.01]">
                          <td className="py-5">{p.period}</td>
                          <td className="py-5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              p.status === 'paid'
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${p.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-5 text-right text-emerald-400 font-black font-mono text-xs">{formatCurrency(p.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[32px] p-8 hover:border-orange-500/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                      <iconify-icon icon="solar:info-circle-bold-duotone" className="text-2xl text-orange-500"></iconify-icon>
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{t('paymentInfo')}</h3>
                  </div>
                  <p className="text-xs leading-loose text-zinc-300 font-medium italic">
                    "{t('paymentDesc')}"
                  </p>
                  <div className="mt-8 pt-8 border-t border-zinc-800/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span>{t('cyclePeriod')}</span>
                    <span className="text-white">{t('monthly')}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-600/20 to-amber-600/5 backdrop-blur-md border border-orange-500/20 rounded-[32px] p-8 flex items-center justify-between shadow-2xl group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <iconify-icon icon="solar:wallet-money-bold-duotone" className="text-3xl text-orange-500"></iconify-icon>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">{t('bankStatus')}</div>
                      <div className="text-base font-black text-white tracking-tight">{t('verified')} ✅</div>
                    </div>
                  </div>
                  <iconify-icon icon="solar:check-circle-bold" className="text-emerald-400 text-3xl animate-pulse"></iconify-icon>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-orange-600/10 to-amber-600/5 backdrop-blur-md border border-orange-500/20 rounded-[32px] p-8 mb-8 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-600/20">
                  {partnerData.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black text-white tracking-tight truncate">{partnerData.name}</h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${getTierColor(partnerData.tier)}`}>
                      <iconify-icon icon="solar:medal-star-bold-duotone" className="text-sm"></iconify-icon>
                      {partnerData.tier} Tier
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500">{partnerData.id}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 truncate">{user?.email || profileForm.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-amber-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-600/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                  <iconify-icon icon="solar:pen-new-square-bold-duotone" className="text-xl text-orange-500"></iconify-icon>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{lang === 'id' ? 'Update Profil' : 'Update Profile'}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{lang === 'id' ? 'Pastikan data sesuai untuk verifikasi komisi' : 'Ensure data is correct for commission verification'}</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                setPartnerData(prev => ({...prev, name: profileForm.fullName}));
                alert(lang === 'id' ? 'Profil berhasil diperbarui!' : 'Profile updated successfully!');
              }}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lang === 'id' ? 'Nama Lengkap (sesuai KTP)' : 'Full Name (as per ID)'}</label>
                  <input
                    type="text" required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                    className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">No. WhatsApp</label>
                    <input
                      type="tel" required
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm({...profileForm, whatsapp: e.target.value})}
                      className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email</label>
                    <input
                      type="email" required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lang === 'id' ? 'Nama Bank' : 'Bank Name'}</label>
                    <input
                      type="text" required
                      value={profileForm.bankName}
                      onChange={(e) => setProfileForm({...profileForm, bankName: e.target.value})}
                      className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                      placeholder="e.g. BCA, Mandiri, BNI"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lang === 'id' ? 'No. Rekening' : 'Account Number'}</label>
                    <input
                      type="text" required
                      value={profileForm.bankAccount}
                      onChange={(e) => setProfileForm({...profileForm, bankAccount: e.target.value})}
                      className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl shadow-orange-600/10 hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  {lang === 'id' ? 'Simpan Perubahan' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Update Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}></div>
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-amber-400 rounded-t-[32px]"></div>
            <button onClick={() => setShowProfileModal(false)} className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors">
              <iconify-icon icon="solar:close-circle-linear" className="text-2xl"></iconify-icon>
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                <iconify-icon icon="solar:user-id-bold-duotone" className="text-2xl text-orange-500"></iconify-icon>
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-widest">{lang === 'id' ? 'Update Profil' : 'Update Profile'}</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{partnerData.id}</p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={(e) => {
              e.preventDefault();
              setPartnerData(prev => ({...prev, name: profileForm.fullName}));
              alert(lang === 'id' ? 'Profil berhasil diperbarui!' : 'Profile updated successfully!');
              setShowProfileModal(false);
            }}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lang === 'id' ? 'Nama Lengkap (sesuai KTP)' : 'Full Name (as per ID)'}</label>
                <input
                  type="text" required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                  className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-3.5 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">No. WhatsApp</label>
                  <input
                    type="tel" required
                    value={profileForm.whatsapp}
                    onChange={(e) => setProfileForm({...profileForm, whatsapp: e.target.value})}
                    className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-3.5 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email</label>
                  <input
                    type="email" required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-3.5 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lang === 'id' ? 'Nama Bank' : 'Bank Name'}</label>
                  <input
                    type="text" required
                    value={profileForm.bankName}
                    onChange={(e) => setProfileForm({...profileForm, bankName: e.target.value})}
                    className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-3.5 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                    placeholder="e.g. BCA, Mandiri, BNI"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lang === 'id' ? 'No. Rekening' : 'Account Number'}</label>
                  <input
                    type="text" required
                    value={profileForm.bankAccount}
                    onChange={(e) => setProfileForm({...profileForm, bankAccount: e.target.value})}
                    className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-3.5 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-4 rounded-2xl shadow-xl shadow-orange-600/10 hover:shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xs"
              >
                {lang === 'id' ? 'Simpan Perubahan' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center gap-4 border-t border-zinc-900/50 mt-10">
        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">
          Tokcer AI © 2026 — {t('advancedAnalytics')}
        </div>
      </footer>
    </div>
  );
};

export default PartnerDashboard;
