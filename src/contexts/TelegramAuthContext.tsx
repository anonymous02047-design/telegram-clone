'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { telegramApi, TelegramUser, TelegramChat, TelegramMessage } from '@/lib/telegram-api';

interface TelegramAuthContextType {
  user: TelegramUser | null;
  chats: TelegramChat[];
  messages: { [chatId: string]: TelegramMessage[] };
  isLoading: boolean;
  error: string | null;
  login: (authData: TelegramUser) => Promise<void>;
  logout: () => void;
  sendMessage: (chatId: string, text: string, options?: Record<string, unknown>) => Promise<TelegramMessage>;
  sendPhoto: (chatId: string, photo: File | string, options?: Record<string, unknown>) => Promise<TelegramMessage>;
  sendDocument: (chatId: string, document: File | string, options?: Record<string, unknown>) => Promise<TelegramMessage>;
  sendVoice: (chatId: string, voice: File | Blob, options?: Record<string, unknown>) => Promise<TelegramMessage>;
  sendVideo: (chatId: string, video: File | string, options?: Record<string, unknown>) => Promise<TelegramMessage>;
  editMessage: (chatId: string, messageId: number, text: string, options?: Record<string, unknown>) => Promise<TelegramMessage>;
  deleteMessage: (chatId: string, messageId: number) => Promise<boolean>;
  getChats: () => Promise<void>;
  getMessages: (chatId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TelegramAuthContext = createContext<TelegramAuthContextType | undefined>(undefined);

interface TelegramAuthProviderProps {
  children: ReactNode;
}

export function TelegramAuthProvider({ children }: TelegramAuthProviderProps) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [chats, setChats] = useState<TelegramChat[]>([]);
  const [messages, setMessages] = useState<{ [chatId: string]: TelegramMessage[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('telegram_user');
    const savedChats = localStorage.getItem('telegram_chats');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('telegram_user');
      }
    }
    
    if (savedChats) {
      try {
        setChats(JSON.parse(savedChats));
      } catch (error) {
        console.error('Error parsing saved chats:', error);
        localStorage.removeItem('telegram_chats');
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('telegram_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('telegram_user');
    }
  }, [user]);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('telegram_chats', JSON.stringify(chats));
    } else {
      localStorage.removeItem('telegram_chats');
    }
  }, [chats]);

  const login = async (authData: TelegramUser) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate auth data
      if (!authData || !authData.id || !authData.first_name) {
        throw new Error('Invalid authentication data');
      }

      // Set user data
      const telegramUser: TelegramUser = {
        id: authData.id,
        first_name: authData.first_name,
        last_name: authData.last_name,
        username: authData.username,
        language_code: authData.language_code,
        is_premium: authData.is_premium || false,
        photo_url: authData.photo_url,
      };

      setUser(telegramUser);
      
      // Load user's chats
      await getChats();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setChats([]);
    setMessages({});
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('telegram_user');
    localStorage.removeItem('telegram_chats');
    localStorage.removeItem('telegram_messages');
  };

  const getChats = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would get chats from Telegram API
      // For now, we'll simulate getting chats with more realistic data
      const mockChats: TelegramChat[] = [
        {
          id: -1001234567890,
          type: 'group',
          title: 'Tech Community',
          description: 'Discussing latest tech trends and innovations',
          member_count: 247,
        },
        {
          id: -1001234567891,
          type: 'supergroup',
          title: 'Project Alpha Team',
          description: 'Internal team communication for Project Alpha',
          member_count: 15,
        },
        {
          id: -1001234567892,
          type: 'channel',
          title: 'Tech News Channel',
          description: 'Latest technology news and updates',
          member_count: 1250,
        },
        {
          id: 123456789,
          type: 'private',
          first_name: 'Alice',
          last_name: 'Johnson',
          username: 'alice_j',
        },
        {
          id: 987654321,
          type: 'private',
          first_name: 'Bob',
          last_name: 'Smith',
          username: 'bobsmith',
        },
        {
          id: 555666777,
          type: 'private',
          first_name: 'Emma',
          last_name: 'Wilson',
          username: 'emma_w',
        },
      ];
      
      setChats(mockChats);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load chats';
      setError(errorMessage);
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getMessages = useCallback(async (chatId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would get messages from Telegram API
      // For now, we'll simulate getting messages with more realistic data
      const mockMessages: TelegramMessage[] = [
        {
          message_id: 1,
          from: {
            id: 123456789,
            first_name: 'Alice',
            last_name: 'Johnson',
            username: 'alice_j',
          },
          date: Date.now() / 1000 - 3600, // 1 hour ago
          chat: {
            id: parseInt(chatId),
            type: 'group',
            title: 'Tech Community',
          },
          text: 'Hey everyone! Just finished reading about the new React 19 features. The concurrent rendering improvements look amazing! 🚀',
        },
        {
          message_id: 2,
          from: {
            id: 987654321,
            first_name: 'Bob',
            last_name: 'Smith',
            username: 'bobsmith',
          },
          date: Date.now() / 1000 - 1800, // 30 minutes ago
          chat: {
            id: parseInt(chatId),
            type: 'group',
            title: 'Tech Community',
          },
          text: 'That\'s awesome! I\'ve been experimenting with the new hooks. The performance boost is noticeable.',
        },
        {
          message_id: 3,
          from: {
            id: 555666777,
            first_name: 'Emma',
            last_name: 'Wilson',
            username: 'emma_w',
          },
          date: Date.now() / 1000 - 1200, // 20 minutes ago
          chat: {
            id: parseInt(chatId),
            type: 'group',
            title: 'Tech Community',
          },
          text: 'Has anyone tried the new Next.js 15 with Turbopack? The build times are incredible! ⚡',
        },
        {
          message_id: 4,
          from: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
          },
          date: Date.now() / 1000 - 600, // 10 minutes ago
          chat: {
            id: parseInt(chatId),
            type: 'group',
            title: 'Tech Community',
          },
          text: 'Yes! I\'ve been using it for this project. The hot reload is so much faster now. Highly recommend! 👍',
        },
        {
          message_id: 5,
          from: {
            id: 123456789,
            first_name: 'Alice',
            last_name: 'Johnson',
            username: 'alice_j',
          },
          date: Date.now() / 1000 - 300, // 5 minutes ago
          chat: {
            id: parseInt(chatId),
            type: 'group',
            title: 'Tech Community',
          },
          text: 'Perfect! I\'ll definitely give it a try. Thanks for the recommendation! 🙏',
        },
      ];
      
      setMessages(prev => ({
        ...prev,
        [chatId]: mockMessages,
      }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
      setError(errorMessage);
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const sendMessage = async (chatId: string, text: string, options?: Record<string, unknown>): Promise<TelegramMessage> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const message = await telegramApi.sendMessage(parseInt(chatId), text, options);
      
      // Add message to local state
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));
      
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const sendPhoto = async (chatId: string, photo: File | string, options?: Record<string, unknown>): Promise<TelegramMessage> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const message = await telegramApi.sendPhoto(parseInt(chatId), photo, options);
      
      // Add message to local state
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));
      
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send photo';
      setError(errorMessage);
      console.error('Error sending photo:', error);
      throw error;
    }
  };

  const sendDocument = async (chatId: string, document: File | string, options?: Record<string, unknown>): Promise<TelegramMessage> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const message = await telegramApi.sendDocument(parseInt(chatId), document, options);
      
      // Add message to local state
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));
      
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send document';
      setError(errorMessage);
      console.error('Error sending document:', error);
      throw error;
    }
  };

  const sendVoice = async (chatId: string, voice: File | Blob, options?: Record<string, unknown>): Promise<TelegramMessage> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const message = await telegramApi.sendVoice(parseInt(chatId), voice, options);
      
      // Add message to local state
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));
      
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send voice message';
      setError(errorMessage);
      console.error('Error sending voice message:', error);
      throw error;
    }
  };

  const sendVideo = async (chatId: string, video: File | string, options?: Record<string, unknown>): Promise<TelegramMessage> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const message = await telegramApi.sendVideo(parseInt(chatId), video, options);
      
      // Add message to local state
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));
      
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send video';
      setError(errorMessage);
      console.error('Error sending video:', error);
      throw error;
    }
  };

  const editMessage = async (chatId: string, messageId: number, text: string, options?: Record<string, unknown>): Promise<TelegramMessage> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const message = await telegramApi.editMessageText(parseInt(chatId), messageId, text, options);
      
      // Update message in local state
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId]?.map(msg => 
          msg.message_id === messageId ? message : msg
        ) || [],
      }));
      
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to edit message';
      setError(errorMessage);
      console.error('Error editing message:', error);
      throw error;
    }
  };

  const deleteMessage = async (chatId: string, messageId: number): Promise<boolean> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const success = await telegramApi.deleteMessage(parseInt(chatId), messageId);
      
      if (success) {
        // Remove message from local state
        setMessages(prev => ({
          ...prev,
          [chatId]: prev[chatId]?.filter(msg => msg.message_id !== messageId) || [],
        }));
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message';
      setError(errorMessage);
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await getChats();
      // Refresh messages for all chats
      for (const chat of chats) {
        await getMessages(chat.id.toString());
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh data';
      setError(errorMessage);
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: TelegramAuthContextType = {
    user,
    chats,
    messages,
    isLoading,
    error,
    login,
    logout,
    sendMessage,
    sendPhoto,
    sendDocument,
    sendVoice,
    sendVideo,
    editMessage,
    deleteMessage,
    getChats,
    getMessages,
    refreshData,
  };

  return (
    <TelegramAuthContext.Provider value={value}>
      {children}
    </TelegramAuthContext.Provider>
  );
}

export function useTelegramAuth() {
  const context = useContext(TelegramAuthContext);
  if (context === undefined) {
    throw new Error('useTelegramAuth must be used within a TelegramAuthProvider');
  }
  return context;
}