import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/fpms';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'faculty@demo.edu': {
    password: 'faculty123',
    user: {
      id: '1',
      email: 'faculty@demo.edu',
      name: 'Dr. John Smith',
      role: 'faculty',
      department: 'Computer Science',
      designation: 'Associate Professor',
      experience: 8,
      hasPhD: true,
    },
  },
  'hod@demo.edu': {
    password: 'hod123',
    user: {
      id: '2',
      email: 'hod@demo.edu',
      name: 'Dr. Sarah Johnson',
      role: 'hod',
      department: 'Computer Science',
      designation: 'Professor & HOD',
      experience: 15,
      hasPhD: true,
    },
  },
  'committee@demo.edu': {
    password: 'committee123',
    user: {
      id: '3',
      email: 'committee@demo.edu',
      name: 'Dr. Michael Brown',
      role: 'committee',
      department: 'Administration',
      designation: 'Principal',
      experience: 20,
      hasPhD: true,
    },
  },
  'admin@demo.edu': {
    password: 'admin123',
    user: {
      id: '4',
      email: 'admin@demo.edu',
      name: 'System Admin',
      role: 'admin',
      department: 'IT',
      designation: 'System Administrator',
      experience: 5,
      hasPhD: false,
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('fpms_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('fpms_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem('fpms_user', JSON.stringify(mockUser.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fpms_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
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