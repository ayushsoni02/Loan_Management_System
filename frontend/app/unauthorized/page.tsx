import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md w-full bg-gray-900 border border-red-500/30 rounded-2xl p-8 text-center shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-3 text-gray-100">Access Denied</h1>
        <p className="text-gray-400 mb-8">
          You don't have the required permissions to view this page. Please log in with an appropriate account or return to the dashboard.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors w-full"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
