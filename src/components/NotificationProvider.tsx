"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  requestNotificationPermission,
  onMessageListener,
} from "@/services/notificationService";

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      setupNotifications();
    }
  }, [user]);

  const setupNotifications = async () => {
    if (!user) return;

    try {
      const userToken = await user.getIdToken();
      await requestNotificationPermission(userToken);
      const unsubscribe = onMessageListener();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up notifications:", error);
    }
  };

  return children;
}
