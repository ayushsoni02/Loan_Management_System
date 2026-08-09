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
    return <div className="p-8 text-white">Loading queue...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Banknote className="w-8 h-8 text-indigo-400" />
            Disbursement Queue
          </h1>
          <p className="text-gray-400 mt-1">Transfer funds to borrowers whose loans are sanctioned.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-gray-300 uppercase font-medium border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Borrower</th>
                <th className="px-6 py-4">Bank Details (Mock)</th>
                <th className="px-6 py-4">Sanctioned Date</th>
                <th className="px-6 py-4">Amount to Disburse</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No loans ready for disbursement.
                  </td>
                </tr>
              ) : (
                queue.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{app.borrowerProfile?.fullName}</p>
                      <p className="text-xs">{app.borrowerProfile?.pan}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">A/C: ************1234</p>
                      <p className="text-xs">IFSC: MOCK0001234</p>
                    </td>
                    <td className="px-6 py-4">{new Date(app.sanctionedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-green-400 text-lg">
                      ₹{app.principal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDisburse(app._id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-medium flex items-center gap-2 ml-auto"
                      >
                        <CheckCircle2 className="w-4 h-4" />
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
