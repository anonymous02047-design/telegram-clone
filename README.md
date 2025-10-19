# Telegram Clone

A modern Telegram clone built with Next.js, TypeScript, Tailwind CSS, Firebase, and MongoDB.

## Features

- 🔐 **Authentication** - Firebase Authentication with email/password
- 💬 **Real-time Chat** - Send and receive messages instantly
- 👥 **Multiple Chat Types** - Private chats, groups, and channels
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Clean and intuitive interface
- 🔒 **Secure** - End-to-end encryption ready
- 📁 **File Sharing** - Share images, documents, and more

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io (coming soon)
- **UI Components**: Radix UI, Lucide React
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd telegram-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/telegram-clone
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/telegram-clone

   # Telegram Bot API (optional)
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_API_ID=your_telegram_api_id
   TELEGRAM_API_HASH=your_telegram_api_hash

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication with Email/Password
   - Get your Firebase config and add it to `.env.local`

5. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in your `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── chats/         # Chat endpoints
│   │   └── messages/       # Message endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   └── chat/              # Chat interface components
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   └── mongodb.ts         # MongoDB connection
├── models/                # Database models
│   ├── User.ts            # User model
│   ├── Chat.ts            # Chat model
│   └── Message.ts         # Message model
└── types/                 # TypeScript type definitions
    └── index.ts           # Main types
```

## API Endpoints

### Chats
- `GET /api/chats?userId={id}` - Get user's chats
- `POST /api/chats` - Create a new chat

### Messages
- `GET /api/messages?chatId={id}&limit={n}&offset={n}` - Get chat messages
- `POST /api/messages` - Send a new message

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Telegram's clean and intuitive design
- Built with modern web technologies
- Open source and community-driven
