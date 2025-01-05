"use client";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function LogoutButton() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const token = await user?.getIdToken();

      if (token) {
        await fetch("/api/notification", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setIsLoading(false);
      await auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
    >
      Log Out
    </button>
  );
}
