import React from 'react';

const ProfileTab = ({ 
  lang, 
  partnerData, 
  setPartnerData, 
  profileForm, 
  setProfileForm, 
  user, 
  getTierColor 
}) => {
  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-orange-600/10 to-amber-600/5 backdrop-blur-md border border-orange-500/20 rounded-[32px] p-8 mb-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-600/20">
            {partnerData.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-white tracking-tight truncate">{partnerData.name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${getTierColor(partnerData.tier)}`}>
                <iconify-icon icon="solar:medal-star-bold-duotone" className="text-sm"></iconify-icon>
                {partnerData.tier} Tier
              </span>
              <span className="text-[10px] font-bold text-zinc-500">{partnerData.id}</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 truncate">{user?.email || profileForm.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-amber-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-600/10 rounded-xl flex items-center justify-center border border-orange-500/20">
            <iconify-icon icon="solar:pen-new-square-bold-duotone" className="text-xl text-orange-500"></iconify-icon>
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{lang === 'id' ? 'Update Profil' : 'Update Profile'}</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{lang === 'id' ? 'Pastikan data sesuai untuk verifikasi komisi' : 'Ensure data is correct for commission verification'}</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          setPartnerData(prev => ({...prev, name: profileForm.fullName}));
          alert(lang === 'id' ? 'Profil berhasil diperbarui!' : 'Profile updated successfully!');
        }}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lang === 'id' ? 'Nama Lengkap (sesuai KTP)' : 'Full Name (as per ID)'}</label>
            <input
              type="text" required
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
              className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">No. WhatsApp</label>
              <input
                type="tel" required
                value={profileForm.whatsapp}
                onChange={(e) => setProfileForm({...profileForm, whatsapp: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email</label>
              <input
                type="email" required
                value={profileForm.email}
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lang === 'id' ? 'Nama Bank' : 'Bank Name'}</label>
              <input
                type="text" required
                value={profileForm.bankName}
                onChange={(e) => setProfileForm({...profileForm, bankName: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
                placeholder="e.g. BCA, Mandiri, BNI"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{lang === 'id' ? 'No. Rekening' : 'Account Number'}</label>
              <input
                type="text" required
                value={profileForm.bankAccount}
                onChange={(e) => setProfileForm({...profileForm, bankAccount: e.target.value})}
                className="w-full bg-black/40 border border-zinc-800 focus:border-orange-500/50 rounded-2xl px-5 py-4 text-sm text-white transition-all focus:ring-4 focus:ring-orange-500/10 outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl shadow-orange-600/10 hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            {lang === 'id' ? 'Simpan Perubahan' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;
