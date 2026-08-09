import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <ShieldAlert className="w-12 h-12 text-black mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-3 text-black">Access Denied</h1>
        <p className="text-gray-500 text-sm mb-8">
          You don't have the required permissions to view this page. Please log in with an appropriate account or return to the dashboard.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors w-full"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
