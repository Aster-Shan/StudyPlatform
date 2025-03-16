import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { User } from '../types';


interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  register: (userData: object) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get('/api/users/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });

    if (response.data.requires2FA) {
      return {
        requires2FA: true,
        tempToken: response.data.tempToken,
        email,
      };
    }

    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  };

  const register = async (userData: object) => {
    try {
      console.log('Sending registration data:', userData);
      
      const response = await api.post('/api/auth/register', userData);
      
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
    } catch (error: unknown) {
      console.error('Registration error details:', error);
      
      // Check if it's an Axios error with a response
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', {
          status: error.response.status,
          data: error.response.data
        });
        
        // Throw a more specific error with the server's message
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data?.message || 'Registration failed';
        
        throw new Error(errorMessage);
      }
      
      // If it's any other type of error, convert to Error object if needed
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unknown error occurred during registration');
      }
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
