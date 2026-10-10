import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('antilia_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api<{ user: User }>('/auth/me')
      .then(data => {
        setUser(data.user);
      })
      .catch((error) => {
        if (error.status === 401) {
          localStorage.removeItem('antilia_token');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (token: string, newUser: User) => {
    localStorage.setItem('antilia_token', token);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('antilia_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
