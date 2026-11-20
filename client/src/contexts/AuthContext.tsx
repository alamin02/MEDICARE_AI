import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_CREDENTIALS } from '../services/syntheticData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  demoLogin: (role: UserRole) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('medicare_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('medicare_token') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('medicare_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medicare_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('medicare_token', token);
    } else {
      localStorage.removeItem('medicare_token');
    }
  }, [token]);

  const demoLogin = (role: UserRole) => {
    let demoUser: User;
    if (role === 'DOCTOR') {
      demoUser = {
        id: 'doc-1',
        email: DEMO_CREDENTIALS.doctor.email,
        name: DEMO_CREDENTIALS.doctor.name,
        role: 'DOCTOR',
        phone: '+880 1711-000002 (Demo)',
        is_demo: true,
        created_at: new Date().toISOString()
      };
    } else if (role === 'ADMIN') {
      demoUser = {
        id: 'admin-1',
        email: DEMO_CREDENTIALS.admin.email,
        name: DEMO_CREDENTIALS.admin.name,
        role: 'ADMIN',
        phone: '+880 1711-000003 (Demo)',
        is_demo: true,
        created_at: new Date().toISOString()
      };
    } else {
      demoUser = {
        id: 'patient-demo-1',
        email: DEMO_CREDENTIALS.patient.email,
        name: DEMO_CREDENTIALS.patient.name,
        role: 'PATIENT',
        phone: '+880 1711-000001 (Demo)',
        is_demo: true,
        created_at: new Date().toISOString()
      };
    }

    const mockToken = `mock-jwt-token-${role.toLowerCase()}-${Date.now()}`;
    setUser(demoUser);
    setToken(mockToken);
  };

  const login = async (email: string, role: UserRole = 'PATIENT'): Promise<boolean> => {
    // Check if matching demo email or create standard mock user
    if (email.includes('doctor')) {
      demoLogin('DOCTOR');
      return true;
    } else if (email.includes('admin')) {
      demoLogin('ADMIN');
      return true;
    } else {
      demoLogin('PATIENT');
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medicare_user');
    localStorage.removeItem('medicare_token');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        demoLogin,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
