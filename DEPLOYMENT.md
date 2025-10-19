# Telegram Clone - Deployment Guide

## Netlify Deployment

### Prerequisites
1. A Netlify account
2. Your Telegram Bot Token
3. Firebase project setup
4. MongoDB database (optional for development)

### Steps to Deploy

1. **Build the project locally:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Set Node version: `18`

3. **Environment Variables:**
   Add these environment variables in Netlify dashboard:
   ```
   NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token_here
   NEXT_PUBLIC_TELEGRAM_WEBAPP_URL=https://your-app.netlify.app
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Telegram Bot Setup:**
   - Create a bot with @BotFather
   - Set the webhook URL to your Netlify domain
   - Configure the bot commands

### Features Included
- ✅ Real-time messaging with Socket.io
- ✅ Telegram Web App integration
- ✅ Group and channel management
- ✅ Video calling with WebRTC
- ✅ File sharing and media gallery
- ✅ Push notifications
- ✅ Message reactions and replies
- ✅ User profiles and settings
- ✅ Bot integration
- ✅ Contact management
- ✅ Call history
- ✅ Search functionality

### Development Mode
The app includes a development mode that works without Telegram Web App for testing purposes.

### Production Considerations
- Set up proper error monitoring
- Configure CDN for static assets
- Set up database backups
- Monitor API rate limits
- Implement proper security measures
