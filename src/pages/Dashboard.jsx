import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { callAiEngine } from '../utils/ai.js';
import ProductModal from '../components/modals/ProductModal.jsx';
import logo from '../assets/logo.png';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import Header from '../components/dashboard/Header.jsx';
import OverviewTab from '../components/dashboard/tabs/OverviewTab.jsx';
import RevenueTab from '../components/dashboard/tabs/RevenueTab.jsx';
import InventoryTab from '../components/dashboard/tabs/InventoryTab.jsx';
import AnalyticsTab from '../components/dashboard/tabs/AnalyticsTab.jsx';
import AiGeneratorTab from '../components/dashboard/tabs/AiGeneratorTab.jsx';
import HealthScoreTab from '../components/dashboard/tabs/HealthScoreTab.jsx';
import AccountTab from '../components/dashboard/tabs/AccountTab.jsx';
import BillingTab from '../components/dashboard/tabs/BillingTab.jsx';
import SupportTab from '../components/dashboard/tabs/SupportTab.jsx';
import MarketIntelTab from '../components/dashboard/tabs/MarketIntelTab.jsx';
import MarketplaceSyncTab from '../components/dashboard/tabs/MarketplaceSyncTab.jsx';
import AdminTab from '../components/dashboard/tabs/AdminTab.jsx';
import { dashboardTranslations } from '../locales/dashboardLocales.js';
import { getShopeeAuthUrl } from '../utils/shopee.js';
import { getTikTokAuthUrl } from '../utils/tiktok.js';


const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('tab-dash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('tokcer_lang') || 'id');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [aiSubTab, setAiSubTab] = useState('content');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiFormat, setAiFormat] = useState('TikTok Video');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [trendPrompt, setTrendPrompt] = useState('');
  const [isTrendAnalyzing, setIsTrendAnalyzing] = useState(false);
  const [trendResult, setTrendResult] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Hari Ini');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [omzetTimeFilter, setOmzetTimeFilter] = useState('all');
  const [showOmzetTimeDropdown, setShowOmzetTimeDropdown] = useState(false);
  const [healthPlatform, setHealthPlatform] = useState('all');
  const [trendSampleKey, setTrendSampleKey] = useState(null);
  const [trendCustomInput, setTrendCustomInput] = useState('');
  const [trendCustomResult, setTrendCustomResult] = useState(null);
  const [isSearchingTrend, setIsSearchingTrend] = useState(false);
  const [analyticsPlatform, setAnalyticsPlatform] = useState('all');
  const [showAnalyticsPlatformDropdown, setShowAnalyticsPlatformDropdown] = useState(false);

  // Support Center States
  const [supportType, setSupportType] = useState('bug'); // 'bug' or 'feature'
  const [supportTitle, setSupportTitle] = useState('');
  const [supportDesc, setSupportDesc] = useState('');
  const [supportFile, setSupportFile] = useState(null);
  const [supportFilePreview, setSupportFilePreview] = useState(null);
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  
  // Account Security States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [securityMessage, setSecurityMessage] = useState({ type: '', text: '' });

  // Market Intel Dynamic States
  const [viralTopics, setViralTopics] = useState([]);
  const [liveSummary, setLiveSummary] = useState(null);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);

  // Operational States (Inventory & Orders)
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isFetchingOperational, setIsFetchingOperational] = useState(false);

  // Analytics Insight States
  const [analyticsInsight, setAnalyticsInsight] = useState(null);
  const [isAnalyzingAnalytics, setIsAnalyzingAnalytics] = useState(false);

  // Health Insight States
  const [healthInsight, setHealthInsight] = useState(null);
  const [isAnalyzingHealth, setIsAnalyzingHealth] = useState(false);
  const [marketplaceConnections, setMarketplaceConnections] = useState([]);

  // System Briefing States
  const [systemBriefing, setSystemBriefing] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [isFetchingBriefing, setIsFetchingBriefing] = useState(false);

  const t = (key) => dashboardTranslations[lang][key] || key;
  const navigate = useNavigate();

    const checkStoreLimit = async () => {
        if (!user) return false;
        const plan = (profile?.subscription_plan || 'starter').toLowerCase();
        const limits = { 'starter': 1, 'pro': 3, 'elite': 10, 'ultimate': 30 };
        const limit = limits[plan] || 1;

        const { count, error } = await supabase
            .from('marketplace_connections')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (error) {
            console.error("Store count error:", error);
            return false;
        }

        if (count >= limit && plan !== 'ultimate') {
            alert(`⚠️ Batas maksimal toko untuk paket ${plan.toUpperCase()} adalah ${limit} toko. Silakan upgrade paket Anda untuk menambah lebih banyak!`);
            return false;
        }
        return true;
    };

    const autoConnectStores = async (userId, platforms, links) => {
        try {
            const { data: existing } = await supabase
                .from('marketplace_connections')
                .select('id')
                .eq('user_id', userId);
            
            if (existing && existing.length > 0) return;

            const plan = (profile?.subscription_plan || 'starter').toLowerCase();
            const limits = { 'starter': 1, 'pro': 3, 'elite': 10, 'ultimate': 30 };
            const limit = limits[plan] || 1;

            // Only take stores up to limit
            const allowedPlatforms = platforms.slice(0, limit);

            const connections = allowedPlatforms.map(plat => ({
                user_id: userId,
                platform: plat.toLowerCase(),
                shop_name: plat + " Store",
                shop_id: links[plat] || 'pending',
                sync_status: 'idle'
            }));

            if (connections.length > 0) {
                await supabase.from('marketplace_connections').insert(connections);
            }
        } catch (err) {
            console.error("AutoConnect Error:", err);
        }
    };

    const handleConnectShopee = async () => {
        const canAdd = await checkStoreLimit();
        if (!canAdd) return;
        try {
            // 1. Fetch Shopee Config from Supabase
            const { data: configs } = await supabase
                .from('ai_configs')
                .select('*')
                .in('key', ['shopee_partner_id', 'shopee_partner_key']);
            
            const configMap = {};
            configs?.forEach(c => configMap[c.key] = c.value);

            if (!configMap.shopee_partner_id || !configMap.shopee_partner_key) {
                alert("⚠️ Konfigurasi API Shopee belum lengkap di Dashboard Internal. Hubungi Admin.");
                return;
            }

            // 2. Build Redirect URL (Current Page)
            const redirectUrl = window.location.origin + window.location.pathname;
            
            // 3. Get Shopee Auth Link
            const authUrl = await getShopeeAuthUrl(
                configMap.shopee_partner_id, 
                configMap.shopee_partner_key, 
                redirectUrl
            );

            // 4. Redirect
            window.location.href = authUrl;
        } catch (err) {
            console.error("Shopee Auth Error:", err);
            alert("Gagal menghubungi server Shopee: " + err.message);
        }
    };

    const handleConnectTikTok = async () => {
        try {
            // 1. Cek Limit (Skip untuk Admin)
            if (user?.email !== 'admin@tokcer-ai.com') {
                const canAdd = await checkStoreLimit();
                if (!canAdd) {
                    alert(`Batas toko untuk paket ${profile?.subscription_plan || 'Starter'} telah tercapai.`);
                    return;
                }
            }

            // 2. Ambil Config TikTok dari Database
            const { data: configs, error: configError } = await supabase
                .from('ai_configs')
                .select('key, value')
                .in('key', ['tiktok_app_id', 'tiktok_service_id']);

            if (configError) {
                console.warn("DB Config Error, using fallback...");
            }

            let appId = import.meta.env.VITE_TIKTOK_APP_ID;
            let serviceId = null;

            if (configs) {
                const appConfig = configs.find(c => c.key === 'tiktok_app_id');
                const serviceConfig = configs.find(c => c.key === 'tiktok_service_id');
                if (appConfig) appId = appConfig.value;
                if (serviceConfig) serviceId = serviceConfig.value;
            }
            
            // TikTok Oauth memerlukan Service ID, bukan App Key. 
            // Jika Service ID tidak ada, kita fallback menggunakan App Key dengan asumsi struktur URL beda
            const finalIdForAuth = serviceId || appId;

            if (!finalIdForAuth) {
                alert("⚠️ App ID atau Service ID TikTok belum dikonfigurasi. Mohon isi di menu Admin.");
                return;
            }

            // 3. Redirect (Bypass ke Mock Page kalau ID-nya mock/placeholder atau ID fallback staging)
            if (finalIdForAuth.includes('mock') || finalIdForAuth.includes('6db7a') || finalIdForAuth.includes('6js3f')) {
                navigate('/tiktok-auth-mock');
            } else {
                window.location.href = getTikTokAuthUrl(finalIdForAuth);
            }
        } catch (err) {
            console.error("TikTok Auth Error:", err);
            // Jika database error, gunakan fallback dari .env agar tidak mati total
            const fallbackId = import.meta.env.VITE_TIKTOK_APP_ID;
            if (fallbackId) {
                window.location.href = getTikTokAuthUrl(fallbackId);
            } else {
                alert("Gagal menghubungi server: " + err.message);
            }
        }
    };

    const fetchMarketplaceConnections = async (userId) => {
        if (!userId) return;
        const { data, error } = await supabase
            .from('marketplace_connections')
            .select('*')
            .eq('user_id', userId);
        if (!error && data) {
            setMarketplaceConnections(data);
        }
    };

    const fetchOperationalData = async (userId, currentUser) => {
        if (!userId) return;
        setIsFetchingOperational(true);
        try {
            let prodQuery = supabase.from('products').select('*').order('created_at', { ascending: false });
            let ordQuery = supabase.from('orders').select('*').order('order_date', { ascending: false });

            const isAdmin = userId === 'admin-bypass' || currentUser?.email === 'admin@tokcer-ai.com';

            if (!isAdmin) {
                prodQuery = prodQuery.eq('user_id', userId);
                ordQuery = ordQuery.eq('user_id', userId);
            }

            const { data: prodData, error: prodError } = await prodQuery;
            if (prodError) {
                console.error("Products Table Error:", prodError.message);
                setProducts([]);
            } else if (prodData) {
                setProducts(prodData);
            }

            const { data: ordData, error: ordError } = await ordQuery;
            if (ordError) {
                console.error("Orders Table Error:", ordError.message);
                setOrders([]);
            } else if (ordData) {
                setOrders(ordData);
            }
            return { products: prodData, orders: ordData };
        } catch (err) {
            console.error("Fetch Operational Error:", err);
            return { products: [], orders: [] };
        } finally {
            setIsFetchingOperational(false);
        }
    };

    const handleImportOrders = async (data) => {
        if (!user || data.length === 0) return;
        setIsFetchingOperational(true);
        try {
            // Helper to find value regardless of header case/spaces
            const getValue = (obj, possibleKeys) => {
                const keys = Object.keys(obj);
                for (const pk of possibleKeys) {
                    const foundKey = keys.find(k => k.toLowerCase().replace(/[\s_]/g, '') === pk.toLowerCase().replace(/[\s_]/g, ''));
                    if (foundKey) return obj[foundKey];
                }
                return null;
            };

            const formattedData = data.map(item => ({
                user_id: user.id === 'admin-bypass' ? null : user.id,
                order_number: getValue(item, ['order_number', 'orderno', 'idpesanan', 'no_pesanan']),
                customer_name: getValue(item, ['customer_name', 'customer', 'namapelanggan']),
                platform: getValue(item, ['platform', 'marketplace', 'sumber']),
                total_amount: Number(getValue(item, ['total_amount', 'total', 'nominal', 'harga']) || 0),
                status: getValue(item, ['status', 'order_status']) || 'completed',
                order_date: getValue(item, ['order_date', 'tanggal', 'date']) || new Date().toISOString()
            }));

            const { error } = await supabase.from('orders').insert(formattedData);
            if (error) throw error;
            
            alert(`✅ Berhasil mengimpor ${data.length} transaksi!`);
            fetchOperationalData(user.id);
        } catch (err) {
            console.error("Import Error:", err);
            alert(`❌ Gagal impor: ${err.message || "Pastikan format CSV sesuai template"}`);
        } finally {
            setIsFetchingOperational(false);
        }
    };

    const handleImportProducts = async (data) => {
        if (!user || data.length === 0) return;
        setIsFetchingOperational(true);
        try {
            const getValue = (obj, possibleKeys) => {
                const keys = Object.keys(obj);
                for (const pk of possibleKeys) {
                    const foundKey = keys.find(k => k.toLowerCase().replace(/[\s_]/g, '') === pk.toLowerCase().replace(/[\s_]/g, ''));
                    if (foundKey) return obj[foundKey];
                }
                return null;
            };

            const formattedData = data.map(item => ({
                user_id: user.id === 'admin-bypass' ? null : user.id,
                name: getValue(item, ['name', 'product_name', 'namaproduk']),
                sku: getValue(item, ['sku', 'kodeproduk']),
                stock: Number(getValue(item, ['stock', 'stok', 'jumlah']) || 0),
                price: Number(getValue(item, ['price', 'harga', 'hargajual']) || 0),
                cost: Number(getValue(item, ['cost', 'modal', 'hargabeli']) || 0),
                description: getValue(item, ['description', 'deskripsi']) || ''
            }));

            const { error } = await supabase.from('products').insert(formattedData);
            if (error) throw error;
            
            alert(`✅ Berhasil mengimpor ${data.length} produk ke katalog!`);
            fetchOperationalData(user.id);
        } catch (err) {
            console.error("Import Error:", err);
            alert(`❌ Gagal impor produk: ${err.message}`);
        } finally {
            setIsFetchingOperational(false);
        }
    };

    const fetchAnalyticsInsight = async () => {
        if (!user || isAnalyzingAnalytics) return;
        
        // Safety check for Plan Permission
        if (!checkPlanPermission('analytics')) return;

        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `tokcer_cache_analytics_${user.id}_${today}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            setAnalyticsInsight(JSON.parse(cachedData));
            return;
        }

        setIsAnalyzingAnalytics(true);
        try {
            const bizType = profile?.business_type || 'E-commerce';
            const safeProducts = Array.isArray(products) ? products : [];
            const safeOrders = Array.isArray(orders) ? orders : [];
            const productNames = safeProducts.slice(0, 10).map(p => p.name).join(', ');
            const recentOrdersCount = safeOrders.length;
            const targetLang = lang === 'id' ? 'Bahasa Indonesia' : 'English';
            
            const systemPrompt = `You are a Senior E-commerce Growth Strategist for Tokcer AI. 
            Analyze the user's business (${bizType}) and their products: [${productNames}]. 
            Respond strictly in ${targetLang}.
            STRICTLY focus only on the user's specific niche and products. 
            DO NOT mention irrelevant global news (like fuel prices, politics, or unrelated commodities) unless they directly impact the ${bizType} industry's logistics or costs.
            Provide actionable strategy in JSON format.
            Analyze seasonal trends in Indonesia for this specific niche, competitor behavior, and identify gap opportunities.
            Keys: 
            "ads_opt": { "golden_hours": string, "strategy": string },
            "bundling": [ { "title": string, "desc": string } ],
            "market_pulse": { "hot_idea": string, "hot_desc": string, "content_tip": string, "content_desc": string },
            "pricing": { "potential_profit": string, "tip": string, "margin_increase": string }`;

            const userPrompt = `Generate analytics insight for my shop selling ${bizType}. I have ${recentOrdersCount} recent orders and these products: ${productNames}.`;
            
            const result = await callAiEngine(systemPrompt, userPrompt, null, 2048, 0.5);
            const cleanJson = result.text.replace(/```json|```/g, '').trim();
            const data = JSON.parse(cleanJson);
            setAnalyticsInsight(data);
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (err) {
            console.error("Analytics Analysis Error:", err);
            // Fallback empty data and STILL CACHE IT to prevent immediate retry loop
            const fallback = {
                ads_opt: { golden_hours: "19:00 - 21:00", strategy: "Gunakan data historis untuk optimasi iklan." },
                bundling: [{ title: "Paket Rekomendasi", desc: "Bundling produk pelengkap." }],
                market_pulse: { hot_idea: "Peningkatan Visual", hot_desc: "Perbaiki foto produk.", content_tip: "Video Review", content_desc: "Gunakan user-generated content." },
                pricing: { potential_profit: "Rp 0", tip: "Pantau harga pasar.", margin_increase: "0%" }
            };
            setAnalyticsInsight(fallback);
            localStorage.setItem(cacheKey, JSON.stringify(fallback));
        } finally {
            setIsAnalyzingAnalytics(false);
        }
    };

    const fetchHealthInsight = async (metrics) => {
        if (!user || isAnalyzingHealth) return;
        
        // Safety check for Plan Permission
        if (!checkPlanPermission('health_check')) return;

        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `tokcer_cache_health_${user.id}_${today}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            setHealthInsight(JSON.parse(cachedData));
            return;
        }

        setIsAnalyzingHealth(true);
        try {
            const systemPrompt = `You are an E-commerce Operational Expert. 
            Analyze these shop metrics: Chat Response: ${metrics.chat}, Shipping: ${metrics.ship}, Returns: ${metrics.return}, Rating: ${metrics.rating}. 
            Respond strictly in ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}.
            Provide 2 specific, actionable improvement recommendations in JSON format.
            Keys: "recommendations" (array of strings).`;

            const userPrompt = `Provide health recommendations for my shop based on current metrics.`;
            
            const result = await callAiEngine(systemPrompt, userPrompt, null, 2048, 0.5);
            const cleanJson = result.text.replace(/```json|```/g, '').trim();
            const data = JSON.parse(cleanJson);
            const recommendations = data.recommendations || [];
            setHealthInsight(recommendations);
            localStorage.setItem(cacheKey, JSON.stringify(recommendations));
        } catch (err) {
            console.error("Health Analysis Error:", err);
            const fallback = [
                lang === 'id' ? "Pertahankan performa chat Anda yang sudah baik." : "Maintain your excellent chat performance.",
                lang === 'id' ? "Coba percepat waktu pengemasan di akhir pekan." : "Try to speed up packing time during weekends."
            ];
            setHealthInsight(fallback);
            localStorage.setItem(cacheKey, JSON.stringify(fallback));
        } finally {
            setIsAnalyzingHealth(false);
        }
    };
    
    const fetchSystemBriefing = async (currentProducts, currentOrders) => {
        const prodData = currentProducts || products;
        const ordData = currentOrders || orders;
        
        if (!user || isFetchingBriefing) return;

        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `tokcer_cache_briefing_${user.id}_${today}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            setSystemBriefing(JSON.parse(cachedData));
            return;
        }

        setIsFetchingBriefing(true);
        try {
            const bizType = profile?.business_type || 'E-commerce';
            const lowStockCount = prodData.filter(p => p.stock < 10).length;
            const highReturnOrders = ordData.filter(o => o.status === 'returned').length;
            
            const systemPrompt = `You are the Tokcer AI System Assistant. Analyze the shop data and provide 3 concise, professional, and actionable notifications in Indonesian.
            Format: JSON array of objects with keys: "title", "desc", "type" (warning, success, info), "time" (e.g. "Baru saja", "1 jam lalu").
            Focus on inventory, store health, or growth opportunities.`;
            
            const userPrompt = `Data: ${bizType} shop, ${lowStockCount} products low stock, ${highReturnOrders} returned orders, ${ordData.length} total orders.`;
            
            const result = await callAiEngine(systemPrompt, userPrompt, null, 1024, 0.5);
            const cleanJson = result.text.replace(/```json|```/g, '').trim();
            const data = JSON.parse(cleanJson);
            
            setSystemBriefing(data);
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (err) {
            console.error("Briefing Error:", err);
            const fallback = [
                { title: "Sistem Optimal", desc: "Seluruh integrasi toko Anda berjalan lancar hari ini.", type: "success", time: "Baru saja" },
                { title: "Tips Pertumbuhan", desc: "Gunakan Market Intel untuk mencari tren produk terbaru.", type: "info", time: "1 jam lalu" }
            ];
            setSystemBriefing(fallback);
            localStorage.setItem(cacheKey, JSON.stringify(fallback));
        } finally {
            setIsFetchingBriefing(false);
        }
    };

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
      
      if (session) {
        setUser(session.user);
        
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        const { data: clientData } = await supabase.from('clients').select('*').ilike('email', session.user.email?.toLowerCase().trim()).maybeSingle();
        setClientData(clientData);
        
        if (session.user.email === 'admin@tokcer-ai.com') {
            localStorage.setItem('tokcer_admin_auth', 'true');
            setProfile({
                full_name: 'Administrator',
                subscription_plan: 'ultimate',
                tokens: 9999,
                totalQuota: 3000,
                isUnlimited: true,
                planName: 'Ultimate'
            });
            setTimeFilter('Semua');
            fetchOperationalData(session.user.id, session.user);
            fetchMarketplaceConnections(session.user.id);
            return;
        } else {
            localStorage.removeItem('tokcer_admin_auth');
        }

        if (prof || clientData) {
            const plan = (clientData?.plan || prof?.subscription_plan || 'starter').toLowerCase();
            const quotaMap = { 'starter': 50, 'pro': 300, 'elite': 1000, 'ultimate': 3000 };
            const totalQuota = quotaMap[plan] || 50;
            const activeTokens = prof?.ai_tokens ?? 0;
            
            setProfile({ 
                ...(prof || {}), 
                subscription_plan: plan,
                tokens: activeTokens, 
                totalQuota: totalQuota,
                isUnlimited: plan === 'ultimate',
                planName: plan.charAt(0).toUpperCase() + plan.slice(1)
            });
        }
        const metadata = session.user.user_metadata;
        if (metadata?.platforms && metadata?.store_links) {
            await autoConnectStores(session.user.id, metadata.platforms, metadata.store_links);
        }
        const { products: pData, orders: oData } = await fetchOperationalData(session.user.id, session.user);
        fetchMarketplaceConnections(session.user.id);
        fetchSystemBriefing(pData, oData);
      } else if (isAdmin) {
        const adminUser = { email: 'admin@tokcer-ai.com', id: 'admin-bypass' };
        setUser(adminUser);
        setProfile({ 
            full_name: 'Administrator', 
            tokens: 9999, 
            role: 'admin',
            subscription_plan: 'ultimate',
            planName: 'Ultimate',
            totalQuota: 3000,
            isUnlimited: true
        });
        setTimeFilter('Semua');
        fetchOperationalData('admin-bypass', adminUser);
        fetchMarketplaceConnections('admin-bypass');
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const shopId = params.get('shop_id');
      if (code && shopId) {
          window.history.replaceState({}, document.title, window.location.pathname);
      }
      const tiktokCode = params.get('auth_code');
      if (tiktokCode) {
          window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
                getUser();
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                localStorage.removeItem('tokcer_admin_auth');
            }
        });

        getUser();

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

  const chargeDailyCredit = async (feature) => {
    if (!user || localStorage.getItem('tokcer_admin_auth') === 'true') return true;

    // 🏮 PLAN CHECK FIRST (Blueprint Security Constraint)
    // Map internal keys to permission keys
    const permKey = feature === 'market' ? 'market_intel' : feature;
    if (!checkPlanPermission(permKey, true)) {
        return false;
    }

    const today = new Date().toISOString().split('T')[0];
    const storageKey = `tokcer_pay_${feature}_${today}`;
    
    if (localStorage.getItem(storageKey)) return true;

    const currentTokens = profile?.tokens ?? 0;
    if (currentTokens < 1) {
        console.warn("Insufficient tokens for feature:", feature);
        return false;
    }

    try {
        const { data, error } = await supabase.rpc('rpc_deduct_token', {
            p_user_id: user.id,
            p_feature: `daily_access_${feature}`,
            p_amount: 1
        });

        if (error || !data.success) {
            console.warn("Deduction failed:", data?.message);
            return false;
        }

        setProfile(prev => ({ ...prev, tokens: data.new_balance }));
        localStorage.setItem(storageKey, 'paid');
        return true;
    } catch (err) {
        console.error("Charge Daily Error:", err);
        return false;
    }
  };

  useEffect(() => {
    if (activeMenu === 'tab-analytics') {
      chargeDailyCredit('analytics').then(allowed => {
        if (allowed) fetchAnalyticsInsight();
      });
    } else if (activeMenu === 'tab-market') {
        chargeDailyCredit('market').then(allowed => {
            if (allowed) fetchGlobalMarketTrends();
        });
    } else if (activeMenu === 'tab-health') {
        chargeDailyCredit('health_check').then(allowed => {
            if (allowed) {
                const safeOrders = Array.isArray(orders) ? orders : [];
                const total = safeOrders.length || 1;
                const cancelled = safeOrders.filter(o => o.status === 'cancelled' || o.status === 'returned').length;
                const returnRate = ((cancelled / total) * 100).toFixed(1) + '%';
                
                fetchHealthInsight({
                    chat: '98%',
                    ship: '1.2 Days',
                    return: returnRate,
                    rating: '4.9/5.0'
                });
            }
        });
    }
  }, [activeMenu, products, orders, healthPlatform, timeFilter]);

  // Reset insights when filters change to allow re-fetching
  useEffect(() => {
    setHealthInsight(null);
  }, [healthPlatform, timeFilter]);

  useEffect(() => {
    setAnalyticsInsight(null);
  }, [analyticsPlatform]);

  const [adminClients, setAdminClients] = useState([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const fetchAdminClients = async () => {
    setIsAdminLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*, partners(full_name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Fetch Admin Clients Error:", error);
      alert("Gagal mengambil data: " + error.message);
    } else {
      setAdminClients(data || []);
    }
    setIsAdminLoading(false);
  };

  useEffect(() => {
    if (activeMenu === 'tab-admin') {
      fetchAdminClients();
    }
  }, [activeMenu]);

  const handleApproveClient = async (clientId, email, shopName) => {
    const confirm = window.confirm(`Approve pendaftaran untuk ${shopName}?`);
    if (!confirm) return;

    setIsAdminLoading(true);
    try {
      // 1. Update status di DB
      const { error } = await supabase
        .from('clients')
        .update({ status: 'active', commission_amount: 100000 }) // Misal komisi flat 100k
        .eq('id', clientId);

      if (error) throw error;

      // 2. Simulasi pengiriman email
      alert(`Berhasil di-approve!\n\nEmail instruksi login telah dikirim ke: ${email}\nAkun untuk toko "${shopName}" sedang disiapkan.`);
      
      fetchAdminClients();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm(t('confirmLogout') || 'Logout?')) {
        await supabase.auth.signOut();
        localStorage.removeItem('tokcer_admin_auth');
        localStorage.removeItem('tokcer_cache_analytics_' + user?.id + '_' + new Date().toISOString().split('T')[0]);
        window.location.href = '/login';
    }
  };




    const checkPlanPermission = (feature, silent = false) => {
        const plan = (profile?.subscription_plan || 'starter').toLowerCase();
        const permissions = {
            'video_gen': ['pro', 'elite', 'ultimate'],
            'health_check': ['pro', 'elite', 'ultimate'],
            'analytics': ['starter', 'pro', 'elite', 'ultimate'],
            'market_intel': ['elite', 'ultimate'],
            'price_optimizer': ['elite', 'ultimate'],
            'competitor_analysis': ['ultimate']
        };
        
        if (permissions[feature] && !permissions[feature].includes(plan)) {
            if (!silent) {
                const minPlan = permissions[feature][0].toUpperCase();
                alert(`⚠️ Fitur ini hanya tersedia untuk paket ${minPlan} ke atas. Silakan upgrade paket Anda!`);
            }
            return false;
        }
        return true;
    };

    const handleGenerateAI = async () => {
    if (!aiPrompt || !user) return;
    
    // Check Plan Permissions for Video Formats
    if (aiFormat.includes('Video') || aiFormat.includes('Reels')) {
        if (!checkPlanPermission('video_gen')) return;
    }

    const isAdmin = profile?.role === 'admin';
    
    // 1. SECURE TOKEN DEDUCTION (PRE-AI CALL)
    if (!isAdmin) {
        const lastPrompt = localStorage.getItem('tokcer_last_prompt');
        const isNewTopic = !lastPrompt || lastPrompt.trim().toLowerCase() !== aiPrompt.trim().toLowerCase();

        if (isNewTopic) {
            // Pre-check state
            if (!profile || (profile.tokens || 0) < 1) {
                setAiResult("⚠️ Maaf, sisa token AI Anda habis. Silakan hubungi admin untuk top-up.");
                return;
            }

            const { data: deductData, error: deductError } = await supabase.rpc('rpc_deduct_token', {
                p_user_id: user.id,
                p_feature: 'content_generator',
                p_amount: 1
            });

            if (deductError || !deductData.success) {
                setAiResult("⚠️ Maaf, sisa token AI Anda habis atau gagal diverifikasi.");
                return;
            }
            
            // Sync state
            setProfile(prev => ({ ...prev, tokens: deductData.new_balance }));
            localStorage.setItem('tokcer_last_prompt', aiPrompt);
        }
    }

    setIsGenerating(true);
    setAiResult('');

    try {
      // 2. Fetch RAG Config
      const { data: config } = await supabase
        .from('ai_configs')
        .select('*')
        .eq('type', 'generator')
        .single();

      const targetLang = lang === 'id' ? 'Bahasa Indonesia' : 'English';
      let platformContext = "";
      if (aiFormat === 'TikTok Video') {
        platformContext = `Buatlah naskah video TikTok durasi 3 menit. Sertakan: Hook viral di 3 detik pertama, Breakdown adegan (Scene by Scene), saran musik latar yang sedang tren, dan narasi yang enerjik.`;
      } else if (aiFormat === 'Instagram Reels') {
        platformContext = `Buatlah naskah Instagram Reels yang estetik. Sertakan: Hook yang menarik perhatian, transisi antar adegan, saran filter/mood, dan caption singkat yang powerful.`;
      } else if (aiFormat === 'Shopee Description') {
        platformContext = `Buatlah deskripsi produk khusus Shopee. Gunakan banyak emoji, highlight promo/voucher, dan gaya bahasa yang persuasif serta "hype" untuk menarik pembeli diskon.`;
      } else if (aiFormat === 'TikTok Shop Description') {
        platformContext = `Buatlah deskripsi produk TikTok Shop. Fokus pada 'USP' produk secara cepat, buat kesan urgensi/kelangkaan, dan arahkan ke keranjang kuning.`;
      }

      if (lang === 'en') {
        platformContext = platformContext
            .replace('Buatlah naskah video TikTok durasi 3 menit', 'Create a 3-minute TikTok video script')
            .replace('Sertakan: Hook viral di 3 detik pertama, Breakdown adegan (Scene by Scene), saran musik latar yang sedang tren, dan narasi yang enerjik.', 'Include: Viral hook in the first 3 seconds, Scene by Scene breakdown, trending background music suggestions, and energetic narration.')
            .replace('Buatlah naskah Instagram Reels yang estetik', 'Create an aesthetic Instagram Reels script')
            .replace('Sertakan: Hook yang menarik perhatian, transisi antar adegan, saran filter/mood, dan caption singkat yang powerful.', 'Include: Attention-grabbing hook, transitions between scenes, filter/mood suggestions, and a powerful short caption.')
            .replace('Buatlah deskripsi produk khusus Shopee', 'Create a specific Shopee product description')
            .replace('Gunakan banyak emoji, highlight promo/voucher, dan gaya bahasa yang persuasif serta "hype" untuk menarik pembeli diskon.', 'Use plenty of emojis, highlight promos/vouchers, and use persuasive "hype" language to attract discount hunters.')
            .replace('Buatlah deskripsi produk TikTok Shop', 'Create a TikTok Shop product description')
            .replace("Fokus pada 'USP' produk secara cepat, buat kesan urgensi/kelangkaan, dan arahkan ke keranjang kuning.", "Focus on the product's USP quickly, create a sense of urgency/scarcity, and direct to the yellow basket.");
      }

      const fullSystemPrompt = `${config?.system_prompt || ''}\n\nATURAN KHUSUS: Respon WAJIB dalam ${targetLang}. ${platformContext}`;
      const userMessage = `Buat konten untuk produk berikut:\n\n${aiPrompt}\n\nPastikan konten berbeda dari sebelumnya (variatif) dan sangat spesifik untuk format ${aiFormat}.`;

      // 3. Tentukan Max Tokens Dinamis (Biar Hemat)
      let computedMaxTokens = 2048;
      if (aiFormat.includes('Description') || aiFormat.includes('Deskripsi') || aiFormat.includes('Caption')) {
        computedMaxTokens = 500;
      }

      // 4. CALL AI ENGINE
      const { text: result, usage } = await callAiEngine(fullSystemPrompt, userMessage, null, computedMaxTokens, 0.8);
      
      setAiResult(result);

      // 4. Log Usage
      await supabase.from('ai_usage_logs').insert([{
          user_id: user?.id || null,
          feature: 'content_generator',
          prompt: userMessage,
          response: result,
          tokens_used: (isAdmin || localStorage.getItem('tokcer_last_prompt') === aiPrompt) ? 0 : 1,
          input_tokens: usage.prompt_tokens,
          output_tokens: usage.completion_tokens,
          cost_usd: (usage.prompt_tokens * 0.00000014) + (usage.completion_tokens * 0.00000028)
      }]);

    } catch (e) {
      console.error("AI Generation Error:", e);
      setAiResult(`❌ Terjadi kesalahan: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

    const handleAnalyzeTrend = async () => {
        if (!trendPrompt) return;
        
        if (!checkPlanPermission('market_intel')) return;

        setIsTrendAnalyzing(true);
        setTrendResult('');

    try {
      // 1. Hardened Token Deduction (RPC)
      const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
      if (!isAdmin) {
          const { data: deductData, error: deductError } = await supabase.rpc('rpc_deduct_token', {
              p_user_id: user.id,
              p_feature: 'market_intel_analysis',
              p_amount: 1
          });

          if (deductError || !deductData.success) {
              setTrendResult(deductData?.message || "⚠️ Maaf, sisa token AI Anda habis.");
              setIsTrendAnalyzing(false);
              return;
          }
          setProfile(prev => ({ ...prev, tokens: deductData.new_balance }));
      }

      // 2. Fetch RAG Config for Analyst
      const { data: config } = await supabase
        .from('ai_configs')
        .select('*')
        .eq('type', 'market_analyst')
        .single();

      const bizType = profile?.business_type || 'General E-commerce';
      
      const systemPrompt = config?.system_prompt || `You are an elite Market Research Analyst for the Indonesian e-commerce market...`;
      
      // 3. Call Intelligence Engine (using master API key from .env automatically)
      const userQuery = `Analyze this niche/product: "${trendPrompt}" within my business category: ${bizType}`;
      const { text: result, usage } = await callAiEngine(systemPrompt, userQuery, null, 2048, 0.5);
      setTrendResult(result);

      await supabase.from('ai_usage_logs').insert([{
          user_id: user?.id || null,
          feature: 'market_intel_analysis_complete',
          prompt: userQuery,
          response: result,
          input_tokens: usage.prompt_tokens,
          output_tokens: usage.completion_tokens,
          cost_usd: (usage.prompt_tokens * 0.00000014) + (usage.completion_tokens * 0.00000028)
      }]);

      // Token usage already logged and deducted by RPC above
    } catch (e) {
      console.error(e);
      setTrendResult("Maaf, terjadi kesalahan saat menganalisa tren.");
    } finally {
      setIsTrendAnalyzing(false);
    }
  };

  const fetchGlobalMarketTrends = async () => {
    if (isFetchingTrends) return;

    const today = new Date().toISOString().split('T')[0];
    setIsFetchingTrends(true);

    try {
      const bizType = profile?.business_type || 'General E-commerce';

      // 1. CEK CACHE GLOBAL DI DATABASE (Berlaku untuk semua user)
      const { data: existingLogs } = await supabase
        .from('ai_usage_logs')
        .select('response')
        .eq('feature', 'global_market_trends')
        .gte('created_at', today)
        .not('response', 'eq', 'SUCCESS') // Abaikan log lama yang cuma isi "SUCCESS"
        .order('created_at', { ascending: false })
        .limit(1);

      if (existingLogs && existingLogs.length > 0) {
        const cachedResult = existingLogs[0].response;
        try {
          const cleanJson = cachedResult.replace(/```json|```/g, '').trim();
          const data = JSON.parse(cleanJson);
          if (data.topics) setViralTopics(data.topics);
          if (data.summary) setLiveSummary(data.summary);
          setIsFetchingTrends(false);
          return; // STOP DI SINI (Hemat kuota!)
        } catch (e) {
          console.error("Gagal parse cache JSON, memanggil AI baru...");
        }
      }

      // 2. JIKA BELUM ADA CACHE, PANGGIL DEEPSEEK
      const systemPrompt = `You are a Market Trend Scout for the Indonesian market...`;
      const { text: result, usage } = await callAiEngine(systemPrompt, "Fetch current viral trends for " + bizType, null, 2048, 0.5);
      
      // Simpan jawaban asli ke database untuk dijadikan cache user lain
      await supabase.from('ai_usage_logs').insert([{
          user_id: user?.id || null,
          feature: 'global_market_trends',
          prompt: "Background Fetch: " + bizType,
          response: result, // << SIMPAN HASIL ASLI!
          input_tokens: usage.prompt_tokens,
          output_tokens: usage.completion_tokens,
          cost_usd: (usage.prompt_tokens * 0.00000014) + (usage.completion_tokens * 0.00000028)
      }]);

      const cleanJson = result.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);
      
      if (data.topics) setViralTopics(data.topics);
      if (data.summary) setLiveSummary(data.summary);

    } catch (err) {
      console.error("Error fetching market trends:", err);
    } finally {
      setIsFetchingTrends(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: lang === 'id' ? 'Password tidak cocok!' : 'Passwords do not match!' });
      return;
    }
    if (newPassword.length < 6) {
      setSecurityMessage({ type: 'error', text: lang === 'id' ? 'Minimal 6 karakter!' : 'At least 6 characters!' });
      return;
    }
    setIsUpdatingPassword(true);
    setSecurityMessage({ type: '', text: '' });
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSecurityMessage({ type: 'success', text: lang === 'id' ? 'Password berhasil diperbarui!' : 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setSecurityMessage({ type: 'error', text: err.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDownloadReport = () => {
    if (orders.length === 0) {
      alert("Belum ada data untuk diunduh.");
      return;
    }

    // Generate CSV from real orders data
    const csvRows = [
      ['Order ID', 'Produk Terjual', 'Platform', 'Nominal (Rp)', 'Status', 'Tanggal'],
      ...orders.map(o => [
        o.order_number || o.id,
        o.customer_name || 'Customer',
        o.platform || 'N/A',
        o.total_amount || 0,
        o.status || 'N/A',
        o.order_date || 'N/A'
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Omzet_TokcerAI_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSupportFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSupportFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmittingSupport(true);
    
    try {
      let attachmentUrl = null;

      // 1. Upload File if exists
      if (supportFile) {
        const fileExt = supportFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `support-attachments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('support-files')
          .upload(filePath, supportFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('support-files')
          .getPublicUrl(filePath);
        
        attachmentUrl = publicUrl;
      }

      // 2. Insert Ticket to DB
      const { error: insertError } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: user.id === 'admin-bypass' ? null : user.id,
          type: supportType,
          title: supportTitle,
          description: supportDesc,
          attachment_url: attachmentUrl,
          status: 'open'
        }]);

      if (insertError) throw insertError;

      setSupportSubmitted(true);
      
      // Reset form
      setSupportTitle('');
      setSupportDesc('');
      setSupportFile(null);
      setSupportFilePreview(null);
    } catch (err) {
      console.error("Support Submission Error:", err);
      alert("❌ Gagal mengirim laporan: " + err.message);
    } finally {
      setIsSubmittingSupport(false);
    }
  };


  const renderContent = () => {
    switch (activeMenu) {
      case 'tab-admin':
        return (
          <AdminTab 
            adminClients={adminClients}
            isAdminLoading={isAdminLoading}
            handleApproveClient={handleApproveClient}
          />
        );
      case 'tab-dash':
        return (
          <OverviewTab 
            t={t} 
            orders={orders} 
            products={products} 
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            showFilterDropdown={showFilterDropdown}
            setShowFilterDropdown={setShowFilterDropdown}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            showPlatformDropdown={showPlatformDropdown}
            setShowPlatformDropdown={setShowPlatformDropdown}
            profile={profile}
            lang={lang}
            setActiveMenu={setActiveMenu}
            systemBriefing={systemBriefing}
            isFetchingBriefing={isFetchingBriefing}
            orders={orders}
            products={products}
          />
        );
      case 'tab-omzet':
        return (
          <RevenueTab 
            t={t}
            orders={orders}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            showPlatformDropdown={showPlatformDropdown}
            setShowPlatformDropdown={setShowPlatformDropdown}
            omzetTimeFilter={omzetTimeFilter}
            setOmzetTimeFilter={setOmzetTimeFilter}
            showOmzetTimeDropdown={showOmzetTimeDropdown}
            setShowOmzetTimeDropdown={setShowOmzetTimeDropdown}
            handleDownloadReport={handleDownloadReport}
            handleImportOrders={handleImportOrders}
          />
        );
      case 'tab-inventory':
        return (
          <InventoryTab 
            t={t}
            products={products}
            setShowProductModal={setShowProductModal}
            handleImportProducts={handleImportProducts}
          />
        );

      case 'tab-billing':
        return (
          <BillingTab 
            user={user} 
            profile={profile} 
            clientData={clientData}
            supabase={supabase} 
            t={t}
          />
        );
      case 'tab-analytics':
        return (
          <AnalyticsTab 
            t={t}
            profile={profile}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            showFilterDropdown={showFilterDropdown}
            setShowFilterDropdown={setShowFilterDropdown}
            analyticsPlatform={analyticsPlatform}
            setAnalyticsPlatform={setAnalyticsPlatform}
            showAnalyticsPlatformDropdown={showAnalyticsPlatformDropdown}
            setShowAnalyticsPlatformDropdown={setShowAnalyticsPlatformDropdown}
            lang={lang}
            orders={orders}
            products={products}
            analyticsInsight={analyticsInsight}
            isAnalyzingAnalytics={isAnalyzingAnalytics}
          />
        );
      case 'tab-health':
        return (
          <HealthScoreTab 
            t={t}
            profile={profile}
            lang={lang}
            healthPlatform={healthPlatform}
            setHealthPlatform={setHealthPlatform}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            showFilterDropdown={showFilterDropdown}
            setShowFilterDropdown={setShowFilterDropdown}
            orders={orders}
            healthInsight={healthInsight}
            isAnalyzingHealth={isAnalyzingHealth}
          />
        );
      case 'tab-ai':
        return (
          <AiGeneratorTab 
            t={t}
            aiSubTab={aiSubTab}
            setAiSubTab={setAiSubTab}
            aiPrompt={aiPrompt}
            setAiPrompt={setAiPrompt}
            aiFormat={aiFormat}
            setAiFormat={setAiFormat}
            aiResult={aiResult}
            setAiResult={setAiResult}
            isGenerating={isGenerating}
            handleGenerateAI={handleGenerateAI}
          />
        );
      case 'tab-market':
        return (
          <MarketIntelTab 
            t={t}
            profile={profile}
            lang={lang}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            showPlatformDropdown={showPlatformDropdown}
            setShowPlatformDropdown={setShowPlatformDropdown}
            viralTopics={viralTopics}
            trendCustomInput={trendCustomInput}
            setTrendCustomInput={setTrendCustomInput}
            isSearchingTrend={isSearchingTrend}
            isTrendAnalyzing={isTrendAnalyzing}
            trendPrompt={trendPrompt}
            setTrendPrompt={setTrendPrompt}
            handleAnalyzeTrend={handleAnalyzeTrend}
            trendSampleKey={trendSampleKey}
            setTrendSampleKey={setTrendSampleKey}
            trendResult={trendResult}
            liveSummary={liveSummary}
            fetchGlobalMarketTrends={fetchGlobalMarketTrends}
          />
        );
      case 'tab-support':
        return (
          <SupportTab 
            t={t}
            lang={lang}
            supportSubmitted={supportSubmitted}
            setSupportSubmitted={setSupportSubmitted}
            setActiveMenu={setActiveMenu}
            supportType={supportType}
            setSupportType={setSupportType}
            handleSupportSubmit={handleSupportSubmit}
            supportTitle={supportTitle}
            setSupportTitle={setSupportTitle}
            supportDesc={supportDesc}
            setSupportDesc={setSupportDesc}
            supportFile={supportFile}
            handleFileChange={handleFileChange}
            supportFilePreview={supportFilePreview}
            setSupportFile={setSupportFile}
            setSupportFilePreview={setSupportFilePreview}
            isSubmittingSupport={isSubmittingSupport}
          />
        );
      case 'tab-account':
        return (
          <AccountTab 
            t={t}
            lang={lang}
            securityMessage={securityMessage}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isUpdatingPassword={isUpdatingPassword}
            handleUpdatePassword={handleUpdatePassword}
            profile={profile}
            user={user}
            clientData={clientData}
          />
        );
      case 'tab-connections':
        return (
          <MarketplaceSyncTab 
            t={t}
            lang={lang}
            onConnectShopee={handleConnectShopee}
            onConnectTikTok={handleConnectTikTok}
            connectedStores={marketplaceConnections}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-['Inter',sans-serif] overflow-hidden">
      <Sidebar 
        t={t}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        lang={lang}
        setLang={setLang}
        profile={profile}
        user={user}
        handleLogout={handleLogout}
      />


      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-zinc-900 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
        {/* Mobile Dashboard Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Content Spacer for Fixed Header on Mobile */}
        <div className="h-16 lg:hidden"></div>

        <div className="max-w-6xl mx-auto p-4 md:p-8 relative">
          {clientData?.status === 'expired' && activeMenu !== 'tab-billing' && (
            <div className="absolute inset-0 z-50 bg-zinc-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-red-500/20 m-4 md:m-8">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <iconify-icon icon="solar:danger-triangle-bold" className="text-4xl text-red-500"></iconify-icon>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Masa Langganan Habis</h2>
                <p className="text-zinc-400 mb-6 max-w-md">Akun Anda telah melewati batas waktu kedaluwarsa. Silakan masuk ke menu Billing untuk melakukan perpanjangan paket agar sistem dapat digunakan kembali.</p>
                <button onClick={() => setActiveMenu('tab-billing')} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
                    <iconify-icon icon="solar:wallet-bold"></iconify-icon>
                    Buka Menu Pembayaran
                </button>
            </div>
          )}
          <div className={clientData?.status === 'expired' && activeMenu !== 'tab-billing' ? 'opacity-20 pointer-events-none blur-sm transition-all h-[70vh] overflow-hidden' : ''}>
            {renderContent()}
          </div>
        </div>
      </main>

      <ProductModal isOpen={showProductModal} onClose={() => setShowProductModal(false)} t={t} />
    </div>
  );
};

export default Dashboard;
