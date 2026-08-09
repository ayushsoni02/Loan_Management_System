import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center text-black font-sans p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-gray-800">
          <CheckCircle2 className="w-8 h-8 text-black dark:text-white" />
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-black dark:text-white">Application Submitted</h1>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Your loan application has been successfully sent to the sanctioning team. You will be notified once it is approved.
        </p>
        
        <Link
          href="/dashboard"
          className="inline-flex justify-center py-2.5 px-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-black dark:text-white bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-colors w-full"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
