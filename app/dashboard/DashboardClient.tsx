"use client";

import { UserButton } from "@civic/auth/react";
import { User } from "@civic/auth";

export default function DashboardClient({ user }: { user: User }) {
  return (
    <div className="flex items-center space-x-4">
      <UserButton 
        className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        dropdownButtonClassName="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      />
    </div>
  );
}