'use client';

import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Video, 
  MessageSquare, 
  MoreVertical,
  Star,
  User,
  Users,
  Shield,
  Globe
} from 'lucide-react';
import { useTelegramAuth } from '@/contexts/TelegramAuthContext';

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  phoneNumber?: string;
  isBlocked: boolean;
  isFavorite: boolean;
  mutualContacts: number;
}

export default function ContactsPage() {
  const { user } = useTelegramAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Mock contacts data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      isOnline: true,
      phoneNumber: '+1234567890',
      isBlocked: false,
      isFavorite: true,
      mutualContacts: 5,
    },
    {
      id: '2',
      name: 'Jane Smith',
      username: 'janesmith',
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      phoneNumber: '+1234567891',
      isBlocked: false,
      isFavorite: false,
      mutualContacts: 3,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      username: 'bobjohnson',
      isOnline: true,
      phoneNumber: '+1234567892',
      isBlocked: false,
      isFavorite: false,
      mutualContacts: 8,
    },
    {
      id: '4',
      name: 'Alice Brown',
      username: 'alicebrown',
      isOnline: false,
      lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      phoneNumber: '+1234567893',
      isBlocked: true,
      isFavorite: false,
      mutualContacts: 2,
    },
  ]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'favorites':
        return matchesSearch && contact.isFavorite;
      case 'online':
        return matchesSearch && contact.isOnline;
      case 'blocked':
        return matchesSearch && contact.isBlocked;
      default:
        return matchesSearch && !contact.isBlocked;
    }
  });

  const handleToggleFavorite = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    ));
  };

  const handleToggleBlock = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, isBlocked: !contact.isBlocked }
        : contact
    ));
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const tabs = [
    { id: 'all', label: 'All', icon: <Users size={16} />, count: contacts.filter(c => !c.isBlocked).length },
    { id: 'favorites', label: 'Favorites', icon: <Star size={16} />, count: contacts.filter(c => c.isFavorite).length },
    { id: 'online', label: 'Online', icon: <Globe size={16} />, count: contacts.filter(c => c.isOnline).length },
    { id: 'blocked', label: 'Blocked', icon: <Shield size={16} />, count: contacts.filter(c => c.isBlocked).length },
  ];

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Contacts</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <UserPlus size={20} className="text-gray-600 dark:text-gray-400" />
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
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <User size={48} className="mb-4" />
            <p className="text-lg font-medium">No contacts found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedContacts.includes(contact.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {contact.name}
                      </h3>
                      {contact.isFavorite && (
                        <Star size={16} className="text-yellow-500 flex-shrink-0" />
                      )}
                      {contact.isBlocked && (
                        <Shield size={16} className="text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{contact.username}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      {contact.isOnline ? (
                        <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                      ) : contact.lastSeen ? (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Last seen {formatLastSeen(contact.lastSeen)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Offline</span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.mutualContacts} mutual contacts
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full">
                      <MessageSquare size={20} />
                    </button>
                    <button className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full">
                      <Phone size={20} />
                    </button>
                    <button className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full">
                      <Video size={20} />
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
