import io from 'socket.io-client';

class SocketService {
  private socket: ReturnType<typeof io> | null = null;

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Message events
  sendMessage(chatId: string, message: Record<string, unknown>) {
    if (this.socket) {
      this.socket.emit('send_message', { chatId, message });
    }
  }

  onMessageReceived(callback: (message: Record<string, unknown>) => void) {
    if (this.socket) {
      this.socket.on('message_received', callback);
    }
  }

  onMessageUpdated(callback: (message: Record<string, unknown>) => void) {
    if (this.socket) {
      this.socket.on('message_updated', callback);
    }
  }

  onMessageDeleted(callback: (messageId: string) => void) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  // Typing events
  sendTyping(chatId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { chatId, isTyping });
    }
  }

  onTyping(callback: (data: { userId: string; chatId: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  // User presence events
  updatePresence(isOnline: boolean) {
    if (this.socket) {
      this.socket.emit('update_presence', { isOnline });
    }
  }

  onUserOnline(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user_online', callback);
    }
  }

  onUserOffline(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user_offline', callback);
    }
  }

  // Chat events
  joinChat(chatId: string) {
    if (this.socket) {
      this.socket.emit('join_chat', { chatId });
    }
  }

  leaveChat(chatId: string) {
    if (this.socket) {
      this.socket.emit('leave_chat', { chatId });
    }
  }

  onChatUpdated(callback: (chat: Record<string, unknown>) => void) {
    if (this.socket) {
      this.socket.on('chat_updated', callback);
    }
  }

  // Voice/Video call events
  initiateCall(chatId: string, callType: 'voice' | 'video') {
    if (this.socket) {
      this.socket.emit('initiate_call', { chatId, callType });
    }
  }

  answerCall(callId: string) {
    if (this.socket) {
      this.socket.emit('answer_call', { callId });
    }
  }

  endCall(callId: string) {
    if (this.socket) {
      this.socket.emit('end_call', { callId });
    }
  }

  onIncomingCall(callback: (call: Record<string, unknown>) => void) {
    if (this.socket) {
      this.socket.on('incoming_call', callback);
    }
  }

  onCallEnded(callback: (callId: string) => void) {
    if (this.socket) {
      this.socket.on('call_ended', callback);
    }
  }

  // File sharing events
  uploadFile(file: File, chatId: string, onProgress?: (progress: number) => void) {
    if (this.socket) {
      this.socket.emit('upload_file', { file: file as unknown as Record<string, unknown>, chatId }, onProgress);
    }
  }

  onFileUploaded(callback: (file: Record<string, unknown>) => void) {
    if (this.socket) {
      this.socket.on('file_uploaded', callback);
    }
  }

  // Notification events
  onNotification(callback: (notification: Record<string, unknown>) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Clean up all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();
export default socketService;
