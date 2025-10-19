'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Video, 
  PhoneOff, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Search,
  Filter,
  MoreVertical,
  Clock,
  User,
  Star
} from 'lucide-react';

interface Call {
  id: string;
  contactName: string;
  contactAvatar?: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  duration: number; // in seconds
  timestamp: Date;
  isFavorite: boolean;
}

export default function CallsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock calls data
  const [calls, setCalls] = useState<Call[]>([
    {
      id: '1',
      contactName: 'John Doe',
      type: 'voice',
      direction: 'outgoing',
      duration: 180, // 3 minutes
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isFavorite: true,
    },
    {
      id: '2',
      contactName: 'Jane Smith',
      type: 'video',
      direction: 'incoming',
      duration: 0,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isFavorite: false,
    },
    {
      id: '3',
      contactName: 'Bob Johnson',
      type: 'voice',
      direction: 'missed',
      duration: 0,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isFavorite: false,
    },
    {
      id: '4',
      contactName: 'Alice Brown',
      type: 'video',
      direction: 'outgoing',
      duration: 420, // 7 minutes
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isFavorite: true,
    },
  ]);

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeFilter) {
      case 'missed':
        return matchesSearch && call.direction === 'missed';
      case 'outgoing':
        return matchesSearch && call.direction === 'outgoing';
      case 'incoming':
        return matchesSearch && call.direction === 'incoming';
      default:
        return matchesSearch;
    }
  });

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleToggleFavorite = (callId: string) => {
    setCalls(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, isFavorite: !call.isFavorite }
        : call
    ));
  };

  const handleCallBack = (call: Call) => {
    // In a real app, this would initiate a call
    console.log('Calling back:', call.contactName);
  };

  const filters = [
    { id: 'all', label: 'All', count: calls.length },
    { id: 'missed', label: 'Missed', count: calls.filter(c => c.direction === 'missed').length },
    { id: 'outgoing', label: 'Outgoing', count: calls.filter(c => c.direction === 'outgoing').length },
    { id: 'incoming', label: 'Incoming', count: calls.filter(c => c.direction === 'incoming').length },
  ];

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Calls</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Filter size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search calls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 p-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{filter.label}</span>
              <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Calls List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Phone size={48} className="mb-4" />
            <p className="text-lg font-medium">No calls found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCalls.map((call) => (
              <div key={call.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        {call.contactName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {call.isFavorite && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {call.contactName}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {call.type === 'video' ? (
                          <Video size={16} className="text-purple-500" />
                        ) : (
                          <Phone size={16} className="text-green-500" />
                        )}
                        {call.direction === 'incoming' ? (
                          <PhoneIncoming size={16} className="text-blue-500" />
                        ) : call.direction === 'outgoing' ? (
                          <PhoneOutgoing size={16} className="text-green-500" />
                        ) : (
                          <PhoneOff size={16} className="text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimestamp(call.timestamp)}
                      </span>
                      {call.duration > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDuration(call.duration)}
                        </span>
                      )}
                      {call.direction === 'missed' && (
                        <span className="text-sm text-red-500 font-medium">Missed</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleFavorite(call.id)}
                      className={`p-2 rounded-full transition-colors ${
                        call.isFavorite 
                          ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Star size={20} />
                    </button>
                    <button
                      onClick={() => handleCallBack(call)}
                      className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                    >
                      {call.type === 'video' ? <Video size={20} /> : <Phone size={20} />}
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
