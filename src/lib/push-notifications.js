// Push Notification Manager for Ymir Sailing Club
// Handles browser push notification permissions and subscriptions

export class PushNotificationManager {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.registration = null;
    this.subscription = null;
  }

  async initialize() {
    if (!this.isSupported) {
      console.log('Push notifications are not supported in this browser');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');

      // Check if we already have permission
      const permission = await this.getPermissionStatus();
      if (permission === 'granted') {
        await this.subscribe();
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  async getPermissionStatus() {
    if (!this.isSupported) return 'denied';
    return Notification.permission;
  }

  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);

    if (permission === 'granted') {
      await this.subscribe();
      return true;
    }

    return false;
  }

  async subscribe() {
    if (!this.registration) {
      throw new Error('Service worker not registered');
    }

    try {
      // Get existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();
      
      if (!this.subscription) {
        // Create new subscription
        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.getVapidPublicKey())
        });
      }

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);
      
      console.log('Push subscription successful');
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  async unsubscribe() {
    if (this.subscription) {
      await this.subscription.unsubscribe();
      this.subscription = null;
      console.log('Push subscription removed');
    }
  }

  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      console.log('Subscription sent to server successfully');
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  }

  getVapidPublicKey() {
    // In production, this should come from environment variables
    // For now, we'll use a placeholder - you'll need to generate real VAPID keys
    return 'BEl62iUYgUivxIkv69yViEuiBIa40HI0F8HwQvfrHQ_4jf0QfTjX0Q5EaGJF_0v8eF0q8LQ1nQaL8oqMvq4BvQ';
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async showTestNotification() {
    if (!this.isSupported) {
      alert('Push notifications are not supported in this browser');
      return;
    }

    const permission = await this.getPermissionStatus();
    if (permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        alert('Permission denied for push notifications');
        return;
      }
    }

    // Show a test notification
    if (this.registration) {
      await this.registration.showNotification('🧪 Test Notification', {
        body: 'This is a test notification from Ymir Sailing Club!',
        icon: '/icon-192.svg',
        badge: '/icon-192.svg',
        vibrate: [100, 50, 100],
        data: {
          type: 'test',
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  isSubscribed() {
    return this.subscription !== null;
  }

  getSubscriptionInfo() {
    if (!this.subscription) return null;
    
    return {
      endpoint: this.subscription.endpoint,
      keys: this.subscription.getKey ? {
        p256dh: this.subscription.getKey('p256dh'),
        auth: this.subscription.getKey('auth')
      } : null
    };
  }
}

// Global instance
export const pushNotificationManager = new PushNotificationManager();

// Auto-initialize when the script loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    pushNotificationManager.initialize();
  });
}
