import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import { callDeepSeek } from '../../../utils/ai';

const BusinessInsightSection = ({ t }) => {
  const [reports, setReports] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const [customColumns, setCustomColumns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColumn, setNewColumn] = useState({ name: '', key: '' });
  const [partnerCSV, setPartnerCSV] = useState(null);
  const [userNeedsCSV, setUserNeedsCSV] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Prices Mapping (Hardcoded as requested for logic safety)
  const PLAN_PRICES = {
    starter: 0,
    pro: 499000,
    elite: 999000,
    ultimate: 1999000
  };

  const fetchReports = async () => {
    // In a real scenario, we might have a 'reports' table. 
    // For now, we'll simulate history or just show the "Current Week" generator.
    const { data, error } = await supabase.from('weekly_reports').select('*').order('created_at', { ascending: false });
    if (!error) setReports(data || []);
  };

  useEffect(() => {
    fetchReports();
    // Load custom columns from localStorage for persistence without DB migration yet
    const saved = localStorage.getItem('tokcer_custom_report_cols');
    if (saved) setCustomColumns(JSON.parse(saved));
  }, []);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length < 2) throw new Error("File CSV kosong atau tidak valid");

        // Robust CSV split (handles quotes with commas)
        const splitCSV = (row) => {
          const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
          return (row.match(regex) || []).map(v => v.replace(/^"|"$/g, '').trim());
        };

        const headers = splitCSV(lines[0]);
        const data = lines.slice(1).map(line => {
          const values = splitCSV(line);
          const obj = {};
          headers.forEach((h, i) => obj[h] = values[i] || '');
          return obj;
        });
        
        if (type === 'partner') setPartnerCSV(data);
        if (type === 'user') setUserNeedsCSV(data);
        alert(`✅ Berhasil memuat ${data.length} data dari CSV ${type.toUpperCase()}`);
      } catch (err) {
        alert("❌ Gagal membaca CSV: " + err.message);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // 1. Fetch Raw Data
      const { data: clients } = await supabase.from('clients').select('*');
      const { data: orders } = await supabase.from('orders').select('*');
      const { data: payouts } = await supabase.from('payouts').select('*').eq('status', 'paid');
      const { data: partners } = await supabase.from('partners').select('*');

      // 2. Calculations
      const activeSubs = {
        starter: clients.filter(c => c.plan === 'starter' && c.status === 'active').length,
        pro: clients.filter(c => c.plan === 'pro' && c.status === 'active').length,
        elite: clients.filter(c => c.plan === 'elite' && c.status === 'active').length,
        ultimate: clients.filter(c => c.plan === 'ultimate' && c.status === 'active').length,
      };

      const mrr = {
        pro: activeSubs.pro * PLAN_PRICES.pro,
        elite: activeSubs.elite * PLAN_PRICES.elite,
        ultimate: activeSubs.ultimate * PLAN_PRICES.ultimate,
      };

      const totalMrr = mrr.pro + mrr.elite + mrr.ultimate;
      const grossIncome = (orders || []).reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
      const totalPayout = (payouts || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const netRevenue = grossIncome - totalPayout;

      // 3. AI Analysis with Dynamic CSV Data
      const prompt = `Analyze this weekly business data for Tokcer AI:
      - Gross Income: IDR ${grossIncome.toLocaleString()}
      - Total MRR: IDR ${totalMrr.toLocaleString()}
      - Active Paid Users: ${activeSubs.pro + activeSubs.elite + activeSubs.ultimate}
      
      DYNAMIC INPUT FROM CSV:
      - Partner Uploaded Data: ${partnerCSV ? JSON.stringify(partnerCSV.slice(0, 5)) : 'No custom partner data'}
      - User Needs Data: ${userNeedsCSV ? JSON.stringify(userNeedsCSV.slice(0, 5)) : 'No custom user needs'}
      
      Please provide a summary in JSON format with keys: "wins", "issues", "actions". 
      Focus specifically on matching "User Needs" from CSV with our current metrics.
      Keep it professional and in Bahasa Indonesia.`;
      
      const { text: aiResult, usage } = await callDeepSeek("You are a Business Intelligence expert for a SaaS platform.", prompt);
      const cleanJson = aiResult.replace(/```json|```/g, '').trim();

      // Log AI Usage
      await supabase.from('ai_usage_logs').insert([{
          user_id: 'admin-bypass', // Dashboard internal use admin id
          feature: 'weekly_report_analysis',
          prompt: prompt,
          response: aiResult,
          input_tokens: usage.prompt_tokens,
          output_tokens: usage.completion_tokens,
          cost_usd: (usage.prompt_tokens * 0.00000014) + (usage.completion_tokens * 0.00000028)
      }]);
      let aiNotes = { wins: '', issues: '', actions: '' };
      try {
        aiNotes = JSON.parse(cleanJson);
      } catch (e) {
        aiNotes = { wins: aiResult, issues: 'Analysis complete', actions: 'Review data' };
      }

      const newReport = {
        id: Date.now(),
        report_week: `W${Math.ceil(new Date().getDate() / 7)}`,
        date_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        date_end: new Date().toISOString().split('T')[0],
        gross_income_idr: grossIncome,
        total_mrr_idr: totalMrr,
        mrr_pro_idr: mrr.pro,
        mrr_elite_idr: mrr.elite,
        mrr_ultimate_idr: mrr.ultimate,
        total_partner_payout_idr: totalPayout,
        net_revenue_idr: netRevenue,
        active_subscribers_starter: activeSubs.starter,
        active_subscribers_pro: activeSubs.pro,
        active_subscribers_elite: activeSubs.elite,
        active_subscribers_ultimate: activeSubs.ultimate,
        total_active_paid: activeSubs.pro + activeSubs.elite + activeSubs.ultimate,
        wins: aiNotes.wins,
        issues: aiNotes.issues,
        actions: aiNotes.actions,
        created_at: new Date().toISOString()
      };

      setActiveReport(newReport);
      setReports([newReport, ...reports]);
      
      // Save to DB if table exists (optional, currently simulating persistence via state)
      await supabase.from('weekly_reports').insert([newReport]);

    } catch (err) {
      console.error("Report Generation Error:", err);
      alert("Gagal membuat laporan: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddColumn = () => {
    if (!newColumn.name || !newColumn.key) return;
    const updated = [...customColumns, newColumn];
    setCustomColumns(updated);
    localStorage.setItem('tokcer_custom_report_cols', JSON.stringify(updated));
    setNewColumn({ name: '', key: '' });
    setIsModalOpen(false);
  };

  const exportToCSV = (report) => {
    const headers = [
      'report_week', 'date_start', 'date_end', 'gross_income_idr', 'total_mrr_idr', 
      'net_revenue_idr', 'active_subscribers_starter', 'active_subscribers_pro', 
      'active_subscribers_elite', 'active_subscribers_ultimate', 'wins', 'issues', 'actions'
    ];
    
    // Add custom columns to headers
    customColumns.forEach(c => headers.push(c.key));

    const row = headers.map(h => {
        const val = report[h] || 0;
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(',');

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + row;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tokcer_Weekly_Report_${report.date_end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Business Insight & Analytics</h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">AI-Powered Financial Reporting System</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-700 transition-all"
          >
            <iconify-icon icon="solar:add-circle-bold-duotone"></iconify-icon>
            Add Column
          </button>
          <div className="flex items-center gap-2">
             <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${partnerCSV ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>
                <iconify-icon icon={partnerCSV ? "solar:check-circle-bold-duotone" : "solar:file-send-bold-duotone"} className="text-base"></iconify-icon>
                Partner CSV
                <input type="file" accept=".csv" className="hidden" onChange={(e) => handleFileUpload(e, 'partner')} />
             </label>
             <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${userNeedsCSV ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>
                <iconify-icon icon={userNeedsCSV ? "solar:check-circle-bold-duotone" : "solar:user-speak-bold-duotone"} className="text-base"></iconify-icon>
                User Needs CSV
                <input type="file" accept=".csv" className="hidden" onChange={(e) => handleFileUpload(e, 'user')} />
             </label>
          </div>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all"
          >
            {isGenerating ? (
              <iconify-icon icon="solar:spinner-linear" className="animate-spin text-lg"></iconify-icon>
            ) : (
              <iconify-icon icon="solar:magic-stick-bold-duotone" className="text-lg"></iconify-icon>
            )}
            Generate Weekly Report
          </button>
        </div>
      </header>

      {/* Overview Cards */}
      {activeReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Gross Income', val: `IDR ${activeReport.gross_income_idr.toLocaleString()}`, icon: 'solar:wallet-money-bold-duotone', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Total MRR', val: `IDR ${activeReport.total_mrr_idr.toLocaleString()}`, icon: 'solar:refresh-bold-duotone', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Active Paid Users', val: activeReport.total_active_paid, icon: 'solar:users-group-rounded-bold-duotone', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Net Revenue', val: `IDR ${activeReport.net_revenue_idr.toLocaleString()}`, icon: 'solar:hand-stars-bold-duotone', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-sm hover:border-zinc-700 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <iconify-icon icon={stat.icon} className={`text-xl ${stat.color}`}></iconify-icon>
                </div>
                <div className="text-[10px] font-black text-zinc-600 group-hover:text-zinc-400">REALTIME</div>
              </div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-black text-white mt-1 tracking-tighter">{stat.val}</h3>
            </div>
          ))}
        </div>
      )}

      {/* AI Analysis View */}
      {activeReport && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <iconify-icon icon="solar:notes-bold-duotone" className="text-blue-500 text-xl"></iconify-icon>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Business Summary</span>
                </div>
                <button 
                  onClick={() => exportToCSV(activeReport)}
                  className="text-[10px] font-black text-blue-500 hover:text-blue-400 flex items-center gap-1 uppercase tracking-widest"
                >
                  <iconify-icon icon="solar:download-square-bold-duotone" className="text-base"></iconify-icon>
                  Export to CSV
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <iconify-icon icon="solar:star-bold-duotone"></iconify-icon>
                    Weekly Wins
                  </h4>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-sm text-zinc-300 leading-relaxed italic">
                    {activeReport.wins}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <iconify-icon icon="solar:danger-bold-duotone"></iconify-icon>
                    Critical Issues
                  </h4>
                  <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-sm text-zinc-300 leading-relaxed italic">
                    {activeReport.issues}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <iconify-icon icon="solar:rocket-bold-duotone"></iconify-icon>
                    Action Items
                  </h4>
                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-sm text-zinc-300 leading-relaxed italic">
                    {activeReport.actions}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <iconify-icon icon="solar:history-bold-duotone" className="text-zinc-500"></iconify-icon>
                Report History
              </h3>
              <div className="space-y-3">
                {reports.map((r, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-3 border rounded-xl transition-all cursor-pointer group ${activeReport?.id === r.id ? 'bg-blue-600/10 border-blue-500' : 'bg-black border-zinc-800 hover:border-zinc-700'}`} 
                    onClick={() => {
                        console.log("Switching to report:", r.id);
                        setActiveReport(r);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${activeReport?.id === r.id ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:bg-blue-600 group-hover:text-white'}`}>
                        {r.report_week}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase">{r.date_end}</p>
                        <p className="text-[8px] font-bold text-zinc-600 uppercase">Financial Report</p>
                      </div>
                    </div>
                    <iconify-icon icon="solar:alt-arrow-right-linear" className={`transition-all ${activeReport?.id === r.id ? 'text-blue-500 rotate-90' : 'text-zinc-700 group-hover:text-white'}`}></iconify-icon>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!activeReport && (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-950 border border-zinc-800 rounded-3xl border-dashed">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
            <iconify-icon icon="solar:graph-bold-duotone" className="text-4xl text-zinc-700"></iconify-icon>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Belum ada laporan aktif</h3>
          <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest mt-2">Klik tombol generate untuk memulai analisa minggu ini</p>
        </div>
      )}

      {/* Add Column Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
              <iconify-icon icon="solar:add-circle-bold-duotone" className="text-blue-500"></iconify-icon>
              Add Custom Column
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-2 block">Column Name (Label)</label>
                <input 
                  type="text" 
                  value={newColumn.name}
                  onChange={(e) => setNewColumn({...newColumn, name: e.target.value})}
                  placeholder="e.g. Operating Cost"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-2 block">Field Key (CSV Key)</label>
                <input 
                  type="text" 
                  value={newColumn.key}
                  onChange={(e) => setNewColumn({...newColumn, key: e.target.value})}
                  placeholder="e.g. op_cost_idr"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all">Cancel</button>
              <button onClick={handleAddColumn} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">Add Column</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessInsightSection;
