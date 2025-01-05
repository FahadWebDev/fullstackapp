"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";
import Header from "@/components/Header";
import TabNavigation, { Tab } from "@/components/TabNavigation";
import ProfileTab from "@/components/ProfileTab";
import MyNews from "@/components/MyNews";
import Weather from "@/components/Weather";
import Review from "@/components/ReviewNews";
import SubscriptionPlans from "@/components/SubscriptionPlans";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const isAdmin = user?.email === "fullstackuser2@gmail.com";

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <Login />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAdmin={isAdmin}
          />

          <div className="py-6">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "my-news" && <MyNews />}
            {activeTab === "weather" && <Weather />}
            {activeTab === "review" && isAdmin && <Review />}
            {activeTab === "subscription" && <SubscriptionPlans />}
          </div>
        </div>
      </div>
    </div>
  );
}
