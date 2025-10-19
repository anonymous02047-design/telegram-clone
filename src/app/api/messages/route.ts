import { NextRequest, NextResponse } from 'next/server';
import Message from '@/models/Message';
import { connect } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connect(process.env.MONGODB_URI!);
    
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    const messages = await Message.find({
      chatId,
      isDeleted: false
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(offset);

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect(process.env.MONGODB_URI!);
    
    const body = await request.json();
    const { chatId, senderId, content, type, replyTo, attachments } = body;

    const message = new Message({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      senderId,
      content,
      type,
      replyTo,
      attachments,
      timestamp: new Date(),
    });

    await message.save();

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
