import React, { useState, useEffect } from 'react';
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

const PartnerDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('tab-onboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
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
  const [supportForm, setSupportForm] = useState({
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [countdown, setCountdown] = useState('');

  const navigate = useNavigate();

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
      const { data: partner } = await supabase.from('partners').select('*').eq('id', currentUser.id).single();
      if (partner) {
        setPartnerData(partner);
        setProfileForm({
          fullName: partner.full_name || '',
          whatsapp: partner.whatsapp || '',
          bankName: partner.bank_name || '',
          bankAccount: partner.bank_account || ''
        });
      }

      const { data: subs } = await supabase.from('clients').select('*').eq('partner_id', currentUser.id).order('created_at', { ascending: false });
      setSubscribers(subs || []);

      const { data: leaders } = await supabase.from('partners').select('full_name, total_omzet').order('total_omzet', { ascending: false }).limit(10);
      setLeaderboardData(leaders || []);
    } catch (err) {
      console.error("Fetch Data Error:", err);
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

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("🚀 Attempting Onboard Submit...");
    try {
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
      console.log("👤 Auth User Check:", authUser, authErr);
      
      const targetUser = authUser || user;

      if (!targetUser || !targetUser.id) {
        throw new Error("Identitas Anda tidak terdeteksi. Mohon Logout lalu Login kembali untuk menyegarkan sesi.");
      }

      if (!onboardForm.paymentProof) throw new Error("Harap upload bukti pembayaran.");

      const file = onboardForm.paymentProof;
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `payment-proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('payments').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('payments').getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('clients').insert([{
        partner_id: targetUser.id,
        shop_name: onboardForm.shopName,
        email: onboardForm.email,
        whatsapp: onboardForm.whatsapp,
        plan: onboardForm.package,
        payment_method: onboardForm.paymentMethod,
        payment_proof_url: publicUrl,
        status: 'pending'
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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const targetUser = authUser || user;
      
      if (!targetUser || !targetUser.id) {
        throw new Error("Identitas Anda tidak terdeteksi. Mohon Logout lalu Login kembali.");
      }

      const { error } = await supabase.from('partners').update({
        full_name: profileForm.fullName,
        whatsapp: profileForm.whatsapp,
        bank_name: profileForm.bankName,
        bank_account: profileForm.bankAccount
      }).eq('id', targetUser.id);
      if (error) throw error;
      alert("Profil diperbarui!");
      fetchData(targetUser);
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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const targetUser = authUser || user;

      if (!targetUser || !targetUser.id) {
        throw new Error("Identitas Anda tidak terdeteksi. Mohon Logout lalu Login kembali.");
      }

      const { error } = await supabase.from('support_tickets').insert([{
        user_id: targetUser.id,
        type: 'bug',
        description: supportForm.description,
        status: 'open'
      }]);
      if (error) throw error;
      alert("Laporan terkirim! Tim kami akan segera menindaklanjuti.");
      setSupportForm({ description: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'tab-onboard': return <OnboardTab form={onboardForm} setForm={setOnboardForm} onSubmit={handleOnboardSubmit} isSubmitting={isSubmitting} />;
      case 'tab-subs': return <SubscribersTab subscribers={subscribers} />;
      case 'tab-leaderboard': return <LeaderboardTab data={leaderboardData} countdown={countdown} />;
      case 'tab-payment': return <PaymentTab partnerData={partnerData} />;
      case 'tab-support': return <SupportTab form={supportForm} setForm={setSupportForm} onSubmit={handleSupportSubmit} isSubmitting={isSubmitting} />;
      case 'tab-profile': return <ProfileTab form={profileForm} setForm={setProfileForm} onSubmit={handleUpdateProfile} isSubmitting={isSubmitting} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-['Inter']">
      <PartnerSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <PartnerHeader partnerData={partnerData} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;
