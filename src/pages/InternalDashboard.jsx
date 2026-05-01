import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { supabase } from '../supabase.js';

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

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, shop_name, email, status, plan, tier, pic, ref, billing_cycle, payment_method, payment_proof_url, created_at, partners(full_name)')
      .order('created_at', { ascending: false });
    if (!error) setAdminClients(data || []);
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
    try {
      const updates = [
        { key: 'system_prompt', value: aiConfig.system_prompt || '' },
        { key: 'rag_knowledge_base', value: aiConfig.rag_knowledge_base || '' },
        { key: 'resend_api_key', value: aiConfig.resend_api_key || '' },
        { key: 'shopee_partner_id', value: aiConfig.shopee_partner_id || '' },
        { key: 'shopee_partner_key', value: aiConfig.shopee_partner_key || '' },
        { key: 'tiktok_app_id', value: aiConfig.tiktok_app_id || '' },
        { key: 'tiktok_app_secret', value: aiConfig.tiktok_app_secret || '' }
      ];

      for (const item of updates) {
        const { error } = await supabase.from('ai_configs').upsert(item, { onConflict: 'key' });
        if (error) throw error;
      }
      alert(t('configUpdated'));
    } catch (err) {
      alert("Error saving config: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async (email, name, plan, cycle) => {
    // Gunakan dari Database jika ada, kalau tidak ada pakai .env
    const apiKey = aiConfig.resend_api_key || import.meta.env.VITE_RESEND_API_KEY;
    
    if (!apiKey || apiKey === 'your_resend_api_key_here' || apiKey === '') {
      console.warn("⚠️ Resend API Key belum diisi. Email tidak terkirim.");
      return;
    }

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: 'Tokcer AI <onboarding@resend.dev>',
          to: [email],
          subject: '🚀 Akun Tokcer AI Anda Telah Aktif!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #f97316;">Selamat, ${name}!</h2>
              <p>Pendaftaran Anda untuk paket <b>${plan.toUpperCase()}</b> (${cycle || 'Monthly'}) telah disetujui.</p>
              <p>Sekarang Anda sudah bisa mengakses seluruh fitur Tokcer AI untuk melejitkan performa toko Anda.</p>
              <div style="background: #fdf2f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><b>Link Dashboard:</b> <a href="https://tokcer-ai.com/login">tokcer-ai.com/login</a></p>
                <p style="margin: 10px 0 0 0;"><b>Username:</b> ${email}</p>
                <p style="margin: 5px 0 0 0;"><b>Password:</b> (Gunakan password saat registrasi)</p>
              </div>
              <p style="font-size: 12px; color: #666;">Jika Anda lupa password, silakan gunakan fitur "Lupa Password" di halaman login.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="text-align: center; color: #999; font-size: 11px;">&copy; 2026 Tokcer AI - Solusi Cerdas E-Commerce</p>
            </div>
          `
        })
      });
      console.log("📧 Welcome email sent to:", email);
    } catch (err) {
      console.error("❌ Failed to send email:", err);
    }
  };

  const handleApproveWithAccount = async () => {
    if (!selectedPartnerApp) return;

    setIsLoading(true);
    try {
      // KHUSUS PARTNER: Selalu Ultimate
      const { data, error: rpcError } = await supabase.rpc('rpc_activate_account', {
        p_email: selectedPartnerApp.email,
        p_application_id: selectedPartnerApp.id,
        p_full_name: selectedPartnerApp.nama || selectedPartnerApp.shop_name,
        p_plan: 'ultimate'
      });

      if (rpcError) throw rpcError;

      // KIRIM EMAIL OTOMATIS
      await sendWelcomeEmail(selectedPartnerApp.email, selectedPartnerApp.nama || selectedPartnerApp.shop_name, 'ultimate', 'Yearly');

      alert(`Sukses! Partner ${selectedPartnerApp.nama} aktif sebagai ULTIMATE.`);
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
      // KHUSUS USER/CLIENT: Sesuai tier yang dipilih
      const { data, error: rpcError } = await supabase.rpc('rpc_activate_account', {
        p_email: client.email,
        p_application_id: client.id,
        p_full_name: client.shop_name,
        p_plan: client.plan || 'starter'
      });

      if (rpcError) throw rpcError;

      // UPDATE SALDO PARTNER OTOMATIS
      if (client.plan && client.plan !== 'starter') {
        const prices = { pro: 499000, elite: 1499000, ultimate: 2000000 };
        let planPrice = prices[client.plan.toLowerCase()] || 0;
        if (client.billing_cycle === 'Yearly') planPrice = planPrice * 11;
        
        // Komisi misal 20%
        const commission = planPrice * 0.20;

        // Cari partner berdasarkan partner_id atau ref
        let targetPartnerId = client.partner_id;
        if (!targetPartnerId && client.ref && client.ref !== 'Direct Web') {
          const { data: refPartner } = await supabase.from('partners').select('id').eq('ref_code', client.ref).maybeSingle();
          if (refPartner) targetPartnerId = refPartner.id;
        }

        if (targetPartnerId) {
          // Kita gunakan RPC rpc_add_partner_commission jika ada, atau update langsung
          // Jika update langsung (bisa ada race condition, tapi untuk MVP cukup)
          const { data: partnerData } = await supabase.from('partners').select('total_omzet').eq('id', targetPartnerId).maybeSingle();
          if (partnerData) {
            const currentOmzet = partnerData.total_omzet || 0;
            await supabase.from('partners').update({ total_omzet: currentOmzet + commission }).eq('id', targetPartnerId);
          }
        }
      }

      // KIRIM EMAIL OTOMATIS
      await sendWelcomeEmail(client.email, client.shop_name, client.plan || 'starter', client.billing_cycle || 'Monthly');

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
        return <AiStrategySection t={t} aiConfig={aiConfig} setAiConfig={setAiConfig} handleSaveAiConfig={handleSaveAiConfig} isLoading={isLoading} aiLogs={aiLogs} />;
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
