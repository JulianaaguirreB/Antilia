import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

export interface User {
  id: string;
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
    let token = null;
    try {
      token = localStorage.getItem('antilia_token');
    } catch (e) {}
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
          try {
            localStorage.removeItem('antilia_token');
            sessionStorage.setItem('session_expired', 'true');
          } catch (e) {}
          window.location.hash = '#/acceso';
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (token: string, newUser: User) => {
    try {
      localStorage.setItem('antilia_token', token);
    } catch (e) {}
    setUser(newUser);
  };

  const logout = () => {
    try {
      localStorage.removeItem('antilia_token');
    } catch (e) {}
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
