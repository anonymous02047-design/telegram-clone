import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
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
}

const ChatSchema = new Schema<IChat>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['private', 'group', 'channel'], required: true },
  description: { type: String },
  avatar: { type: String },
  participants: [{ type: String, required: true }],
  admins: [{ type: String }],
  createdBy: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
