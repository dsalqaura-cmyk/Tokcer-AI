import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { supabase } from '../supabase';
import logo from '../assets/logo.png';

// RICH SAMPLE DATA - STRICTOR ENGLISH COMPLIANCE
const MOCK_USERS = [
  { id: 'TKC-U001', name: 'Andi Saputra', email: 'andi.s@gmail.com', business_type: 'Fashion Retail', platforms: ['Shopee', 'TikTok'], created_at: '2026-04-24T10:00:00Z', tier: 'Elite', status: 'Active', due_date: '2026-07-24', amount: 'Rp 350,000', ref: 'REF-8890', pic: 'Dina - Gold Partner', stats: { omzet: 'Rp 45.2M', health: 92, orders: 1250 } },
  { id: 'TKC-U002', name: 'Siska Amelia', email: 'siska.amelia@outlook.com', business_type: 'Beauty & Skincare', platforms: ['Lazada', 'Tokopedia'], created_at: '2026-04-24T14:20:00Z', tier: 'Pro', status: 'Warning', due_date: '2026-05-12', amount: 'Rp 150,000', ref: 'REF-8891', pic: 'Budi - Silver Partner', stats: { omzet: 'Rp 12.8M', health: 45, orders: 340 } },
  { id: 'TKC-U003', name: 'Dimas Pratama', email: 'dimas.p@yahoo.com', business_type: 'Electronics', platforms: ['Shopee', 'TikTok', 'Lazada'], created_at: '2026-04-23T09:15:00Z', tier: 'Ultimate', status: 'Active', due_date: '2026-10-23', amount: 'Rp 750,000', ref: 'REF-8892', pic: 'Admin Core', stats: { omzet: 'Rp 128.5M', health: 98, orders: 4200 } },
  { id: 'TKC-U004', name: 'Budi Hartono', email: 'budi.h@gmail.com', business_type: 'Home & Living', platforms: ['Tokopedia'], created_at: '2026-04-22T11:00:00Z', tier: 'Starter', status: 'Active', due_date: '2026-05-22', amount: 'Rp 50,000', ref: 'REF-8893', pic: 'Direct Registration', stats: { omzet: 'Rp 5.2M', health: 85, orders: 120 } },
  { id: 'TKC-U005', name: 'Lina Marlina', email: 'lina.m@gmail.com', business_type: 'Food & Beverage', platforms: ['Shopee', 'Gofood'], created_at: '2026-04-21T16:45:00Z', tier: 'Elite', status: 'Active', due_date: '2026-07-21', amount: 'Rp 350,000', ref: 'REF-8894', pic: 'Raffi Digital Agency', stats: { omzet: 'Rp 62.8M', health: 94, orders: 1850 } },
];

const MOCK_PARTNERS = [
  { id: 'TKC-P001', name: 'Raffi Digital Agency', email: 'contact@raffi.agency', niche: 'Social Media Marketing', followers: '1.2M', media_link: 'https://instagram.com/raffi_agency', status: 'Active', tier: 'Platinum', omzet: 245000000, referrals: 156, pic: 'Admin Core', joined_at: '2026-01-15' },
  { id: 'TKC-P002', name: 'Jessica Content Creator', email: 'jess.creator@gmail.com', niche: 'Beauty & Fashion', followers: '450K', media_link: 'https://tiktok.com/@jess_creator', status: 'Active', tier: 'Gold', omzet: 185000000, referrals: 89, pic: 'Dina - Gold Partner', joined_at: '2026-02-10' },
  { id: 'TKC-P003', name: 'Andrian Tech Reviews', email: 'andrian.tech@gmail.com', niche: 'Gadgets & Tech', followers: '85K', media_link: 'https://youtube.com/andrian_tech', status: 'Active', tier: 'Silver', omzet: 42000000, referrals: 34, pic: 'Admin Core', joined_at: '2026-03-05' },
  { id: 'TKC-P004', name: 'Sari Healthy Food', email: 'sari.food@yahoo.com', niche: 'Health & Lifestyle', followers: '12K', media_link: 'https://instagram.com/sari_healthy', status: 'Pending', tier: 'Bronze', omzet: 0, referrals: 0, pic: 'Direct Application', joined_at: '2026-04-25' },
  { id: 'TKC-P005', name: 'Budi Digital Solutions', email: 'budi.solutions@gmail.com', niche: 'Business & Tech', followers: '150K', media_link: 'https://linkedin.com/in/budi_digital', status: 'Active', tier: 'Platinum', omzet: 310000000, referrals: 210, pic: 'Admin Core', joined_at: '2026-01-20' },
  { id: 'TKC-P006', name: 'Lina Beauty Vlogger', email: 'lina.beauty@outlook.com', niche: 'Skincare & Makeup', followers: '890K', media_link: 'https://youtube.com/lina_beauty', status: 'Active', tier: 'Gold', omzet: 195000000, referrals: 112, pic: 'Dina - Gold Partner', joined_at: '2026-02-28' },
];

const MOCK_TICKETS = [
  { id: 'TKT-2026-001', type: 'Bug Report', title: 'Chart Omzet not loading on mobile', priority: 'High', status: 'Open', created_at: '2026-04-25T08:00:00Z', author: 'Andi Saputra', user_id: 'TKC-U001' },
  { id: 'TKT-2026-002', type: 'Feature Request', title: 'Add export to PDF for monthly analytics', priority: 'Medium', status: 'In Progress', created_at: '2026-04-24T15:30:00Z', author: 'Siska Amelia', user_id: 'TKC-U002' },
  { id: 'TKT-2026-003', type: 'Billing', title: 'Double charge on subscription renewal', priority: 'High', status: 'Pending', created_at: '2026-04-25T09:45:00Z', author: 'Dimas Pratama', user_id: 'TKC-U003' },
];

const RECENT_ACTIVITY = [
  { type: 'payment', user: 'Dimas Pratama', action: 'Upgraded to Ultimate', time: '12 mins ago', amount: 'Rp 750,000' },
  { type: 'user', user: 'Budi Hartono', action: 'New Registration', time: '45 mins ago', status: 'Starter' },
  { type: 'partner', user: 'Sari Healthy Food', action: 'New Partner Application', time: '1 hour ago', tier: 'Bronze' },
  { type: 'ticket', user: 'Andi Saputra', action: 'Reported a Bug', time: '2 hours ago', priority: 'High' },
];

const InternalDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeAppTab, setActiveAppTab] = useState('app-subs');
  const [revenuePeriod, setRevenuePeriod] = useState('daily');
  const [showModal, setShowModal] = useState(false);
  const [showUserStats, setShowUserStats] = useState(null);
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [adminClients, setAdminClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [aiConfig, setAiConfig] = useState({ system_prompt: '', rag_knowledge_base: '' });
  const [aiLogs, setAiLogs] = useState([]);

  const [lang, setLang] = useState(localStorage.getItem('tokcer_lang') || 'id');
  const translations = {
    id: {
      overview: "Ringkasan",
      approvals: "Pusat Persetujuan",
      users: "Manajer User",
      partners: "Kemitraan",
      tickets: "Bug & Request",
      supabase: "Monitor Supabase",
      superAdmin: "Super Admin",
      exitSystem: "Keluar Sistem",
      coreCommand: "Pusat Komando",
      systemStatus: "Status Sistem",
      liveSynced: "LIVE & SINKRON",
      financialHub: "Pusat Performa Keuangan",
      grossIncome: "Pendapatan Kotor",
      partnerPayouts: "Pembayaran Partner",
      paid: "Sudah Dibayar",
      pending: "Menunggu",
      activePartners: "Partner Aktif",
      netProfit: "Profit Bersih",
      tierDist: "Distribusi Tier Partner",
      liveMonitor: "Monitor Live",
      recentActivity: "Aktivitas Terbaru",
      paymentsUpgrades: "Pembayaran & Upgrade",
      identityVerification: "Verifikasi Identitas",
      partnerApplications: "Pendaftaran Partner",
      identification: "Identifikasi",
      statusPlan: "Status / Paket",
      picPartner: "PIC Partner",
      refSource: "Sumber Referral",
      actions: "Aksi",
      approve: "Setujui",
      reject: "Tolak",
      userBaseMonitor: "Monitoring Database User",
      subscriberInfo: "Info Pelanggan",
      activePlan: "Paket Aktif",
      health: "Kesehatan",
      viewDetails: "Lihat Detail",
      totalReferrals: "Total Referral",
      networkPayouts: "Pembayaran Jaringan",
      newApps: "Pendaftaran Baru",
      globalNetwork: "Jaringan Partner Global",
      registerPartner: "Daftar Partner",
      partnerEntity: "Entitas Partner",
      nicheAudience: "Niche / Audiens",
      tier: "Tier",
      referrals: "Referral",
      revenue: "Omzet",
      status: "Status",
      feedbackLoop: "Loop Feedback Sistem",
      priority: "Prioritas",
      accept: "Terima",
      toUserDb: "Ke User DB",
      toPartnerDb: "Ke Partner DB",
      infraHub: "Hub Infrastruktur Supabase",
      authService: "Layanan Auth",
      confirmApproval: "Konfirmasi Persetujuan",
      approveUpgrade: "Setujui permintaan upgrade untuk",
      confirm: "Konfirmasi",
      cancel: "Batal",
      details: "Detail",
      healthScore: "Skor Kesehatan",
      orders: "Pesanan",
      aiStrategy: "AI Strategy Hub",
      aiManagement: "Manajemen AI Core",
      strictInstructions: "Instruksi Ketat (System Prompt)",
      knowledgeBase: "Basis Pengetahuan (RAG)",
      saveConfig: "Simpan Konfigurasi",
      configUpdated: "Konfigurasi AI diperbarui!",
      aiLogs: "Log Aktivitas AI",
      user: "User",
      task: "Tugas",
      credits: "Kredit",
      time: "Waktu",
    },
    en: {
      overview: "Overview",
      approvals: "Approval Center",
      users: "User Manager",
      partners: "Partnership",
      tickets: "Bugs & Requests",
      supabase: "Supabase Monitor",
      superAdmin: "Super Admin",
      exitSystem: "Exit System",
      coreCommand: "Core Command Center",
      systemStatus: "System Status",
      liveSynced: "LIVE & SYNCED",
      financialHub: "Financial Performance Hub",
      grossIncome: "Gross Income",
      partnerPayouts: "Partner Payouts",
      paid: "Paid",
      pending: "Pending",
      activePartners: "Active Partners",
      netProfit: "Net Profit",
      tierDist: "Partner Tier Distribution",
      liveMonitor: "Live Monitor",
      recentActivity: "Recent Activity",
      paymentsUpgrades: "Payments & Upgrades",
      identityVerification: "Identity Verification",
      partnerApplications: "Partner Applications",
      identification: "Identification",
      statusPlan: "Status / Plan",
      picPartner: "PIC Partner",
      refSource: "Referral Source",
      actions: "Actions",
      approve: "Approve",
      reject: "Reject",
      userBaseMonitor: "User Base Monitoring",
      subscriberInfo: "Subscriber Info",
      activePlan: "Active Plan",
      health: "Health",
      viewDetails: "View Details",
      totalReferrals: "Total Referrals",
      networkPayouts: "Network Payouts",
      newApps: "New Applications",
      globalNetwork: "Global Partner Network",
      registerPartner: "Register Partner",
      partnerEntity: "Partner Entity",
      nicheAudience: "Niche / Audience",
      tier: "Tier",
      referrals: "Referrals",
      revenue: "Revenue",
      status: "Status",
      feedbackLoop: "System Feedback Loop",
      priority: "Priority",
      accept: "Accept",
      toUserDb: "To User DB",
      toPartnerDb: "To Partner DB",
      infraHub: "Supabase Infrastructure Hub",
      authService: "Auth Service",
      confirmApproval: "Confirm Approval",
      approveUpgrade: "Approve upgrade request for",
      confirm: "Confirm",
      cancel: "Cancel",
      details: "Details",
      healthScore: "Health Score",
      orders: "Orders",
      aiStrategy: "AI Strategy Hub",
      aiManagement: "AI Core Management",
      strictInstructions: "Strict Instructions (System Prompt)",
      knowledgeBase: "Knowledge Base (RAG)",
      saveConfig: "Save Configuration",
      configUpdated: "AI Configuration updated!",
      aiLogs: "AI Activity Logs",
      user: "User",
      task: "Task",
      credits: "Credits",
      time: "Time",
    }
  };

  const t = (key) => translations[lang][key] || key;
  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('tokcer_lang', newLang);
    window.dispatchEvent(new Event('lang-change'));
  };

  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem('tokcer_lang') || 'id');
    };
    window.addEventListener('lang-change', handleLangChange);
    return () => window.removeEventListener('lang-change', handleLangChange);
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    // Explicitly select ID to ensure it's there
    const { data, error } = await supabase
      .from('clients')
      .select('id, shop_name, email, status, plan, tier, pic, ref, payment_method, partners(full_name)')
      .order('created_at', { ascending: false });
    if (!error) setAdminClients(data);
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('tokcer_admin_auth');
    navigate('/admin-login');
  };

  const fetchAiConfig = async () => {
    const { data, error } = await supabase.from('ai_configs').select('*');
    if (!error && data) {
      const configMap = {};
      data.forEach(item => {
        configMap[item.key] = item.value;
      });
      setAiConfig(configMap);
    }
  };

  const fetchAiLogs = async () => {
    const { data, error } = await supabase
      .from('ai_usage_logs')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(10);
    if (!error) setAiLogs(data);
  };

  const handleSaveAiConfig = async () => {
    setIsLoading(true);
    try {
      const updates = [
        { key: 'system_prompt', value: aiConfig.system_prompt },
        { key: 'rag_knowledge_base', value: aiConfig.rag_knowledge_base }
      ];

      for (const item of updates) {
        await supabase.from('ai_configs').upsert(item, { onConflict: 'key' });
      }
      alert(t('configUpdated'));
    } catch (err) {
      alert("Error saving config: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchAiConfig();
    fetchAiLogs();
  }, []);

  const handleApprove = async (client) => {
    const confirm = window.confirm(`DEBUG: Approve ${client.shop_name}?\nID: ${client.id}\nFULL DATA: ${JSON.stringify(client)}`);
    if (!confirm) return;

    setIsLoading(true);
    try {
      console.log('Attempting to approve client ID:', client.id);
      const { data, error } = await supabase
        .from('clients')
        .update({ status: 'active', commission_amount: 100000 })
        .eq('id', client.id)
        .select();

      if (error) {
        console.error('Supabase Error:', error);
        alert('Supabase Error: ' + JSON.stringify(error));
        throw error;
      }
      
      console.log('Update result:', data);
      
      if (data && data.length > 0) {
        alert(`Berhasil! Status ${client.shop_name} sekarang adalah ACTIVE.`);
      } else {
        alert(`Peringatan: Tidak ada data yang diupdate.\nID: ${client.id}\nStatus yang dicari: active`);
      }
      
      await fetchClients();
      setShowModal(false);
    } catch (err) {
      console.error('Approve Error:', err);
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart Initialization
  useEffect(() => {
    if (activeSection === 'overview' && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Platinum', 'Gold', 'Silver', 'Bronze'],
          datasets: [{
            data: [15, 25, 35, 25], 
            backgroundColor: ['#1e40af', '#fbbf24', '#94a3b8', '#b45309'],
            borderWidth: 0,
            cutout: '75%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [activeSection]);

  const openApprovalModal = (name, tier, amount, ref) => {
    setModalData({ name, tier, amount, ref });
    setShowModal(true);
  };

  const getTierBadgeClass = (tier) => {
    switch(tier?.toLowerCase()) {
      case 'platinum': return 'bg-blue-900/30 text-blue-400 border border-blue-500/20';
      case 'gold': return 'bg-amber-900/30 text-amber-400 border border-amber-500/20';
      case 'silver': return 'bg-zinc-700 text-zinc-300 border border-zinc-600';
      case 'bronze': return 'bg-orange-900/30 text-orange-400 border border-orange-500/20';
      case 'ultimate': return 'bg-purple-900/30 text-purple-400 border border-purple-500/20';
      case 'elite': return 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/20';
      case 'pro': return 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/20';
      default: return 'bg-zinc-800 text-zinc-500';
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-['Inter',sans-serif] overflow-hidden animate-in fade-in duration-700">
      
      {/* Mobile Toggle Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 bg-zinc-900 text-white flex flex-col shrink-0 shadow-2xl z-40 border-r border-zinc-800 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <img src={logo} alt="Tokcer AI" className="h-8 w-auto" />
          <div className="text-xl font-black tracking-tighter uppercase text-white">
            <span className="text-blue-500">Core</span>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <div className="flex bg-black rounded-lg p-1 border border-zinc-800">
            <button 
              onClick={() => toggleLang('id')}
              className={`flex-1 py-1 text-[10px] font-black rounded ${lang === 'id' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              ID
            </button>
            <button 
              onClick={() => toggleLang('en')}
              className={`flex-1 py-1 text-[10px] font-black rounded ${lang === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              EN
            </button>
          </div>
        </div>
        
        <nav className="flex-1 mt-6 overflow-y-auto custom-scrollbar space-y-1">
          {[
            { id: 'overview', label: t('overview'), icon: 'solar:chart-square-bold-duotone' },
            { id: 'approvals', label: t('approvals'), icon: 'solar:check-circle-bold-duotone', badge: 12 },
            { id: 'users', label: t('users'), icon: 'solar:users-group-rounded-bold-duotone' },
            { id: 'partners', label: t('partners'), icon: 'solar:users-group-two-rounded-bold-duotone' },
            { id: 'tickets', label: t('tickets'), icon: 'solar:bug-bold-duotone', badge: 3 },
            { id: 'ai-gen', label: t('aiStrategy'), icon: 'solar:magic-stick-bold-duotone' },
            { id: 'supabase', label: t('supabase'), icon: 'solar:database-bold-duotone' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 py-3.5 px-6 transition-all border-l-4 group ${activeSection === item.id ? 'bg-blue-600/10 border-blue-500 text-white shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : 'border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-white'}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <iconify-icon icon={item.icon} className={`text-xl transition-transform group-hover:scale-110 ${activeSection === item.id ? 'text-blue-500' : 'text-zinc-500'}`}></iconify-icon>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-blue-600 text-[9px] font-black px-2 py-0.5 rounded-md text-white shadow-lg shadow-blue-600/30">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">{t('superAdmin')}</p>
              <p className="text-[8px] font-bold text-zinc-500 truncate">admin@tokcer-ai.com</p>
            </div>
          </div>
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center mb-4 italic">Core Command v2.4.1</p>
          
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            <iconify-icon icon="solar:logout-3-bold-duotone" className="text-lg"></iconify-icon>
            {t('exitSystem')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden relative">
        
        {/* Header Section */}
        <header className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 py-4 px-8 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Trigger */}
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl border border-zinc-700">
               <iconify-icon icon="solar:hamburger-menu-bold" className="text-white text-xl"></iconify-icon>
             </button>
             <h1 className="text-xl font-black text-white uppercase tracking-tight">
               {activeSection === 'partners' ? 'Partnership' : activeSection.toUpperCase()} <span className="text-zinc-500 font-light">| Command Center</span>
             </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1 text-right">{t('systemStatus')}</p>
              <p className="text-sm font-bold text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {t('liveSynced')}
              </p>
            </div>
          </div>
        </header>

        {/* Dynamic Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          
          {/* SECTION: OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 mb-8 overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600/[0.03] pointer-events-none"></div>
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div>
                    <h3 className="font-black text-xl text-white uppercase tracking-tight">{t('financialHub')}</h3>
                    <p className="text-sm text-zinc-500 font-medium">Daily income, payouts, and net profit analytics</p>
                  </div>
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                    {['daily', 'weekly', 'monthly'].map(p => (
                      <button key={p} onClick={() => setRevenuePeriod(p)} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${revenuePeriod === p ? 'bg-zinc-800 text-blue-400 shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}>{t(p)}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                  <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{t('grossIncome')}</p>
                    <h2 className="text-2xl font-black text-white tracking-tighter">Rp 82.5M</h2>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[9px] font-black bg-green-500/10 text-green-500 px-2 py-0.5 rounded tracking-widest">+15.2%</span>
                    </div>
                  </div>
                  <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{t('partnerPayouts')}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">{t('paid')}</p>
                        <h2 className="text-xl font-black text-white tracking-tighter">Rp 15.2M</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-amber-500 uppercase mb-1">{t('pending')}</p>
                        <h2 className="text-xl font-black text-amber-500 tracking-tighter">Rp 6.2M</h2>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{t('activePartners')}</p>
                    <h2 className="text-2xl font-black text-white tracking-tighter">124</h2>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[9px] font-black bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded tracking-widest">+4 New</span>
                    </div>
                  </div>
                  <div className="p-6 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 text-white">
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{t('netProfit')}</p>
                    <h2 className="text-2xl font-black tracking-tighter">Rp 56.9M</h2>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[9px] font-black bg-white/20 text-white px-2 py-0.5 rounded tracking-widest">68.9%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 lg:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-white uppercase tracking-tight">{t('tierDist')}</h3>
                    <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-tighter">{t('liveMonitor')}</span>
                  </div>
                  <div className="flex items-center gap-8 h-40">
                    <div className="w-1/3 h-full relative">
                      <canvas ref={chartRef}></canvas>
                    </div>
                    <div className="w-2/3 grid grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        { label: 'Platinum', color: 'bg-blue-600', count: 18 },
                        { label: 'Gold', color: 'bg-amber-400', count: 31 },
                        { label: 'Silver', color: 'bg-zinc-400', count: 43 },
                        { label: 'Bronze', color: 'bg-orange-600', count: 32 }
                      ].map((t_item) => (
                        <div key={t_item.label} className="flex items-center justify-between bg-zinc-950/50 p-3 rounded-xl border border-zinc-800">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${t_item.color}`}></span>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t_item.label}</span>
                          </div>
                          <span className="font-black text-white text-xs">{t_item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
                    <h3 className="font-black text-white uppercase tracking-tight mb-6">{t('recentActivity')}</h3>
                    <div className="space-y-6">
                        {RECENT_ACTIVITY.map((act, i) => (
                            <div key={i} className="flex gap-4 relative">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${act.type === 'payment' ? 'bg-green-500' : act.type === 'user' ? 'bg-blue-500' : act.type === 'partner' ? 'bg-amber-500' : 'bg-red-500'}`}>
                                    <iconify-icon icon={act.type === 'payment' ? 'solar:dollar-bold' : act.type === 'user' ? 'solar:user-bold' : act.type === 'partner' ? 'solar:handshake-bold' : 'solar:bug-bold'} className="text-[10px] text-white"></iconify-icon>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[11px] font-black text-white tracking-tight leading-none uppercase">{act.user}</p>
                                        <span className="text-[8px] font-bold text-zinc-600 uppercase">{act.time}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-tight">{act.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: APPROVAL CENTER */}
          {activeSection === 'approvals' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 overflow-hidden">
                <div className="flex space-x-8 px-8 border-b border-zinc-800 bg-zinc-950/50 pt-6">
                  {[
                    { id: 'app-subs', label: t('paymentsUpgrades') },
                    { id: 'new-user', label: t('identityVerification') },
                    { id: 'new-partner', label: t('partnerApplications') }
                  ].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveAppTab(tab.id)} 
                      className={`pb-5 text-[11px] font-black uppercase tracking-widest relative transition-colors ${activeAppTab === tab.id ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {tab.label}
                      {activeAppTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-2px_10px_rgba(59,130,246,0.5)]"></div>}
                    </button>
                  ))}
                </div>

                <div className="p-8">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-4 pb-2">{t('identification')}</th>
                        <th className="px-4 pb-2">{t('statusPlan')}</th>
                        <th className="px-4 pb-2 text-center">{t('picPartner')}</th>
                        <th className="px-4 pb-2 text-center">{t('refSource')}</th>
                        <th className="px-4 pb-2 text-right">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeAppTab === 'app-subs' 
                        ? adminClients.filter(c => !c.status || c.status.toLowerCase() === 'pending') 
                        : activeAppTab === 'new-partner' ? MOCK_PARTNERS.filter(p => !p.status || p.status.toLowerCase() === 'pending') 
                        : MOCK_USERS.filter(u => !u.status || u.status.toLowerCase() === 'pending' || u.status.toLowerCase() === 'warning')
                      ).map((item, i) => (
                        <tr key={i} className="bg-zinc-900/30 hover:bg-zinc-800/50 transition-all group">
                          <td className="p-4 rounded-l-2xl border-l border-y border-zinc-800/50">
                            <div className="font-black text-white text-sm tracking-tight group-hover:text-blue-400 transition-colors">{item.name || item.shop_name}</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">{item.email}</div>
                          </td>
                          <td className="p-4 border-y border-zinc-800/50">
                            <span className={`${getTierBadgeClass(item.tier || item.plan)} text-[9px] font-black px-3 py-1 rounded-lg uppercase border border-white/5`}>{item.tier || item.plan}</span>
                          </td>
                          <td className="p-4 border-y border-zinc-800/50 text-center">
                            <span className="text-[10px] font-bold text-zinc-400">{item.pic || item.partners?.full_name || 'Direct Access'}</span>
                          </td>
                          <td className="p-4 border-y border-zinc-800/50 text-center">
                            <span className="text-[10px] font-black text-blue-500 tracking-tighter uppercase bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">{item.ref || item.payment_method || 'SYSTEM'}</span>
                          </td>
                          <td className="p-4 rounded-r-2xl border-r border-y border-zinc-800/50 text-right">
                            <div className="flex items-center justify-end gap-3">
                              {item.status === 'pending' || !item.status ? (
                                <>
                                  <button onClick={() => { setSelectedClient(item); setShowModal(true); }} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">Approve</button>
                                  <button className="px-6 py-2 bg-zinc-800 hover:bg-rose-600 text-zinc-500 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl border border-zinc-700 transition-all active:scale-95">Reject</button>
                                </>
                              ) : (
                                <span className="text-emerald-500 text-[10px] font-black uppercase px-4 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                  {item.status}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: USER MANAGER */}
          {activeSection === 'users' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
                   <h3 className="font-black text-white uppercase tracking-tight">{t('userBaseMonitor')}</h3>
                </div>
                <div className="p-8">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-4 pb-2">{t('subscriberInfo')}</th>
                        <th className="px-4 pb-2">{t('activePlan')}</th>
                        <th className="px-4 pb-2">{t('health')}</th>
                        <th className="px-4 pb-2 text-right">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_USERS.map((u) => (
                        <tr key={u.id} className="bg-zinc-950/50 hover:bg-zinc-800/50 transition-all group">
                          <td className="p-4 rounded-l-2xl border-l border-y border-zinc-800">
                            <div className="font-black text-white text-sm tracking-tight">{u.name}</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">{u.id} • {u.email}</div>
                          </td>
                          <td className="p-4 border-y border-zinc-800">
                             <span className={`${getTierBadgeClass(u.tier)} text-[9px] font-black px-3 py-1 rounded-lg uppercase`}>{u.tier}</span>
                          </td>
                          <td className="p-4 border-y border-zinc-800">
                             <span className={`text-[10px] font-black ${u.stats.health > 80 ? 'text-green-500' : 'text-amber-500'}`}>{u.stats.health}%</span>
                          </td>
                          <td className="p-4 rounded-r-2xl border-r border-y border-zinc-800 text-right">
                             <button onClick={() => setShowUserStats(u)} className="px-4 py-2 bg-blue-600/10 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-xl border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all">{t('viewDetails')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PARTNERSHIP MANAGER - CRITICAL FIX */}
          {activeSection === 'partners' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t('totalReferrals')}</p>
                   <h3 className="text-3xl font-black text-white tracking-tighter">601</h3>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t('networkPayouts')}</p>
                   <h3 className="text-3xl font-black text-green-500 tracking-tighter">Rp 21.4M</h3>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t('newApps')}</p>
                   <h3 className="text-3xl font-black text-amber-500 tracking-tighter">12</h3>
                </div>
              </div>

              <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-white uppercase tracking-tight">{t('globalNetwork')}</h3>
                    <p className="text-xs text-zinc-500 font-medium">Managing affiliates, agencies, and content creators</p>
                  </div>
                  <button className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                    <iconify-icon icon="solar:user-plus-bold-duotone" className="text-lg"></iconify-icon>
                    {t('registerPartner')}
                  </button>
                </div>
                <div className="p-8 overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1000px]">
                    <thead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-4 pb-2">{t('partnerEntity')}</th>
                        <th className="px-4 pb-2">{t('nicheAudience')}</th>
                        <th className="px-4 pb-2 text-center">{t('tier')}</th>
                        <th className="px-4 pb-2 text-right">{t('referrals')}</th>
                        <th className="px-4 pb-2 text-right">{t('revenue')}</th>
                        <th className="px-4 pb-2 text-center">{t('status')}</th>
                        <th className="px-4 pb-2 text-right">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PARTNERS.map((p) => (
                        <tr key={p.id} className="bg-zinc-950/50 hover:bg-zinc-800/50 transition-all group">
                          <td className="p-4 rounded-l-2xl border-l border-y border-zinc-800">
                            <div className="font-black text-white text-sm tracking-tight">{p.name}</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">{p.id} • {p.email}</div>
                          </td>
                          <td className="p-4 border-y border-zinc-800">
                             <div className="text-[10px] font-black text-white uppercase mb-1">{p.niche}</div>
                             <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{p.followers} FOLLOWERS</div>
                          </td>
                          <td className="p-4 border-y border-zinc-800 text-center">
                             <span className={`${getTierBadgeClass(p.tier)} text-[8px] font-black px-3 py-1 rounded-lg tracking-widest uppercase`}>{p.tier}</span>
                          </td>
                          <td className="p-4 border-y border-zinc-800 text-right font-black text-white text-sm">{p.referrals}</td>
                          <td className="p-4 border-y border-zinc-800 text-right font-black text-blue-400 text-sm">Rp {(p.omzet / 1000000).toFixed(1)}M</td>
                          <td className="p-4 border-y border-zinc-800 text-center">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${p.status === 'Active' ? 'text-green-500 border-green-500/20' : 'text-amber-500 border-amber-500/20'}`}>{p.status}</span>
                          </td>
                          <td className="p-4 rounded-r-2xl border-r border-y border-zinc-800 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button onClick={() => alert(`Settings for ${p.name}`)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-white hover:text-black rounded-xl border border-zinc-700 transition-all">
                                 <iconify-icon icon="solar:settings-bold-duotone" className="text-xl"></iconify-icon>
                               </button>
                               <button onClick={() => alert(`Stats for ${p.name}`)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-blue-600 text-white rounded-xl border border-zinc-700 transition-all">
                                 <iconify-icon icon="solar:chart-square-bold-duotone" className="text-xl"></iconify-icon>
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: BUGS & REQUESTS */}
          {activeSection === 'tickets' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-8">
                  <h3 className="font-black text-white uppercase tracking-tight mb-8">{t('feedbackLoop')}</h3>
                  <div className="space-y-4">
                    {MOCK_TICKETS.map(t_item => (
                      <div key={t_item.id} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex justify-between items-center">
                         <div className="flex gap-4 items-center">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t_item.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-400'}`}>
                               <iconify-icon icon="solar:shield-warning-bold-duotone" className="text-xl"></iconify-icon>
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-white uppercase tracking-tight">{t_item.title}</h4>
                               <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">BY: {t_item.author} • {t_item.priority} {t('priority')}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <button className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all">{t('accept')}</button>
                            <button className="px-4 py-2 bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all border border-zinc-700">{t('reject')}</button>
                            <div className="h-8 w-px bg-zinc-800 mx-2"></div>
                            <div className="flex gap-2">
                              <button className="px-3 py-2 bg-zinc-900 text-zinc-400 text-[8px] font-black uppercase tracking-tighter rounded-lg border border-zinc-800 hover:border-blue-500/50 transition-all">{t('toUserDb')}</button>
                              <button className="px-3 py-2 bg-zinc-900 text-zinc-400 text-[8px] font-black uppercase tracking-tighter rounded-lg border border-zinc-800 hover:border-amber-500/50 transition-all">{t('toPartnerDb')}</button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* SECTION: SUPABASE MONITOR */}
          {activeSection === 'supabase' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'DB Connections', value: '42/100', color: 'text-green-500', trend: 'Healthy' },
                  { label: 'Storage Used', value: '1.2GB/5GB', color: 'text-amber-500', trend: '24% Full' },
                  { label: 'Avg API Latency', value: '45ms', color: 'text-blue-500', trend: 'Optimized' },
                  { label: 'Active Sessions', value: '1,256', color: 'text-purple-500', trend: 'Live' }
                ].map(s => (
                  <div key={s.label} className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">{s.label}</p>
                    <p className={`text-3xl font-black ${s.color} tracking-tighter`}>{s.value}</p>
                    <p className="text-[8px] font-black text-zinc-600 uppercase mt-4 tracking-widest">{s.trend}</p>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-900/50 p-12 rounded-[3rem] border border-zinc-800 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl"></div>
                <iconify-icon icon="solar:settings-bold-duotone" className="text-6xl text-zinc-800 mb-6 animate-spin-slow"></iconify-icon>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('infraHub')}</h3>
                <p className="text-zinc-500 text-sm mt-2 max-w-lg mx-auto uppercase font-bold tracking-[0.1em]">Connected to project `iogxyo...`. Monitoring real-time data flow, authentication triggers, and storage bucket accessibility.</p>
                
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {['Auth Service', 'PostgREST', 'Realtime', 'Storage'].map(srv => (
                        <div key={srv} className="flex items-center gap-2 justify-center py-2 px-4 rounded-full bg-zinc-950 border border-zinc-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{srv === 'Auth Service' ? t('authService') : srv} OK</span>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: AI STRATEGY HUB */}
          {activeSection === 'ai-gen' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10"></div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-black text-2xl text-white uppercase tracking-tight">{t('aiManagement')}</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Control AI Behavior and Knowledge Base</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">DeepSeek-V3 Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* System Prompt */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('strictInstructions')}</label>
                      <iconify-icon icon="solar:shield-keyhole-bold-duotone" className="text-blue-500"></iconify-icon>
                    </div>
                    <textarea 
                      className="w-full h-64 bg-black/40 border border-zinc-800 focus:border-blue-500/50 rounded-3xl p-6 text-sm text-zinc-300 outline-none resize-none leading-relaxed font-mono"
                      value={aiConfig.system_prompt}
                      onChange={(e) => setAiConfig({...aiConfig, system_prompt: e.target.value})}
                    ></textarea>
                  </div>

                  {/* RAG Knowledge Base */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('knowledgeBase')}</label>
                      <iconify-icon icon="solar:library-bold-duotone" className="text-amber-500"></iconify-icon>
                    </div>
                    <textarea 
                      className="w-full h-64 bg-black/40 border border-zinc-800 focus:border-amber-500/50 rounded-3xl p-6 text-sm text-zinc-300 outline-none resize-none leading-relaxed font-mono"
                      placeholder="Input knowledge chunks here for RAG..."
                      value={aiConfig.rag_knowledge_base}
                      onChange={(e) => setAiConfig({...aiConfig, rag_knowledge_base: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleSaveAiConfig}
                    disabled={isLoading}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? 'SAVING...' : t('saveConfig')}
                  </button>
                </div>
              </div>

              {/* AI Logs */}
              <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-zinc-800 bg-zinc-950/50">
                  <h3 className="font-black text-white uppercase tracking-tight">{t('aiLogs')}</h3>
                </div>
                <div className="p-8">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-4 pb-2">{t('user')}</th>
                        <th className="px-4 pb-2">{t('task')}</th>
                        <th className="px-4 pb-2 text-center">{t('credits')}</th>
                        <th className="px-4 pb-2 text-right">{t('time')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiLogs.length > 0 ? aiLogs.map((log, i) => (
                        <tr key={i} className="bg-zinc-950/50 hover:bg-zinc-800/50 transition-all group">
                          <td className="p-4 rounded-l-2xl border-l border-y border-zinc-800">
                            <div className="font-black text-white text-xs uppercase tracking-tight">{log.profiles?.full_name || 'System User'}</div>
                          </td>
                          <td className="p-4 border-y border-zinc-800">
                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{log.task_type} ({log.topic})</span>
                          </td>
                          <td className="p-4 border-y border-zinc-800 text-center">
                             <span className="bg-blue-600/10 text-blue-400 text-[10px] font-black px-3 py-1 rounded-lg">-{log.credits_spent} CR</span>
                          </td>
                          <td className="p-4 rounded-r-2xl border-r border-y border-zinc-800 text-right">
                             <span className="text-[10px] font-bold text-zinc-600 uppercase italic">{new Date(log.created_at).toLocaleTimeString()}</span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">No AI activity recorded yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL: USER QUICK VIEW */}
      {showUserStats && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-zinc-900 rounded-[2.5rem] max-w-4xl w-full p-10 border border-zinc-800 relative">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{showUserStats.name} {t('details')}</h2>
                    <button onClick={() => setShowUserStats(null)} className="text-zinc-500 hover:text-white transition-all">
                        <iconify-icon icon="solar:close-circle-bold" className="text-3xl"></iconify-icon>
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center">
                        <p className="text-zinc-600 text-[10px] font-black uppercase mb-2">{t('revenue')}</p>
                        <p className="text-xl font-black text-white">{showUserStats.stats.omzet}</p>
                    </div>
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center">
                        <p className="text-zinc-600 text-[10px] font-black uppercase mb-2">{t('healthScore')}</p>
                        <p className="text-xl font-black text-green-500">{showUserStats.stats.health}%</p>
                    </div>
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center">
                        <p className="text-zinc-600 text-[10px] font-black uppercase mb-2">{t('orders')}</p>
                        <p className="text-xl font-black text-white">{showUserStats.stats.orders}</p>
                    </div>
                </div>
           </div>
        </div>
      )}

      {/* MODAL: PAYMENT VERIFICATION */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-zinc-900 rounded-[2.5rem] max-w-md w-full p-10 border border-zinc-800 text-center">
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">{t('confirmApproval')}</h2>
            <p className="text-sm text-zinc-500 mb-8 font-medium italic">{t('approveUpgrade')} {selectedClient?.shop_name || selectedClient?.name}?</p>
            <div className="flex gap-4">
              <button onClick={() => handleApprove(selectedClient)} className="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl">{t('confirm')}</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-2xl">{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalDashboard;
