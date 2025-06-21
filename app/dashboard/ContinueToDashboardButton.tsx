"use client";
export default function ContinueToDashboardButton() {
  return (
    <button
      onClick={() => window.location.href = "/dashboard/dashboard"}
      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full block text-center"
    >
      Continue to dashboard
    </button>
  );
} 