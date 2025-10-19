'use client';

import React from 'react';
import { Phone, Video, MoreVertical, Search } from 'lucide-react';
import { Chat } from '@/types';

interface ChatHeaderProps {
  chat: Chat | null;
  onSearch: () => void;
}

export default function ChatHeader({ chat, onSearch }: ChatHeaderProps) {
  if (!chat) {
    return (
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {chat.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="font-medium text-gray-900">{chat.name}</h2>
          <p className="text-sm text-gray-500">
            {chat.type === 'private' ? 'Online' : `${chat.participants.length} members`}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={onSearch}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <Search size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Phone size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Video size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
