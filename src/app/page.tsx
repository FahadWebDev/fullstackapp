"use client";

import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";
import LogoutButton from "@/components/Logout";
import MyNews from "@/components/MyNews";
import { useState } from "react";
import Weather from "@/components/Weather";
import Review from "@/components/ReviewNews";
import SubscriptionPlans from "@/components/SubscriptionPlans";

type Tab = "profile" | "my-news" | "weather" | "review" | "subscription";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const isAdmin = user?.email === "fullstackuser2@gmail.com";
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user ? (
          <>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome, {user.displayName || user.email}
                  </h2>
                  <p className="mt-1 text-gray-500">{user.email}</p>
                </div>
                <LogoutButton />
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "profile"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("my-news")}
                    className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "my-news"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
                  >
                    My News
                  </button>
                  <button
                    onClick={() => setActiveTab("weather")}
                    className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "weather"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
                  >
                    Weather
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => setActiveTab("review")}
                      className={`
                  whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === "review"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
                    >
                      Review
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab("subscription")}
                    className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "subscription"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
                  >
                    Subscription
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="py-6">
                {activeTab === "profile" && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Profile Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Email
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Display Name
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.displayName || "Not set"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Account Created
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.metadata.creationTime
                            ? new Date(
                                user.metadata.creationTime
                              ).toLocaleDateString()
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "my-news" && <MyNews />}
                {activeTab === "weather" && <Weather />}
                {activeTab === "review" && isAdmin && <Review />}
                {activeTab === "subscription" && <SubscriptionPlans />}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Login />
          </div>
        )}
      </div>
    </div>
  );
}
