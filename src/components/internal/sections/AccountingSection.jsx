import React, { useState } from 'react';

const AccountingSection = ({ t }) => {
  const [usdRate, setUsdRate] = useState(17300);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Header Config */}
      <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 backdrop-blur-xl">
        <div className="flex flex-col md:flex-flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Global Config</span>
            <h2 className="text-3xl font-black text-white tracking-tighter mt-1">Internal Accounting</h2>
          </div>
          <div className="flex items-center gap-3 bg-black/40 p-2 rounded-2xl border border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 px-2">USD/IDR Rate:</span>
            <input 
              type="number" 
              value={usdRate} 
              onChange={(e) => setUsdRate(e.target.value)}
              className="bg-zinc-900 text-white font-black text-sm w-24 p-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 backdrop-blur-xl">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Gross Omzet</p>
          <h3 className="text-2xl font-black text-white tracking-tighter">Rp 0</h3>
          <p className="text-[10px] text-zinc-600 mt-1 font-bold">Bulan Ini</p>
        </div>
        <div className="bg-emerald-500/10 p-6 rounded-[2rem] border border-emerald-500/10 backdrop-blur-xl">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Net Profit</p>
          <h3 className="text-2xl font-black text-emerald-400 tracking-tighter">Rp 0</h3>
          <p className="text-[10px] text-emerald-500/60 mt-1 font-bold">Margin: 0%</p>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 backdrop-blur-xl">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Subscribers Aktif</p>
          <h3 className="text-2xl font-black text-white tracking-tighter">0</h3>
          <p className="text-[10px] text-zinc-600 mt-1 font-bold">User Berbayar</p>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 backdrop-blur-xl">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">ARPU</p>
          <h3 className="text-2xl font-black text-white tracking-tighter">Rp 0</h3>
          <p className="text-[10px] text-zinc-600 mt-1 font-bold">Average Revenue Per User</p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Income Transactions */}
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Income Module</span>
              <h3 className="text-xl font-black text-white tracking-tight mt-1">Income Transactions</h3>
            </div>
            <button onClick={() => setShowIncomeModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all">
              + Tambah Transaksi
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Gross Amount</th>
                  <th className="p-4">Net After COGS</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="py-10 text-center text-zinc-600 italic text-sm">Belum ada data transaksi masuk.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Infra Costs */}
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-500">Expense Module</span>
              <h3 className="text-xl font-black text-white tracking-tight mt-1">Infrastructure Costs</h3>
            </div>
            <button onClick={() => setShowExpenseModal(true)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black uppercase tracking-widest rounded-xl border border-zinc-700 transition-all">
              + Catat Biaya
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Nominal (IDR)</th>
                  <th className="p-4">Siklus</th>
                </tr>
              </thead>
              <tbody>
                {/* Mock Data based on spec */}
                <tr className="bg-zinc-950/50 rounded-2xl border border-zinc-800">
                  <td className="p-4 rounded-l-2xl border-l border-y border-zinc-800 text-xs font-bold text-white">2026-05-08</td>
                  <td className="p-4 border-y border-zinc-800 text-xs text-white font-bold">Web Hosting</td>
                  <td className="p-4 border-y border-zinc-800 text-xs text-zinc-400">Niagahoster</td>
                  <td className="p-4 border-y border-zinc-800 text-xs text-white font-black">Rp 250,000</td>
                  <td className="p-4 rounded-r-2xl border-r border-y border-zinc-800 text-xs text-zinc-500 font-bold">Annual</td>
                </tr>
                <tr className="bg-zinc-950/50 rounded-2xl border border-zinc-800">
                  <td className="p-4 rounded-l-2xl border-l border-y border-zinc-800 text-xs font-bold text-white">2026-05-05</td>
                  <td className="p-4 border-y border-zinc-800 text-xs text-white font-bold">AI Credit</td>
                  <td className="p-4 border-y border-zinc-800 text-xs text-zinc-400">DeepSeek</td>
                  <td className="p-4 border-y border-zinc-800 text-xs text-white font-black">Rp 36,676</td>
                  <td className="p-4 rounded-r-2xl border-r border-y border-zinc-800 text-xs text-zinc-500 font-bold">Usage-based</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal Income */}
      {showIncomeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900/90 border border-white/10 rounded-[2rem] p-8 w-full max-w-md text-white relative shadow-2xl">
            <button onClick={() => setShowIncomeModal(false)} className="absolute top-6 right-6 text-white/60 hover:text-white">
              <iconify-icon icon="solar:close-circle-bold-duotone" className="text-2xl"></iconify-icon>
            </button>
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Income Module</span>
              <h3 className="text-xl font-black mt-1">Tambah Transaksi</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500">Source</label>
                <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1">
                  <option>organic</option>
                  <option>partner</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500">Plan</label>
                <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1">
                  <option>pro</option>
                  <option>elite</option>
                  <option>ultimate</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500">Gross Amount</label>
                <input type="number" placeholder="Rp" className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1" />
              </div>
              <button onClick={() => { alert('Fungsi simpan belum dihubungkan ke DB!'); setShowIncomeModal(false); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                Simpan Transaksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Expense */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900/90 border border-white/10 rounded-[2rem] p-8 w-full max-w-md text-white relative shadow-2xl">
            <button onClick={() => setShowExpenseModal(false)} className="absolute top-6 right-6 text-white/60 hover:text-white">
              <iconify-icon icon="solar:close-circle-bold-duotone" className="text-2xl"></iconify-icon>
            </button>
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-500">Expense Module</span>
              <h3 className="text-xl font-black mt-1">Catat Biaya Infra</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500">Kategori</label>
                <select className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1">
                  <option>web_hosting</option>
                  <option>ai_credit</option>
                  <option>database</option>
                  <option>email_service</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500">Vendor</label>
                <input type="text" placeholder="Nama Vendor" className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500">Nominal (IDR)</label>
                <input type="number" placeholder="Rp" className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1" />
              </div>
              <button onClick={() => { alert('Fungsi simpan belum dihubungkan ke DB!'); setShowExpenseModal(false); }} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                Simpan Biaya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingSection;
