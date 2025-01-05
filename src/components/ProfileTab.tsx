'use client';

import { useAuth } from "@/context/AuthContext";

export default function ProfileTab() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Profile Information
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Display Name
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {user?.displayName || "Not set"}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Account Created
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {user?.metadata.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}