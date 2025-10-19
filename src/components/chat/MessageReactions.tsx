'use client';

import React, { useState } from 'react';
import { Heart, ThumbsUp, Laugh, Angry, Plus } from 'lucide-react';

interface MessageReactionsProps {
  messageId: string;
  reactions: Reaction[];
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

const defaultReactions = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
];

export default function MessageReactions({ messageId, reactions, onAddReaction, onRemoveReaction }: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);

  const handleReactionClick = (emoji: string) => {
    const existingReaction = reactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      // Check if current user already reacted
      const hasReacted = existingReaction.users.includes('current-user-id'); // In real app, use actual user ID
      
      if (hasReacted) {
        onRemoveReaction(messageId, emoji);
      } else {
        onAddReaction(messageId, emoji);
      }
    } else {
      onAddReaction(messageId, emoji);
    }
    
    setShowPicker(false);
  };

  const getReactionUsers = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    return reaction ? reaction.users : [];
  };

  const hasUserReacted = (emoji: string) => {
    const users = getReactionUsers(emoji);
    return users.includes('current-user-id'); // In real app, use actual user ID
  };

  return (
    <div className="relative">
      {/* Reaction Picker */}
      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
          <div className="flex items-center space-x-1">
            {defaultReactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReactionClick(reaction.emoji)}
                onMouseEnter={() => setHoveredReaction(reaction.emoji)}
                onMouseLeave={() => setHoveredReaction(null)}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  hasUserReacted(reaction.emoji) ? 'bg-blue-100 dark:bg-blue-900/20' : ''
                }`}
                title={reaction.label}
              >
                <span className="text-lg">{reaction.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reaction Display */}
      <div className="flex items-center space-x-1 mt-1">
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            onClick={() => handleReactionClick(reaction.emoji)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors ${
              hasUserReacted(reaction.emoji)
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{reaction.emoji}</span>
            <span className="text-xs">{reaction.count}</span>
          </button>
        ))}
        
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Add reaction"
        >
          <Plus size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Reaction Details Tooltip */}
      {hoveredReaction && (
        <div className="absolute bottom-full left-0 mb-1 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20">
          {getReactionUsers(hoveredReaction).length > 0 ? (
            <div>
              <p className="font-medium">{hoveredReaction} {reactions.find(r => r.emoji === hoveredReaction)?.count}</p>
              <p className="text-gray-300">
                {getReactionUsers(hoveredReaction).slice(0, 3).join(', ')}
                {getReactionUsers(hoveredReaction).length > 3 && ` and ${getReactionUsers(hoveredReaction).length - 3} others`}
              </p>
            </div>
          ) : (
            <p>Click to add {hoveredReaction}</p>
          )}
        </div>
      )}
    </div>
  );
}
