'use client';

import React, { useState } from 'react';
import { 
  Hash, 
  Settings, 
  Users, 
  MessageSquare, 
  Globe, 
  Lock, 
  Edit, 
  Trash2,
  BarChart3,
  Calendar,
  Eye,
  Share2,
  Bell,
  BellOff
} from 'lucide-react';
import { Chat } from '@/types';

interface ChannelManagementProps {
  channel: Chat;
  isOpen: boolean;
  onClose: () => void;
  onUpdateChannel: (channelId: string, updates: Partial<Chat>) => void;
  onDeleteChannel: (channelId: string) => void;
}

interface ChannelStats {
  subscribers: number;
  views: number;
  messages: number;
  growth: number;
}

export default function ChannelManagement({ channel, isOpen, onClose, onUpdateChannel, onDeleteChannel }: ChannelManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: channel.name,
    description: channel.description || '',
    username: `@${channel.name.toLowerCase().replace(/\s+/g, '')}`,
  });

  // Mock channel stats
  const channelStats: ChannelStats = {
    subscribers: 1250,
    views: 15600,
    messages: 89,
    growth: 12.5,
  };

  const handleSave = () => {
    onUpdateChannel(channel.id, {
      name: editData.name,
      description: editData.description,
    });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'subscribers', label: 'Subscribers', icon: <Users size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Channel Management</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>
          
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Channel Overview</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Channel Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                    <Hash size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={editData.username}
                          onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{channel.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{editData.username}</p>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">{channel.description || 'No description'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users size={20} className="text-blue-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Subscribers</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{channelStats.subscribers.toLocaleString()}</p>
                  <p className="text-sm text-green-500">+{channelStats.growth}% this month</p>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <Eye size={20} className="text-purple-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Views</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{channelStats.views.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">All time</p>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={20} className="text-green-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Messages</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{channelStats.messages}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} className="text-orange-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Created</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Date(channel.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <Share2 size={20} />
                  <span>Share Channel</span>
                </button>
                <button className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <MessageSquare size={20} />
                  <span>Send Message</span>
                </button>
                <button className="flex items-center space-x-2 p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <BarChart3 size={20} />
                  <span>View Analytics</span>
                </button>
                <button className="flex items-center space-x-2 p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subscribers</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Recent Subscribers</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{channelStats.subscribers} total</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">U{i + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">User {i + 1}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@user{i + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Channel Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Public Channel</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow anyone to find and join this channel</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Allow Comments</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Let subscribers comment on messages</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Send notifications for new messages</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onDeleteChannel(channel.id)}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Delete Channel</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Growth</h4>
                  <div className="h-32 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Growth Chart</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement</h4>
                  <div className="h-32 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Engagement Chart</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
