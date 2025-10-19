import mongoose, { Schema, Document } from 'mongoose';

export interface IAttachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
}

export interface IMessage extends Document {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  timestamp: Date;
  editedAt?: Date;
  replyTo?: string;
  isDeleted: boolean;
  attachments?: IAttachment[];
}

const AttachmentSchema = new Schema<IAttachment>({
  id: { type: String, required: true },
  filename: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
});

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true, unique: true },
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file', 'voice', 'video'], required: true },
  timestamp: { type: Date, default: Date.now },
  editedAt: { type: Date },
  replyTo: { type: String },
  isDeleted: { type: Boolean, default: false },
  attachments: [AttachmentSchema],
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
