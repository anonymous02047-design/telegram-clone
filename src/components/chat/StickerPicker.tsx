'use client';

import React, { useState } from 'react';
import { Smile, Heart, ThumbsUp, Laugh } from 'lucide-react';

interface StickerPickerProps {
  onStickerSelect: (sticker: string) => void;
  onClose: () => void;
}

// Mock sticker data - in a real app, this would come from an API
const stickerPacks = {
  emoji: [
    { id: 'smile', emoji: '😊', name: 'Smile' },
    { id: 'heart', emoji: '❤️', name: 'Heart' },
    { id: 'laugh', emoji: '😂', name: 'Laugh' },
    { id: 'love', emoji: '🥰', name: 'Love' },
    { id: 'wink', emoji: '😉', name: 'Wink' },
    { id: 'kiss', emoji: '😘', name: 'Kiss' },
    { id: 'thumbsup', emoji: '👍', name: 'Thumbs Up' },
    { id: 'thumbsdown', emoji: '👎', name: 'Thumbs Down' },
    { id: 'clap', emoji: '👏', name: 'Clap' },
    { id: 'fire', emoji: '🔥', name: 'Fire' },
    { id: 'party', emoji: '🎉', name: 'Party' },
    { id: 'star', emoji: '⭐', name: 'Star' },
    { id: 'thinking', emoji: '🤔', name: 'Thinking' },
    { id: 'shrug', emoji: '🤷', name: 'Shrug' },
    { id: 'ok', emoji: '👌', name: 'OK' },
    { id: 'pray', emoji: '🙏', name: 'Pray' },
  ],
  reactions: [
    { id: 'like', emoji: '👍', name: 'Like' },
    { id: 'dislike', emoji: '👎', name: 'Dislike' },
    { id: 'love', emoji: '❤️', name: 'Love' },
    { id: 'laugh', emoji: '😂', name: 'Laugh' },
    { id: 'wow', emoji: '😮', name: 'Wow' },
    { id: 'sad', emoji: '😢', name: 'Sad' },
    { id: 'angry', emoji: '😠', name: 'Angry' },
  ],
  animals: [
    { id: 'cat', emoji: '🐱', name: 'Cat' },
    { id: 'dog', emoji: '🐶', name: 'Dog' },
    { id: 'panda', emoji: '🐼', name: 'Panda' },
    { id: 'monkey', emoji: '🐵', name: 'Monkey' },
    { id: 'bear', emoji: '🐻', name: 'Bear' },
    { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
    { id: 'fox', emoji: '🦊', name: 'Fox' },
    { id: 'owl', emoji: '🦉', name: 'Owl' },
  ],
  food: [
    { id: 'pizza', emoji: '🍕', name: 'Pizza' },
    { id: 'burger', emoji: '🍔', name: 'Burger' },
    { id: 'cake', emoji: '🎂', name: 'Cake' },
    { id: 'coffee', emoji: '☕', name: 'Coffee' },
    { id: 'beer', emoji: '🍺', name: 'Beer' },
    { id: 'wine', emoji: '🍷', name: 'Wine' },
    { id: 'icecream', emoji: '🍦', name: 'Ice Cream' },
    { id: 'donut', emoji: '🍩', name: 'Donut' },
  ],
};

export default function StickerPicker({ onStickerSelect, onClose }: StickerPickerProps) {
  const [activeTab, setActiveTab] = useState<keyof typeof stickerPacks>('emoji');

  const handleStickerClick = (sticker: string) => {
    onStickerSelect(sticker);
  };

  const tabs = [
    { id: 'emoji', label: 'Emoji', icon: <Smile size={16} /> },
    { id: 'reactions', label: 'Reactions', icon: <Heart size={16} /> },
    { id: 'animals', label: 'Animals', icon: <ThumbsUp size={16} /> },
    { id: 'food', label: 'Food', icon: <Laugh size={16} /> },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stickers</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <span className="text-gray-500">✕</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Sticker Grid */}
      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-2">
          {stickerPacks[activeTab].map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => handleStickerClick(sticker.emoji)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
              title={sticker.name}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {sticker.emoji}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Stickers */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Recent
        </h4>
        <div className="flex space-x-2">
          {/* This would be populated with recently used stickers */}
          <button
            onClick={() => handleStickerClick('😊')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="text-xl">😊</span>
          </button>
          <button
            onClick={() => handleStickerClick('❤️')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="text-xl">❤️</span>
          </button>
          <button
            onClick={() => handleStickerClick('👍')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="text-xl">👍</span>
          </button>
        </div>
      </div>
    </div>
  );
}
