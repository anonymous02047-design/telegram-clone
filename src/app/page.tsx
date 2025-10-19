'use client';

import { useTelegramAuth } from '@/contexts/TelegramAuthContext';
import TelegramLogin from '@/components/auth/TelegramLogin';
import ChatInterface from '@/components/chat/ChatInterface';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading, error } = useTelegramAuth();

  useEffect(() => {
    // Initialize Telegram WebApp
    if (typeof window !== 'undefined') {
      // Load Telegram WebApp script if not already loaded
      if (!window.Telegram) {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <TelegramLogin />;
  }

  return <ChatInterface />;
}
