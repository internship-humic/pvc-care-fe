'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
    } else {
      setUserData(JSON.parse(userStr));
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memuat Profil...</div>;
  }

  const roleValue = String(userData?.role || userData?.user_role || userData?.type || '').toLowerCase();
  const isDoctor = roleValue.includes('doctor') || roleValue.includes('dokter');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      
      {/* ==================== HEADER SIMPLE ==================== */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 lg:px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden shadow-sm shadow-blue-200">
            <img src="/LogoPVC.png" alt="PVCare Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">PVCare</span>
        </div>

        <Link href="/dashboard" className="border border-slate-300 hover:border-blue-500 text-blue-600 text-xs font-bold py-2 px-5 rounded-full transition-all shadow-sm">
          Kembali ke dashboard
        </Link>
      </nav>

      {/* ==================== KONTEN UTAMA ==================== */}
      <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in-up">
        {isDoctor ? <DoctorProfile userData={userData} /> : <PatientProfile userData={userData} />}
      </main>

    </div>
  );
}

// ============================================================================
// KOMPONEN: PROFIL PASIEN
// ============================================================================
function PatientProfile({ userData }: { userData: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State Modal Ubah Password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChangeSubmit = async () => {
    if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
      alert("Harap isi semua kolom password.");
      return;
    }

    if (passwordData.new_password.length < 6) {
      alert("Password baru minimal harus 6 karakter.");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/auth/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password berhasil diperbarui!");
        setIsPasswordModalOpen(false);
        setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      } else {
        alert("Gagal mengubah password: " + (data.message || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  // Data Profil
  const profile = userData?.profile || userData?.patient_profile || {};
  const email = userData?.email || 'email@example.com';
  
  // State form
  const [formData, setFormData] = useState({
    name: profile.name || userData?.name || '',
    phone: profile.phone || '',
    gender: profile.gender || '',
    birthdate: profile.birthdate ? new Date(profile.birthdate).toISOString().split('T')[0] : '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/patient-profile/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Update localStorage
        const updatedUser = { ...userData };
        if (updatedUser.patient_profile) {
          updatedUser.patient_profile = data.data;
        } else if (updatedUser.profile) {
          updatedUser.profile = data.data;
        }
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setIsEditing(false);
        alert('Profil berhasil diperbarui!');
        window.location.reload(); // Reload to reflect changes globally
      } else {
        alert('Gagal memperbarui profil: ' + (data.message || 'Error'));
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };
  
  const displayGender = formData.gender === 'Male' ? 'Laki-laki' : formData.gender === 'Female' ? 'Perempuan' : formData.gender || '-';
  
  // Format Tanggal Display
  let birthDateDisplay = '-';
  if (formData.birthdate) {
    const d = new Date(formData.birthdate);
    birthDateDisplay = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Ambil inisial nama untuk avatar
  const initials = formData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Profile Pasien</h1>
        <p className="text-slate-500 text-lg mt-1">Kelola informasi pribadi dan pengaturan akun Anda</p>
      </div>

      {/* KARTU INFORMASI PRIBADI */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-6">
        
        {/* Header Kartu (Avatar & Tombol Edit) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-[#4880FF] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-blue-500/30">
              {initials || '👤'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{formData.name || 'Nama Pasien'}</h2>
              <p className="text-slate-500">{email}</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)} 
                disabled={isLoading}
                className="border border-slate-300 hover:bg-slate-50 text-slate-600 font-medium py-2.5 px-6 rounded-xl transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#4880FF] hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Edit Profile
            </button>
          )}
        </div>

        <hr className="border-slate-100 mb-8" />

        {/* Form Informasi */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
            {isEditing ? (
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full border border-blue-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            ) : (
              <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
                <span className="text-slate-400 mr-3">👤</span>
                <span className="text-slate-800 font-medium">{formData.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Email (Tidak dapat diubah)</label>
            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-100/50">
              <span className="text-slate-400 mr-3">✉️</span>
              <span className="text-slate-500 font-medium">{email}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Nomor HP</label>
            {isEditing ? (
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full border border-blue-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            ) : (
              <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
                <span className="text-slate-400 mr-3">📞</span>
                <span className="text-slate-800 font-medium">{formData.phone || '-'}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Jenis Kelamin</label>
              {isEditing ? (
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full border border-blue-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                >
                  <option value="">Pilih...</option>
                  <option value="Male">Laki-laki</option>
                  <option value="Female">Perempuan</option>
                </select>
              ) : (
                <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
                  <span className="text-slate-800 font-medium">{displayGender}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Tanggal Lahir</label>
              {isEditing ? (
                <input 
                  type="date" 
                  name="birthdate" 
                  value={formData.birthdate} 
                  onChange={handleChange} 
                  className="w-full border border-blue-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                />
              ) : (
                <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
                  <span className="text-slate-400 mr-3">📅</span>
                  <span className="text-slate-800 font-medium">{birthDateDisplay}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KARTU KEAMANAN */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-5">Keamanan</h3>
        <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-slate-500 text-xl">
              🔒
            </div>
            <div>
              <p className="font-bold text-slate-800">Password</p>
              <p className="text-xs text-slate-500 mt-0.5">Kelola kata sandi akun Anda</p>
            </div>
          </div>
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="border border-slate-300 hover:border-slate-400 text-slate-700 font-bold py-2 px-5 rounded-xl text-sm bg-white shadow-sm transition-all"
          >
            Ubah Password
          </button>
        </div>
      </div>

      {/* MODAL UBAH PASSWORD */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-8 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Ubah Password</h3>
              <button 
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
                }}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Password Lama</label>
                <input 
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  placeholder="Masukkan password lama"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Password Baru</label>
                <input 
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Konfirmasi Password Baru</label>
                <input 
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  placeholder="Ulangi password baru"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
                }}
                disabled={isChangingPassword}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3 px-6 rounded-xl transition text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handlePasswordChangeSubmit}
                disabled={isChangingPassword}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/20 transition text-sm disabled:opacity-50"
              >
                {isChangingPassword ? 'Memproses...' : 'Ubah Password'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ============================================================================
// KOMPONEN: PROFIL DOKTER
// ============================================================================
function DoctorProfile({ userData }: { userData: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const profile = userData?.profile || userData?.doctor_profile || {};
  const email = userData?.email || 'email@example.com';
  
  // State form
  const [formData, setFormData] = useState({
    name: profile.name || userData?.name || '',
    phone: profile.phone || '',
    gender: profile.gender || '',
    birthdate: profile.birthdate ? new Date(profile.birthdate).toISOString().split('T')[0] : '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('phone', formData.phone);
      submitData.append('gender', formData.gender);
      submitData.append('birthdate', formData.birthdate);
      
      if (selectedFile) {
        submitData.append('profile_photo', selectedFile);
      }

      const res = await fetch('http://localhost:8000/api/doctor-profile/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData // FormData sets its own multipart/form-data boundary
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Update localStorage
        const updatedUser = { ...userData };
        if (updatedUser.doctor_profile) {
          updatedUser.doctor_profile = data.data;
        } else if (updatedUser.profile) {
          updatedUser.profile = data.data;
        }
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setIsEditing(false);
        alert('Profil dokter berhasil diperbarui!');
        window.location.reload();
      } else {
        alert('Gagal memperbarui profil: ' + (data.message || 'Error'));
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan sistem saat menyimpan profil.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayGender = formData.gender === 'Male' ? 'Laki-laki' : formData.gender === 'Female' ? 'Perempuan' : formData.gender || '-';
  const profilePhoto = photoPreview || profile.profile_photo || 'https://placehold.co/400x500/e2e8f0/64748b?text=Doctor+Photo';

  // Dummy stat
  const statPasien = "240"; 
  const statVerifikasi = "185";

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Profile Dokter</h1>
          <p className="text-slate-500 text-lg mt-1">Informasi profesional dan statistik verifikasi Anda</p>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setIsEditing(false);
                setPhotoPreview(null);
                setSelectedFile(null);
                setFormData({
                  name: profile.name || userData?.name || '',
                  phone: profile.phone || '',
                  gender: profile.gender || '',
                  birthdate: profile.birthdate ? new Date(profile.birthdate).toISOString().split('T')[0] : '',
                });
              }}
              disabled={isLoading}
              className="border border-slate-300 hover:bg-slate-50 text-slate-600 font-medium py-2 px-5 rounded-xl transition-all"
            >
              Batal
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-[#4880FF] hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Profile
          </button>
        )}
      </div>

      {/* CONTAINER ABU-ABU (Sesuai Desain Figma) */}
      <div className="bg-[#F1F5F9] rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* KIRI: KARTU UTAMA DOKTER */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm p-6 relative">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Foto Dokter */}
            <div className="w-full md:w-1/2 relative group">
              <img src={profilePhoto.startsWith('/images') ? `http://localhost:8000${profilePhoto}` : profilePhoto} alt="Doctor" className="w-full h-auto aspect-[3/4] object-cover rounded-3xl border border-slate-100 shadow-sm" />
              {isEditing && (
                <label className="absolute top-4 right-4 text-xs font-bold text-slate-700 bg-white shadow-lg px-4 py-2 rounded-full hover:bg-slate-50 transition cursor-pointer flex items-center gap-2">
                  <span>📸 Ubah Foto</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>

            {/* Info Dokter */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
              
              <div className="border-b border-slate-200 pb-3">
                <p className="text-sm font-medium text-slate-500">Nama Anda</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 border border-blue-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold text-xl"
                  />
                ) : (
                  <h2 className="text-2xl font-black text-slate-800 leading-tight mt-1">{formData.name}</h2>
                )}
              </div>

              <div className="border-b border-slate-200 pb-3">
                <p className="text-sm font-medium text-slate-500">Tanggal Lahir</p>
                {isEditing ? (
                  <input 
                    type="date" 
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="w-full mt-1 border border-blue-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold"
                  />
                ) : (
                  <h3 className="text-xl font-bold text-slate-800 mt-1">{formData.birthdate ? new Date(formData.birthdate).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}</h3>
                )}
              </div>

              <div className="border-b border-slate-200 pb-3">
                <p className="text-sm font-medium text-slate-500">Status</p>
                <h3 className={`text-xl font-bold mt-1 ${profile.verification_status === 'Verified' ? 'text-green-600' : profile.verification_status === 'Declined' ? 'text-red-600' : 'text-orange-500'}`}>
                  {profile.verification_status || 'Pending'}
                </h3>
              </div>

              <div className="pb-3">
                <p className="text-sm font-medium text-slate-500">Jenis Kelamin</p>
                {isEditing ? (
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full mt-1 border border-blue-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-bold"
                  >
                    <option value="">Pilih...</option>
                    <option value="Male">Laki-laki</option>
                    <option value="Female">Perempuan</option>
                  </select>
                ) : (
                  <h3 className="text-xl font-bold text-slate-800 mt-1">{displayGender}</h3>
                )}
              </div>

            </div>
          </div>

          {/* Kontak Baris Bawah */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4">
            <div className="flex-1 flex items-center gap-3 border-[1.5px] border-blue-400 rounded-2xl p-4 shadow-sm shadow-blue-100 bg-blue-50/20">
              <div className="w-12 h-12 rounded-full border border-blue-200 bg-blue-50 text-blue-500 flex items-center justify-center text-xl shrink-0">
                ✉️
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-[11px] text-slate-500 font-medium">Email (Read-only)</p>
                <p className="font-bold text-slate-800 text-sm truncate">{email}</p>
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 border-[1.5px] border-blue-400 rounded-2xl p-4 shadow-sm shadow-blue-100 bg-blue-50/20">
              <div className="w-12 h-12 rounded-full border border-blue-200 bg-blue-50 text-blue-500 flex items-center justify-center text-xl shrink-0">
                📞
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-[11px] text-slate-500 font-medium">Nomor Telepon</p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full mt-1 border border-blue-300 rounded-lg px-2 py-1 bg-white focus:outline-none text-slate-800 text-sm font-bold"
                  />
                ) : (
                  <p className="font-bold text-slate-800 text-sm truncate">{formData.phone || '-'}</p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* KANAN: STATISTIK (Pill Cards) */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          
          <div className="bg-[#D1E0F5] border border-blue-200 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-transform cursor-default">
            <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-blue-300">
              👥
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Total Pasien</p>
              <p className="text-lg font-black text-slate-800 leading-none mt-1">{statPasien}</p>
            </div>
          </div>

          <div className="bg-[#D4EEDC] border border-green-200 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-transform cursor-default">
            <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-green-300">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Verifikasi Selesai</p>
              <p className="text-xl font-black text-slate-800 leading-none mt-1">{statVerifikasi}</p>
            </div>
          </div>

          <div className="bg-[#FBEED1] border border-orange-200 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-transform cursor-default">
            <div className="w-14 h-14 bg-orange-400 text-white rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-orange-200">
              ⭐
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Rating</p>
              <p className="text-2xl font-black text-slate-800 leading-none mt-1">4.9</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}