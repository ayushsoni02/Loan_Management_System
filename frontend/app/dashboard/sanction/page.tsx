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
    return <div className="p-8 text-black font-sans">Loading queue...</div>;
  }

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <FileCheck className="w-6 h-6" />
            Sanction Queue
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Review and approve pending loan applications.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Borrower</th>
                <th className="px-6 py-3">Salary</th>
                <th className="px-6 py-3">Principal</th>
                <th className="px-6 py-3">Tenure</th>
                <th className="px-6 py-3">Slip</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No applications pending sanction.
                  </td>
                </tr>
              ) : (
                queue.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-black">{app.borrowerProfile?.fullName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{app.borrowerProfile?.pan}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-black">₹{app.borrowerProfile?.monthlySalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-black">₹{app.principal.toLocaleString()}</td>
                    <td className="px-6 py-4">{app.tenureDays} Days</td>
                    <td className="px-6 py-4">
                      {app.salarySlipDocument ? (
                        <a 
                          href={`http://localhost:5001${app.salarySlipDocument.filePath}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-black font-medium hover:underline flex items-center gap-1"
                        >
                          View PDF
                        </a>
                      ) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleApprove(app._id)}
                        className="p-1.5 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg border border-transparent hover:border-green-200 transition-all"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openRejectModal(app._id)}
                        className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md shadow-xl overflow-hidden font-sans">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-base font-bold text-black">Reject Loan</h3>
              <button onClick={() => setRejectModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReject} className="p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Rejection</label>
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-black outline-none resize-none mb-5"
                placeholder="E.g., Salary slip is unreadable..."
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-black font-medium text-sm rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-black hover:bg-gray-800 text-white font-medium text-sm rounded-lg transition-all"
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
