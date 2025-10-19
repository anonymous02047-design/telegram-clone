'use client';

import React, { useState } from 'react';
import { X, Users, Hash, Lock, Globe, Search, UserPlus, Camera } from 'lucide-react';
import { useTelegramAuth } from '@/contexts/TelegramAuthContext';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupData: GroupData) => void;
}

interface GroupData {
  name: string;
  description: string;
  type: 'group' | 'channel';
  privacy: 'public' | 'private';
  members: string[];
  avatar?: string;
}

interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
}

export default function CreateGroupModal({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) {
  const { user } = useTelegramAuth();
  const [step, setStep] = useState(1);
  const [groupData, setGroupData] = useState<GroupData>({
    name: '',
    description: '',
    type: 'group',
    privacy: 'private',
    members: [],
    avatar: undefined,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  // Mock users data - in a real app, this would come from an API
  const mockUsers: User[] = [
    { id: '1', name: 'John Doe', username: 'johndoe', isOnline: true },
    { id: '2', name: 'Jane Smith', username: 'janesmith', isOnline: false },
    { id: '3', name: 'Bob Johnson', username: 'bobjohnson', isOnline: true },
    { id: '4', name: 'Alice Brown', username: 'alicebrown', isOnline: true },
    { id: '5', name: 'Charlie Wilson', username: 'charliewilson', isOnline: false },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (step === 1 && groupData.name.trim()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleCreate = () => {
    onCreateGroup({
      ...groupData,
      members: selectedMembers.map(member => member.id),
    });
    onClose();
    setStep(1);
    setGroupData({
      name: '',
      description: '',
      type: 'group',
      privacy: 'private',
      members: [],
      avatar: undefined,
    });
    setSelectedMembers([]);
  };

  const handleAddMember = (user: User) => {
    if (!selectedMembers.find(member => member.id === user.id)) {
      setSelectedMembers(prev => [...prev, user]);
    }
  };

  const handleRemoveMember = (userId: string) => {
    setSelectedMembers(prev => prev.filter(member => member.id !== userId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {step === 1 ? 'Create Group' : step === 2 ? 'Add Members' : 'Review & Create'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              {/* Group Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                    {groupData.avatar ? (
                      <img src={groupData.avatar} alt="Group avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Users size={32} className="text-white" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                    <Camera size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Group Photo</p>
              </div>

              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={groupData.name}
                  onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter group name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Group Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGroupData(prev => ({ ...prev, type: 'group' }))}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      groupData.type === 'group'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Users size={24} className="mx-auto mb-2 text-blue-500" />
                    <p className="font-medium text-gray-900 dark:text-white">Group</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Interactive chat</p>
                  </button>
                  <button
                    onClick={() => setGroupData(prev => ({ ...prev, type: 'channel' }))}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      groupData.type === 'channel'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Hash size={24} className="mx-auto mb-2 text-purple-500" />
                    <p className="font-medium text-gray-900 dark:text-white">Channel</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Broadcast messages</p>
                  </button>
                </div>
              </div>

              {/* Privacy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Privacy
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={groupData.privacy === 'private'}
                      onChange={(e) => setGroupData(prev => ({ ...prev, privacy: e.target.value as 'private' | 'public' }))}
                      className="text-blue-500"
                    />
                    <Lock size={16} className="text-gray-500" />
                    <span className="text-gray-900 dark:text-white">Private</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={groupData.privacy === 'public'}
                      onChange={(e) => setGroupData(prev => ({ ...prev, privacy: e.target.value as 'private' | 'public' }))}
                      className="text-blue-500"
                    />
                    <Globe size={16} className="text-gray-500" />
                    <span className="text-gray-900 dark:text-white">Public</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={groupData.description}
                  onChange={(e) => setGroupData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter group description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Users List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleAddMember(user)}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <UserPlus size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Members */}
              {selectedMembers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Members ({selectedMembers.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
                      >
                        <span className="text-sm">{member.name}</span>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {groupData.type === 'group' ? <Users size={32} className="text-white" /> : <Hash size={32} className="text-white" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{groupData.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{groupData.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="text-gray-900 dark:text-white capitalize">{groupData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Privacy:</span>
                  <span className="text-gray-900 dark:text-white capitalize">{groupData.privacy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Members:</span>
                  <span className="text-gray-900 dark:text-white">{selectedMembers.length + 1}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <button
              onClick={step > 1 ? () => setStep(step - 1) : onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </button>
            <button
              onClick={step < 3 ? handleNext : handleCreate}
              disabled={step === 1 && !groupData.name.trim()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg"
            >
              {step < 3 ? 'Next' : 'Create Group'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
