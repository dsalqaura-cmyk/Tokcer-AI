import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { supabase } from '../supabase';

// Components
import InternalSidebar from '../components/internal/InternalSidebar.jsx';
import InternalHeader from '../components/internal/InternalHeader.jsx';
import OverviewSection from '../components/internal/sections/OverviewSection.jsx';
import ApprovalSection from '../components/internal/sections/ApprovalSection.jsx';
import UserSection from '../components/internal/sections/UserSection.jsx';
import PartnerSection from '../components/internal/sections/PartnerSection.jsx';
import TicketSection from '../components/internal/sections/TicketSection.jsx';
import AiStrategySection from '../components/internal/sections/AiStrategySection.jsx';
import SupabaseSection from '../components/internal/sections/SupabaseSection.jsx';

// Modals
import UserQuickViewModal from '../components/internal/modals/UserQuickViewModal.jsx';
import PaymentVerificationModal from '../components/internal/modals/PaymentVerificationModal.jsx';
import PartnerReviewModal from '../components/internal/modals/PartnerReviewModal.jsx';
import AccountSetupModal from '../components/internal/modals/AccountSetupModal.jsx';

import { internalTranslations } from '../locales/internalLocales';

// MOCK DATA
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

const RECENT_ACTIVITY = [
  { type: 'payment', user: 'Dimas Pratama', action: 'Upgraded to Ultimate', time: '12 mins ago', amount: 'Rp 750,000' },
  { type: 'user', user: 'Budi Hartono', action: 'New Registration', time: '45 mins ago', status: 'Starter' },
  { type: 'partner', user: 'Sari Healthy Food', action: 'New Partner Application', time: '1 hour ago', tier: 'Bronze' },
  { type: 'ticket', user: 'Andi Saputra', action: 'Reported a Bug', time: '2 hours ago', priority: 'High' },
];

const InternalDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeAppTab, setActiveAppTab] = useState('app-subs');
  const [revenuePeriod, setRevenuePeriod] = useState('daily');
  const [showModal, setShowModal] = useState(false);
  const [showUserStats, setShowUserStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [adminClients, setAdminClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [aiConfig, setAiConfig] = useState({ system_prompt: '', rag_knowledge_base: '' });
  const [aiLogs, setAiLogs] = useState([]);
  const [partnerApps, setPartnerApps] = useState([]);
  const [selectedPartnerApp, setSelectedPartnerApp] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvalAccount, setApprovalAccount] = useState({ username: '', password: '' });

  const [lang, setLang] = useState(localStorage.getItem('tokcer_lang') || 'id');
  const t = (key) => internalTranslations[lang][key] || key;

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
    const { data, error } = await supabase
      .from('clients')
      .select('id, shop_name, email, status, plan, tier, pic, ref, payment_method, payment_proof_url, created_at, partners(full_name)')
      .order('created_at', { ascending: false });
    if (!error) setAdminClients(data);
    setIsLoading(false);
  };

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*, partners(full_name)')
      .order('created_at', { ascending: false });

    if (!error) setTickets(data || []);
  };

  const fetchPartnerApps = async () => {
    const { data, error } = await supabase
      .from('partner_applications')
      .select('*')
      .eq('status', 'agreed')
      .order('agreed_at', { ascending: false });
    
    if (!error) setPartnerApps(data);
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

  const handleApproveWithAccount = async () => {
    if (!selectedPartnerApp) return;

    setIsLoading(true);
    try {
      // 1. Panggil Edge Function untuk bikin user di Auth & kirim email
      const { data, error: functionError } = await supabase.functions.invoke('activate-partner', {
        body: { 
          email: selectedPartnerApp.email, 
          password: 'Tokcer@2026', 
          applicationId: selectedPartnerApp.id,
          nama: selectedPartnerApp.nama
        }
      });

      if (functionError) throw functionError;

      // 2. Update status lokal jika berhasil
      alert(`Berhasil! Akun untuk ${selectedPartnerApp.nama} telah aktif dan email instruksi telah dikirim.`);
      setShowApproveModal(false);
      setSelectedPartnerApp(null);
      await fetchPartnerApps();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (client) => {
    if (!client) return;
    const confirm = window.confirm(`Approve ${client.shop_name}?`);
    if (!confirm) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({ status: 'active', commission_amount: 100000 })
        .eq('id', client.id)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        alert(`Berhasil! Status ${client.shop_name} sekarang adalah ACTIVE.`);
      }
      
      await fetchClients();
      setShowModal(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchAiConfig();
    fetchAiLogs();
    fetchPartnerApps();
    fetchTickets();
  }, []);

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

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection t={t} revenuePeriod={revenuePeriod} setRevenuePeriod={setRevenuePeriod} chartRef={chartRef} RECENT_ACTIVITY={RECENT_ACTIVITY} />;
      case 'approvals':
        return <ApprovalSection t={t} activeAppTab={activeAppTab} setActiveAppTab={setActiveAppTab} adminClients={adminClients} partnerApps={partnerApps} MOCK_USERS={MOCK_USERS} getTierBadgeClass={getTierBadgeClass} setSelectedPartnerApp={setSelectedPartnerApp} setShowApproveModal={setShowApproveModal} handleApprove={handleApprove} />;
      case 'users':
        return <UserSection t={t} MOCK_USERS={MOCK_USERS} getTierBadgeClass={getTierBadgeClass} setShowUserStats={setShowUserStats} />;
      case 'partners':
        return <PartnerSection t={t} MOCK_PARTNERS={MOCK_PARTNERS} getTierBadgeClass={getTierBadgeClass} />;
      case 'tickets':
        return <TicketSection t={t} tickets={tickets} selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} />;
      case 'ai-gen':
        return <AiStrategySection t={t} aiConfig={aiConfig} setAiConfig={setAiConfig} handleSaveAiConfig={handleSaveAiConfig} isLoading={isLoading} aiLogs={aiLogs} />;
      case 'supabase':
        return <SupabaseSection t={t} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-['Inter',sans-serif] overflow-hidden animate-in fade-in duration-700">
      <InternalSidebar t={t} activeSection={activeSection} setActiveSection={setActiveSection} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} lang={lang} toggleLang={toggleLang} handleLogout={handleLogout} adminClients={adminClients} partnerApps={partnerApps} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden relative">
        <InternalHeader t={t} activeSection={activeSection} setIsSidebarOpen={setIsSidebarOpen} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderSection()}
        </div>
      </main>

      <UserQuickViewModal t={t} showUserStats={showUserStats} setShowUserStats={setShowUserStats} />
      <PaymentVerificationModal t={t} showModal={showModal} setShowModal={setShowModal} selectedClient={selectedClient} handleApprove={handleApprove} />
      <PartnerReviewModal selectedPartnerApp={selectedPartnerApp} setSelectedPartnerApp={setSelectedPartnerApp} setShowApproveModal={setShowApproveModal} />
      <AccountSetupModal showApproveModal={showApproveModal} setShowApproveModal={setShowApproveModal} selectedPartnerApp={selectedPartnerApp} approvalAccount={approvalAccount} setApprovalAccount={setApprovalAccount} handleApproveWithAccount={handleApproveWithAccount} isLoading={isLoading} />
    </div>
  );
};

export default InternalDashboard;
