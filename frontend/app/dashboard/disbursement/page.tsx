"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Banknote, CheckCircle2 } from "lucide-react";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

export default function DisbursementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "disbursement") {
      router.push("/unauthorized");
      return;
    }

    fetchQueue();
  }, [user, router]);

  const fetchQueue = async () => {
    try {
      const { data } = await api.get("/dashboard/disbursement/queue");
      if (data.success) {
        setQueue(data.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch queue");
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (id: string) => {
    try {
      const { data } = await api.post(`/dashboard/loans/${id}/disburse`);
      if (data.success) {
        toast.success("Funds Disbursed!");
        setQueue(queue.filter(q => q._id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to disburse");
    }
  };

  if (loading) {
    return <div className="p-8 text-black dark:text-white font-sans">Loading queue...</div>;
  }

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto transition-colors">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
            <Banknote className="w-6 h-6" />
            Disbursement Queue
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Transfer funds to borrowers whose loans are sanctioned.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-medium border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3">Borrower</th>
                <th className="px-6 py-3">Bank Details (Mock)</th>
                <th className="px-6 py-3">Sanctioned Date</th>
                <th className="px-6 py-3">Amount to Disburse</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No loans ready for disbursement.
                  </td>
                </tr>
              ) : (
                queue.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-black dark:text-white">{app.borrowerProfile?.fullName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{app.borrowerProfile?.pan}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black dark:text-white font-medium">A/C: ************1234</p>
                      <p className="text-xs text-gray-500 mt-0.5">IFSC: MOCK0001234</p>
                    </td>
                    <td className="px-6 py-4">{new Date(app.sanctionedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-black dark:text-white text-base">
                      ₹{app.principal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDisburse(app._id)}
                        className="px-3 py-1.5 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-lg transition-all text-xs font-medium flex items-center gap-1.5 ml-auto"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Disburse Funds
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
