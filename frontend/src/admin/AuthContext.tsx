import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken, clearToken, getToken } from '../api/client';

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'comercial';
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from an existing token.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<AuthUser>('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ access_token: string; user: AuthUser }>('/auth/login', {
      email,
      password,
    });
    setToken(res.data.access_token);
    setUser(res.data.user);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
