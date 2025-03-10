// src/pages/OAuth2RedirectHandler.tsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      setToken(token);
      navigate('/');
    } else {
      navigate('/login', { state: { error: 'Failed to login with Google' } });
    }
  }, [searchParams, navigate, setToken]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Processing login...</p>
    </div>
  );
}