// lib/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/rest';

// Define types
type User = {
  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: Role[];
};

type Role = {
  id: number;
  name: string;
  shortname: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roleName: string) => boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authAPI.login(username, password);
      
      if (data.success) {
        // Store user data
        localStorage.setItem('user', JSON.stringify(data));
        
        // Update state
        setUser({
          user_id: data.user_id,
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          roles: data.roles,
        });
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  // Check if user has specific role
  const hasRole = (roleName: string) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.shortname === roleName);
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Provide context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}