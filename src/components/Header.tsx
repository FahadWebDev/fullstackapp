'use client';

import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/Logout";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.displayName || user?.email}
          </h2>
          <p className="mt-1 text-gray-500">{user?.email}</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}