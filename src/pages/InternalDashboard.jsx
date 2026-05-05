import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { supabase } from '../lib/supabase.js';

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
import PayoutSection from '../components/internal/sections/PayoutSection.jsx';
import BusinessInsightSection from '../components/internal/sections/BusinessInsightSection.jsx';

// Modals
import UserQuickViewModal from '../components/internal/modals/UserQuickViewModal.jsx';
import PaymentVerificationModal from '../components/internal/modals/PaymentVerificationModal.jsx';
import PartnerReviewModal from '../components/internal/modals/PartnerReviewModal.jsx';
import AccountSetupModal from '../components/internal/modals/AccountSetupModal.jsx';

import { internalTranslations } from '../locales/internalLocales.js';

const InternalDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
  const [adminPartners, setAdminPartners] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [aiConfig, setAiConfig] = useState({ system_prompt: '', rag_knowledge_base: '' });
  const [originalAiConfig, setOriginalAiConfig] = useState({});
  const [aiHistory, setAiHistory] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);
  const [partnerApps, setPartnerApps] = useState([]);
  const [selectedPartnerApp, setSelectedPartnerApp] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvalAccount, setApprovalAccount] = useState({ username: '', password: '' });

  const [lang, setLang] = useState(localStorage.getItem('tokcer_lang') || 'id');
  const t = (key) => internalTranslations[lang]?.[key] || key;

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

  // TAMBAHAN UCUP: Ambil semua data otomatis pas halaman dibuka
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchClients(),
          fetchPartners(),
          fetchAllUsers(),
          fetchGlobalStats(),
          fetchTickets(),
          fetchPartnerApps(),
          fetchAiConfig(),
          fetchAiHistory(),
          fetchAiLogs()
        ]);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("❌ Gagal narik data Clients:", error);
      // alert("Error Database: " + error.message);
    } else {
      setAdminClients(data || []);
    }
  };

  const fetchPartners = async () => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setAdminPartners(data || []);
  };

  const fetchAllUsers = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*, partners(full_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (!error) setAllUsers(data || []);
  };

  const [globalStats, setGlobalStats] = useState({ 
    totalRevenue: 0, 
    totalOrders: 0, 
    activeUsers: 0, 
    activePartners: 0,
    totalPaid: 0,
    totalPending: 0
  });

  const fetchGlobalStats = async () => {
    try {
      const { data: ords } = await supabase.from('orders').select('total_amount');
      const { count: uCount } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active');
      const { count: pCount } = await supabase.from('partners').select('*', { count: 'exact', head: true });
      const { data: pays } = await supabase.from('payouts').select('amount, status');
      
      const revenue = (ords || []).reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
      const paid = (pays || []).filter(p => p.status === 'paid').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const pending = (pays || []).filter(p => p.status === 'pending').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

      setGlobalStats({
        totalRevenue: revenue || 0,
        totalOrders: ords?.length || 0,
        activeUsers: uCount || 0,
        activePartners: pCount || 0,
        totalPaid: paid || 0,
        totalPending: pending || 0
      });
    } catch (err) {
      console.error("Error fetching global stats:", err);
      setGlobalStats(prev => ({ ...prev })); // Maintain state on error
    }
  };

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*, partners(full_name), clients:user_id(shop_name)')
      .order('created_at', { ascending: false });

    if (!error) setTickets(data || []);
  };

  const fetchPartnerApps = async () => {
    const { data, error } = await supabase
      .from('partner_applications')
      .select('*')
      .eq('status', 'agreed')
      .order('agreed_at', { ascending: false });
    
    if (!error) setPartnerApps(data || []);
  };

  const handleLogout = async () => {
    if(window.confirm(t('confirmLogout') || 'Logout?')) {
      await supabase.auth.signOut().finally(() => {
        localStorage.clear();
        window.location.href = '/admin-login';
      });
    }
  };


  const fetchAiConfig = async () => {
    const { data, error } = await supabase.from('ai_configs').select('*');
    if (!error && data) {
      const configMap = {};
      data.forEach(item => {
        configMap[item.key] = item.value;
      });
      setAiConfig(configMap);
      setOriginalAiConfig(configMap);
    }
  };

  const fetchAiHistory = async () => {
    const { data, error } = await supabase
      .from('ai_configs_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error("Fetch AI History Error:", error);
    } else {
      console.log("AI History Loaded:", data?.length || 0, "records");
      setAiHistory(data || []);
    }
  };

  const fetchAiLogs = async () => {
    const { data, error } = await supabase
      .from('ai_usage_logs')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(10);
    if (!error) setAiLogs(data || []);
  };

  const handleSaveAiConfig = async () => {
    setIsLoading(true);
    console.log("Saving AI Config...");
    try {
      const updates = [
        { key: 'system_prompt', value: aiConfig.system_prompt || '' },
        { key: 'rag_knowledge_base', value: aiConfig.rag_knowledge_base || '' },
        { key: 'resend_api_key', value: aiConfig.resend_api_key || '' },
        { key: 'shopee_partner_id', value: aiConfig.shopee_partner_id || '' },
        { key: 'shopee_partner_key', value: aiConfig.shopee_partner_key || '' },
        { key: 'tiktok_app_id', value: aiConfig.tiktok_app_id || '' },
        { key: 'tiktok_app_secret', value: aiConfig.tiktok_app_secret || '' },
        { key: 'ai_api_key', value: aiConfig.deepseek_api_key || '' },
        { key: 'ai_total_topup', value: aiConfig.ai_total_topup || '0' }
      ];

      for (const item of updates) {
        const oldValue = originalAiConfig[item.key];
        
        // Only save to history if it's system_prompt or RAG and it has changed
        if ((item.key === 'system_prompt' || item.key === 'rag_knowledge_base') && oldValue !== item.value) {
          console.log(`Version change detected for ${item.key}. Saving history...`);
          const { error: histError } = await supabase.from('ai_configs_history').insert([{
            key: item.key,
            old_value: oldValue || '',
            new_value: item.value,
            changed_by: user?.id === 'admin-bypass' ? null : user?.id
          }]);
          if (histError) console.error("History Insert Error:", histError);
        }

        const { error } = await supabase.from('ai_configs').upsert({
          ...item,
          key: item.key === 'ai_api_key' ? 'deepseek_api_key' : item.key
        }, { onConflict: 'key' });
        if (error) throw error;
      }
      
      setOriginalAiConfig(aiConfig);
      await fetchAiHistory();
      alert(t('configUpdated'));
    } catch (err) {
      console.error("Save Config Error:", err);
      alert("Error saving config: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async (email, name, plan, cycle) => {
    // 🏮 SAFETY GUARD: Fungsi ini HANYA untuk pengiriman MANUAL (Resend Email).
    // Email otomatis sudah ditangani secara terpusat oleh Database Trigger: tr_send_welcome_email.
    // JANGAN panggil fungsi ini di dalam flow handleApprove otomatis untuk mencegah Double Email.
    console.log("ℹ️ Menjalankan fungsi email manual untuk:", email);

    // Gunakan dari Database jika ada, kalau tidak ada pakai .env
    const apiKey = aiConfig.resend_api_key || import.meta.env.VITE_RESEND_API_KEY;
    
    if (!apiKey || apiKey === 'your_resend_api_key_here' || apiKey === '') {
      console.warn("⚠️ Resend API Key belum diisi. Email tidak terkirim.");
      return;
    }

    // Peringatan Domain Resend Sandbox
    if (email.includes('mailinator') || email.includes('example')) {
      console.log("ℹ️ Mengirim ke email testing/mailinator via Resend Sandbox...");
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: 'Tokcer AI <onboarding@resend.dev>', // Catatan: Ganti ke admin@tokcer-ai.com jika domain sudah verified
          to: [email],
          subject: '🚀 Akun Tokcer AI Anda Telah Aktif!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://dashboardstaging.tokcer-ai.com/logo.png" alt="Tokcer AI" style="height: 40px;">
              </div>
              <h2 style="color: #f97316;">Selamat, ${name}!</h2>
              <p>Pendaftaran Anda untuk paket <b>${plan.toUpperCase()}</b> (${cycle || 'Monthly'}) telah disetujui.</p>
              <p>Sekarang Anda sudah bisa mengakses seluruh fitur Tokcer AI untuk melejitkan performa toko Anda.</p>
              <div style="background: #fdf2f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><b>Link Dashboard:</b> <a href="https://staging.tokcer-ai.com/login">staging.tokcer-ai.com/login</a></p>
                <p style="margin: 10px 0 0 0;"><b>Username:</b> ${email}</p>
                <p style="margin: 5px 0 0 0;"><b>Password:</b> Tokcer@2026</p>
              </div>
              <p style="font-size: 12px; color: #666;">Jika Anda lupa password, silakan gunakan fitur "Lupa Password" di halaman login.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="text-align: center; color: #999; font-size: 11px;">&copy; 2026 Tokcer AI - Solusi Cerdas E-Commerce</p>
            </div>
          `
        })
      });

      const result = await response.json();
      if (response.ok) {
        console.log("📧 Welcome email sent successfully to:", email, "ID:", result.id);
      } else {
        console.error("❌ Resend API Error:", result);
        // Jika error 403, biasanya karena domain belum verified atau kirim ke email yang tidak terdaftar di sandbox
      }
    } catch (err) {
      console.error("❌ Network error while sending email:", err);
    }
  };

  const handleApproveWithAccount = async () => {
    if (!selectedPartnerApp) return;

    setIsLoading(true);
    try {
      // 🏮 CENTRALIZED PARTNER ACTIVATION (Blueprint Section 4.A.3)
      // All logic (Auth, Profile, Partner Record, Strategy Sync, and Emails) is now handled by this single RPC.
      const { data, error: rpcError } = await supabase.rpc('rpc_activate_account', {
        p_email: selectedPartnerApp.email,
        p_application_id: selectedPartnerApp.id,
        p_full_name: selectedPartnerApp.nama || selectedPartnerApp.shop_name,
        p_plan: 'ultimate',
        p_role: 'partner'
      });

      if (rpcError) throw rpcError;

      alert(`Sukses! Partner ${selectedPartnerApp.nama} aktif dan data partner terbuat di database.`);
      setShowApproveModal(false);
      setSelectedPartnerApp(null);
      await fetchPartnerApps();
      await fetchClients();
    } catch (err) {
      console.error("Activation Error:", err);
      alert("Gagal Aktivasi: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (client) => {
    if (!client) return;
    
    const needsProof = client.plan !== 'starter';
    if (needsProof && !client.payment_proof_url && client.ref === 'Direct Web') {
      alert("Peringatan: User ini belum melampirkan bukti bayar!");
      return;
    }

    if (!window.confirm(`Setujui pendaftaran ${client.shop_name} dengan paket ${client.plan?.toUpperCase()}?`)) return;

    setIsLoading(true);
    try {
      // 🏮 CENTRALIZED ACTIVATION (Blueprint Section 4.A.3)
      // All logic (Auth, Profile, Partner Omzet, Tiers, and Emails) is now handled by this single RPC.
      const { data, error: rpcError } = await supabase.rpc('rpc_activate_account', {
        p_email: client.email,
        p_application_id: client.id,
        p_full_name: client.shop_name,
        p_plan: client.plan || 'starter'
      });

      if (rpcError) throw rpcError;

      alert(data.message || "User berhasil diaktifkan!");
      await fetchClients();
      setShowModal(false);
    } catch (err) {
      console.error("Client Activation Error:", err);
      alert("Gagal mengaktifkan client: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleRemindPartner = async (client) => {
    if (!client || !client.partners?.email) {
      alert("Partner email not found!");
      return;
    }

    const confirm = window.confirm(`Send follow-up reminder to ${client.partners?.full_name}?`);
    if (!confirm) return;

    setIsLoading(true);
    try {
      const apiKey = aiConfig.resend_api_key || import.meta.env.VITE_RESEND_API_KEY;
      if (apiKey && apiKey !== 'your_resend_api_key_here') {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            from: 'Tokcer AI <onboarding@resend.dev>',
            to: [client.partners.email],
            subject: 'Notifikasi Partner Tokcer AI',
            html: `<p>Halo ${client.partners.full_name},</p><p>Terdapat klien baru Anda yang perlu di follow-up.</p>`
          })
        });
      }

      alert(`Reminder sent to ${client.partners?.full_name}`);
      
      if (user?.id) {
        await supabase.from('ai_usage_logs').insert([{
            user_id: user.id,
            feature: 'admin_remind_partner',
            prompt: `Remind ${client.partners?.full_name}`,
            response: 'SUCCESS'
        }]);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (item) => {
    if (!item) return;
    if (!window.confirm(`Yakin ingin MENOLAK ${item.shop_name || item.name || item.nama}?`)) return;

    setIsLoading(true);
    try {
      if (activeAppTab === 'new-partner') {
        const { error } = await supabase.from('partner_applications').update({ status: 'rejected' }).eq('id', item.id);
        if (error) throw error;
        await fetchPartnerApps();
      } else {
        const { error } = await supabase.from('clients').update({ status: 'rejected' }).eq('id', item.id);
        if (error) throw error;
        await fetchClients();
      }
      alert('Pendaftaran berhasil ditolak.');
    } catch (err) {
      console.error("Reject Error:", err);
      alert('Gagal menolak pendaftaran: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
        
        const targetUser = authUser || (isAdmin ? { email: 'admin@tokcer-ai.com', id: 'admin-bypass' } : null);
        setUser(targetUser);
        
        // Fetch sequentially to prevent total failure if one fails
        await fetchClients();
        await fetchPartners();
        await fetchAllUsers();
        await fetchAiConfig();
        await fetchAiHistory();
        await fetchAiLogs();
        await fetchPartnerApps();
        await fetchTickets();
        await fetchGlobalStats();
      } catch (err) {
        console.error("Dashboard Init Error:", err);
      }
    };
    initData();
  }, []);


  const recentActivities = useMemo(() => {
    const activities = [];
    adminClients.slice(0, 5).forEach(c => {
      activities.push({
        type: 'user',
        user: c.shop_name || 'New Shop',
        action: 'New Registration',
        time: c.created_at,
        status: c.plan || 'Starter'
      });
    });
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
  }, [adminClients]);

  const getTierBadgeClass = (tier) => {
    switch(tier?.toLowerCase()) {
      case 'platinum': return 'bg-blue-900/30 text-blue-400 border border-blue-500/20';
      case 'gold': return 'bg-amber-900/30 text-amber-400 border border-amber-500/20';
      case 'silver': return 'bg-zinc-700 text-zinc-300 border border-zinc-600';
      case 'bronze': return 'bg-orange-900/30 text-orange-400 border border-orange-500/20';
      case 'ultimate': return 'bg-orange-500/20 text-orange-500 border border-orange-500/30';
      case 'elite': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'pro': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      default: return 'bg-zinc-800 text-zinc-500';
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection t={t} revenuePeriod={revenuePeriod} setRevenuePeriod={setRevenuePeriod} chartRef={chartRef} RECENT_ACTIVITY={recentActivities} adminClients={adminClients} adminPartners={adminPartners} globalStats={globalStats} />;
      case 'approvals':
        return <ApprovalSection t={t} activeAppTab={activeAppTab} setActiveAppTab={setActiveAppTab} adminClients={adminClients} partnerApps={partnerApps} MOCK_USERS={[]} getTierBadgeClass={getTierBadgeClass} setSelectedPartnerApp={setSelectedPartnerApp} setShowApproveModal={setShowApproveModal} handleApprove={handleApprove} handleReject={handleReject} handleRemindPartner={handleRemindPartner} />;
      case 'users':
        return <UserSection t={t} adminClients={adminClients} allUsers={allUsers} getTierBadgeClass={getTierBadgeClass} setShowUserStats={setShowUserStats} />;
      case 'partners':
        return <PartnerSection t={t} adminPartners={adminPartners} getTierBadgeClass={getTierBadgeClass} />;
      case 'payouts':
        return <PayoutSection t={t} />;
      case 'tickets':
        return <TicketSection t={t} tickets={tickets} selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} fetchTickets={fetchTickets} />;
      case 'ai-gen':
        return <AiStrategySection t={t} aiConfig={aiConfig} setAiConfig={setAiConfig} handleSaveAiConfig={handleSaveAiConfig} aiHistory={aiHistory} fetchAiHistory={fetchAiHistory} aiLogs={aiLogs} />;
      case 'insight':
        return <BusinessInsightSection t={t} />;
      case 'supabase':
        return <SupabaseSection t={t} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-['Inter',sans-serif] overflow-hidden animate-in fade-in duration-700">
      <InternalSidebar t={t} activeSection={activeSection} setActiveSection={setActiveSection} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} lang={lang} toggleLang={toggleLang} handleLogout={handleLogout} adminClients={adminClients} partnerApps={partnerApps} tickets={tickets} />
      
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
