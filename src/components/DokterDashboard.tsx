import StatCard from './StatCard';

export default function DokterDashboard({ userData }: { userData: any }) {
  const doctorName = userData?.profile?.name || userData?.name || 'Dokter';
  const verificationStatus = userData?.doctor_profile?.verification_status || userData?.profile?.verification_status || 'Pending';
  const isVerified = verificationStatus === 'Verified';
  
  return (
    <div className="space-y-6">
      {!isVerified && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md shadow-sm animate-fade-in-up flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <p className="font-medium text-sm">Akun Anda sedang dalam proses verifikasi oleh Admin. Beberapa fitur utama mungkin belum dapat digunakan.</p>
        </div>
      )}

      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-slate-900">Dashboard Anda</h2>
        <p className="text-slate-500 mt-1 text-base">Selamat datang, <strong className="text-blue-600 capitalize">Dr. {doctorName}</strong>. Berikut ringkasan aktivitas Anda 😊</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-fade-in-up delay-100"><StatCard icon="👥" title="Total Pasien" value="521" sub="" color="blue" /></div>
        <div className="animate-fade-in-up delay-200"><StatCard icon="✓" title="Pasien Diverifikasi" value="518" sub="" color="green" /></div>
        <div className="animate-fade-in-up delay-300"><StatCard icon="⏱" title="Menunggu Diverifikasi" value="3" sub="" color="purple" /></div>
        <div className="animate-fade-in-up delay-400"><StatCard icon="⭐" title="Rating Anda" value="4.9" sub="" color="orange" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 h-72 flex flex-col justify-between animate-fade-in-up delay-300">
           <h3 className="font-bold text-slate-800">Verifikasi Mingguan</h3>
           <div className="flex-1 bg-slate-50 mt-4 rounded border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400">Grafik Batang (Bar Chart)</div>
         </div>
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 h-72 flex flex-col justify-between animate-fade-in-up delay-400">
           <h3 className="font-bold text-slate-800">Tren Pasien Bulanan</h3>
           <div className="flex-1 bg-slate-50 mt-4 rounded border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400">Grafik Garis (Line Chart)</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in-up delay-300">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">Pending Verifications</h3>
             {isVerified ? (
               <button className="text-xs text-blue-600 font-bold hover:underline transition">Lihat Semua →</button>
             ) : (
               <span className="text-xs text-slate-400 font-bold cursor-not-allowed" title="Fitur ini terkunci">Lihat Semua 🔒</span>
             )}
           </div>
           <div className="space-y-3">
             {[
               { init: 'AH', name: 'Ahmad Hidayat', age: '45 tahun', date: '15 Mei 2026', conf: '98%', color: 'text-red-500', bg: 'bg-red-50' },
               { init: 'SN', name: 'Siti Nurhaliza', age: '52 tahun', date: '14 Mei 2026', conf: '96%', color: 'text-orange-500', bg: 'bg-orange-50' },
               { init: 'BS', name: 'Budi Santoso', age: '38 tahun', date: '14 Mei 2026', conf: '94%', color: 'text-green-500', bg: 'bg-green-50' },
             ].map((item, i) => (
               <div key={i} className={`flex items-center justify-between p-3 border border-slate-100 rounded-xl transition-all group ${isVerified ? 'hover:bg-slate-50 cursor-pointer' : 'opacity-60 cursor-not-allowed bg-slate-50'}`}>
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center transition ${isVerified ? 'group-hover:bg-blue-600 group-hover:text-white' : ''}`}>{item.init}</div>
                   <div>
                     <p className={`font-bold text-slate-800 text-sm transition ${isVerified ? 'group-hover:text-blue-600' : ''}`}>{item.name}</p>
                     <p className="text-[10px] text-slate-500">{item.age} • Uploaded: {item.date}</p>
                   </div>
                 </div>
                 <div className="text-right flex items-center gap-4">
                   <div>
                     <p className="text-[10px] text-slate-400 font-medium">AI Confidence</p>
                     <p className="text-blue-600 font-extrabold text-lg leading-none mt-1">{item.conf}</p>
                     <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full mt-1 inline-block ${item.color} ${item.bg}`}>Status</span>
                   </div>
                   {!isVerified && <span className="text-slate-300 text-xl" title="Terkunci">🔒</span>}
                 </div>
               </div>
             ))}
           </div>
         </div>
         
         <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in-up delay-400">
           <h3 className="font-bold text-slate-800 mb-4">Aktivitas Terbaru</h3>
           <div className="space-y-5">
              <div className="flex gap-3 relative before:absolute before:left-4 before:top-8 before:w-0.5 before:h-8 before:bg-slate-100">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0 z-10">📈</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Verified PVC analysis</p>
                  <p className="text-xs text-slate-500 mt-1">Ahmad Hidayat</p>
                  <p className="text-[10px] text-slate-400 mt-1">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex gap-3 relative before:absolute before:left-4 before:top-8 before:w-0.5 before:h-8 before:bg-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center text-xs shrink-0 z-10">👁️</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Reviewed ECG data</p>
                  <p className="text-xs text-slate-500 mt-1">Siti Nurhaliza</p>
                  <p className="text-[10px] text-slate-400 mt-1">4 jam yang lalu</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center text-xs shrink-0 z-10">📝</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Added medical notes</p>
                  <p className="text-xs text-slate-500 mt-1">Budi Santoso</p>
                  <p className="text-[10px] text-slate-400 mt-1">6 jam yang lalu</p>
                </div>
              </div>
           </div>
         </div>
      </div>
    </div>
  );
}