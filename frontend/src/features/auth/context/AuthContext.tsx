import { replaceRoute } from '../../../app/routing';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setUnauthorizedHandler } from '../../../shared/api/client';

export type LumiStyle = {outfit:'none'|'sweater'|'overalls'|'cape';hair:'none'|'curls'|'pink'|'silver';hat:'none'|'beanie'|'party'|'crown';glasses?:'none'|'round'|'sun'|'heart'};
export interface User {
  avatar_url?: string | null;
  lumi_style?: LumiStyle;
  id: string;
  name: string;
  email: string;
  created_at: string;
  email_verified_at?: string | null;
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
    setUnauthorizedHandler(() => {
      try {
        localStorage.removeItem('antilia_token');
        sessionStorage.setItem('session_expired', 'true');
        sessionStorage.removeItem('antilia_welcome_email');
      } catch (e) {}
      setUser(null);
      if (window.location.hash !== '#/acceso' && window.location.hash !== '#/registro') {
        replaceRoute('#/acceso');
      }
    });

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
      .catch(() => {
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
    sessionStorage.removeItem('antilia_welcome_email');
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
