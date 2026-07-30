'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  userData: any;
  token: string | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the most up-to-date user profile from backend
  const refreshUser = async (currentToken?: string, currentUser?: any) => {
    const activeToken = currentToken || localStorage.getItem('token');
    const activeUser = currentUser || JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!activeToken || !activeUser) {
      setLoading(false);
      return null;
    }

    const roleValue = String(activeUser.role || activeUser.user_role || '').toLowerCase();
    let profileUrl = '';

    if (roleValue.includes('doctor') || roleValue.includes('dokter')) {
      profileUrl = 'http://localhost:8000/api/doctor-profile/me';
    } else if (roleValue === 'patient' || roleValue === 'pasien') {
      profileUrl = 'http://localhost:8000/api/patient-profile/me';
    } else {
      // For Admin or other roles, skip backend sync and use local storage directly
      setUserData(activeUser);
      setToken(activeToken);
      setLoading(false);
      return activeUser;
    }

    try {
      const res = await fetch(profileUrl, {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const apiData = data.data || data;
        
        // Reconstruct updated user object maintaining login response format
        const updatedUser = {
          ...activeUser,
          id: apiData.id,
          email: apiData.email,
          role: apiData.role,
          patient_profile: apiData.role === 'patient' ? apiData.profile : activeUser.patient_profile,
          doctor_profile: apiData.role === 'doctor' ? apiData.profile : activeUser.doctor_profile,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setToken(activeToken);
        return updatedUser;
      }
    } catch (err) {
      console.error('Failed to silently refresh user profile:', err);
    } finally {
      setLoading(false);
    }
    
    // Fallback if API fails
    setUserData(activeUser);
    setToken(activeToken);
    return activeUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserData(null);
    setToken(null);
    router.push('/login');
  };

  useEffect(() => {
    const initAuth = async () => {
      const activeToken = localStorage.getItem('token');
      const activeUserStr = localStorage.getItem('user');

      if (!activeToken || !activeUserStr) {
        setLoading(false);
        // Redirect to login if on protected dashboard routes
        const protectedPaths = [
          '/dashboard', 
          '/profile', 
          '/deteksi', 
          '/riwayat', 
          '/notifikasi', 
          '/kelola-dokter', 
          '/kelola-pasien',
          '/verifikasi',
          '/pasien'
        ];
        const isProtected = protectedPaths.some(p => pathname === p || pathname?.startsWith(p + '/'));
        
        if (isProtected) {
          router.push('/login');
        }
        return;
      }

      try {
        const activeUser = JSON.parse(activeUserStr);
        // Populate local state immediately first to keep UI responsive
        setUserData(activeUser);
        setToken(activeToken);
        setLoading(false);

        // Perform non-blocking silent refresh in the background
        await refreshUser(activeToken, activeUser);
      } catch (e) {
        console.error("Failed parsing user data during initAuth:", e);
        logout();
      }
    };

    initAuth();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ userData, token, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
