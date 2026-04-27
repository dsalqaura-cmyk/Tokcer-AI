import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ProductModal from '../components/modals/ProductModal';
// Build Timestamp: 2026-04-27 10:45:00
import logo from '../assets/logo.png';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('tab-dash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('tokcer_lang') || 'id');
  const [user, setUser] = useState(null);
  const [aiSubTab, setAiSubTab] = useState('content');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiFormat, setAiFormat] = useState('TikTok Video');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [trendPrompt, setTrendPrompt] = useState('');
  const [isTrendAnalyzing, setIsTrendAnalyzing] = useState(false);
  const [trendResult, setTrendResult] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Bulan Ini');
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

  // Support Center States
  const [supportType, setSupportType] = useState('bug'); // 'bug' or 'feature'
  const [supportTitle, setSupportTitle] = useState('');
  const [supportDesc, setSupportDesc] = useState('');
  const [supportFile, setSupportFile] = useState(null);
  const [supportFilePreview, setSupportFilePreview] = useState(null);
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const translations = {
    id: {
      dashboard: "Dashboard",
      revenue: "Data Omzet",
      inventory: "Inventory",
      analytics: "Analytics",
      aiGenerator: "AI Generator",
      healthScore: "Health Score",
      marketIntel: "Market Intel",
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
      } else if (isAdmin) {
        setUser({ email: 'admin@tokcer-ai.com' });
      }
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
    if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
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
        temperature: 0.8,
        max_tokens: 1024,
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
    if (!aiPrompt) return;
    setIsGenerating(true);
    setAiResult('');
    const systemPrompt = `Kamu adalah Copywriter Senior spesialis e-commerce Indonesia. Tugas kamu membuat konten promosi yang menarik, persuasif, dan sesuai platform. Gunakan Bahasa Indonesia yang natural, tidak kaku. Output HARUS mengikuti format yang diminta user.`;
    const userMessage = `Buat konten promosi format "${aiFormat}" untuk produk berikut:\n\n${aiPrompt}\n\nSertakan: Hook yang menarik, Body (penjelasan produk), dan CTA yang kuat.`;
    try {
      const result = await callDeepSeek(systemPrompt, userMessage);
      setAiResult(result);
    } catch (e) {
      setAiResult(`❌ Error: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeTrend = async () => {
    if (!trendPrompt) return;
    setIsTrendAnalyzing(true);
    setTrendResult('');
    const systemPrompt = `Kamu adalah Market Research Analyst dan Data Analyst spesialis e-commerce Indonesia. Kamu memiliki pengetahuan mendalam tentang tren belanja online di Shopee, Tokopedia, dan TikTok Shop Indonesia. Berikan analisis yang tajam, berbasis data, dan actionable dalam Bahasa Indonesia.`;
    const userMessage = `Lakukan analisis Market Trend Radar untuk kategori/niche berikut di Indonesia:\n\n"${trendPrompt}"\n\nBerikan analisis mencakup:\n1. 🔥 Tren Terkini (apa yang sedang viral/naik)
2. 🎯 Target Demografi Utama
3. 💡 Top 5 Produk Paling Potensial untuk Dijual
4. ⚠️ Risiko & Kompetitor yang Perlu Diwaspadai
5. 🚀 Rekomendasi Strategi Berjualan`;
    try {
      const result = await callDeepSeek(systemPrompt, userMessage);
      setTrendResult(result);
    } catch (e) {
      setTrendResult(`❌ Error: ${e.message}`);
    } finally {
      setIsTrendAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    // Generate simple CSV content for Excel
    const csvRows = [
      ['Order ID', 'Produk Terjual', 'Platform', 'Nominal (Rp)', 'Status', 'Tanggal'],
      ['#TK-9921', 'Sepatu Sneakers A1', 'TikTok', '350000', 'Selesai', '2023-10-24'],
      ['#SP-8834', 'Kaos Polos Premium', 'Shopee', '120000', 'Dikirim', '2023-10-24'],
      ['#TP-7712', 'Jaket Hoodie Urban', 'Tokopedia', '450000', 'Selesai', '2023-10-23'],
      ['#TK-9920', 'Topi Baseball Hitam', 'TikTok', '85000', 'Selesai', '2023-10-23'],
      ['#SP-8833', 'Kemeja Flannel Pria', 'Shopee', '180000', 'Selesai', '2023-10-22'],
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Laporan_Omzet_TokcerAI.csv");
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

  const renderSupportCenter = () => {
    if (supportSubmitted) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
            <iconify-icon icon="solar:check-circle-bold" className="text-5xl text-emerald-500"></iconify-icon>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t('supportSuccess')}</h2>
          <p className="text-zinc-400 max-w-sm mb-8">{t('supportSuccessDesc')}</p>
          <button 
            onClick={() => { setSupportSubmitted(false); setActiveMenu('tab-dash'); }}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            {t('backToDashboard')}
          </button>
        </div>
      );
    }

    return (
      <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header>
          <h2 className="text-2xl font-semibold text-white tracking-tight">{t('supportCenter')}</h2>
          <p className="text-xs text-zinc-400 mt-1">{t('supportDesc')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bug Report Option */}
          <div 
            onClick={() => setSupportType('bug')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${supportType === 'bug' ? 'bg-orange-950/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${supportType === 'bug' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              <iconify-icon icon="solar:danger-bold" className="text-2xl"></iconify-icon>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('reportBug')}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{t('bugDesc')}</p>
          </div>

          {/* Feature Suggestion Option */}
          <div 
            onClick={() => setSupportType('feature')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${supportType === 'feature' ? 'bg-orange-950/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${supportType === 'feature' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              <iconify-icon icon="solar:lightbulb-bold" className="text-2xl"></iconify-icon>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('suggestFeature')}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{t('featureDesc')}</p>
          </div>
        </div>

        <form onSubmit={handleSupportSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
                {supportType === 'bug' ? t('bugTitleLabel') : t('featureTitleLabel')}
              </label>
              <input 
                type="text" 
                required
                value={supportTitle}
                onChange={(e) => setSupportTitle(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-600"
                placeholder={supportType === 'bug' ? t('bugTitlePlaceholder') : t('featureTitlePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
                {supportType === 'bug' ? t('bugDetailLabel') : t('featureDetailLabel')}
              </label>
              <textarea 
                required
                rows="5"
                value={supportDesc}
                onChange={(e) => setSupportDesc(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-600 resize-none"
                placeholder={supportType === 'bug' ? t('bugDetailPlaceholder') : t('featureDetailPlaceholder')}
              ></textarea>
            </div>

            {supportType === 'bug' && (
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
                  {t('uploadScreenshot')}
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all">
                    <iconify-icon icon="solar:camera-linear" className="text-lg"></iconify-icon>
                    {supportFile ? supportFile.name : t('uploadScreenshot')}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                  {supportFilePreview && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-700">
                      <img src={supportFilePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => { setSupportFile(null); setSupportFilePreview(null); }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <iconify-icon icon="solar:trash-bin-trash-bold" className="text-white"></iconify-icon>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmittingSupport}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white py-4 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmittingSupport ? (
              <><iconify-icon icon="solar:spinner-linear" className="text-xl animate-spin"></iconify-icon> {t('sending')}</>
            ) : (
              <><iconify-icon icon="solar:send-square-bold" className="text-xl"></iconify-icon> {t('sendReport')}</>
            )}
          </button>
        </form>
      </div>
    );
  };

  const renderAdminApproval = () => {
    return (
      <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Dashboard Internal Admin</h2>
          <p className="text-xs text-zinc-400 mt-1">Review dan aktivasi pendaftaran dari Partner.</p>
        </header>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-zinc-800/50">
                  <th className="px-6 py-4">Toko / Partner</th>
                  <th className="px-6 py-4">Paket / Bayar</th>
                  <th className="px-6 py-4">Bukti</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {adminClients.length === 0 && !isAdminLoading && (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-zinc-500 italic">Belum ada data pendaftaran.</td>
                  </tr>
                )}
                {adminClients.map((client) => (
                  <tr key={client.id} className="border-b border-zinc-800/30 hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">{client.shop_name}</div>
                      <div className="text-[10px] text-zinc-500">{client.email}</div>
                      <div className="text-[9px] text-orange-500 font-black mt-1 uppercase tracking-tighter">BY: {client.partners?.full_name || 'Partner Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-zinc-300 uppercase">{client.plan}</div>
                      <div className="text-[10px] text-zinc-500 uppercase">{client.payment_method}</div>
                    </td>
                    <td className="px-6 py-4">
                      {client.payment_proof_url ? (
                        <button className="text-orange-500 hover:underline text-[10px] font-bold" onClick={() => window.open(client.payment_proof_url)}>Lihat Bukti</button>
                      ) : (
                        <span className="text-zinc-600 text-[10px]">No File</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase border ${
                        client.status === 'active' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 'text-amber-500 border-amber-500/20 bg-amber-500/10'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {client.status === 'pending' && (
                        <button 
                          onClick={() => handleApproveClient(client.id, client.email, client.shop_name)}
                          disabled={isAdminLoading}
                          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20 transition-all"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'tab-admin': return renderAdminApproval();
      case 'tab-dash': {
        // Dynamic dummy data based on time filter
        let estimasiProfit = "Rp 42.120.000";
        let estimasiOmzet = "Rp 128.450.000";
        
        if (timeFilter === 'Hari Ini') {
          estimasiProfit = "Rp 1.400.000";
          estimasiOmzet = "Rp 4.250.000";
        } else if (timeFilter === '1 Bulan Terakhir') {
          estimasiProfit = "Rp 40.500.000";
          estimasiOmzet = "Rp 120.000.000";
        } else if (timeFilter === '2 Bulan Terakhir') {
          estimasiProfit = "Rp 78.000.000";
          estimasiOmzet = "Rp 230.500.000";
        } else if (timeFilter === '3 Bulan Terakhir') {
          estimasiProfit = "Rp 115.200.000";
          estimasiOmzet = "Rp 340.800.000";
        }

        return (
          <div className="relative z-10 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">{t('overview')}</h2>
                <p className="text-xs text-zinc-400 mt-1">{t('monitorShop')}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto z-50">
                {/* Platform Filter */}
                <div className="relative w-full sm:w-auto">
                  <div
                    onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                    className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
                  >
                    <div className="flex items-center gap-2">
                      <iconify-icon icon="solar:filter-linear" className="text-orange-500"></iconify-icon>
                      {platformFilter === 'all' ? t('allPlatforms') : platformFilter}
                    </div>
                    <iconify-icon icon={showPlatformDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="sm:ml-2 text-zinc-500"></iconify-icon>
                  </div>
                  {showPlatformDropdown && (
                    <div className="absolute top-full left-0 sm:right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-[60] py-1 overflow-hidden">
                      {[['all', t('allPlatforms')], ['TikTok', 'TikTok Shop'], ['Shopee', 'Shopee'], ['Tokopedia', 'Tokopedia']].map(([val, label]) => (
                        <div
                          key={val}
                          onClick={() => { setPlatformFilter(val); setShowPlatformDropdown(false); }}
                          className={`px-4 py-2 text-xs cursor-pointer flex items-center gap-2 transition-colors ${platformFilter === val ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                        >
                          {val === 'TikTok' && <iconify-icon icon="ri:tiktok-fill" className="text-sm"></iconify-icon>}
                          {val === 'Shopee' && <iconify-icon icon="simple-icons:shopee" className="text-sm text-orange-500"></iconify-icon>}
                          {val === 'Tokopedia' && <iconify-icon icon="solar:shop-2-linear" className="text-sm text-teal-400"></iconify-icon>}
                          {val === 'all' && <iconify-icon icon="solar:widget-linear" className="text-sm text-orange-400"></iconify-icon>}
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Period Filter */}
                <div className="relative w-full sm:w-auto">
                  <div 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
                  >
                    <div className="flex items-center gap-2">
                      <iconify-icon icon="solar:calendar-linear"></iconify-icon> 
                      {t(timeFilter)}
                    </div>
                    <iconify-icon icon={showFilterDropdown ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="sm:ml-2 text-zinc-400"></iconify-icon>
                  </div>
                  {showFilterDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-[60] overflow-hidden">
                      <div className="py-1">
                        {['Hari Ini', 'Bulan Ini', '1 Bulan Terakhir', '2 Bulan Terakhir', '3 Bulan Terakhir'].map((option) => (
                          <div 
                            key={option}
                            onClick={() => {
                              setTimeFilter(option);
                              setShowFilterDropdown(false);
                            }}
                            className={`px-4 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${timeFilter === option ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                          >
                            {t(option)}
                            {timeFilter === option && <iconify-icon icon="solar:check-circle-bold" className="text-sm"></iconify-icon>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>
            
            {/* Row 1: Top Metrics Grid (4 columns) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Live Visitors */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-medium text-zinc-400">{t('visitors')}</div>
                  <div className="flex h-2 w-2 rounded-full bg-emerald-500 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <iconify-icon icon="ri:tiktok-fill" className="text-white text-lg"></iconify-icon>
                      <span className="text-[10px] text-zinc-400">TikTok Live</span>
                    </div>
                    <div className="text-lg font-semibold text-white tracking-tight">842</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <iconify-icon icon="ri:instagram-fill" className="text-pink-500 text-lg"></iconify-icon>
                      <span className="text-[10px] text-zinc-400">Insta Live</span>
                    </div>
                    <div className="text-lg font-semibold text-white tracking-tight">398</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wider">Total</span>
                  <span className="text-xs font-bold text-emerald-500">1,240</span>
                </div>
              </div>

              {/* Omzet Hari Ini — enhanced with profit */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-orange-500/30 transition-colors">
                <div className="text-xs font-medium text-zinc-400 mb-2">{t('omzetToday')}</div>
                <div className="text-2xl font-semibold text-white tracking-tight">Rp 4.25M</div>
                <div className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                  <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +12% {t('vsYesterday')}
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <div className="text-[10px] text-zinc-500 mb-1">{t('profitHariIni')}</div>
                  <div className="text-base font-semibold text-emerald-400">Rp 1.27M</div>
                  <div className="text-[10px] text-emerald-500 flex items-center gap-1 mt-0.5">
                    <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +8.5% {t('vsYesterday')}
                  </div>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-blue-500/30 transition-colors">
                <div className="text-xs font-medium text-zinc-400 mb-2">{t('convRate')}</div>
                <div className="text-2xl font-semibold text-white tracking-tight">4.8%</div>
                <div className="text-[10px] text-blue-500 mt-1 flex items-center gap-1">
                  <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> {t('industryAvg')}
                </div>
              </div>

              {/* Health Score */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-amber-500/30 transition-colors flex flex-col justify-between">
                <div className="text-xs font-medium text-zinc-400 mb-2 flex items-center gap-2">
                  {t('healthTitle')}
                  <iconify-icon icon="solar:shield-check-linear" className="text-amber-500"></iconify-icon>
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-semibold text-amber-500 tracking-tight">92</div>
                  <div className="text-[10px] text-zinc-500 mb-1">/100</div>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            {/* Row 2: Analytics & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Chart & Profit - 2/3 width */}
              <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
                  <div>
                    <div className="text-xs font-medium text-zinc-400 mb-1">{t('estProfit')} ({t(timeFilter)})</div>
                    <div className="text-3xl font-semibold text-white tracking-tight">{estimasiProfit}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-zinc-400 mb-1">{t('totOmzet')} ({t(timeFilter)})</div>
                    <div className="text-xl font-semibold text-zinc-300">{estimasiOmzet}</div>
                  </div>
                </div>


                {/* Combined Bar + Line Chart */}
                {(() => {
                  const chartData = {
                    'Hari Ini': {
                      labels: ['08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
                      omzet:   [15, 28, 45, 60, 72, 100, 88, 65],
                      profit:  [10, 18, 28, 38, 45,  62, 55, 40],
                    },
                    'Bulan Ini': {
                      labels: lang === 'id' ? ['Mg 1','Mg 2','Mg 3','Mg 4'] : ['Wk 1','Wk 2','Wk 3','Wk 4'],
                      omzet:   [45, 70, 85, 100],
                      profit:  [28, 42, 55,  62],
                    },
                    '1 Bulan Terakhir': {
                      labels: lang === 'id' ? ['Mg 1','Mg 2','Mg 3','Mg 4'] : ['Wk 1','Wk 2','Wk 3','Wk 4'],
                      omzet:   [60, 80, 75, 90],
                      profit:  [35, 50, 45, 56],
                    },
                    '2 Bulan Terakhir': {
                      labels: lang === 'id' ? ['Bln 1','Bln 2'] : ['Mo 1','Mo 2'],
                      omzet:   [80, 100],
                      profit:  [48,  62],
                    },
                    '3 Bulan Terakhir': {
                      labels: lang === 'id' ? ['Jan','Feb','Mar'] : ['Jan','Feb','Mar'],
                      omzet:   [70, 85, 100],
                      profit:  [42, 52,  62],
                    },
                  };
                  const data = chartData[timeFilter] || chartData['Bulan Ini'];
                  const maxVal = Math.max(...data.omzet, 100);
                  const n = data.labels.length;
                  const W = 400; const H = 140; const pad = 16;
                  const colW = (W - pad * 2) / n;
                  const barW = colW * 0.45;
                  const toY = (v) => pad + (1 - v / maxVal) * (H - pad * 2);
                  // line path
                  const pts = data.profit.map((v, i) => [
                    pad + i * colW + colW / 2,
                    toY(v)
                  ]);
                  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
                  const areaPath = linePath + ` L${pts[n-1][0].toFixed(1)},${H-pad} L${pts[0][0].toFixed(1)},${H-pad} Z`;
                  return (
                    <div className="bg-black border border-zinc-800 rounded-xl p-3 flex-1 mt-auto">
                      {/* Legend */}
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-sm bg-orange-600"></div>
                          <span className="text-[10px] text-zinc-400">{t('revenueLabel')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-0.5 bg-emerald-400"></div>
                          <span className="text-[10px] text-zinc-400">{t('profitLabel')}</span>
                        </div>
                      </div>
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{height:'130px'}}>
                        {/* Grid lines */}
                        {[0.25,0.5,0.75].map(f => (
                          <line key={f} x1={pad} y1={toY(maxVal*f)} x2={W-pad} y2={toY(maxVal*f)}
                            stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="4,4" />
                        ))}
                        {/* Bars */}
                        {data.omzet.map((v, i) => {
                          const x = pad + i * colW + (colW - barW) / 2;
                          const y = toY(v);
                          const h = H - pad - y;
                          return <rect key={i} x={x} y={y} width={barW} height={h}
                            fill={v === Math.max(...data.omzet) ? '#ea580c' : '#7c2d12'}
                            rx="3" opacity="0.85" />;
                        })}
                        {/* Area under profit line */}
                        <path d={areaPath} fill="#10b981" opacity="0.1" />
                        {/* Profit line */}
                        <path d={linePath} fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />
                        {/* Profit dots */}
                        {pts.map((p, i) => (
                          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#34d399" stroke="#000" strokeWidth="1" />
                        ))}
                        {/* X-axis labels */}
                        {data.labels.map((lb, i) => (
                          <text key={i} x={pad + i * colW + colW / 2} y={H - 1}
                            textAnchor="middle" fontSize="8" fill="#71717a">{lb}</text>
                        ))}
                      </svg>
                    </div>
                  );
                })()}
              </div>

              {/* System Notifications - 1/3 width */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col">
                <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <iconify-icon icon="solar:bell-bing-linear" className="text-orange-500"></iconify-icon>
                  {t('notif')}
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[250px]">
                  <div className="bg-black border border-zinc-800 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs font-medium text-white">{t('quota')}</div>
                      <div className="text-[10px] text-zinc-500">Just now</div>
                    </div>
                    <div className="text-[10px] text-zinc-400 mb-2">{t('quotaDesc')}</div>
                    <div className="w-full bg-zinc-800 rounded-full h-1">
                      <div className="bg-orange-500 h-1 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-black border border-zinc-800 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs font-medium text-white">{t('tiktokIntegrate')}</div>
                      <div className="text-[10px] text-zinc-500">2 hrs ago</div>
                    </div>
                    <div className="text-[10px] text-zinc-400">{t('tiktokIntegrateDesc')}</div>
                  </div>

                  <div className="bg-black border border-zinc-800 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs font-medium text-white">{t('specialPromo')}</div>
                      <div className="text-[10px] text-zinc-500">1 day ago</div>
                    </div>
                    <div className="text-[10px] text-zinc-400">{t('specialPromoDesc')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Activities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Transactions */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-semibold text-white">{t('recentTrx')}</div>
                  <button onClick={() => setActiveMenu('tab-omzet')} className="text-xs text-orange-500 hover:text-orange-400 transition-colors">{t('viewAll')}</button>
                </div>
                <div className="space-y-3">
                  {[
                    { id: '#TK-9921', item: 'Sepatu Sneakers A1', price: 'Rp 350.000', platform: 'TikTok', icon: 'ri:tiktok-fill', color: 'text-zinc-300' },
                    { id: '#SP-8834', item: 'Kaos Polos Premium', price: 'Rp 120.000', platform: 'Shopee', icon: 'simple-icons:shopee', color: 'text-orange-500' },
                    { id: '#TP-7712', item: 'Jaket Hoodie Urban', price: 'Rp 450.000', platform: 'Tokopedia', icon: 'simple-icons:tokopedia', color: 'text-teal-400' }
                  ].map((trx, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center ${trx.color}`}>
                          <iconify-icon icon={trx.icon}></iconify-icon>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-white">{trx.item}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{trx.id} • {trx.platform}</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-white">{trx.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-semibold text-white">{t('lowStock')}</div>
                  <button onClick={() => setActiveMenu('tab-inventory')} className="text-xs text-orange-500 hover:text-orange-400 transition-colors">{t('manageInv')}</button>
                </div>
                <div className="space-y-3">
                  {[
                    { item: 'Jaket Hoodie Urban (Abu)', sku: 'JH-URB-GRY', stock: 0, status: t('outOfStock'), statusColor: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
                    { item: 'Kaos Polos Premium (Hitam)', sku: 'KP-PRM-BLK', stock: 12, status: t('runningLow'), statusColor: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
                    { item: 'Celana Cargo Pria (Cream)', sku: 'CC-M-CRM', stock: 15, status: t('runningLow'), statusColor: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' }
                  ].map((prod, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-colors">
                      <div>
                        <div className="text-xs font-medium text-white">{prod.item}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{t('sku')}: {prod.sku}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`text-xs font-semibold ${prod.statusColor}`}>{prod.stock} Pcs</div>
                        <div className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 border ${prod.bg} ${prod.statusColor}`}>{prod.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'tab-omzet':
        return (
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">{t('revenue')}</h2>
                <p className="text-xs text-zinc-400 mt-1">{t('revenueDesc') || 'Detailed sales performance across multiple channels.'}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
                {/* Platform Filter Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <div
                    onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                    className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-700 transition-colors w-full justify-between sm:justify-start"
                  >
                    <iconify-icon icon="solar:filter-linear" className="text-orange-500"></iconify-icon>
                    {platformFilter === 'all' ? t('allPlatforms') : platformFilter}
                    <iconify-icon icon={showPlatformDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="text-zinc-500"></iconify-icon>
                  </div>
                  {showPlatformDropdown && (
                    <div className="absolute top-full right-0 mt-1 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                      {[['all', t('allPlatforms')], ['TikTok', 'TikTok Shop'], ['Shopee', 'Shopee'], ['Tokopedia', 'Tokopedia']].map(([val, label]) => (
                        <div
                          key={val}
                          onClick={() => { setPlatformFilter(val); setShowPlatformDropdown(false); }}
                          className={`px-4 py-2 text-xs cursor-pointer flex items-center gap-2 transition-colors ${platformFilter === val ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                        >
                          {val === 'TikTok' && <iconify-icon icon="ri:tiktok-fill" className="text-sm"></iconify-icon>}
                          {val === 'Shopee' && <iconify-icon icon="simple-icons:shopee" className="text-sm text-orange-500"></iconify-icon>}
                          {val === 'Tokopedia' && <iconify-icon icon="solar:shop-2-linear" className="text-sm text-teal-400"></iconify-icon>}
                          {val === 'all' && <iconify-icon icon="solar:widget-linear" className="text-sm text-orange-400"></iconify-icon>}
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Time Filter Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <div
                    onClick={() => setShowOmzetTimeDropdown(!showOmzetTimeDropdown)}
                    className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-700 transition-colors w-full justify-between sm:justify-start"
                  >
                    <iconify-icon icon="solar:calendar-linear" className="text-orange-500"></iconify-icon>
                    {omzetTimeFilter === 'all' ? t('omzetFilterAll') : t(`omzetFilter${omzetTimeFilter.charAt(0).toUpperCase() + omzetTimeFilter.slice(1)}`) || omzetTimeFilter}
                    <iconify-icon icon={showOmzetTimeDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="text-zinc-500"></iconify-icon>
                  </div>
                  {showOmzetTimeDropdown && (
                    <div className="absolute top-full right-0 mt-1 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                      {[
                        ['all', t('omzetFilterAll')],
                        ['Today', t('omzetFilterToday')],
                        ['Yesterday', t('omzetFilterYesterday')],
                        ['Week', t('omzetFilterWeek')],
                        ['Month', t('omzetFilterMonth')],
                        ['2Month', t('omzetFilter2Month')],
                        ['3Month', t('omzetFilter3Month')],
                      ].map(([val, label]) => (
                        <div
                          key={val}
                          onClick={() => { setOmzetTimeFilter(val); setShowOmzetTimeDropdown(false); }}
                          className={`px-4 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${omzetTimeFilter === val ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                        >
                          {label}
                          {omzetTimeFilter === val && <iconify-icon icon="solar:check-circle-bold" className="text-sm"></iconify-icon>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={handleDownloadReport} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm">
                  <iconify-icon icon="solar:download-linear" className="text-base"></iconify-icon>
                  {t('downloadReport')}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-orange-500/30 transition-colors">
                <div className="text-xs font-medium text-zinc-400 mb-2">{t('incomeToday')}</div>
                <div className="text-xl font-semibold text-white">Rp 4.250.000</div>
                <div className="text-[10px] text-orange-500 mt-2 flex items-center gap-1 font-medium">
                  <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +5.2%
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-orange-500/30 transition-colors">
                <div className="text-xs font-medium text-zinc-400 mb-2">{t('activeOrders')}</div>
                <div className="text-xl font-semibold text-white">32 <span className="text-xs font-normal text-zinc-500 ml-1">{t('orders')}</span></div>
                <div className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1 font-medium">
                  <iconify-icon icon="solar:clock-circle-linear"></iconify-icon> {t('processing')}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-amber-500/30 transition-colors">
                <div className="text-xs font-medium text-zinc-400 mb-2">{t('convRate')}</div>
                <div className="text-xl font-semibold text-amber-500">4.8%</div>
                <div className="text-[10px] text-amber-500 mt-2 flex items-center gap-1 font-medium">
                  <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +1.2%
                </div>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 shadow-sm w-full overflow-x-auto custom-scrollbar">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-12 gap-4 p-4 bg-black text-[10px] font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                  <div className="col-span-2">{t('orderId')}</div>
                  <div className="col-span-4">{t('productSold')}</div>
                  <div className="col-span-2">{t('platform')}</div>
                  <div className="col-span-2 text-right">{t('amount')}</div>
                  <div className="col-span-2 text-right">{t('status')}</div>
                </div>
                <div className="divide-y divide-zinc-800">
                  <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                    <div className="col-span-2 font-mono text-xs text-zinc-500">#TK-9921</div>
                    <div className="col-span-4 font-medium text-white truncate">Sepatu Sneakers A1</div>
                    <div className="col-span-2 flex items-center gap-1.5"><iconify-icon icon="ri:tiktok-fill" className="text-zinc-300"></iconify-icon> TikTok</div>
                    <div className="col-span-2 text-right text-white">Rp 350.000</div>
                    <div className="col-span-2 text-right flex justify-end">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/50 text-emerald-500 border border-emerald-900/50">{t('done')}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                    <div className="col-span-2 font-mono text-xs text-zinc-500">#SP-8834</div>
                    <div className="col-span-4 font-medium text-white truncate">Kaos Polos Premium</div>
                    <div className="col-span-2 flex items-center gap-1.5"><iconify-icon icon="simple-icons:shopee" className="text-orange-500"></iconify-icon> Shopee</div>
                    <div className="col-span-2 text-right text-white">Rp 120.000</div>
                    <div className="col-span-2 text-right flex justify-end">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/50 text-amber-500 border border-amber-900/50">{t('processing')}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                    <div className="col-span-2 font-mono text-xs text-zinc-500">#TP-7712</div>
                    <div className="col-span-4 font-medium text-white truncate">Jaket Hoodie Urban</div>
                    <div className="col-span-2 flex items-center gap-1.5"><iconify-icon icon="solar:shop-2-linear" className="text-teal-400"></iconify-icon> Tokopedia</div>
                    <div className="col-span-2 text-right text-white">Rp 450.000</div>
                    <div className="col-span-2 text-right flex justify-end">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/50 text-emerald-500 border border-emerald-900/50">{t('done')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tab-inventory':
        return (
          <div className="relative z-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-semibold text-white tracking-tight">{t('inventory')} & Catalog</h2>
              <button onClick={() => setShowProductModal(true)} className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                <iconify-icon icon="solar:add-circle-linear" className="text-base"></iconify-icon> 
                {t('addProduct')}
              </button>
            </header>
            
            <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 shadow-sm w-full overflow-x-auto custom-scrollbar">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-12 gap-4 p-4 bg-black text-xs font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                  <div className="col-span-5">{t('productSold')}</div>
                  <div className="col-span-3">{t('sku')}</div>
                  <div className="col-span-2 text-right">{t('stock')}</div>
                  <div className="col-span-2 text-right">{t('status')}</div>
                </div>
                <div className="divide-y divide-zinc-800">
                  {[
                    { name: 'Sepatu Sneakers A1', sku: 'SS-A1-BLU', stock: 142, status: t('optimal'), statusColor: 'text-orange-500' },
                    { name: 'Kaos Polos Premium', sku: 'KP-PRM-BLK', stock: 12, status: t('runningLow'), statusColor: 'text-amber-500' },
                    { name: 'Jaket Hoodie Urban', sku: 'JH-URB-GRY', stock: 0, status: t('outOfStock'), statusColor: 'text-rose-500' }
                  ].map((p, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800/50 transition-colors">
                      <div className="col-span-5 flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-orange-500 transition-colors border border-zinc-700 shrink-0"><iconify-icon icon="solar:sneakers-linear" className="text-xl"></iconify-icon></div>
                        <span className="font-medium text-white truncate">{p.name}</span>
                      </div>
                      <div className="col-span-3 text-zinc-500 font-mono text-xs bg-zinc-800 w-fit px-2 py-1 rounded border border-zinc-700 truncate">{p.sku}</div>
                      <div className="col-span-2 text-right text-white">{p.stock}</div>
                      <div className="col-span-2 text-right flex justify-end">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-medium uppercase tracking-wider shrink-0 ${p.status === t('optimal') ? 'bg-orange-950/50 text-orange-500 border border-orange-900/50' : p.status === t('runningLow') ? 'bg-amber-950/50 text-amber-500 border border-amber-900/50' : 'bg-rose-950/50 text-rose-500 border border-rose-900/50'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${p.status === t('optimal') ? 'bg-orange-500' : p.status === t('runningLow') ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></div> 
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'tab-analytics':
        return (
          <div className="relative z-10 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">{t('marketAnalytics')}</h2>
                <p className="text-sm text-zinc-400 mt-1">{t('analyticsDesc') || 'Performance analysis, tactical strategy, and profit optimization.'}</p>
              </div>
              <div className="relative w-full sm:w-auto">
                <div 
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
                >
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="solar:calendar-linear" className="text-orange-500"></iconify-icon> 
                    {t(timeFilter)}
                  </div>
                  <iconify-icon icon={showFilterDropdown ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="sm:ml-2 text-zinc-400"></iconify-icon>
                </div>
                {showFilterDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="py-1">
                      {['Hari Ini', 'Bulan Ini', '1 Bulan Terakhir', '2 Bulan Terakhir', '3 Bulan Terakhir'].map((option) => (
                        <div 
                          key={option}
                          onClick={() => { setTimeFilter(option); setShowFilterDropdown(false); }}
                          className={`px-4 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${timeFilter === option ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                        >
                          {t(option)}
                          {timeFilter === option && <iconify-icon icon="solar:check-circle-bold" className="text-sm"></iconify-icon>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Platform Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'TikTok Shop', revenue: 'Rp 52.4M', orders: 1240, color: 'text-zinc-300', icon: 'ri:tiktok-fill', trend: '+12.5%' },
                { name: 'Shopee', revenue: 'Rp 48.2M', orders: 1180, color: 'text-orange-500', icon: 'simple-icons:shopee', trend: '+8.2%' },
                { name: 'Tokopedia', revenue: 'Rp 32.1M', orders: 840, color: 'text-teal-400', icon: 'solar:shop-2-linear', trend: '-2.4%' },
              ].map((p, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center ${p.color}`}>
                      <iconify-icon icon={p.icon} className="text-xl"></iconify-icon>
                    </div>
                    <span className={`text-xs font-medium ${p.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{p.trend}</span>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-400">{p.name}</h3>
                  <div className="text-2xl font-semibold text-white mt-1">{p.revenue}</div>
                  <div className="text-[10px] text-zinc-500 mt-1">{p.orders} {t('done')}</div>
                </div>
              ))}
            </div>

            {/* AI Strategic Intel Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Peak Hours & Ads Optimization */}
              <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <iconify-icon icon="solar:bolt-circle-linear" className="text-white text-xl"></iconify-icon>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{t('strategicIntel')}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('adsTrafficOpt')}</div>
                    <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <iconify-icon icon="solar:clock-circle-linear" className="text-orange-500 mt-0.5"></iconify-icon>
                        <div>
                          <div className="text-xs font-medium text-white">{t('goldenHours')} (19:00 - 22:00)</div>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{t('goldenHoursDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <iconify-icon icon="solar:star-circle-linear" className="text-orange-500 mt-0.5"></iconify-icon>
                        <div>
                          <div className="text-xs font-medium text-white">{t('campaignFlashSale')}</div>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{t('campaignFlashSaleDesc')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('bundlingPromoIdeas')}</div>
                    <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <iconify-icon icon="solar:box-minimalistic-linear" className="text-orange-500 mt-0.5"></iconify-icon>
                        <div>
                          <div className="text-xs font-medium text-white">{t('bundleSneakersKaos')}</div>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{t('bundleSneakersKaosDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <iconify-icon icon="solar:gift-linear" className="text-orange-500 mt-0.5"></iconify-icon>
                        <div>
                          <div className="text-xs font-medium text-white">{t('buy2get1')}</div>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{t('buy2get1Desc')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selling Ideas / Market Pulse */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-6">{t('marketPulseIdeas')}</div>
                <div className="flex-1 space-y-4">
                  <div className="p-4 bg-orange-600/10 border border-orange-500/20 rounded-xl">
                    <div className="text-xs font-bold text-orange-500 mb-1">🔥 {t('hotIdea')}</div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">{t('hotIdeaDesc')}</p>
                  </div>
                  <div className="p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                    <div className="text-xs font-bold text-white mb-1">💡 {t('contentTip')}</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{t('contentTipDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Recommendation Engine */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <iconify-icon icon="solar:magic-stick-3-linear" className="text-8xl text-orange-500"></iconify-icon>
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                  <iconify-icon icon="solar:globus-linear" className="text-white"></iconify-icon>
                </div>
                <h3 className="text-lg font-semibold text-white">{t('priceOpt')}</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {t('priceOptDesc')}
                  </p>
                  <div className="space-y-3">
                    {[
                      { item: 'Sepatu Sneakers A1', current: 'Rp 350k', rec: 'Rp 375k', reason: t('demandTikTok'), action: t('increase') + ' 7%' },
                      { item: 'Kaos Polos Premium', current: 'Rp 120k', rec: 'Rp 115k', reason: t('competitionShopee'), action: t('decrease') + ' 4%' },
                      { item: 'Jaket Hoodie Urban', current: 'Rp 450k', rec: 'Rp 450k', reason: t('optimalPrice'), action: t('maintain') },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-xl">
                        <div>
                          <div className="text-xs font-medium text-white">{r.item}</div>
                          <div className="text-[10px] text-zinc-500 mt-1">{r.reason}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-orange-500">{r.rec}</div>
                          <div className={`text-[10px] ${r.action.includes('Naik') || r.action.includes('Inc') ? 'text-emerald-500' : r.action.includes('Turun') || r.action.includes('Dec') ? 'text-rose-500' : 'text-zinc-500'}`}>{r.action}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/50 border border-zinc-800 rounded-xl p-5 flex flex-col justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <iconify-icon icon="solar:chart-line-up-bold" className="text-3xl text-emerald-400"></iconify-icon>
                    </div>
                    <div className="text-4xl font-bold text-white">+Rp 4.2M</div>
                    <p className="text-xs text-zinc-400">{t('potentialProfit')}</p>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-left">
                      <p className="text-[10px] text-zinc-500 leading-relaxed">{t('priceRecTip') || (lang === 'id' ? 'Terapkan rekomendasi harga secara manual melalui platform masing-masing untuk memaksimalkan profit bulan ini.' : 'Apply price recommendations manually through each platform to maximize profit this month.')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tab-health': {
        const healthData = {
          all:       { chat: '98%', ship: '1.2 Days', return: '0.4%', rating: '4.9/5.0', score: 92 },
          TikTok:    { chat: '99%', ship: '1.0 Days', return: '0.3%', rating: '4.9/5.0', score: 95 },
          Shopee:    { chat: '97%', ship: '1.3 Days', return: '0.5%', rating: '4.8/5.0', score: 88 },
          Tokopedia: { chat: '96%', ship: '1.5 Days', return: '0.6%', rating: '4.7/5.0', score: 85 },
        };
        const hd = healthData[healthPlatform] || healthData.all;
        return (
          <div className="relative z-10 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">{t('shopHealth')}</h2>
                <p className="text-sm text-zinc-400 mt-1">{t('shopHealthDesc')}</p>
              </div>
              <div className="relative w-full sm:w-auto">
                <div 
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
                >
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="solar:calendar-linear" className="text-orange-500"></iconify-icon> 
                    {t(timeFilter)}
                  </div>
                  <iconify-icon icon={showFilterDropdown ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="sm:ml-2 text-zinc-400"></iconify-icon>
                </div>
                {showFilterDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="py-1">
                      {['Hari Ini', 'Bulan Ini', '1 Bulan Terakhir', '2 Bulan Terakhir', '3 Bulan Terakhir'].map((option) => (
                        <div 
                          key={option}
                          onClick={() => { setTimeFilter(option); setShowFilterDropdown(false); }}
                          className={`px-4 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${timeFilter === option ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                        >
                          {t(option)}
                          {timeFilter === option && <iconify-icon icon="solar:check-circle-bold" className="text-sm"></iconify-icon>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Platform Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[['all', t('allPlatforms'), 'solar:widget-linear', 'text-orange-400'],
                ['TikTok', 'TikTok Shop', 'ri:tiktok-fill', 'text-zinc-300'],
                ['Shopee', 'Shopee', 'simple-icons:shopee', 'text-orange-500'],
                ['Tokopedia', 'Tokopedia', 'solar:shop-2-linear', 'text-teal-400'],
              ].map(([key, label, icon, icolor]) => (
                <button
                  key={key}
                  onClick={() => setHealthPlatform(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                    healthPlatform === key
                      ? 'bg-orange-950/40 border-orange-500 text-orange-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  <iconify-icon icon={icon} className={`text-base ${healthPlatform === key ? 'text-orange-400' : icolor}`}></iconify-icon>
                  {label}
                </button>
              ))}
            </div>

            {/* Health Score Big Number */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-6 shadow-sm">
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#27272a" strokeWidth="8" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#f97316" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 34 * hd.score / 100} ${2 * Math.PI * 34}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-400">{hd.score}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{t('healthTitle')}</p>
                <p className="text-3xl font-bold text-white">{hd.score}<span className="text-base text-zinc-500 font-normal">/100</span></p>
                <p className="text-xs text-zinc-400 mt-1">
                  {platformFilter === 'all' ? t('allPlatforms') : platformFilter}
                  {hd.score >= 90 ? (lang === 'id' ? ' · Sangat Baik 🏆' : ' · Excellent 🏆') : hd.score >= 80 ? (lang === 'id' ? ' · Baik ✅' : ' · Good ✅') : (lang === 'id' ? ' · Perlu Perhatian ⚠️' : ' · Needs Attention ⚠️')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t('chatResponse'), value: hd.chat, icon: 'solar:chat-line-linear', color: 'text-emerald-500' },
                { label: t('shippingSpeed'), value: hd.ship, icon: 'solar:delivery-linear', color: 'text-blue-500' },
                { label: t('returnRate'), value: hd.return, icon: 'solar:refresh-linear', color: 'text-orange-500' },
                { label: t('rating'), value: hd.rating, icon: 'solar:star-linear', color: 'text-amber-500' },
              ].map((m, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <iconify-icon icon={m.icon} className={`text-xl ${m.color}`}></iconify-icon>
                    <span className="text-xs font-medium text-zinc-500 uppercase">{m.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{t('aiHealthRec')}</h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <iconify-icon icon="solar:check-read-linear" className="text-emerald-500 text-xl shrink-0"></iconify-icon>
                  <p className="text-sm text-zinc-300">{t('healthRec1')}</p>
                </div>
                <div className="flex gap-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <iconify-icon icon="solar:danger-linear" className="text-orange-500 text-xl shrink-0"></iconify-icon>
                  <p className="text-sm text-zinc-300">{t('healthRec2')}</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'tab-ai':
        return (
          <div className="relative z-10">
            {/* Header */}
            <header className="mb-6">
              <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                {t('aiGenerator')}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">{t('aiDesc')}</p>
            </header>

            {/* Sub-tab: Content only — Trend Radar moved to Market Intel */}
            <div className="flex gap-2 mb-8 bg-black border border-zinc-800 rounded-xl p-1 w-fit">
              <button
                onClick={() => { setAiSubTab('content'); setAiResult(''); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all bg-orange-600 text-white shadow-md"
              >
                <iconify-icon icon="solar:magic-stick-3-linear" className="text-base"></iconify-icon>
                {t('contentGen')}
              </button>
            </div>

            {/* === SUB-TAB: CONTENT GENERATOR === */}
            {aiSubTab === 'content' && (
              <div className="max-w-2xl space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{t('prodDesc')}</label>
                  <div className={`relative bg-black border rounded-xl shadow-sm transition duration-300 ${isGenerating ? 'border-zinc-700 opacity-60' : 'border-zinc-800 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/50'}`}>
                    <textarea
                      className="w-full bg-transparent p-4 text-sm text-white focus:outline-none placeholder:text-zinc-600 resize-none disabled:cursor-not-allowed"
                      rows="4"
                      placeholder={t('aiPromptPlaceholder')}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      disabled={isGenerating}
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">{t('formatOutput')}</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Video Content Group */}
                    <div className={`p-4 rounded-2xl border transition-all ${aiFormat.includes('Video') ? 'bg-orange-950/20 border-orange-500/50' : 'bg-black border-zinc-800'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <iconify-icon icon="solar:video-frame-bold-duotone" className="text-xl text-orange-500"></iconify-icon>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{t('videoContent')}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {['TikTok Video', 'Instagram Reels'].map(f => (
                          <button
                            key={f}
                            onClick={() => setAiFormat(f)}
                            className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all text-left flex items-center justify-between ${aiFormat === f ? 'bg-orange-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                          >
                            {f}
                            {aiFormat === f && <iconify-icon icon="solar:check-circle-bold"></iconify-icon>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Content Group */}
                    <div className={`p-4 rounded-2xl border transition-all ${!aiFormat.includes('Video') ? 'bg-orange-950/20 border-orange-500/50' : 'bg-black border-zinc-800'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <iconify-icon icon="solar:notes-bold-duotone" className="text-xl text-orange-500"></iconify-icon>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{t('textContent')}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {['Shopee Ads', 'Tokopedia Description', 'TikTok Shop Copy'].map(f => (
                          <button
                            key={f}
                            onClick={() => setAiFormat(f)}
                            className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all text-left flex items-center justify-between ${aiFormat === f ? 'bg-orange-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                          >
                            {f}
                            {aiFormat === f && <iconify-icon icon="solar:check-circle-bold"></iconify-icon>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !aiPrompt}
                  className="w-full bg-orange-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:bg-orange-500 transition-all flex justify-center items-center gap-2 border border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <><iconify-icon icon="solar:spinner-linear" className="text-lg animate-spin"></iconify-icon> {t('genLoading')}</>
                  ) : (
                    <><iconify-icon icon="solar:stars-bold" className="text-lg"></iconify-icon> Surprise Me!!!</>
                  )}
                </button>

                {aiResult && (
                  <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl relative group">
                    <button
                      onClick={() => navigator.clipboard.writeText(aiResult)}
                      className="absolute top-4 right-4 text-zinc-500 hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100 p-2 bg-black rounded-md border border-zinc-800"
                    >
                      <iconify-icon icon="solar:copy-linear" className="text-lg"></iconify-icon>
                    </button>
                    <div className="flex items-center gap-2 mb-4 text-orange-500 text-xs font-medium uppercase tracking-widest">
                      <iconify-icon icon="solar:check-circle-linear" className="text-base"></iconify-icon>
                      {t('genResult')}
                    </div>
                    <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{aiResult}</div>
                  </div>
                )}
              </div>
            )}

            {/* === SUB-TAB: MARKET TREND RADAR === */}
            {aiSubTab === 'trend' && (
              <div className="max-w-2xl space-y-6">
                <div className="bg-black border border-zinc-800 rounded-xl p-4 flex items-start gap-3">
                  <iconify-icon icon="solar:info-circle-linear" className="text-orange-500 text-xl mt-0.5 shrink-0"></iconify-icon>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t('marketInfo')}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{t('nicheLabel')}</label>
                  <div className={`relative bg-black border rounded-xl shadow-sm transition duration-300 ${isTrendAnalyzing ? 'border-zinc-700 opacity-60' : 'border-zinc-800 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/50'}`}>
                    <textarea
                      className="w-full bg-transparent p-4 text-sm text-white focus:outline-none placeholder:text-zinc-600 resize-none disabled:cursor-not-allowed"
                      rows="3"
                      placeholder={t('trendPromptPlaceholder')}
                      value={trendPrompt}
                      onChange={(e) => setTrendPrompt(e.target.value)}
                      disabled={isTrendAnalyzing}
                    ></textarea>
                  </div>
                </div>

                {/* Quick Suggestions */}
                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">{t('quickSuggest')}</label>
                  <div className="flex flex-wrap gap-2">
                    {['Skincare Pria', 'Outfit Thrifting', 'Peralatan Dapur', 'Gadget Gaming', 'Suplemen Kesehatan'].map(s => (
                      <button
                        key={s}
                        onClick={() => setTrendPrompt(s)}
                        disabled={isTrendAnalyzing}
                        className="px-3 py-1.5 text-[11px] font-medium bg-zinc-800 border border-zinc-700 rounded-full text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-all disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeTrend}
                  disabled={isTrendAnalyzing || !trendPrompt}
                  className="w-full bg-orange-600 text-white py-3.5 rounded-xl text-sm font-medium shadow-md hover:bg-orange-500 transition-all flex justify-center items-center gap-2 border border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTrendAnalyzing ? (
                    <><iconify-icon icon="solar:spinner-linear" className="text-lg animate-spin"></iconify-icon> {t('analyzing')}</>
                  ) : (
                    <><iconify-icon icon="solar:radar-linear" className="text-lg"></iconify-icon> {t('analyzeNow')}</>
                  )}
                </button>

                {trendResult && (
                  <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl relative group">
                    <button
                      onClick={() => navigator.clipboard.writeText(trendResult)}
                      className="absolute top-4 right-4 text-zinc-500 hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100 p-2 bg-black rounded-md border border-zinc-800"
                    >
                      <iconify-icon icon="solar:copy-linear" className="text-lg"></iconify-icon>
                    </button>
                    <div className="flex items-center gap-2 mb-4 text-orange-500 text-xs font-medium uppercase tracking-widest">
                      <iconify-icon icon="solar:radar-linear" className="text-base"></iconify-icon>
                      {t('analyzeResult')}
                    </div>
                    <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{trendResult}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'tab-market':
        return (
          <div className="relative z-10 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">{t('marketIntelTitle')}</h2>
                <p className="text-sm text-zinc-400 mt-1">{t('monitorShop')}</p>
              </div>
              <div className="relative w-full sm:w-auto">
                <div 
                  onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                  className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
                >
                  <div className="flex items-center gap-2">
                    <iconify-icon icon="solar:filter-linear" className="text-orange-500"></iconify-icon>
                    {platformFilter === 'all' ? t('allPlatforms') : platformFilter}
                  </div>
                  <iconify-icon icon={showPlatformDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="sm:ml-2 text-zinc-500"></iconify-icon>
                </div>
                {showPlatformDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                    {[['all', t('allPlatforms')], ['TikTok', 'TikTok Shop'], ['Shopee', 'Shopee'], ['Tokopedia', 'Tokopedia']].map(([val, label]) => (
                      <div
                        key={val}
                        onClick={() => { setPlatformFilter(val); setShowPlatformDropdown(false); }}
                        className={`px-4 py-2 text-xs cursor-pointer flex items-center gap-2 transition-colors ${platformFilter === val ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                      >
                        {val === 'TikTok' && <iconify-icon icon="ri:tiktok-fill" className="text-sm"></iconify-icon>}
                        {val === 'Shopee' && <iconify-icon icon="simple-icons:shopee" className="text-sm text-orange-500"></iconify-icon>}
                        {val === 'Tokopedia' && <iconify-icon icon="solar:shop-2-linear" className="text-sm text-teal-400"></iconify-icon>}
                        {val === 'all' && <iconify-icon icon="solar:widget-linear" className="text-sm text-orange-400"></iconify-icon>}
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Radar Trend AI - Sample Data */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <iconify-icon icon="solar:radar-linear" className="text-white text-xl"></iconify-icon>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{t('trendRadarAI')}</h3>
                  <p className="text-[10px] text-zinc-500">Sample data — powered by AI Market Intelligence</p>
                </div>
              </div>

              {/* Manual Search Input */}
              <div className="mb-5">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">🔍 {lang === 'id' ? 'Cari Kategori / Niche Manual' : 'Search Custom Category / Niche'}</div>
                <div className="flex gap-2">
                  <div className={`flex-1 flex items-center gap-2 bg-black border rounded-xl px-3 py-2.5 transition-all ${
                    isSearchingTrend ? 'border-indigo-500/50 ring-1 ring-indigo-500/30' : 'border-zinc-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30'
                  }`}>
                    <iconify-icon icon="solar:magnifer-linear" className="text-zinc-500 text-base shrink-0"></iconify-icon>
                    <input
                      type="text"
                      value={trendCustomInput}
                      onChange={(e) => { setTrendCustomInput(e.target.value); if (e.target.value) { setTrendSampleKey(null); setTrendCustomResult(null); } }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && trendCustomInput.trim()) {
                          setIsSearchingTrend(true);
                          setTrendSampleKey(null);
                          setTimeout(() => {
                            setTrendCustomResult(trendCustomInput.trim());
                            setIsSearchingTrend(false);
                          }, 900);
                        }
                      }}
                      placeholder={lang === 'id' ? 'Ketik kategori produk... (tekan Enter)' : 'Type product category... (press Enter)'}
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                    />
                    {trendCustomInput && (
                      <button onClick={() => { setTrendCustomInput(''); setTrendCustomResult(null); }} className="text-zinc-600 hover:text-zinc-400 transition-colors">
                        <iconify-icon icon="solar:close-circle-linear" className="text-base"></iconify-icon>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (!trendCustomInput.trim()) return;
                      setIsSearchingTrend(true);
                      setTrendSampleKey(null);
                      setTimeout(() => {
                        setTrendCustomResult(trendCustomInput.trim());
                        setIsSearchingTrend(false);
                      }, 900);
                    }}
                    disabled={!trendCustomInput.trim() || isSearchingTrend}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shrink-0"
                  >
                    {isSearchingTrend ? (
                      <iconify-icon icon="solar:spinner-linear" className="text-base animate-spin"></iconify-icon>
                    ) : (
                      <iconify-icon icon="solar:radar-linear" className="text-base"></iconify-icon>
                    )}
                    {lang === 'id' ? 'Analisa' : 'Analyze'}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-zinc-800"></div>
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{lang === 'id' ? 'atau pilih contoh' : 'or choose sample'}</span>
                <div className="flex-1 h-px bg-zinc-800"></div>
              </div>

              {/* Sample Category Pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { key: 'running', label: '👟 Sepatu Lari' },
                  { key: 'skincare', label: '✨ Skincare Pria' },
                  { key: 'thrifting', label: '👔 Outfit Thrifting' },
                  { key: 'gadget', label: '🎮 Gadget Gaming' },
                  { key: 'supplement', label: '💊 Suplemen Kesehatan' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setTrendSampleKey(trendSampleKey === key ? null : key); setTrendCustomInput(''); setTrendCustomResult(null); }}
                    className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${
                      trendSampleKey === key
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-indigo-500 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Custom Input Result */}
              {trendCustomResult && !trendSampleKey && (() => {
                const query = trendCustomResult;
                return (
                  <div className="space-y-4 border-t border-zinc-800 pt-5">
                    <div className="flex items-center gap-2 mb-1">
                      <iconify-icon icon="solar:radar-linear" className="text-indigo-400 text-base"></iconify-icon>
                      <span className="text-sm font-semibold text-white">Analisis: <span className="text-indigo-400">{query}</span></span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">🔥 Tren Terkini</p>
                        <p className="text-sm text-zinc-200">Kategori <strong className="text-white">{query}</strong> menunjukkan pertumbuhan signifikan di marketplace Indonesia. Permintaan meningkat terutama di TikTok Shop & Shopee dalam 3 bulan terakhir.</p>
                      </div>
                      <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">🎯 Target Demografi</p>
                        <p className="text-sm text-zinc-200">Segmen utama berusia 18–35 tahun, aktif di media sosial. Perilaku pembelian didorong oleh konten video dan ulasan produk autentik.</p>
                      </div>
                    </div>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">💡 Top 5 Produk Potensial</p>
                      <div className="space-y-1.5">
                        {[
                          `1. Produk ${query} varian terlaris (best-seller)`,
                          `2. Bundle/paket hemat kategori ${query}`,
                          `3. Versi premium / upgrade dari ${query}`,
                          `4. Aksesori & pelengkap ${query}`,
                          `5. Edisi limited / kolaborasi brand ${query}`,
                        ].map((item, i) => (
                          <p key={i} className="text-sm text-zinc-200">{item}</p>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-rose-600/10 border border-rose-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">⚠️ Risiko</p>
                        <p className="text-sm text-zinc-200">Persaingan harga ketat dari penjual lain. Pastikan diferensiasi produk melalui kualitas, packaging, atau layanan purna jual yang unggul.</p>
                      </div>
                      <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">🚀 Strategi</p>
                        <p className="text-sm text-zinc-200">Manfaatkan konten video TikTok untuk edukasi produk. Aktifkan program Flash Sale Shopee di akhir pekan. Optimalkan foto produk untuk SEO marketplace.</p>
                      </div>
                    </div>
                    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-3 flex items-start gap-2">
                      <iconify-icon icon="solar:info-circle-linear" className="text-indigo-400 text-base mt-0.5 shrink-0"></iconify-icon>
                      <p className="text-xs text-zinc-400">Data ini merupakan analisis template berdasarkan pola pasar umum. Untuk analisis mendalam berbasis data real-time, gunakan fitur AI Generator.</p>
                    </div>
                  </div>
                );
              })()}

              {trendSampleKey && (() => {
                const sampleData = {
                  running: {
                    trend: '🔥 Naik 35% di TikTok Shop. Kategori lari outdoor & trail running jadi favorit.',
                    demo: '🎯 Pria 18-35 thn, komunitas lari, gym-goer. Aktif di TikTok & Shopee.',
                    top5: ['1. Sepatu Trail Running ringan', '2. Insole anti-blister', '3. Kaus kaki kompresi', '4. Sepatu road running wanita', '5. Sandal recovery post-run'],
                    risk: '⚠️ Banyak seller baru masuk, margin tipis di Shopee. Fokus diferensiasi di TikTok.',
                    strategy: '🚀 Buat konten "Before & After" performa lari. Kolaborasi micro-influencer komunitas lari.',
                  },
                  skincare: {
                    trend: '🔥 Tren pria makin peduli kulit. Produk moisturizer & sunscreen pria naik 28%.',
                    demo: '🎯 Pria 20-40 thn, pekerja kantoran & mahasiswa. Aktif di TikTok & Instagram.',
                    top5: ['1. Moisturizer ringan SPF30', '2. Serum Vitamin C pria', '3. Facial wash oil control', '4. Toner eksfoliasi', '5. Eye cream anti-kantung'],
                    risk: '⚠️ Brand Korea masih dominasi. Perlu keunggulan harga atau formula lokal yang terbukti.',
                    strategy: '🚀 Konten edukasi "skincare routine pria 3 langkah" sangat viral. Bundling starter kit.',
                  },
                  thrifting: {
                    trend: '🔥 "Vintage aesthetic" & "Y2K fashion" masih kuat. Pencarian naik 40% di Tokopedia.',
                    demo: '🎯 Gen Z 16-25 thn, mahasiswa. Budget sensitif tapi fashion-conscious.',
                    top5: ['1. Kemeja flanel vintage', '2. Jaket denim second', '3. Celana cargo oversize', '4. Kaos band retro', '5. Bucket hat & aksesoris retro'],
                    risk: '⚠️ Kualitas tidak konsisten bisa bikin return tinggi. Foto produk harus sangat detail.',
                    strategy: '🚀 "GRWM thrift haul" di TikTok paling efektif. Live selling malam hari boost konversi.',
                  },
                  gadget: {
                    trend: '🔥 Gaming mobile & PC peripheral naik 22%. Aksesori HP gaming paling dicari.',
                    demo: '🎯 Pria 15-28 thn, gamer & content creator. Loyal brand tapi price-sensitive.',
                    top5: ['1. Controller gamepad Bluetooth', '2. Cooling fan HP gaming', '3. Headset gaming under 300k', '4. Stand HP lipat portabel', '5. Power bank 20.000mAh fast charge'],
                    risk: '⚠️ Produk KW banyak beredar, reputasi toko krusial. Garansi jadi pembeda utama.',
                    strategy: '🚀 Review & unboxing di YouTube Shorts + TikTok. Bundle dengan aksesoris relevan.',
                  },
                  supplement: {
                    trend: '🔥 Kesadaran kesehatan post-COVID masih tinggi. Vitamin C, D & Omega-3 paling populer.',
                    demo: '🎯 Semua usia, terutama 25-50 thn. Wanita lebih dominan sebagai pembeli keluarga.',
                    top5: ['1. Vitamin C 1000mg effervescent', '2. Multivitamin anak', '3. Kolagen minuman', '4. Probiotik digestive', '5. Suplemen mata lutein'],
                    risk: '⚠️ Regulasi BPOM ketat. Pastikan semua produk terdaftar. Klaim berlebihan bisa kena suspend.',
                    strategy: '🚀 Konten edukasi manfaat vs testimoni. Bundling paket keluarga meningkatkan AOV.',
                  },
                };
                const d = sampleData[trendSampleKey];
                return (
                  <div className="space-y-4 border-t border-zinc-800 pt-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">🔥 Tren Terkini</p>
                        <p className="text-sm text-zinc-200">{d.trend}</p>
                      </div>
                      <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">🎯 Target Demografi</p>
                        <p className="text-sm text-zinc-200">{d.demo}</p>
                      </div>
                    </div>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">💡 Top 5 Produk Potensial</p>
                      <div className="space-y-1.5">
                        {d.top5.map((item, i) => (
                          <p key={i} className="text-sm text-zinc-200">{item}</p>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-rose-600/10 border border-rose-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">⚠️ Risiko</p>
                        <p className="text-sm text-zinc-200">{d.risk}</p>
                      </div>
                      <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">🚀 Strategi</p>
                        <p className="text-sm text-zinc-200">{d.strategy}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-widest flex items-center gap-2">
                      <iconify-icon icon="solar:fire-bold" className="text-orange-500"></iconify-icon>
                      {t('weeklyViralTopics')}
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-mono">LIVE FEED</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { topic: 'Old Money Aesthetic', platform: 'TikTok', trend: '+142%', color: 'text-zinc-300' },
                      { topic: 'Skincare Barrier Repair', platform: 'Shopee', trend: '+85%', color: 'text-orange-500' },
                      { topic: 'Eco-friendly Home Living', platform: 'Tokopedia', trend: '+64%', color: 'text-teal-400' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center ${t.color}`}>
                            <iconify-icon icon={t.platform === 'TikTok' ? 'ri:tiktok-fill' : t.platform === 'Shopee' ? 'simple-icons:shopee' : 'solar:shop-2-linear'}></iconify-icon>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{t.topic}</div>
                            <div className="text-[10px] text-zinc-500">{t.platform} Trends</div>
                          </div>
                        </div>
                        <div className="text-xs font-black text-emerald-500">{t.trend}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-widest flex items-center gap-2">
                      <iconify-icon icon="solar:chart-line-up-bold" className="text-indigo-500"></iconify-icon>
                      {t('liveDataSampling')}
                    </h3>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20"></div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-5">
                        <iconify-icon icon="solar:graph-bold" className="text-4xl text-indigo-400"></iconify-icon>
                      </div>
                      <p className="text-[11px] text-indigo-300 font-bold mb-1 uppercase tracking-wider">{t('aiSummary')}</p>
                      <p className="text-xs text-zinc-300 leading-relaxed italic">
                        {lang === 'id' 
                          ? '"Produk kategori Home & Living mengalami kenaikan volume pencarian 3x lipat menjelang akhir pekan. Rekomendasi: Fokus pada keyword \'minimalist\' dan \'aesthetic\'."'
                          : '"Home & Living category products saw a 3x increase in search volume leading into the weekend. Recommendation: Focus on \'minimalist\' and \'aesthetic\' keywords."'
                        }
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500">{t('marketConfidence')}</span>
                        <span className="text-emerald-500 font-bold">88%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1">
                        <div className="bg-indigo-500 h-1 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tab-support':
        return renderSupportCenter();
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-['Inter',sans-serif] overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 border-r border-zinc-800 bg-black flex flex-col shrink-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? '!translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <img src={logo} alt="Tokcer AI" className="h-8 w-auto" />
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-400 hover:text-white">
            <iconify-icon icon="solar:close-circle-linear" className="text-2xl"></iconify-icon>
          </button>
        </div>
        
        <div className="p-4 w-full overflow-y-auto custom-scrollbar flex-1">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-4 px-3">
            {t('overview')}
          </div>
          <nav className="flex flex-col gap-1.5 md:gap-2">
            <button 
              onClick={() => { setActiveMenu('tab-dash'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeMenu === 'tab-dash' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 border-l-2' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'}`}
            >
              <iconify-icon icon="solar:widget-linear" className="text-lg"></iconify-icon> {t('dashboard')}
            </button>
            <button 
              onClick={() => { setActiveMenu('tab-omzet'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeMenu === 'tab-omzet' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 border-l-2' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'}`}
            >
              <iconify-icon icon="solar:chart-square-linear" className="text-lg"></iconify-icon> {t('revenue')}
            </button>
            <button 
              onClick={() => { setActiveMenu('tab-inventory'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeMenu === 'tab-inventory' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 border-l-2' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'}`}
            >
              <iconify-icon icon="solar:box-linear" className="text-lg"></iconify-icon> {t('inventory')}
            </button>
            <button 
              onClick={() => { setActiveMenu('tab-analytics'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeMenu === 'tab-analytics' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 border-l-2' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'}`}
            >
              <iconify-icon icon="solar:graph-up-linear" className="text-lg"></iconify-icon> {t('analytics')}
            </button>
            <button 
              onClick={() => { setActiveMenu('tab-ai'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm transition-all shrink-0 group/ai relative ${activeMenu === 'tab-ai' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 border-l-2' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'}`}
            >
              {activeMenu !== 'tab-ai' && <div className="absolute inset-0 bg-orange-950/50 opacity-0 group-hover/ai:opacity-100 rounded-xl transition-opacity"></div>}
              <iconify-icon icon="solar:magic-stick-3-linear" className={`text-lg ${activeMenu !== 'tab-ai' ? 'text-orange-500' : ''} relative z-10`}></iconify-icon> 
              <span className="relative z-10">{t('aiGenerator')}</span>
            </button>
            <button 
              onClick={() => { setActiveMenu('tab-support'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeMenu === 'tab-support' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 border-l-2' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'}`}
            >
              <iconify-icon icon="solar:headphones-round-linear" className="text-lg"></iconify-icon> {t('supportCenter')}
            </button>
            <button 
              onClick={() => { setActiveMenu('tab-health'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeMenu === 'tab-health' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 border-l-2' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'}`}
            >
              <iconify-icon icon="solar:shield-check-linear" className="text-lg"></iconify-icon> {t('healthScore')}
            </button>
            <button 
              onClick={() => { setActiveMenu('tab-market'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeMenu === 'tab-market' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 border-l-2' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'}`}
            >
              <iconify-icon icon="solar:global-linear" className="text-lg"></iconify-icon> {t('marketIntel')}
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800">
          {/* Language Toggle */}
          <div className="flex items-center justify-between mb-6 px-2">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Language</span>
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
              <button 
                onClick={() => { setLang('id'); localStorage.setItem('tokcer_lang', 'id'); }}
                className={`px-2 py-1 text-[10px] font-bold rounded ${lang === 'id' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
              >
                ID
              </button>
              <button 
                onClick={() => { setLang('en'); localStorage.setItem('tokcer_lang', 'en'); }}
                className={`px-2 py-1 text-[10px] font-bold rounded ${lang === 'en' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* User Tier Card */}
          <div className="mb-4 px-2">
            <div className="bg-gradient-to-br from-amber-950/60 to-orange-950/40 border border-amber-700/40 rounded-xl p-3 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                    <iconify-icon icon="solar:crown-bold" className="text-white text-[10px]"></iconify-icon>
                  </div>
                  <div>
                    <p className="text-[8px] text-amber-400/80 uppercase tracking-widest font-semibold">{t('planActive')}</p>
                    <p className="text-xs font-bold text-amber-300 leading-none">{t('ultimatePlan')}</p>
                  </div>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">✓ {t('active')}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-zinc-500">{t('aiQuota')}</span>
                  <span className="text-amber-400 font-semibold">42 / 100</span>
                </div>
                <div className="w-full bg-zinc-800/80 rounded-full h-1">
                  <div className="h-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{width: '42%'}}></div>
                </div>
              </div>
              <p className="text-[8px] text-zinc-600 mt-1.5 text-center italic">{t('validUntil')} 30 Mei 2025</p>
            </div>
          </div>

          <div className="mb-4 px-2">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">{t('loggedAs')}</p>
            <p className="text-sm text-zinc-300 truncate">{user?.email || 'admin@tokoanda.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/50"
          >
            <iconify-icon icon="solar:logout-2-linear" className="text-xl"></iconify-icon>
            {t('logout')}
          </button>
        </div>
      </aside>

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
