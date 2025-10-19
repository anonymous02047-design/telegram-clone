'use client';

import React, { useState } from 'react';
import { Search, Plus, Settings, LogOut } from 'lucide-react';
import { useTelegramAuth } from '@/contexts/TelegramAuthContext';
import { Chat } from '@/types';

interface SidebarProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onCreateChat: () => void;
  onSearch: () => void;
  onSettings: () => void;
}

export default function Sidebar({ chats, selectedChatId, onChatSelect, onCreateChat, onSearch, onSettings }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useTelegramAuth();

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Telegram Clone</h1>
          <button
            onClick={logout}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={onSearch}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 cursor-pointer"
            readOnly
          />
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.first_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium">{user?.first_name || 'User'}</p>
            <p className="text-sm text-gray-400">Online</p>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <button
            onClick={onCreateChat}
            className="w-full flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors mb-2"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span>New Chat</span>
          </button>
        </div>

        <div className="px-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer mb-1 ${
                selectedChatId === chat.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {chat.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{chat.name}</p>
                <p className="text-sm text-gray-400 truncate">
                  {chat.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
              {chat.lastMessage && (
                <div className="text-xs text-gray-400">
                  {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={onSettings}
          className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors w-full"
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
