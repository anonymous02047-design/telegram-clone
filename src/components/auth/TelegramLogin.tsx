'use client';

import React, { useState, useEffect } from 'react';
import { useTelegramAuth } from '@/contexts/TelegramAuthContext';
import { telegramWebApp } from '@/lib/telegram-webapp';
import { Loader2, Smartphone, Globe, AlertCircle, CheckCircle } from 'lucide-react';

interface TelegramLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function TelegramLogin({ onSuccess, onError }: TelegramLoginProps) {
  const { login, isLoading, error } = useTelegramAuth();
  const [isWebAppAvailable, setIsWebAppAvailable] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkWebAppAvailability = () => {
      const available = telegramWebApp.isAvailable;
      setIsWebAppAvailable(available);
      setIsInitializing(false);

      if (available && telegramWebApp.user) {
        // Auto-login if user data is available
        handleTelegramLogin();
      }
    };

    // Check immediately
    checkWebAppAvailability();

    // Also check after a short delay in case the WebApp loads later
    const timer = setTimeout(checkWebAppAvailability, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTelegramLogin = async () => {
    try {
      if (!telegramWebApp.isAvailable) {
        throw new Error('Telegram WebApp is not available');
      }

      const user = telegramWebApp.user;
      if (!user) {
        throw new Error('No user data available from Telegram');
      }

      await login(user);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('Telegram login error:', error);
      onError?.(errorMessage);
    }
  };

  const handleDevelopmentLogin = async () => {
    try {
      // Mock user data for development
      const mockUser = {
        id: 123456789,
        first_name: 'Alex',
        last_name: 'Developer',
        username: 'alex_dev',
        language_code: 'en',
        is_premium: true,
        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      };

      await login(mockUser);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Development login failed';
      console.error('Development login error:', error);
      onError?.(errorMessage);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Initializing Telegram WebApp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Telegram Clone
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with your Telegram account
            </p>
          </div>

          {/* Status */}
          <div className="mb-6">
            {isWebAppAvailable ? (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Telegram WebApp Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Running in Development Mode</span>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}

          {/* Login Options */}
          <div className="space-y-4">
            {isWebAppAvailable ? (
              <button
                onClick={handleTelegramLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Smartphone className="w-5 h-5" />
                )}
                <span>
                  {isLoading ? 'Connecting...' : 'Login with Telegram'}
                </span>
              </button>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleDevelopmentLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Globe className="w-5 h-5" />
                  )}
                  <span>
                    {isLoading ? 'Connecting...' : 'Login (Development Mode)'}
                  </span>
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    To use the full Telegram integration, open this app in Telegram
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Features Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Features
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time messaging</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Voice & video calls</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>File sharing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Group management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Bot integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Push notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
