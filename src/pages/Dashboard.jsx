import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../hooks/useTranslation';

// Import Modular Components
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import DashboardRevenue from '../components/dashboard/DashboardRevenue';
import DashboardInventory from '../components/dashboard/DashboardInventory';
import DashboardAnalytics from '../components/dashboard/DashboardAnalytics';
import DashboardAI from '../components/dashboard/DashboardAI';
import DashboardHealth from '../components/dashboard/DashboardHealth';
import DashboardSupport from '../components/dashboard/DashboardSupport';
import DashboardOnboarding from '../components/dashboard/DashboardOnboarding';
import StoreIntegrator from '../components/dashboard/StoreIntegrator';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, lang, setLang } = useTranslation();
  
  // -- UI States --
  const [activeMenu, setActiveMenu] = useState('tab-dash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Bulan Ini');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [analyticsPlatform, setAnalyticsPlatform] = useState('all');
  const [showAnalyticsPlatformDropdown, setShowAnalyticsPlatformDropdown] = useState(false);
  const [healthPlatform, setHealthPlatform] = useState('all');

  // -- Data States --
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // -- AI Generator States --
  const [aiInput, setAiInput] = useState('');
  const [aiFormat, setAiFormat] = useState('TikTok Video');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiResult, setAiResult] = useState('');

  // -- Trend Analysis States --
  const [trendCustomInput, setTrendCustomInput] = useState('');
  const [trendCustomResult, setTrendCustomResult] = useState(null);
  const [isSearchingTrend, setIsSearchingTrend] = useState(false);
  const [trendSampleKey, setTrendSampleKey] = useState(null);

  // -- Integration States --
  const [hasConnectedStore, setHasConnectedStore] = useState(false);
  const [showIntegrator, setShowIntegrator] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: prof, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(prof);
      
      // Check for connected stores (placeholder logic)
      const { data: stores } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', session.user.id);
      
      if (stores && stores.length > 0) {
        setHasConnectedStore(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // AI Generation Logic (Phase 3)
  const handleGenerateAI = async () => {
    if (!aiInput.trim()) return;
    
    // Check tokens
    if ((profile?.tokens || 0) <= 0) {
      alert('Maaf, kuota AI Anda sudah habis. Silakan hubungi admin untuk top-up.');
      return;
    }

    setIsGeneratingAI(true);
    setAiResult('');

    try {
      // 1. Fetch AI Config (System Prompt & RAG)
      const { data: config } = await supabase
        .from('ai_configs')
        .select('*')
        .eq('type', 'generator')
        .single();

      const systemPrompt = config?.system_prompt || "You are a professional social media copywriter for Tokcer AI.";
      const ragKnowledge = config?.rag_knowledge_base || "";

      // 2. Call DeepSeek API
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) throw new Error("DeepSeek API Key is missing");

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: `${systemPrompt}\n\nKNOWLEDGE BASE:\n${ragKnowledge}` },
            { role: "user", content: `Buatkan copywriting untuk format ${aiFormat} dengan deskripsi produk: ${aiInput}` }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      setAiResult(content);

      // 3. Deduct Token
      const { error: tokenErr } = await supabase
        .from('profiles')
        .update({ tokens: (profile.tokens - 1) })
        .eq('id', profile.id);

      if (!tokenErr) {
        setProfile({ ...profile, tokens: profile.tokens - 1 });
      }

      // 4. Log Usage
      await supabase.from('ai_usage_logs').insert({
        user_id: profile.id,
        prompt: aiInput,
        format: aiFormat,
        result: content,
        tokens_used: 1
      });

    } catch (error) {
      console.error('AI Generation Error:', error);
      setAiResult("Maaf, terjadi kesalahan saat menghubungi AI. Pastikan API Key sudah terpasang.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAnalyzeTrend = () => {
    if (!trendCustomInput.trim()) return;
    setIsSearchingTrend(true);
    setTrendSampleKey(null);
    setTimeout(() => {
      setTrendCustomResult(trendCustomInput.trim());
      setIsSearchingTrend(false);
    }, 1200);
  };

  const wrapContent = (content) => {
    if (showIntegrator) {
      return <StoreIntegrator t={t} onBack={() => setShowIntegrator(false)} />;
    }

    return (
      <div className="space-y-6">
        {!hasConnectedStore && <DashboardOnboarding onConnect={() => setShowIntegrator(true)} />}
        {content}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'tab-dash': 
        return wrapContent(
          <DashboardOverview 
            t={t}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            showFilterDropdown={showFilterDropdown}
            setShowFilterDropdown={setShowFilterDropdown}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            showPlatformDropdown={showPlatformDropdown}
            setShowPlatformDropdown={setShowPlatformDropdown}
          />
        );
      case 'tab-omzet':
        return wrapContent(<DashboardRevenue t={t} />);
      case 'tab-inventory':
        return wrapContent(<DashboardInventory t={t} />);
      case 'tab-analytics':
        return wrapContent(
          <DashboardAnalytics 
            t={t}
            analyticsPlatform={analyticsPlatform}
            setAnalyticsPlatform={setAnalyticsPlatform}
            showAnalyticsPlatformDropdown={showAnalyticsPlatformDropdown}
            setShowAnalyticsPlatformDropdown={setShowAnalyticsPlatformDropdown}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            showFilterDropdown={showFilterDropdown}
            setShowFilterDropdown={setShowFilterDropdown}
          />
        );
      case 'tab-ai':
        return wrapContent(
          <DashboardAI 
            t={t}
            lang={lang}
            aiInput={aiInput}
            setAiInput={setAiInput}
            aiFormat={aiFormat}
            setAiFormat={setAiFormat}
            isGeneratingAI={isGeneratingAI}
            aiResult={aiResult}
            handleGenerateAI={handleGenerateAI}
            trendCustomInput={trendCustomInput}
            setTrendCustomInput={setTrendCustomInput}
            isSearchingTrend={isSearchingTrend}
            trendSampleKey={trendSampleKey}
            setTrendSampleKey={setTrendSampleKey}
            setTrendCustomResult={setTrendCustomResult}
            trendCustomResult={trendCustomResult}
            handleAnalyzeTrend={handleAnalyzeTrend}
          />
        );
      case 'tab-health':
        return wrapContent(
          <DashboardHealth 
            t={t}
            lang={lang}
            healthPlatform={healthPlatform}
            setHealthPlatform={setHealthPlatform}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            showFilterDropdown={showFilterDropdown}
            setShowFilterDropdown={setShowFilterDropdown}
          />
        );
      case 'tab-support':
        return wrapContent(<DashboardSupport t={t} />);
      default:
        return <div className="text-zinc-500 italic">Menu {activeMenu} is under construction.</div>;
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <iconify-icon icon="solar:bolt-bold-duotone" className="text-orange-500 text-6xl animate-pulse"></iconify-icon>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-['Inter',sans-serif] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar Mobile Toggle */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
             <iconify-icon icon="solar:bolt-bold-duotone" className="text-white text-xl"></iconify-icon>
          </div>
          <span className="font-bold italic uppercase tracking-tighter">Tokcer<span className="text-orange-500">AI</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="text-zinc-400 hover:text-white">
          <iconify-icon icon="solar:hamburger-menu-linear" className="text-2xl"></iconify-icon>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-[100] md:relative md:z-0 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:block'}`}>
        <div className="absolute inset-0 bg-black/60 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        <DashboardSidebar 
          t={t}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          setIsSidebarOpen={setIsSidebarOpen}
          lang={lang}
          setLang={setLang}
          profile={profile}
          handleLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 relative h-screen overflow-y-auto custom-scrollbar bg-zinc-950">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="p-4 md:p-10 max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
