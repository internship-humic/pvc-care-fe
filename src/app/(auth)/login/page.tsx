'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  // State UI
  const [showPassword, setShowPassword] = useState(false);

  // State Data & Status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fungsi Submit Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Menembak endpoint login universal di backend
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("ISI DATA DARI BACKEND:", data);

      if (response.ok) {
        setMessage({ type: 'success', text: 'Login berhasil! Mengalihkan...' });
        
        // 1. Simpan Token JWT
        if (data.data?.accessToken) {
          localStorage.setItem('token', data.data.accessToken);
        }
        
        // 2. Simpan data user dengan "Sistem Sapu Jagat"
        if (data.data?.user) {
          const userString = JSON.stringify(data.data.user, (key, value) => {
            // Naikkan batas toleransi menjadi 300.000 karakter (sekitar 300 KB).
            // Foto kompresi kita (150 KB) akan aman melewati filter ini.
            // Tapi foto lama yang ukurannya MB-an akan tetap dibuang agar tidak crash.
            if (typeof value === 'string' && value.length > 300000) {
              return undefined; 
            }
            return value;
          });

          localStorage.removeItem('user');
          localStorage.setItem('user', userString);
        }

        // Redirect ke halaman Dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);

      } else {
        setMessage({ type: 'error', text: data.message || data.error || 'Email atau password salah.' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setMessage({ type: 'error', text: 'Gagal terhubung ke server. Pastikan backend menyala.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans antialiased relative">
      
      {/* Tombol Close (X) di Kanan Atas */}
      <Link href="/" className="absolute top-6 right-6 lg:right-10 z-50 p-2 text-slate-400 hover:text-slate-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Link>

      {/* ==================== PANEL KIRI ==================== */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-blue-600 to-blue-400 relative overflow-hidden flex-col justify-between">
        <div className="pt-12 pl-12 z-10 flex items-center gap-3">
          <div className="w-12 h-12  rounded-full flex items-center justify-center">
            <img src="/LogoPVC.png" alt="PVCare Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-4xl font-bold text-white tracking-tight">PVCare</span>
        </div>

        <div className="relative h-[70%] w-full flex items-end justify-center">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full border-[20px] border-white/10 z-0"></div>
          <img src="login_doctor.png" alt="Doctors" className="relative z-10 object-cover w-[90%] h-auto" />

          {/* Kartu Animasi Statis */}
          <div className="absolute top-1/4 left-10 z-20 bg-slate-900/60 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 text-white shadow-xl animate-fade-in-up">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img src="/icons/VectorSearchWhite.svg" alt="Search" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="font-semibold text-sm">Well qualified doctors</p>
              <p className="text-xs text-slate-300">Dengan dokter professional</p>
            </div>
          </div>
          
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-slate-900/60 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 text-white shadow-xl animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img src="/icons/activityPutih.svg" alt="activityPutih" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="font-semibold text-sm">AI Detection</p>
              <p className="text-xs text-slate-300">Deteksi hasil dengan AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PANEL KANAN ==================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-16 relative">
        <div className="w-full max-w-md">
          
          {/* Header Teks Universal */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back!</h1>
            <p className="text-slate-500 text-sm mt-3">
              New to PVCare? <Link href="/register" className="text-blue-600 font-medium hover:underline transition">Sign up</Link>
            </p>
          </div>

          {/* Notifikasi Alert */}
          {message.text && (
            <div className={`mb-6 p-3 rounded-lg text-sm font-medium text-center ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          {/* FORM LOGIN */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email address</label>
              {/* Teks hitam pekat ditambahkan */}
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400 text-sm text-slate-900"
                required
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-semibold text-slate-700">Your password</label>
              <div className="relative">
                {/* Teks hitam pekat ditambahkan */}
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400 text-sm text-slate-900 tracking-widest"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2064B7] hover:bg-[#1A539B] disabled:bg-blue-300 text-white font-medium py-3 rounded-lg transition shadow-sm mt-2 flex justify-center items-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Log in'}
            </button>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-xs font-medium text-slate-700">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-xs font-medium text-[#2064B7] hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>

          {/* --- SOCIAL LOGIN 
          <div className="pt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs font-medium text-slate-500">Or log in with</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <button className="flex justify-center items-center py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                <span className="text-xl">G</span>
              </button>
              <button className="flex justify-center items-center py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-blue-600">
                <span className="text-xl font-bold">f</span>
              </button>
              <button className="flex justify-center items-center py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                <span className="text-xl text-black"></span>
              </button>
            </div>
          </div>
          --- */}

        </div>
      </div>
    </div>
  );
}