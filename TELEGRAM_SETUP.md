# Telegram API Setup Guide

This guide will help you set up the Telegram API integration for the Telegram Clone application.

## 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather
3. Send `/newbot` command
4. Follow the instructions to create your bot
5. Save the bot token you receive

## 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Telegram Bot Configuration
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
NEXT_PUBLIC_TELEGRAM_WEBAPP_URL=https://your-domain.com

# Firebase Configuration (for fallback authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/telegram-clone

# Socket.io Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

## 3. Set Up Webhook (Optional)

For production deployment, you can set up a webhook to receive updates:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/telegram/webhook"
  }'
```

## 4. Configure Bot Commands

Set up bot commands using BotFather:

```
/setcommands
start - Start the bot
help - Get help
settings - Open settings
```

## 5. Test the Integration

1. Start your development server: `npm run dev`
2. Open the app in Telegram by sending `/start` to your bot
3. The app should load with your Telegram user data

## 6. Production Deployment

### Vercel Deployment

1. Set environment variables in Vercel dashboard
2. Deploy your app
3. Update webhook URL to your production domain

### Other Platforms

Make sure to:
- Set all environment variables
- Configure webhook URL
- Set up SSL certificate
- Configure CORS if needed

## 7. Features Available

With Telegram API integration, you get:

- ✅ Real user authentication
- ✅ Real chat data
- ✅ Real message sending/receiving
- ✅ File sharing
- ✅ Voice messages
- ✅ Group management
- ✅ Bot integration
- ✅ Push notifications
- ✅ WebRTC video calls

## 8. Troubleshooting

### Common Issues

1. **Bot token not working**: Make sure the token is correct and the bot is active
2. **Webhook not receiving updates**: Check the webhook URL and SSL certificate
3. **CORS errors**: Configure CORS settings for your domain
4. **Authentication issues**: Ensure the Telegram WebApp is properly initialized

### Debug Mode

Enable debug mode by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

This will show additional console logs for debugging.

## 9. Security Considerations

- Never expose your bot token in client-side code
- Use environment variables for all sensitive data
- Implement proper error handling
- Validate all incoming webhook data
- Use HTTPS in production

## 10. API Rate Limits

Telegram API has rate limits:
- 30 messages per second per bot
- 1 message per second per chat
- 20 messages per minute per group

Make sure to implement proper rate limiting in your application.
