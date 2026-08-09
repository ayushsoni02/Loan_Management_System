"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileCheck, CheckCircle2, XCircle, X } from "lucide-react";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

export default function SanctionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "sanction") {
      router.push("/unauthorized");
      return;
    }

    fetchQueue();
  }, [user, router]);

  const fetchQueue = async () => {
    try {
      const { data } = await api.get("/dashboard/sanction/applications");
      if (data.success) {
        setQueue(data.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch queue");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { data } = await api.post(`/dashboard/loans/${id}/sanction`);
      if (data.success) {
        toast.success("Loan Sanctioned Successfully!");
        setQueue(queue.filter(q => q._id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to sanction");
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason) return;

    try {
      const { data } = await api.post(`/dashboard/loans/${selectedLoanId}/reject`, { reason: rejectReason });
      if (data.success) {
        toast.success("Loan Rejected!");
        setRejectModalOpen(false);
        setQueue(queue.filter(q => q._id !== selectedLoanId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject");
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedLoanId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-white">Loading queue...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileCheck className="w-8 h-8 text-indigo-400" />
            Sanction Queue
          </h1>
          <p className="text-gray-400 mt-1">Review and approve pending loan applications.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-gray-300 uppercase font-medium border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Borrower</th>
                <th className="px-6 py-4">Salary</th>
                <th className="px-6 py-4">Principal</th>
                <th className="px-6 py-4">Tenure</th>
                <th className="px-6 py-4">Slip</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No applications pending sanction.
                  </td>
                </tr>
              ) : (
                queue.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{app.borrowerProfile?.fullName}</p>
                      <p className="text-xs">{app.borrowerProfile?.pan}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-green-400">₹{app.borrowerProfile?.monthlySalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-white">₹{app.principal.toLocaleString()}</td>
                    <td className="px-6 py-4">{app.tenureDays} Days</td>
                    <td className="px-6 py-4">
                      {app.salarySlipDocument ? (
                        <a 
                          href={`http://localhost:5001${app.salarySlipDocument.filePath}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-indigo-400 hover:underline"
                        >
                          View PDF
                        </a>
                      ) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleApprove(app._id)}
                        className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg border border-green-500/20 transition-all"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openRejectModal(app._id)}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">Reject Loan</h3>
              <button onClick={() => setRejectModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReject} className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Rejection</label>
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 bg-gray-950 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none mb-6"
                placeholder="E.g., Salary slip is unreadable..."
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
