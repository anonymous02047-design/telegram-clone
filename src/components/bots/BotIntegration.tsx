'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Plus, 
  Settings, 
  MessageSquare, 
  Zap, 
  Shield, 
  Globe,
  Code,
  Play,
  Pause,
  Trash2,
  Edit3,
  Save,
  X
} from 'lucide-react';

interface Bot {
  id: string;
  name: string;
  username: string;
  description: string;
  avatar?: string;
  isActive: boolean;
  commands: BotCommand[];
  permissions: BotPermission[];
  webhookUrl?: string;
  token: string;
  createdAt: Date;
}

interface BotCommand {
  command: string;
  description: string;
  parameters?: string[];
}

interface BotPermission {
  type: 'read_messages' | 'send_messages' | 'manage_chat' | 'webhook';
  granted: boolean;
}

interface BotIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BotIntegration({ isOpen, onClose }: BotIntegrationProps) {
  const [activeTab, setActiveTab] = useState('bots');
  const [bots, setBots] = useState<Bot[]>([]);
  const [isCreatingBot, setIsCreatingBot] = useState(false);
  const [isEditingBot, setIsEditingBot] = useState<string | null>(null);
  const [newBot, setNewBot] = useState({
    name: '',
    username: '',
    description: '',
    webhookUrl: '',
  });

  // Mock bots data
  useEffect(() => {
    setBots([
      {
        id: '1',
        name: 'Weather Bot',
        username: 'weather_bot',
        description: 'Get weather information for any city',
        isActive: true,
        commands: [
          { command: '/weather', description: 'Get current weather', parameters: ['city'] },
          { command: '/forecast', description: 'Get weather forecast', parameters: ['city', 'days'] },
        ],
        permissions: [
          { type: 'read_messages', granted: true },
          { type: 'send_messages', granted: true },
          { type: 'manage_chat', granted: false },
          { type: 'webhook', granted: true },
        ],
        webhookUrl: 'https://api.example.com/webhook/weather',
        token: 'bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'News Bot',
        username: 'news_bot',
        description: 'Latest news and updates',
        isActive: false,
        commands: [
          { command: '/news', description: 'Get latest news' },
          { command: '/subscribe', description: 'Subscribe to news updates' },
        ],
        permissions: [
          { type: 'read_messages', granted: true },
          { type: 'send_messages', granted: true },
          { type: 'manage_chat', granted: false },
          { type: 'webhook', granted: false },
        ],
        token: 'bot987654321:XYZabcDEFghiJKLmnoPQRstuvwxyz',
        createdAt: new Date(),
      },
    ]);
  }, []);

  const handleCreateBot = () => {
    if (newBot.name && newBot.username && newBot.description) {
      const bot: Bot = {
        id: Date.now().toString(),
        name: newBot.name,
        username: newBot.username,
        description: newBot.description,
        isActive: false,
        commands: [],
        permissions: [
          { type: 'read_messages', granted: false },
          { type: 'send_messages', granted: false },
          { type: 'manage_chat', granted: false },
          { type: 'webhook', granted: false },
        ],
        webhookUrl: newBot.webhookUrl,
        token: `bot${Math.random().toString(36).substr(2, 9)}:${Math.random().toString(36).substr(2, 35)}`,
        createdAt: new Date(),
      };
      
      setBots(prev => [...prev, bot]);
      setNewBot({ name: '', username: '', description: '', webhookUrl: '' });
      setIsCreatingBot(false);
    }
  };

  const handleToggleBot = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId ? { ...bot, isActive: !bot.isActive } : bot
    ));
  };

  const handleDeleteBot = (botId: string) => {
    setBots(prev => prev.filter(bot => bot.id !== botId));
  };

  const handleUpdatePermissions = (botId: string, permissionType: BotPermission['type'], granted: boolean) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId 
        ? { 
            ...bot, 
            permissions: bot.permissions.map(p => 
              p.type === permissionType ? { ...p, granted } : p
            )
          } 
        : bot
    ));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'bots', label: 'My Bots', icon: <Bot size={16} /> },
    { id: 'create', label: 'Create Bot', icon: <Plus size={16} /> },
    { id: 'api', label: 'API Docs', icon: <Code size={16} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bot Integration</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={20} className="text-gray-500" />
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
          {activeTab === 'bots' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">My Bots</h3>
                <button
                  onClick={() => setActiveTab('create')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  <Plus size={16} />
                  <span>Create Bot</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bots.map((bot) => (
                  <div key={bot.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bot size={20} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{bot.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{bot.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleBot(bot.id)}
                          className={`p-2 rounded-full transition-colors ${
                            bot.isActive 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {bot.isActive ? <Play size={16} /> : <Pause size={16} />}
                        </button>
                        <button
                          onClick={() => setIsEditingBot(bot.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBot(bot.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{bot.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                        <span className={`text-sm font-medium ${
                          bot.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {bot.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Commands:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{bot.commands.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Webhook:</span>
                        <span className={`text-sm ${
                          bot.webhookUrl ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {bot.webhookUrl ? 'Configured' : 'Not set'}
                        </span>
                      </div>
                    </div>

                    {/* Bot Commands */}
                    {bot.commands.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Commands:</h5>
                        <div className="space-y-1">
                          {bot.commands.map((command, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <code className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                {command.command}
                              </code>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {command.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Bot</h3>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bot Name
                    </label>
                    <input
                      type="text"
                      value={newBot.name}
                      onChange={(e) => setNewBot(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter bot name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={newBot.username}
                      onChange={(e) => setNewBot(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter bot username (without @)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newBot.description}
                      onChange={(e) => setNewBot(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what your bot does"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Webhook URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={newBot.webhookUrl}
                      onChange={(e) => setNewBot(prev => ({ ...prev, webhookUrl: e.target.value }))}
                      placeholder="https://your-domain.com/webhook"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setActiveTab('bots')}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateBot}
                      disabled={!newBot.name || !newBot.username || !newBot.description}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg"
                    >
                      <Save size={16} />
                      <span>Create Bot</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bot API Documentation</h3>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Getting Started</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Use our Bot API to create interactive bots for your Telegram channels and groups.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Authentication</h4>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <code className="text-sm text-gray-900 dark:text-white">
                        Authorization: Bearer YOUR_BOT_TOKEN
                      </code>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Endpoints</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                        <code className="text-sm text-gray-900 dark:text-white">/api/bot/sendMessage</code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                        <code className="text-sm text-gray-900 dark:text-white">/api/bot/getUpdates</code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                        <code className="text-sm text-gray-900 dark:text-white">/api/bot/setWebhook</code>
                      </div>
                    </div>
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
