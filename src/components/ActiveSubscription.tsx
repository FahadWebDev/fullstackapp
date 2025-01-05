"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, AlertCircle, CreditCard, Clock, Ban } from "lucide-react";

interface Subscription {
  id: string;
  status: string;
  stripePriceId: string;
  planType: "basic" | "pro" | "custom";
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  createdAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export default function ActiveSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: CheckCircle,
          label: "Active",
        };
      case "past_due":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: AlertCircle,
          label: "Past Due",
        };
      case "canceled":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: Ban,
          label: "Canceled",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: Clock,
          label: status,
        };
    }
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case "basic":
        return "Basic Plan";
      case "pro":
        return "Pro Plan";
      default:
        return "Custom Plan";
    }
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch(`/api/subscription?userId=${user.uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch subscription");
        }

        const data = await response.json();
        setSubscription(data.subscription);
      } catch (err) {
        console.error("Error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load subscription"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
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
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              No Active Subscription
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Subscribe to access premium features
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(subscription.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {getPlanName(subscription.planType)}
            </h3>
            <div className="mt-1 flex items-center">
              <StatusIcon className={`h-5 w-5 ${statusBadge.text}`} />
              <span className={`ml-2 text-sm font-medium ${statusBadge.text}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}
          >
            {subscription.status === "active" ? "Current" : subscription.status}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 divide-y divide-gray-200">
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-500">Subscription ID</p>
                <p className="font-medium text-gray-900">
                  {subscription?.stripeSubscriptionId?.slice(0, 14)}...
                </p>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-500">Started On</p>
                <p className="font-medium text-gray-900">
                  {new Date(subscription.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {subscription.status === "active" && (
            <div className="pt-4">
              <p className="text-sm text-gray-500">
                Next billing date:{" "}
                <span className="font-medium text-gray-900">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
