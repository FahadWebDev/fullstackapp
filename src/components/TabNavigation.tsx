'use client';

export type Tab = "profile" | "my-news" | "weather" | "review" | "subscription";

interface TabNavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isAdmin: boolean;
}

interface TabItem {
  id: Tab;
  label: string;
  adminOnly?: boolean;
}

const TABS: TabItem[] = [
  { id: "profile", label: "Profile" },
  { id: "my-news", label: "My News" },
  { id: "weather", label: "Weather" },
  { id: "review", label: "Review", adminOnly: true },
  { id: "subscription", label: "Subscription" }
];

export default function TabNavigation({ activeTab, setActiveTab, isAdmin }: TabNavigationProps) {
  const tabStyle = (tab: Tab) => `
    whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
    ${
      activeTab === tab
        ? "border-indigo-500 text-indigo-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }
  `;

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {TABS.map((tab) => {
          if (tab.adminOnly && !isAdmin) return null;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={tabStyle(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}