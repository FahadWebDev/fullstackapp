// components/SubscriptionPlans.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStripe } from "@/lib/stripe";
import { Check } from "lucide-react";
import ActiveSubscription from "./ActiveSubscription";

const plans = [
  {
    id: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || "",
    name: "Basic",
    price: "$9.99",
    interval: "month",
    features: [
      "Create up to 10 news articles",
      "Basic analytics",
      "Email support",
      "Standard customer service",
      "1GB storage space",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || "",
  },
  {
    id: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    name: "Pro",
    price: "$29.99",
    interval: "month",
    features: [
      "Unlimited news articles",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Unlimited storage space",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
  },
];

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId);

      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user?.uid,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <ActiveSubscription />
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Subscription Plans
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden h-full"
            >
              {/* Header */}
              <div className="px-6 py-8 bg-gray-50 border-b border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-base text-gray-500">
                    /{plan.interval}
                  </span>
                </p>
              </div>

              {/* Features List */}
              <div className="flex-grow px-6 py-8">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="ml-3 text-base text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="px-6 py-8 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading === plan.priceId}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === plan.priceId ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Subscribe to {plan.name}</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
