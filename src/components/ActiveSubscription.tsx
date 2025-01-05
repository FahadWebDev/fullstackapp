// components/ActiveSubscription.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Subscription {
  id: string;
  status: string;
  stripePriceId: string;
  createdAt: string;
  periodEnd: string;
}

export default function ActiveSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!user) return;

        const token = await user.getIdToken();
        const response = await fetch(`/api/subscription?userId=${user.uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch subscription");
        }

        const data = await response.json();
        setSubscription(data.subscription);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load subscription");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading) {
    return <div className="text-center text-black">Loading your subscriptions...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-gray-600 text-center">No active subscription</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Active Subscription
      </h3>
      <div className="mt-4 space-y-2">
        <p>
          Status:{" "}
          <span className="capitalize font-medium">{subscription.status}</span>
        </p>
        <p>
          Started:{" "}
          <span className="font-medium">
            {new Date(subscription.createdAt).toLocaleDateString()}
          </span>
        </p>
        {subscription.periodEnd && (
          <p>
            Renews:{" "}
            <span className="font-medium">
              {new Date(subscription.periodEnd).toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
