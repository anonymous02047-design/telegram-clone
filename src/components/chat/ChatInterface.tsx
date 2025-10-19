'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTelegramAuth } from '@/contexts/TelegramAuthContext';
import { Chat, Message } from '@/types';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import SearchModal from './SearchModal';
import SettingsModal from '@/components/settings/SettingsModal';
import VoiceRecorder from './VoiceRecorder';
import FileUpload from './FileUpload';
import StickerPicker from './StickerPicker';
import { socketService } from '@/lib/socket';

export default function ChatInterface() {
  const { user, chats, messages, sendMessage, sendPhoto, sendDocument, sendVoice, sendVideo, getChats, getMessages, isLoading, error } = useTelegramAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find(chat => chat.id.toString() === selectedChatId);
  
  // Add null check for selectedChat
  if (selectedChatId && !selectedChat) {
    console.warn('Selected chat not found:', selectedChatId);
  }

  // Mock data for demonstration
  useEffect(() => {
    // Load chats from Telegram API
    if (user) {
      getChats();
    }
  }, [user, getChats]);

  // Load messages for selected chat
  useEffect(() => {
    if (selectedChatId) {
      getMessages(selectedChatId);
    }
  }, [selectedChatId, getMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleCreateChat = () => {
    // In a real app, this would open a modal to create a new chat
    console.log('Create new chat');
  };

  const handleSendMessage = async (content: string, type: 'text' | 'file') => {
    if (!selectedChatId || !user) return;

    try {
      await sendMessage(selectedChatId, content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendVoiceMessage = async (audioBlob: Blob) => {
    if (!selectedChatId || !user) return;

    try {
      await sendVoice(selectedChatId, audioBlob);
    } catch (error) {
      console.error('Error sending voice message:', error);
    }
  };

  const handleSendFiles = async (files: File[]) => {
    if (!selectedChatId || !user) return;

    try {
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          await sendPhoto(selectedChatId, file);
        } else if (file.type.startsWith('video/')) {
          await sendVideo(selectedChatId, file);
        } else {
          await sendDocument(selectedChatId, file);
        }
      }
    } catch (error) {
      console.error('Error sending files:', error);
    }
  };

  const handleSendSticker = async (sticker: string) => {
    if (!selectedChatId || !user) return;

    try {
      await sendMessage(selectedChatId, sticker, { parse_mode: 'HTML' });
      setIsStickerPickerOpen(false);
    } catch (error) {
      console.error('Error sending sticker:', error);
    }
  };

  const handleMessageSelect = (message: Message) => {
    // Scroll to message in chat
    const messageElement = document.getElementById(`message-${message.id}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Error</div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar
          chats={chats.map(chat => ({
            id: chat.id.toString(),
            name: chat.title || chat.first_name || 'Unknown',
            type: chat.type === 'private' ? 'private' : chat.type === 'group' ? 'group' : 'channel',
            participants: [],
            admins: [],
            createdBy: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            lastMessage: undefined
          }))}
          selectedChatId={selectedChatId || undefined}
          onChatSelect={handleChatSelect}
          onCreateChat={handleCreateChat}
          onSearch={() => setIsSearchOpen(true)}
          onSettings={() => setIsSettingsOpen(true)}
        />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          chat={selectedChat ? {
            id: selectedChat.id.toString(),
            name: selectedChat.title || selectedChat.first_name || 'Unknown',
            type: selectedChat.type === 'private' ? 'private' : selectedChat.type === 'group' ? 'group' : 'channel',
            participants: [],
            admins: [],
            createdBy: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            lastMessage: undefined
          } : null} 
          onSearch={() => setIsSearchOpen(true)}
        />
        
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChatId && messages[selectedChatId]?.map((message) => (
                <div key={message.message_id} id={`message-${message.message_id}`}>
                  <MessageBubble
                    message={{
                      id: message.message_id.toString(),
                      chatId: selectedChatId,
                      senderId: message.from?.id.toString() || '',
                      content: message.text || '',
                      type: message.photo ? 'image' : message.document ? 'file' : 'text',
                      timestamp: new Date(message.date * 1000),
                      isDeleted: false
                    }}
                    isOwn={message.from?.id === user?.id}
                  />
                </div>
              )) || []}
              <div ref={messagesEndRef} />
            </div>
        
        {isVoiceRecording ? (
          <VoiceRecorder
            onSendVoiceMessage={handleSendVoiceMessage}
            onCancel={() => setIsVoiceRecording(false)}
          />
        ) : isFileUploadOpen ? (
          <FileUpload
            onFileSelect={handleSendFiles}
            onClose={() => setIsFileUploadOpen(false)}
          />
        ) : isStickerPickerOpen ? (
          <StickerPicker
            onStickerSelect={handleSendSticker}
            onClose={() => setIsStickerPickerOpen(false)}
          />
        ) : (
          <MessageInput
            onSendMessage={handleSendMessage}
            onVoiceRecord={() => setIsVoiceRecording(true)}
            onFileUpload={() => setIsFileUploadOpen(true)}
            onStickerPicker={() => setIsStickerPickerOpen(true)}
            disabled={!selectedChatId}
          />
        )}
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onChatSelect={handleChatSelect}
        onMessageSelect={handleMessageSelect}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
