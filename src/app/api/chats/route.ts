import { NextRequest, NextResponse } from 'next/server';
import Chat from '@/models/Chat';
import { connect } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connect(process.env.MONGODB_URI!);
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const chats = await Chat.find({
      participants: userId
    }).sort({ updatedAt: -1 });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect(process.env.MONGODB_URI!);
    
    const body = await request.json();
    const { name, type, participants, createdBy, description } = body;

    const chat = new Chat({
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      participants,
      admins: [createdBy],
      createdBy,
      description,
    });

    await chat.save();

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}
