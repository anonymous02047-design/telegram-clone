'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Crown, 
  UserPlus, 
  UserMinus, 
  Shield, 
  Ban, 
  MessageSquare,
  Hash,
  Lock,
  Globe,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Chat } from '@/types';

interface GroupManagementProps {
  group: Chat;
  isOpen: boolean;
  onClose: () => void;
  onUpdateGroup: (groupId: string, updates: Partial<Chat>) => void;
  onDeleteGroup: (groupId: string) => void;
}

interface Member {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  role: 'admin' | 'member';
  isOnline: boolean;
  joinedAt: Date;
}

export default function GroupManagement({ group, isOpen, onClose, onUpdateGroup, onDeleteGroup }: GroupManagementProps) {
  const [activeTab, setActiveTab] = useState('members');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: group.name,
    description: group.description || '',
  });

  // Mock members data
  const mockMembers: Member[] = [
    { id: '1', name: 'John Doe', username: 'johndoe', role: 'admin', isOnline: true, joinedAt: new Date() },
    { id: '2', name: 'Jane Smith', username: 'janesmith', role: 'member', isOnline: false, joinedAt: new Date() },
    { id: '3', name: 'Bob Johnson', username: 'bobjohnson', role: 'member', isOnline: true, joinedAt: new Date() },
  ];

  const handleSave = () => {
    onUpdateGroup(group.id, {
      name: editData.name,
      description: editData.description,
    });
    setIsEditing(false);
  };

  const handlePromoteToAdmin = (memberId: string) => {
    // In a real app, this would update the member's role
    console.log('Promote to admin:', memberId);
  };

  const handleRemoveMember = (memberId: string) => {
    // In a real app, this would remove the member
    console.log('Remove member:', memberId);
  };

  const handleBanMember = (memberId: string) => {
    // In a real app, this would ban the member
    console.log('Ban member:', memberId);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'members', label: 'Members', icon: <Users size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    { id: 'permissions', label: 'Permissions', icon: <Shield size={16} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Group Management</h2>
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
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Members</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                  <UserPlus size={16} />
                  <span>Add Members</span>
                </button>
              </div>

              <div className="space-y-2">
                {mockMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                          {member.role === 'admin' && <Crown size={16} className="text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{member.username}</p>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {member.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {member.role === 'member' && (
                        <button
                          onClick={() => handlePromoteToAdmin(member.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="Promote to Admin"
                        >
                          <Crown size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Remove Member"
                      >
                        <UserMinus size={16} />
                      </button>
                      <button
                        onClick={() => handleBanMember(member.id)}
                        className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg"
                        title="Ban Member"
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Group Settings</h3>
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Group Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{group.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{group.description || 'No description'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Group Type
                  </label>
                  <div className="flex items-center space-x-2">
                    {group.type === 'group' ? <Users size={20} className="text-blue-500" /> : <Hash size={20} className="text-purple-500" />}
                    <span className="text-gray-900 dark:text-white capitalize">{group.type}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Privacy
                  </label>
                  <div className="flex items-center space-x-2">
                    {group.type === 'private' ? <Lock size={20} className="text-gray-500" /> : <Globe size={20} className="text-green-500" />}
                    <span className="text-gray-900 dark:text-white capitalize">Private</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onDeleteGroup(group.id)}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Delete Group</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Permissions</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Send Messages</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow members to send messages</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Send Media</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow members to send photos, videos, and files</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Add Members</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow members to add new members</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Pin Messages</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow members to pin messages</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
