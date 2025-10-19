'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Share, 
  Trash2, 
  Eye,
  Calendar,
  User,
  MessageSquare,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Archive
} from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  name: string;
  url: string;
  size: number;
  timestamp: Date;
  senderName: string;
  chatName: string;
  thumbnail?: string;
  duration?: number; // for videos/audio
}

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock media data
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'image',
      name: 'photo_001.jpg',
      url: '/api/placeholder/400/300',
      size: 1024000, // 1MB
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      senderName: 'John Doe',
      chatName: 'Family Group',
    },
    {
      id: '2',
      type: 'video',
      name: 'video_001.mp4',
      url: '/api/placeholder/400/300',
      size: 15728640, // 15MB
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      senderName: 'Jane Smith',
      chatName: 'Work Team',
      duration: 120, // 2 minutes
    },
    {
      id: '3',
      type: 'document',
      name: 'presentation.pdf',
      url: '/api/placeholder/400/300',
      size: 5242880, // 5MB
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      senderName: 'Bob Johnson',
      chatName: 'Project Discussion',
    },
    {
      id: '4',
      type: 'audio',
      name: 'voice_message.ogg',
      url: '/api/placeholder/400/300',
      size: 512000, // 512KB
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      senderName: 'Alice Brown',
      chatName: 'Friends Chat',
      duration: 45, // 45 seconds
    },
  ]);

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.chatName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && item.type === activeFilter;
  });

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
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

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} className="text-blue-500" />;
      case 'video': return <Video size={20} className="text-purple-500" />;
      case 'document': return <FileText size={20} className="text-green-500" />;
      case 'audio': return <Music size={20} className="text-orange-500" />;
      default: return <Archive size={20} className="text-gray-500" />;
    }
  };

  const filters = [
    { id: 'all', label: 'All', icon: <Archive size={16} />, count: mediaItems.length },
    { id: 'image', label: 'Photos', icon: <ImageIcon size={16} />, count: mediaItems.filter(m => m.type === 'image').length },
    { id: 'video', label: 'Videos', icon: <Video size={16} />, count: mediaItems.filter(m => m.type === 'video').length },
    { id: 'document', label: 'Documents', icon: <FileText size={16} />, count: mediaItems.filter(m => m.type === 'document').length },
    { id: 'audio', label: 'Audio', icon: <Music size={16} />, count: mediaItems.filter(m => m.type === 'audio').length },
  ];

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Media</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              {viewMode === 'grid' ? <List size={20} className="text-gray-600 dark:text-gray-400" /> : <Grid size={20} className="text-gray-600 dark:text-gray-400" />}
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Filter size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search media..."
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
              {filter.icon}
              <span>{filter.label}</span>
              <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {selectedItems.length} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg">
                <Download size={16} />
              </button>
              <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg">
                <Share size={16} />
              </button>
              <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Archive size={48} className="mb-4" />
            <p className="text-lg font-medium">No media found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4' : 'space-y-2'}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                  viewMode === 'grid' ? 'aspect-square' : 'flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg'
                } ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSelectItem(item.id)}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                        <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                    {selectedItems.includes(item.id) && (
                      <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                      <p className="text-xs truncate">{item.name}</p>
                      <p className="text-xs opacity-75">{formatFileSize(item.size)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(item.size)}</span>
                        <span>{formatTimestamp(item.timestamp)}</span>
                        <span>{item.senderName}</span>
                        <span>{item.chatName}</span>
                        {item.duration && (
                          <span>{formatDuration(item.duration)}</span>
                        )}
                      </div>
                    </div>
                    {selectedItems.includes(item.id) && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
