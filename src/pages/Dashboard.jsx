// Last Updated: 2026-04-27 12:20:00 (Trigger Re-deploy)
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ProductModal from '../components/modals/ProductModal';
// Build Timestamp: 2026-04-27 11:46:00
import logo from '../assets/logo.png';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import DashboardRevenue from '../components/dashboard/DashboardRevenue';
import DashboardInventory from '../components/dashboard/DashboardInventory';
import DashboardAnalytics from '../components/dashboard/DashboardAnalytics';
import DashboardAI from '../components/dashboard/DashboardAI';
import DashboardHealth from '../components/dashboard/DashboardHealth';
import DashboardAccount from '../components/dashboard/DashboardAccount';
import DashboardSupport from '../components/dashboard/DashboardSupport';
import MarketIntel from '../components/dashboard/MarketIntel';
import MarketplaceSync from '../components/dashboard/MarketplaceSync';
import DashboardAdmin from '../components/dashboard/DashboardAdmin';


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

  const translations = {
    id: {
      dashboard: "Dashboard",
      revenue: "Data Omzet",
      inventory: "Inventory",
      analytics: "Analytics",
      aiGenerator: "AI Generator",
      healthScore: "Health Score",
      marketIntel: "Market Intel",
      accountSecurity: "Keamanan Akun",
      logout: "Keluar",
      overview: "Ringkasan",
      monitorShop: "Pantau performa tokomu detik ini juga.",
      today: "Hari Ini",
      thisMonth: "Bulan Ini",
      visitors: "Pengunjung Live",
      omzetToday: "Omzet Hari Ini",
      convRate: "Tingkat Konversi",
      healthTitle: "Skor Kesehatan",
      estProfit: "Estimasi Profit",
      totOmzet: "Total Omzet",
      notif: "Notifikasi Sistem",
      recentTrx: "Transaksi Terbaru",
      lowStock: "Informasi Stok Menipis",
      viewAll: "Lihat Semua",
      manageInv: "Kelola Inventory",
      premium: "Fitur Premium",
      loggedAs: "Masuk sebagai",
      marketAnalytics: "Analisis Pasar",
      strategicIntel: "Intelijen Strategis AI",
      priceOpt: "Optimasi Harga AI",
      platformComp: "Perbandingan Platform",
      priceRec: "Rekomendasi Harga",
      applyAll: "Terapkan Semua",
      revenueDesc: "Rincian performa penjualan dari berbagai saluran.",
      invDesc: "Kelola stok produk Anda di semua platform.",
      addProduct: "Tambah Produk",
      searchProd: "Cari produk...",
      stock: "Stok",
      price: "Harga",
      action: "Aksi",
      edit: "Edit",
      delete: "Hapus",
      aiDesc: "Buat konten promosi & riset pasar instan dengan kecerdasan buatan.",
      contentGen: "Generator Konten",
      trendRadar: "Radar Tren Pasar",
      prodDesc: "Deskripsi Produk Anda",
      formatOutput: "Pilih Format Output",
      genMagic: "Buat Konten Magic",
      genLoading: "Menghubungkan ke AI Engine...",
      genResult: "Hasil Generate",
      copy: "Salin",
      marketInfo: "Masukkan niche atau kategori produk yang ingin Anda jual. AI akan menganalisis tren pasar Indonesia, target demografi, dan memberikan rekomendasi produk terlaris.",
      nicheLabel: "Kategori / Niche Produk",
      quickSuggest: "Contoh Cepat",
      analyzeNow: "Analisis Tren Pasar Sekarang",
      analyzing: "Menganalisis Pasar...",
      analyzeResult: "Hasil Analisis Tren Pasar",
      incomeToday: "Pendapatan Hari Ini",
      activeOrders: "Pesanan Aktif",
      shopHealth: "Detail Kesehatan Toko",
      marketIntelTitle: "Intelijen Pasar",
      peak: "Puncak",
      quota: "Sisa Kuota AI Generator",
      quotaDesc: "Anda memiliki sisa 42 generasi konten bulan ini.",
      tiktokIntegrate: "Integrasi TikTok Shop",
      tiktokIntegrateDesc: "Token API TikTok Shop Anda akan kedaluwarsa dalam 3 hari. Segera perbarui.",
      specialPromo: "Promo Spesial",
      specialPromoDesc: "Upgrade ke paket Ultimate untuk membuka fitur Market Intel tanpa batas.",
      orderId: "Order ID",
      productSold: "Produk Terjual",
      platform: "Platform",
      amount: "Nominal",
      status: "Status",
      done: "Selesai",
      vsYesterday: "vs kemarin",
      noDataToday: "Belum ada data",
      noProfitData: "Data profit belum ada",
      basedOnVisitors: "Berdasarkan pengunjung aktif",
      filteredData: "Data terfilter",
      estMargin: "Estimasi margin 20%",
      systemNotif: "Notifikasi Sistem",
      aiQuotaTitle: "Kuota AI Generator",
      tiktokIntegration: "Integrasi TikTok Shop",
      specialPromoTitle: "Promo Spesial",
      justNow: "Baru saja",
      "2hrsAgo": "2 jam yang lalu",
      "1dayAgo": "1 hari yang lalu",
      customer: "Pelanggan",
      runningLow: "Stok Menipis",
      outOfStock: "Stok Habis",
      stockHealthy: "Stok aman dan sehat",
      noRecentTrx: "Belum ada transaksi terbaru",
      downloadReport: "Unduh Laporan",
      processing: "Sedang diproses",
      sku: "SKU",
      outOfStock: "Habis",
      runningLow: "Menipis",
      orders: "Pesanan",
      analyticsDesc: "Analisis performa, strategi taktis, dan optimasi profit berbasis AI.",
      liveVisitorsDesc: "Pengunjung aktif saat ini",
      vsYesterday: "vs kemarin",
      industryAvg: "Di atas rata-rata industri",
      adsTrafficOpt: "Optimasi Iklan & Trafik",
      goldenHours: "Jam Emas",
      goldenHoursDesc: "Traffic TikTok naik 40%. Rekomendasi: Naikkan bid ads 1.5x.",
      campaignFlashSale: "Kampanye Flash Sale",
      campaignFlashSaleDesc: "Efektivitas di Shopee meningkat saat akhir pekan. Fokus pada produk terlaris.",
      bundlingPromoIdeas: "Ide Bundling & Promo",
      bundleSneakersKaos: "Bundel: Sneakers + Kaos",
      bundleSneakersKaosDesc: "Kombinasi ini memiliki tingkat konversi 25% lebih tinggi.",
      buy2get1: "Beli 2 Gratis 1 (Aksesoris)",
      buy2get1Desc: "Gunakan promo ini untuk menghabiskan sisa stok SKU CC-M-CRM.",
      marketPulseIdeas: "Analisa AI",
      hotIdea: "Saran AI",
      hotIdeaDesc: "Tren 'Old Money Aesthetic' sedang naik di TikTok Shop Indonesia. Rekomendasi stok: Kemeja Linen & Celana Chino warna bumi.",
      contentTip: "Tips Konten",
      contentTipDesc: "Gunakan format video 'Before & After' untuk produk Sneakers A1. Musik viral: 'Lampu Kuning' (Trending).",
      priceOptDesc: "Berdasarkan analisis pasar real-time di 3 platform besar, berikut adalah rekomendasi penyesuaian harga untuk memaksimalkan profit & volume penjualan.",
      potentialProfit: "Potensi penambahan profit bersih jika semua rekomendasi diterapkan bulan ini.",
      demandTikTok: "Permintaan tinggi di TikTok",
      competitionShopee: "Persaingan ketat di Shopee",
      optimalPrice: "Harga sudah optimal",
      increase: "Naikkan",
      decrease: "Turunkan",
      maintain: "Pertahankan",
      shopHealthDesc: "Analisis mendalam tentang keunggulan operasional toko Anda.",
      chatResponse: "Respon Chat",
      shippingSpeed: "Kecepatan Pengiriman",
      returnRate: "Tingkat Pengembalian",
      rating: "Penilaian",
      aiHealthRec: "Rekomendasi Kesehatan AI",
      healthRec1: "Tingkat respon chat Anda sangat baik! Terus gunakan Balasan Otomatis AI untuk menjaga skor ini selama jam sibuk.",
      healthRec2: "Kecepatan pengiriman untuk pesanan Tokopedia sedikit menurun minggu lalu. Pertimbangkan untuk mengoptimalkan alur kerja pengemasan pada hari Senin.",
      compPriceTracker: "Pelacak Harga Kompetitor",
      me: "Saya",
      market: "Pasar",
      warning: "Peringatan",
      optimal: "Optimal",
      competitive: "Kompetitif",
      globalTrendPred: "Prediksi Tren Global",
      globalTrendDesc: "Model AI memprediksi lonjakan 30% dalam permintaan 'Eco-friendly Sportswear' di Asia Tenggara kuartal depan.",
      exploreNiche: "Jelajahi Niche",
      aiPromptPlaceholder: "Contoh: Sepatu running ringan bahan mesh breathable, cocok untuk lari dan jalan santai, tersedia warna hitam & putih...",
      trendPromptPlaceholder: "Contoh: Skincare wajah pria, Sepatu olahraga wanita, Aksesoris HP gaming...",
      tiktokVideo: "Video TikTok",
      marketplace: "Marketplace",
      instagramFeed: "Feed Instagram",
      sneakersA1: "Sepatu Sneakers A1",
      premiumTee: "Kaos Polos Premium",
      hoodieUrban: "Jaket Hoodie Urban",
      newProductDesc: "Tambahkan produk baru ke dalam katalog inventory Anda.",
      productName: "Nama Produk",
      productNamePlaceholder: "Cth: Sepatu Running",
      skuPlaceholder: "Cth: SPR-001",
      initialStock: "Stok Awal",
      pricePlaceholder: "150000",
      saveProduct: "Simpan Produk",
      simulatedAlert: "Ini adalah simulasi. Fitur simpan ke database akan segera hadir!",
      'Hari Ini': 'Hari Ini',
      'Bulan Ini': 'Bulan Ini',
      '1 Bulan Terakhir': '1 Bulan Terakhir',
      '2 Bulan Terakhir': '2 Bulan Terakhir',
      '3 Bulan Terakhir': '3 Bulan Terakhir',
      profitHariIni: "Profit Hari Ini",
      allPlatforms: "Semua Platform",
      omzetFilterAll: "Semua",
      omzetFilterToday: "Hari Ini",
      omzetFilterYesterday: "Kemarin",
      omzetFilterWeek: "7 Hari Terakhir",
      omzetFilterMonth: "Bulan Lalu",
      omzetFilter2Month: "2 Bulan Terakhir",
      omzetFilter3Month: "3 Bulan Terakhir",
      trendRadarAI: "Radar Trend AI",
      trendSampleLabel: "Contoh Kategori",
      trendAnalysisResult: "Hasil Analisis",
      supportCenter: "Pusat Bantuan",
      reportBug: "Laporkan Bug",
      bugDesc: "Temukan kendala? Laporkan kepada tim kami agar segera kami perbaiki.",
      suggestFeature: "Masukan Fitur",
      featureDesc: "Punya ide fitur keren? Bagikan kepada kami untuk pengembangan Tokcer AI.",
      bugTitleLabel: "Judul Masalah",
      bugTitlePlaceholder: "Cth: Error saat generate konten",
      bugDetailLabel: "Detail Masalah",
      bugDetailPlaceholder: "Jelaskan langkah-langkah untuk mereproduksi bug...",
      featureTitleLabel: "Judul Fitur",
      featureTitlePlaceholder: "Cth: Integrasi dengan WhatsApp",
      featureDetailLabel: "Deskripsi Fitur",
      featureDetailPlaceholder: "Jelaskan bagaimana fitur ini akan membantu Anda...",
      uploadScreenshot: "Unggah Screenshot",
      sendReport: "Kirim Laporan",
      sending: "Mengirim...",
      supportSuccess: "Berhasil Terkirim!",
      supportSuccessDesc: "Terima kasih atas masukannya! Tim kami akan segera meninjau laporan Anda.",
      backToDashboard: "Kembali ke Dashboard",
      videoContent: "Konten Video",
      textContent: "Konten Teks",
      weeklyViralTopics: "Topik Viral Minggu Ini",
      liveDataSampling: "Sampling Data Live",
      aiSummary: "Ringkasan AI",
      marketConfidence: "Kepercayaan Pasar",
      planActive: "Plan Aktif",
      ultimatePlan: "Ultimate",
      active: "Aktif",
      aiQuota: "Kuota AI",
      validUntil: "Berlaku hingga",
      supportDesc: "Kami siap membantu Anda 24/7.",
      revenueLabel: "Omzet",
      profitLabel: "Profit",
    },
    en: {
      dashboard: "Dashboard",
      revenue: "Revenue Data",
      inventory: "Inventory",
      analytics: "Analytics",
      aiGenerator: "AI Generator",
      healthScore: "Health Score",
      marketIntel: "Market Intel",
      accountSecurity: "Account Security",
      clientApproval: "Dashboard Internal Admin",
      logout: "Sign Out",
      overview: "Overview",
      monitorShop: "Monitor your shop's performance in real-time.",
      today: "Today",
      thisMonth: "This Month",
      visitors: "Live Visitors",
      omzetToday: "Today's Revenue",
      convRate: "Conversion Rate",
      healthTitle: "Health Score",
      estProfit: "Estimated Profit",
      totOmzet: "Total Revenue",
      notif: "System Notifications",
      recentTrx: "Recent Transactions",
      lowStock: "Low Stock Alerts",
      viewAll: "View All",
      manageInv: "Manage Inventory",
      premium: "Premium Features",
      loggedAs: "Logged in as",
      marketAnalytics: "Market Analytics",
      strategicIntel: "AI Strategic Intel",
      priceOpt: "AI Price Optimization",
      platformComp: "Platform Comparison",
      priceRec: "Price Recommendations",
      applyAll: "Apply All",
      shopHealth: "Shop Health Details",
      marketIntelTitle: "Market Intelligence",
      peak: "Peak",
      quota: "AI Generator Quota",
      quotaDesc: "You have 42 content generations left this month.",
      tiktokIntegrate: "TikTok Shop Integration",
      tiktokIntegrateDesc: "Your TikTok Shop API token will expire in 3 days. Renew now.",
      specialPromo: "Special Promo",
      specialPromoDesc: "Upgrade to Ultimate to unlock unlimited Market Intel features.",
      orderId: "Order ID",
      productSold: "Product Sold",
      platform: "Platform",
      amount: "Amount",
      status: "Status",
      done: "Completed",
      downloadReport: "Download Report",
      activeOrders: "Active Orders",
      processing: "Processing",
      sku: "SKU",
      outOfStock: "Out of Stock",
      runningLow: "Running Low",
      orders: "Orders",
      revenueDesc: "Detailed sales performance across multiple channels.",
      invDesc: "Manage your product stock across all platforms.",
      addProduct: "Add Product",
      searchProd: "Search products...",
      stock: "Stock",
      price: "Price",
      action: "Action",
      edit: "Edit",
      delete: "Delete",
      aiDesc: "Create promotional content & instant market research with AI.",
      contentGen: "Content Generator",
      trendRadar: "Market Trend Radar",
      prodDesc: "Your Product Description",
      formatOutput: "Choose Output Format",
      genMagic: "Generate Magic Content",
      genLoading: "Connecting to AI Engine...",
      genResult: "Generated Result",
      copy: "Copy",
      marketInfo: "Enter the niche or product category you want to sell. AI will analyze the Indonesian market trend, target demographics, and provide best-selling product recommendations.",
      nicheLabel: "Product Category / niche",
      quickSuggest: "Quick Suggestions",
      analyzeNow: "Analyze Market Trend Now",
      analyzing: "Analyzing Market...",
      analyzeResult: "Market Trend Analysis Result",
      incomeToday: "Income Today",
      analyticsDesc: "Performance analysis, tactical strategy, and profit optimization.",
      liveVisitorsDesc: "Current active visitors",
      vsYesterday: "vs yesterday",
      industryAvg: "Above industry average",
      adsTrafficOpt: "Ads & Traffic Optimization",
      goldenHours: "Golden Hours",
      goldenHoursDesc: "TikTok traffic increased by 40%. Recommendation: Increase ads bid by 1.5x.",
      campaignFlashSale: "Campaign Flash Sale",
      campaignFlashSaleDesc: "Effectiveness on Shopee increases during weekends. Focus on best-selling products.",
      bundlingPromoIdeas: "Bundling & Promo Ideas",
      bundleSneakersKaos: "Bundle: Sneakers + Kaos",
      bundleSneakersKaosDesc: "This combination has a 25% higher conversion rate.",
      buy2get1: "Buy 2 Get 1 (Accessories)",
      buy2get1Desc: "Use this promo to clear remaining stock of SKU CC-M-CRM.",
      marketPulseIdeas: "AI Analysis",
      hotIdea: "AI Suggestion",
      hotIdeaDesc: "The 'Old Money Aesthetic' trend is rising on TikTok Shop Indonesia. Stock recommendation: Linen Shirts & Earth-toned Chino Pants.",
      contentTip: "Content Tip",
      contentTipDesc: "Use 'Before & After' video format for Sneakers A1. Viral music: 'Lampu Kuning' (Trending).",
      priceOptDesc: "Based on real-time market analysis across 3 major platforms, here are the price adjustment recommendations to maximize profit & sales volume.",
      potentialProfit: "Potential net profit increase if all recommendations are applied this month.",
      demandTikTok: "High demand on TikTok",
      competitionShopee: "Stiff competition on Shopee",
      optimalPrice: "Price is already optimal",
      increase: "Increase",
      decrease: "Decrease",
      maintain: "Maintain",
      shopHealthDesc: "Deep dive into your store's operational excellence.",
      chatResponse: "Chat Response",
      shippingSpeed: "Shipping Speed",
      returnRate: "Return Rate",
      rating: "Rating",
      aiHealthRec: "AI Health Recommendations",
      healthRec1: "Your chat response rate is excellent! Keep using AI Auto-Reply to maintain this score during peak hours.",
      healthRec2: "Shipping speed for Tokopedia orders slightly decreased last week. Consider optimizing your packing workflow on Mondays.",
      compPriceTracker: "Competitor Price Tracker",
      me: "Me",
      market: "Market",
      warning: "Warning",
      optimal: "Optimal",
      competitive: "Competitive",
      globalTrendPred: "Global Trend Prediction",
      globalTrendDesc: "AI models predict a 30% surge in 'Eco-friendly Sportswear' demand in Southeast Asia next quarter.",
      exploreNiche: "Explore Niche",
      aiPromptPlaceholder: "Example: Lightweight mesh running shoes, breathable, suitable for running and walking, available in black & white...",
      trendPromptPlaceholder: "Example: Men's face skincare, women's sportswear, gaming phone accessories...",
      tiktokVideo: "TikTok Video",
      marketplace: "Marketplace",
      instagramFeed: "Instagram Feed",
      sneakersA1: "Sneakers A1",
      premiumTee: "Premium Tee",
      hoodieUrban: "Hoodie Urban",
      newProductDesc: "Add a new product to your inventory catalog.",
      productName: "Product Name",
      productNamePlaceholder: "Ex: Running Shoes",
      skuPlaceholder: "Ex: SPR-001",
      initialStock: "Initial Stock",
      pricePlaceholder: "150000",
      saveProduct: "Save Product",
      simulatedAlert: "This is a simulation. Database save feature is coming soon!",
      'Hari Ini': 'Today',
      'Bulan Ini': 'This Month',
      '1 Bulan Terakhir': 'Last 1 Month',
      '2 Bulan Terakhir': 'Last 2 Months',
      '3 Bulan Terakhir': 'Last 3 Months',
      profitHariIni: "Today's Profit",
      allPlatforms: "All Platforms",
      omzetFilterAll: "All",
      omzetFilterToday: "Today",
      omzetFilterYesterday: "Yesterday",
      omzetFilterWeek: "Last 7 Days",
      omzetFilterMonth: "Last Month",
      omzetFilter2Month: "Last 2 Months",
      omzetFilter3Month: "Last 3 Months",
      trendRadarAI: "AI Trend Radar",
      trendSampleLabel: "Sample Categories",
      trendAnalysisResult: "Analysis Result",
      supportCenter: "Support Center",
      reportBug: "Report a Bug",
      bugDesc: "Found an issue? Report it to our team so we can fix it immediately.",
      suggestFeature: "Feature Suggestion",
      featureDesc: "Have a great idea? Share it with us to help Tokcer AI grow.",
      bugTitleLabel: "Issue Title",
      bugTitlePlaceholder: "Ex: Error while generating content",
      bugDetailLabel: "Issue Details",
      bugDetailPlaceholder: "Explain the steps to reproduce the bug...",
      featureTitleLabel: "Feature Title",
      featureTitlePlaceholder: "Ex: WhatsApp Integration",
      featureDetailLabel: "Feature Description",
      featureDetailPlaceholder: "Explain how this feature would help you...",
      uploadScreenshot: "Upload Screenshot",
      sendReport: "Send Report",
      sending: "Sending...",
      supportSuccess: "Successfully Sent!",
      supportSuccessDesc: "Thank you for your feedback! Our team will review your report soon.",
      backToDashboard: "Back to Dashboard",
      videoContent: "Video Content",
      textContent: "Text Content",
      weeklyViralTopics: "Weekly Viral Topics",
      liveDataSampling: "Live Data Sampling",
      aiSummary: "AI Summary",
      marketConfidence: "Market Confidence",
      planActive: "Active Plan",
      ultimatePlan: "Ultimate",
      active: "Active",
      aiQuota: "AI Quota",
      validUntil: "Valid until",
      supportDesc: "We are ready to help you 24/7.",
      revenueLabel: "Revenue",
      profitLabel: "Profit",
      vsYesterday: "vs yesterday",
      noDataToday: "No data today",
      noProfitData: "No profit data",
      basedOnVisitors: "Based on active visitors",
      filteredData: "Filtered data",
      estMargin: "Estimated 20% margin",
      systemNotif: "System Notifications",
      aiQuotaTitle: "AI Generator Quota",
      tiktokIntegration: "TikTok Shop Integration",
      specialPromoTitle: "Special Promo",
      justNow: "Just now",
      "2hrsAgo": "2 hrs ago",
      "1dayAgo": "1 day ago",
      customer: "Customer",
      runningLow: "Running Low",
      outOfStock: "Out of Stock",
      stockHealthy: "Stock is safe and healthy",
      noRecentTrx: "No recent transactions",
    }
  };

  const t = (key) => translations[lang][key] || key;
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
      
      if (session) {
        setUser(session.user);
        // Fetch profile and tokens
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (prof) {
            // Support both 'tokens' and 'ai_credits_remaining'
            const activeTokens = prof.tokens !== undefined ? prof.tokens : prof.ai_credits_remaining;
            setProfile({ ...prof, tokens: activeTokens });
        }

        // AUTO-CONNECT STORES FROM METADATA
        const metadata = session.user.user_metadata;
        if (metadata?.platforms && metadata?.store_links) {
            await autoConnectStores(session.user.id, metadata.platforms, metadata.store_links);
        }

        // FETCH OPERATIONAL DATA
        fetchOperationalData(session.user.id);
      } else if (isAdmin) {
        setUser({ email: 'admin@tokcer-ai.com', id: 'admin-bypass' });
        setProfile({ full_name: 'Administrator', tokens: 999, role: 'admin' });
      }
    };

    const autoConnectStores = async (userId, platforms, links) => {
        try {
            // Check if already connected
            const { data: existing } = await supabase
                .from('marketplace_connections')
                .select('id')
                .eq('user_id', userId);
            
            if (existing && existing.length > 0) return;

            // Create connections
            const connections = platforms.map(plat => ({
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

    const handleImportOrders = async (data) => {
        if (!user || data.length === 0) return;
        
        setIsFetchingOperational(true);
        try {
            const formattedData = data.map(item => ({
                user_id: user.id,
                order_number: item.order_number,
                customer_name: item.customer_name,
                platform: item.platform,
                total_amount: Number(item.total_amount || 0),
                status: item.status || 'completed',
                order_date: item.order_date || new Date().toISOString()
            }));

            const { error } = await supabase.from('orders').insert(formattedData);
            if (error) throw error;
            
            alert(`✅ Berhasil mengimpor ${data.length} transaksi!`);
            fetchOperationalData(user.id);
        } catch (err) {
            console.error("Import Error:", err);
            alert("❌ Gagal mengimpor data. Pastikan format CSV benar.");
        } finally {
            setIsFetchingOperational(false);
        }
    };

    const handleImportProducts = async (data) => {
        if (!user || data.length === 0) return;
        
        setIsFetchingOperational(true);
        try {
            const formattedData = data.map(item => ({
                user_id: user.id,
                name: item.name,
                sku: item.sku,
                stock: Number(item.stock || 0),
                price: Number(item.price || 0),
                description: item.description || ''
            }));

            const { error } = await supabase.from('products').insert(formattedData);
            if (error) throw error;
            
            alert(`✅ Berhasil mengimpor ${data.length} produk ke katalog!`);
            fetchOperationalData(user.id);
        } catch (err) {
            console.error("Import Error:", err);
            alert("❌ Gagal mengimpor produk. Pastikan format CSV benar.");
        } finally {
            setIsFetchingOperational(false);
        }
    };

    const fetchOperationalData = async (userId) => {
        setIsFetchingOperational(true);
        try {
            // Fetch Products
            const { data: prodData } = await supabase
                .from('products')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (prodData) setProducts(prodData);

            // Fetch Orders
            const { data: ordData } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('order_date', { ascending: false });
            if (ordData) setOrders(ordData);
        } catch (err) {
            console.error("Fetch Operational Error:", err);
        } finally {
            setIsFetchingOperational(false);
        }
    };

    const getPlatformStats = () => {
        const stats = {
            tiktok: { revenue: 0, orders: 0 },
            shopee: { revenue: 0, orders: 0 },
            tokopedia: { revenue: 0, orders: 0 },
            other: { revenue: 0, orders: 0 }
        };
        
        orders.forEach(o => {
            const p = (o.platform || 'other').toLowerCase();
            if (stats[p]) {
                stats[p].revenue += Number(o.total_amount || 0);
                stats[p].orders += 1;
            } else {
                stats.other.revenue += Number(o.total_amount || 0);
                stats.other.orders += 1;
            }
        });
        return stats;
    };

    const callDeepSeek = async (system, prompt) => {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-34bbe3cdd5664996a4777f4e6c21aba0'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: system },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    };

    const fetchTrends = async () => {
        setIsFetchingTrends(true);
        try {
            const bizType = profile?.business_type || 'E-commerce';
            const systemPrompt = "You are an AI Market Analyst for Tokcer AI. Return ONLY a JSON object with 'topics' (array of 3 objects with topic, platform, trend_percent, color_class) and 'summary' (object with summary, risk, strategy).";
            const result = await callDeepSeek(systemPrompt, "Fetch current viral trends for " + bizType);
            const data = JSON.parse(result.replace(/```json|```/g, '').trim());
            if (data.topics) setViralTopics(data.topics);
            if (data.summary) setLiveSummary(data.summary);
        } catch (e) { console.error(e); }
        finally { setIsFetchingTrends(false); }
    };

    const handleGenerate = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        try {
            const systemPrompt = `You are an expert ${aiFormat} writer for Tokcer AI.`;
            const result = await callDeepSeek(systemPrompt, aiPrompt);
            setAiResult(result);
        } catch (e) { console.error(e); }
        finally { setIsGenerating(false); }
    };

    getUser();
  }, []);

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
    localStorage.removeItem('tokcer_admin_auth');
    await supabase.auth.signOut();
    navigate('/login');
  };

  const callDeepSeek = async (systemPrompt, userMessage) => {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('API Key AI Generator belum dikonfigurasi. Silakan isi VITE_DEEPSEEK_API_KEY di file .env Anda.');
    }
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2, // Increased slightly for variety while maintaining high accuracy
        max_tokens: 2048,
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Request gagal dengan status ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'AI tidak memberikan respons.';
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt || !user) return;
    
    // 1. Check Credits (Bypass for Admin)
    const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
    if (!isAdmin && (!profile || (profile.tokens || 0) < 1)) {
      setAiResult("⚠️ Maaf, sisa token AI Anda habis. Silakan hubungi admin untuk top-up.");
      return;
    }

    setIsGenerating(true);
    setAiResult('');

    try {
      // 2. Fetch RAG Config from Supabase
      const { data: config } = await supabase
        .from('ai_configs')
        .select('*')
        .eq('type', 'generator')
        .single();

      const systemPrompt = config?.system_prompt || `Kamu adalah Copywriter Senior spesialis e-commerce Indonesia. Gunakan Bahasa Indonesia yang natural.`;
      const ragKnowledge = config?.rag_knowledge_base ? `\n\nGunakan referensi pengetahuan berikut ini untuk menjawab (Strict Knowledge):\n${config.rag_knowledge_base}` : '';
      
      const fullSystemPrompt = `${systemPrompt}${ragKnowledge}`;
      const userMessage = `Buat konten promosi format "${aiFormat}" untuk produk berikut:\n\n${aiPrompt}\n\nSertakan: Hook yang menarik, Body (penjelasan produk), dan CTA yang kuat.`;

      // 3. Call DeepSeek
      const result = await callDeepSeek(fullSystemPrompt, userMessage);
      setAiResult(result);

      // 4. Update Tokens & Log Usage (Only for non-admin)
      if (!isAdmin) {
        const currentTokens = profile.tokens !== undefined ? profile.tokens : (profile.ai_credits_remaining || 0);
        const newTokens = currentTokens - 1;
        
        // Update either tokens or ai_credits_remaining based on what's available
        const updateData = profile.tokens !== undefined ? { tokens: newTokens } : { ai_credits_remaining: newTokens };
        await supabase.from('profiles').update(updateData).eq('id', user.id);
        
        setProfile({ ...profile, tokens: newTokens });

        await supabase.from('ai_usage_logs').insert([{
          user_id: user.id,
          prompt: userMessage,
          response: result,
          tokens_used: 1,
          feature: 'content_generator'
        }]);
      }

    } catch (e) {
      setAiResult(`❌ Error: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeTrend = async () => {
    if (!trendPrompt || !user) return;

    // 1. Check Credits (Bypass for Admin)
    const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
    if (!isAdmin && (!profile || (profile.tokens || 0) < 1)) {
      setTrendResult("⚠️ Maaf, sisa token AI Anda habis.");
      return;
    }

    setIsTrendAnalyzing(true);
    setTrendResult('');

    try {
      // 2. Fetch RAG Config for Analyst
      const { data: config } = await supabase
        .from('ai_configs')
        .select('*')
        .eq('type', 'market_analyst')
        .single();

      const systemPrompt = config?.system_prompt || `You are an elite Market Research Analyst for the Indonesian e-commerce market. 
      Analyze the viral potential, competitor pricing landscape, and supply-chain risks for the specific category provided.
      Be specific and provide unique insights. Compare TikTok Shop (viral/content-driven) vs Shopee (search/price-driven).
      
      Format your response as a JSON object with these keys: 
      "trend": (detailed current market trend), 
      "demo": (specific target audience profile), 
      "top5": (array of 5 specific high-potential products), 
      "risk": (potential business risks),
      "strategy": (actionable execution strategy).`;
      
      const result = await callDeepSeek(systemPrompt, trendPrompt);
      setTrendResult(result);

      // Log Usage
      if (!isAdmin) {
        const currentTokens = profile.tokens !== undefined ? profile.tokens : (profile.ai_credits_remaining || 0);
        await supabase.from('profiles').update({ tokens: currentTokens - 1 }).eq('id', user.id);
        setProfile({ ...profile, tokens: currentTokens - 1 });
      }
    } catch (e) {
      console.error(e);
      setTrendResult("Maaf, terjadi kesalahan saat menganalisa tren.");
    } finally {
      setIsTrendAnalyzing(false);
    }
  };

  const fetchGlobalMarketTrends = async () => {
    if (viralTopics.length > 0 || isFetchingTrends) return;
    setIsFetchingTrends(true);
    try {
      const bizType = profile?.business_type || 'General E-commerce';
      const systemPrompt = `You are a Market Trend Scout. Provide 3 viral topics and a short live summary for the "${bizType}" category in Indonesia. 
      Format: JSON object with keys: "topics" (array of {topic, platform, trend_percent, color_class}), "summary" (string).`;
      
      const result = await callDeepSeek(systemPrompt, "Fetch current viral trends for " + bizType);
      const cleanJson = result.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);
      
      if (data.topics) setViralTopics(data.topics);
      if (data.summary) setLiveSummary(data.summary);
    } catch (e) {
      console.error("Fetch Trends Error:", e);
      // Fallback
      setViralTopics([
        { topic: 'Local Pride Brand', platform: 'TikTok', trend_percent: '+120%', color_class: 'text-orange-500' },
        { topic: 'Budget Skincare', platform: 'Shopee', trend_percent: '+88%', color_class: 'text-pink-500' }
      ]);
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
    setIsSubmittingSupport(true);
    
    // Simulate API call to send email
    setTimeout(() => {
      console.log('Support Report Submitted:', {
        type: supportType,
        title: supportTitle,
        description: supportDesc,
        file: supportFile?.name
      });
      setIsSubmittingSupport(false);
      setSupportSubmitted(true);
      
      // Reset form
      setSupportTitle('');
      setSupportDesc('');
      setSupportFile(null);
      setSupportFilePreview(null);
    }, 2000);
  };


  const renderContent = () => {
    switch (activeMenu) {
      case 'tab-admin':
        return (
          <DashboardAdmin 
            adminClients={adminClients}
            isAdminLoading={isAdminLoading}
            handleApproveClient={handleApproveClient}
          />
        );
      case 'tab-dash':
        return (
          <DashboardOverview 
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
          />
        );
      case 'tab-omzet':
        return (
          <DashboardRevenue 
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
            setOmzetTimeFilter={setOmzetTimeFilter}
            showOmzetTimeDropdown={showOmzetTimeDropdown}
            setShowOmzetTimeDropdown={setShowOmzetTimeDropdown}
            handleDownloadReport={handleDownloadReport}
            handleImportOrders={handleImportOrders}
          />
        );
      case 'tab-inventory':
        return (
          <DashboardInventory 
            t={t}
            products={products}
            setShowProductModal={setShowProductModal}
            handleImportProducts={handleImportProducts}
          />
        );
      case 'tab-analytics':
        return (
          <DashboardAnalytics 
            t={t}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            showFilterDropdown={showFilterDropdown}
            setShowFilterDropdown={setShowFilterDropdown}
            analyticsPlatform={analyticsPlatform}
            setAnalyticsPlatform={setAnalyticsPlatform}
            showAnalyticsPlatformDropdown={showAnalyticsPlatformDropdown}
            setShowAnalyticsPlatformDropdown={setShowAnalyticsPlatformDropdown}
            lang={lang}
          />
        );
      case 'tab-health':
        return (
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
      case 'tab-ai':
        return (
          <DashboardAI 
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
          <MarketIntel 
            t={t}
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
          <DashboardSupport 
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
          <DashboardAccount 
            t={t}
            lang={lang}
            securityMessage={securityMessage}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isUpdatingPassword={isUpdatingPassword}
            handleUpdatePassword={handleUpdatePassword}
          />
        );
      case 'tab-connections':
        return (
          <MarketplaceSync 
            t={t}
            lang={lang}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-['Inter',sans-serif] overflow-hidden">
      <DashboardSidebar 
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
        <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-800 shadow-xl">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Tokcer AI" className="h-7 w-auto" />
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-all active:scale-95"
            aria-label="Open Sidebar"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Menu</span>
            <iconify-icon icon="solar:hamburger-menu-bold-duotone" className="text-xl text-orange-500"></iconify-icon>
          </button>
        </div>

        {/* Content Spacer for Fixed Header on Mobile */}
        <div className="h-16 lg:hidden"></div>

        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>

      <ProductModal isOpen={showProductModal} onClose={() => setShowProductModal(false)} t={t} />
    </div>
  );
};

export default Dashboard;
