'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MessageCircle, Users, Hash, Calendar, Filter } from 'lucide-react';
import { Chat, Message } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatSelect: (chatId: string) => void;
  onMessageSelect: (message: Message) => void;
}

interface SearchResult {
  type: 'chat' | 'message';
  data: Chat | Message;
  relevance: number;
}

export default function SearchModal({ isOpen, onClose, onChatSelect, onMessageSelect }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'chats' | 'messages'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data - in a real app, this would come from an API
  const mockChats: Chat[] = [
    {
      id: '1',
      name: 'John Doe',
      type: 'private',
      participants: ['user1', 'user2'],
      admins: [],
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Tech Team',
      type: 'group',
      participants: ['user1', 'user2', 'user3'],
      admins: ['user1'],
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockMessages: Message[] = [
    {
      id: 'msg1',
      chatId: '1',
      senderId: 'user2',
      content: 'Hey, how are you doing?',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isDeleted: false,
    },
    {
      id: 'msg2',
      chatId: '2',
      senderId: 'user3',
      content: 'The new feature is ready for testing',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isDeleted: false,
    },
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query, activeFilter, dateFilter]);

  const performSearch = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const searchQuery = query.toLowerCase();
    const filteredResults: SearchResult[] = [];

    // Search chats
    if (activeFilter === 'all' || activeFilter === 'chats') {
      mockChats.forEach(chat => {
        if (chat.name.toLowerCase().includes(searchQuery)) {
          filteredResults.push({
            type: 'chat',
            data: chat,
            relevance: chat.name.toLowerCase().indexOf(searchQuery)
          });
        }
      });
    }

    // Search messages
    if (activeFilter === 'all' || activeFilter === 'messages') {
      mockMessages.forEach(message => {
        if (message.content.toLowerCase().includes(searchQuery)) {
          const chat = mockChats.find(c => c.id === message.chatId);
          if (chat && isDateInRange(message.timestamp)) {
            filteredResults.push({
              type: 'message',
              data: message,
              relevance: message.content.toLowerCase().indexOf(searchQuery)
            });
          }
        }
      });
    }

    // Sort by relevance
    filteredResults.sort((a, b) => a.relevance - b.relevance);
    setResults(filteredResults);
    setIsLoading(false);
  };

  const isDateInRange = (date: Date): boolean => {
    const now = new Date();
    const messageDate = new Date(date);

    switch (dateFilter) {
      case 'today':
        return messageDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return messageDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return messageDate >= monthAgo;
      default:
        return true;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'chat') {
      onChatSelect((result.data as Chat).id);
    } else {
      onMessageSelect(result.data as Message);
    }
    onClose();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getChatIcon = (chat: Chat) => {
    switch (chat.type) {
      case 'private':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'group':
        return <Users size={16} className="text-green-500" />;
      case 'channel':
        return <Hash size={16} className="text-purple-500" />;
      default:
        return <MessageCircle size={16} className="text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Search size={20} className="text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search messages and chats..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
            </div>
            
            <div className="flex space-x-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'chats', label: 'Chats' },
                { id: 'messages', label: 'Messages' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as 'all' | 'chats' | 'messages')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
                className="text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded px-2 py-1 text-gray-700 dark:text-gray-300"
              >
                <option value="all">All time</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                >
                  {result.type === 'chat' ? (
                    <div className="flex items-center space-x-3">
                      {getChatIcon(result.data as Chat)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {(result.data as Chat).name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(result.data as Chat).type === 'private' ? 'Private chat' : 
                           (result.data as Chat).type === 'group' ? 'Group chat' : 'Channel'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <MessageCircle size={16} className="text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {(result.data as Message).content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate((result.data as Message).timestamp)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No results found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Try different keywords or check your filters
              </p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Start typing to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
