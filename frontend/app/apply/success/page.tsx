import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md w-full bg-gray-900 border border-green-500/30 rounded-2xl p-8 text-center shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)]">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold mb-3 text-gray-100">Application Submitted!</h1>
        
        <p className="text-gray-400 mb-8">
          Your loan application has been successfully sent to the sanctioning team. You will be notified once it is approved.
        </p>
        
        <Link
          href="/dashboard"
          className="inline-flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors w-full"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
