import { AxiosError } from 'axios';
import { AlertCircle } from 'lucide-react';
import React, { FormEvent, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface LocationState {
  email?: string;
  tempToken?: string;
}

export default function Login2FA() {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();
  const { email, tempToken } = location.state as LocationState;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/verify-2fa', {
        email,
        code,
        tempToken
      });

      setToken(response.data.token);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data || 'Invalid verification code. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if email or tempToken is not available, then redirect to login page
  if (!email || !tempToken) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Two-Factor Authentication</h2>
        <p className="text-center text-gray-500 mb-8">
          Enter the verification code from your authenticator app
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input 
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              required
              className="w-full text-center text-lg tracking-widest border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-md"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <p className="text-sm text-gray-600">
            Didn't receive a code? Check your authenticator app
          </p>
        </div>
      </div>
    </div>
  );
}
