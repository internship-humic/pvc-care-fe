'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

// --- DUMMY DATA NOTIFIKASI ---
const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: 'verified',
    title: 'Verifikasi Selesai',
    message: 'Dr. Sarah Williams telah memverifikasi hasil analisis PVC Anda.',
    time: '2 jam yang lalu',
    isNew: true,
    img: 'https://placehold.co/100x100/e2e8f0/64748b?text=SW'
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Reminder Pemeriksaan',
    message: 'Waktunya untuk melakukan pemeriksaan PVC rutin Anda.',
    time: '1 hari yang lalu',
    isNew: true,
    icon: (
      <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    bgColor: 'bg-orange-100'
  },
  {
    id: 3,
    type: 'note',
    title: 'Catatan Medis Baru',
    message: 'Dr. Michael Olise menambahkan catatan medis untuk pemeriksaan tanggal 10 Mei.',
    time: '5 hari yang lalu',
    isNew: false,
    img: 'https://placehold.co/100x100/e2e8f0/64748b?text=MO'
  },
  {
    id: 4,
    type: 'request',
    title: 'Request Verifikasi Diterima',
    message: 'Dr. Michael Olise menerima request verifikasi Anda.',
    time: '5 hari yang lalu',
    isNew: false,
    img: 'https://placehold.co/100x100/e2e8f0/64748b?text=MO'
  },
  {
    id: 5,
    type: 'verified',
    title: 'Verifikasi Selesai',
    message: 'Dr. Robert Martinez telah memverifikasi hasil analisis PVC Anda.',
    time: '5 minggu yang lalu',
    isNew: false,
    img: 'https://placehold.co/100x100/e2e8f0/64748b?text=RM'
  }
];

export default function NotifikasiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // --- CEK AUTENTIKASI ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userStr) {
      setUserData(JSON.parse(userStr));
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memuat Notifikasi...</div>;
  }

  // Hitung jumlah notifikasi baru
  const newNotifCount = DUMMY_NOTIFICATIONS.filter(n => n.isNew).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* PANGGIL KOMPONEN NAVBAR TERPUSAT */}
      <Navbar userData={userData} />

      {/* BEGIN: Main Content Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Notifikasi</h1>
            <p className="text-slate-500 text-lg font-medium">Anda memiliki {newNotifCount} notifikasi baru</p>
          </div>
          <button className="text-[#4880FF] font-bold hover:underline text-sm mb-1 transition">
            Tandai Semua Dibaca
          </button>
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="divide-y divide-slate-100">
            {DUMMY_NOTIFICATIONS.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-6 flex items-start group hover:bg-slate-50 transition-colors cursor-pointer ${notif.isNew ? 'bg-blue-50/20' : ''}`}
              >
                
                {/* Avatar / Icon */}
                {notif.img ? (
                  <img alt={notif.title} className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-sm" src={notif.img} />
                ) : (
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${notif.bgColor}`}>
                    {notif.icon}
                  </div>
                )}

                {/* Content */}
                <div className="ml-5 flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold ${notif.isNew ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notif.title}
                    </h3>
                    <button className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Hapus Notifikasi">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <p className={`${notif.isNew ? 'text-slate-600 font-medium' : 'text-slate-500'} mt-1`}>
                    {notif.message}
                  </p>
                  
                  <div className="flex items-center mt-3 space-x-3">
                    <span className="text-sm font-medium text-slate-400">{notif.time}</span>
                    {notif.isNew && (
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm shadow-green-500/30">
                        Baru
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}