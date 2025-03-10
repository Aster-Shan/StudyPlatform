import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'; // Add React import
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: unknown) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const setToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await api.get('/api/users/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    
    // Check if 2FA is required
    if (response.data.requires2FA) {
      return {
        requires2FA: true,
        tempToken: response.data.tempToken,
        email
      };
    }
    
    // Regular login
    localStorage.setItem('token', response.data.token);
    setTokenState(response.data.token);
    setUser(response.data.user);
    
    return response.data;
  };

  const register = async (userData: unknown) => {
    const response = await api.post('/api/auth/register', userData);
    
    localStorage.setItem('token', response.data.token);
    setTokenState(response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setTokenState(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout, 
      updateUser,
      setToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};
