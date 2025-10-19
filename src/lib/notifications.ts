'use client';

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      console.warn('Notification permission has been denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(data: NotificationData): Promise<void> {
    if (!this.isSupported || this.permission !== 'granted') {
      console.warn('Cannot show notification: permission not granted');
      return;
    }

    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || '/icon-192x192.png',
        badge: data.badge || '/badge-72x72.png',
        tag: data.tag,
        data: data.data,
        actions: data.actions,
        requireInteraction: true,
        silent: false,
      });

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // Handle different notification types
        if (data.data?.type === 'message') {
          // Navigate to specific chat
          const chatId = data.data.chatId as string;
          if (chatId) {
            // In a real app, you'd navigate to the chat
            console.log('Navigate to chat:', chatId);
          }
        } else if (data.data?.type === 'call') {
          // Handle incoming call
          const callId = data.data.callId as string;
          if (callId) {
            console.log('Handle incoming call:', callId);
          }
        }
      };

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async showMessageNotification(senderName: string, messageContent: string, chatId: string): Promise<void> {
    await this.showNotification({
      title: `New message from ${senderName}`,
      body: messageContent,
      tag: `message-${chatId}`,
      data: {
        type: 'message',
        chatId,
        senderName,
      },
      actions: [
        {
          action: 'reply',
          title: 'Reply',
          icon: '/icons/reply.png',
        },
        {
          action: 'mark-read',
          title: 'Mark as Read',
          icon: '/icons/check.png',
        },
      ],
    });
  }

  async showCallNotification(callerName: string, callType: 'voice' | 'video', callId: string): Promise<void> {
    await this.showNotification({
      title: `Incoming ${callType} call from ${callerName}`,
      body: `Tap to answer the call`,
      tag: `call-${callId}`,
      data: {
        type: 'call',
        callId,
        callerName,
        callType,
      },
      actions: [
        {
          action: 'answer',
          title: 'Answer',
          icon: '/icons/phone.png',
        },
        {
          action: 'decline',
          title: 'Decline',
          icon: '/icons/phone-off.png',
        },
      ],
    });
  }

  async showGroupNotification(groupName: string, messageContent: string, groupId: string): Promise<void> {
    await this.showNotification({
      title: `New message in ${groupName}`,
      body: messageContent,
      tag: `group-${groupId}`,
      data: {
        type: 'group',
        groupId,
        groupName,
      },
    });
  }

  async showChannelNotification(channelName: string, messageContent: string, channelId: string): Promise<void> {
    await this.showNotification({
      title: `New post in ${channelName}`,
      body: messageContent,
      tag: `channel-${channelId}`,
      data: {
        type: 'channel',
        channelId,
        channelName,
      },
    });
  }

  async showSystemNotification(title: string, body: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): Promise<void> {
    const icons = {
      info: '/icons/info.png',
      success: '/icons/success.png',
      warning: '/icons/warning.png',
      error: '/icons/error.png',
    };

    await this.showNotification({
      title,
      body,
      icon: icons[type],
      tag: `system-${Date.now()}`,
      data: {
        type: 'system',
        notificationType: type,
      },
    });
  }

  // Service Worker registration for push notifications
  async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  // Subscribe to push notifications
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      console.log('Push subscription created:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Push subscription removed');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  // Check if notifications are supported and permitted
  get isNotificationSupported(): boolean {
    return this.isSupported && this.permission === 'granted';
  }

  // Get current permission status
  get permissionStatus(): NotificationPermission {
    return this.permission;
  }
}

// Create and export a singleton instance
export const notificationService = new NotificationService();

// Export the class for custom instances
export { NotificationService };
export type { NotificationData, NotificationAction };
