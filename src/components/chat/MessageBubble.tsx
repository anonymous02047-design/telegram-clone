'use client';

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-200 text-gray-900'
      }`}>
        {message.replyTo && (
          <div className={`text-xs mb-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            Replying to message
          </div>
        )}
        
        <div className="break-words">
          {message.type === 'text' && (
            <p>{message.content}</p>
          )}
          
          {message.type === 'image' && (
            <div>
              <Image 
                src={message.content} 
                alt="Shared image" 
                width={300}
                height={200}
                className="max-w-full h-auto rounded"
              />
            </div>
          )}
          
          {message.type === 'file' && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center">
                📄
              </div>
              <div>
                <p className="font-medium">File</p>
                <p className="text-sm opacity-75">Click to download</p>
              </div>
            </div>
          )}

          {message.type === 'voice' && (
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                <Play size={16} />
              </button>
              <div>
                <p className="font-medium">Voice Message</p>
                <p className="text-sm opacity-75">Click to play</p>
              </div>
            </div>
          )}

          {message.type === 'video' && (
            <div>
              <video 
                src={message.content} 
                controls 
                className="max-w-full h-auto rounded"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
        
        <div className={`text-xs mt-1 ${
          isOwn ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
          {message.editedAt && ' (edited)'}
        </div>
      </div>
    </div>
  );
}
