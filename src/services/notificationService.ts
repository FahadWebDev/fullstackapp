// src/services/notificationService.ts
import { messaging } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export async function requestNotificationPermission(userToken: string) {
  try {
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    // Get FCM token
    const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (!fcmToken) {
      console.error('No registration token available');
      return null;
    }

    // Save FCM token
    const response = await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ fcmToken })
    });

    if (!response.ok) {
      throw new Error('Failed to save FCM token');
    }

    return fcmToken;
  } catch (error) {
    console.error('Error setting up notifications:', error);
    return null;
  }
}

export async function removeFcmToken(userToken: string) {
  try {
    const response = await fetch('/api/fcm-token', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to remove FCM token');
    }

    return true;
  } catch (error) {
    console.error('Error removing FCM token:', error);
    return false;
  }
}

export function onMessageListener() {
  if (!messaging) return;

  return onMessage(messaging, (payload) => {
    if (payload.notification) {
      new Notification(payload.notification.title || '', {
        body: payload.notification.body,
      });
    }
  });
}