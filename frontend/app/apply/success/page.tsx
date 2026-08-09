import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-black font-sans p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
          <CheckCircle2 className="w-8 h-8 text-black" />
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-black">Application Submitted</h1>
        
        <p className="text-gray-500 text-sm mb-8">
          Your loan application has been successfully sent to the sanctioning team. You will be notified once it is approved.
        </p>
        
        <Link
          href="/dashboard"
          className="inline-flex justify-center py-2.5 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors w-full"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
