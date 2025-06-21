import { getUser } from "@civic/auth/nextjs";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import Link from "next/link";
import ContinueToDashboardButton from "./ContinueToDashboardButton";

export default async function DashboardPage() {
  // Get user information on the server side
  const user = await getUser();

  // Redirect to login if user is not authenticated
  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <DashboardClient user={user} />
            </div>

            {/* Welcome Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Welcome back, {user.name || user.email}!
              </h2>
              <p className="text-blue-700">
                You have successfully logged in to your dashboard.
              </p>
            </div>

            {/* User Information Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                User Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.id}</p>
                </div>
                {user.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                )}
                {user.name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                  </div>
                )}
                {user.given_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Given Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.given_name}</p>
                  </div>
                )}
                {user.family_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Family Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.family_name}</p>
                  </div>
                )}
                {user.updated_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <ContinueToDashboardButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}