'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

// --- HELPER FORMAT WAKTU RELATIF ---
const formatRelativeTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (error) {
    return '';
  }
};

// --- HELPER IKON NOTIFIKASI ---
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'VerificationComplete':
      return (
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-green-100 shadow-sm">
          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case 'NewScanAssigned':
      return (
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-blue-100 shadow-sm">
          <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
      );
    case 'DoctorVerified':
      return (
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-100 shadow-sm">
          <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      );
    case 'DoctorDeclined':
      return (
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-red-100 shadow-sm">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case 'ReminderCheckup':
      return (
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-orange-100 shadow-sm">
          <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-slate-100 shadow-sm">
          <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      );
  }
};

export default function NotifikasiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // --- AMBIL DATA NOTIFIKASI DARI API ---
  const fetchNotifications = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/notifications?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const resData = await res.json();
      if (res.ok && resData.data && resData.data.data) {
        setNotifications(resData.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    
    fetchNotifications(token);
  }, [router]);

  // --- FUNGSI TANDAI SEMUA DIBACA ---
  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await fetch('http://localhost:8000/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      } else {
        const err = await res.json();
        console.error("Failed mark all as read response:", err);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // --- FUNGSI TANDAI SATU DIBACA ---
  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await fetch(`http://localhost:8000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // --- FUNGSI HAPUS SATU NOTIFIKASI ---
  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event bubbling ke baris
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await fetch(`http://localhost:8000/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memuat Notifikasi...</div>;
  }

  // Hitung jumlah notifikasi baru
  const newNotifCount = notifications.filter(n => !n.is_read).length;

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
          {newNotifCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-[#4880FF] font-bold hover:underline text-sm mb-1 transition"
            >
              Tandai Semua Dibaca
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              Tidak ada notifikasi untuk ditampilkan.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                  className={`p-6 flex items-start group hover:bg-slate-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/20' : ''}`}
                >
                  
                  {/* Avatar / Icon */}
                  {getNotificationIcon(notif.type)}

                  {/* Content */}
                  <div className="ml-5 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-bold ${!notif.is_read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h3>
                      <button 
                        onClick={(e) => handleDeleteNotification(notif.id, e)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1" 
                        title="Hapus Notifikasi"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <p className={`${!notif.is_read ? 'text-slate-600 font-medium' : 'text-slate-500'} mt-1`}>
                      {notif.message}
                    </p>
                    
                    <div className="flex items-center mt-3 space-x-3">
                      <span className="text-sm font-medium text-slate-400">
                        {formatRelativeTime(notif.created_at)}
                      </span>
                      {!notif.is_read && (
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm shadow-green-500/30">
                          Baru
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}