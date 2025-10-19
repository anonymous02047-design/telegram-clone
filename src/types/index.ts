export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  phoneNumber?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  name: string;
  type: 'private' | 'group' | 'channel';
  description?: string;
  avatar?: string;
  participants: string[];
  admins: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  timestamp: Date;
  editedAt?: Date;
  replyTo?: string;
  isDeleted: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
}

export interface ChatMember {
  userId: string;
  chatId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  lastReadMessageId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'mention' | 'invite';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}
