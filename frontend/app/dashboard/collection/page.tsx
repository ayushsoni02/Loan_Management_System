"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Wallet, X } from "lucide-react";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

export default function CollectionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [paymentData, setPaymentData] = useState({ utrNumber: "", amount: "", date: "" });

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "collection") {
      router.push("/unauthorized");
      return;
    }

    fetchLoans();
  }, [user, router]);

  const fetchLoans = async () => {
    try {
      const { data } = await api.get("/dashboard/collection/active-loans");
      if (data.success) {
        setLoans(data.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.utrNumber || !paymentData.amount || !paymentData.date) return;

    try {
      const { data } = await api.post(`/dashboard/loans/${selectedLoanId}/payments`, paymentData);
      if (data.success) {
        toast.success("Payment recorded successfully!");
        setPaymentModalOpen(false);
        // Refresh loans to get updated outstanding balance and status
        fetchLoans();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to record payment");
    }
  };

  const openPaymentModal = (id: string, maxAmount: number) => {
    setSelectedLoanId(id);
    setPaymentData({ utrNumber: "", amount: maxAmount.toString(), date: new Date().toISOString().split('T')[0] });
    setPaymentModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-white">Loading active loans...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Wallet className="w-8 h-8 text-indigo-400" />
            Collections
          </h1>
          <p className="text-gray-400 mt-1">Record payments and track outstanding balances.</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-gray-300 uppercase font-medium border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Borrower</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Repayment</th>
                <th className="px-6 py-4">Paid</th>
                <th className="px-6 py-4">Outstanding</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No active or closed loans found.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{loan.borrowerProfile?.fullName}</p>
                      <p className="text-xs">{loan.borrowerProfile?.pan}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        loan.status === "closed" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      }`}>
                        {loan.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">₹{loan.totalRepayment.toLocaleString()}</td>
                    <td className="px-6 py-4 text-green-400">₹{loan.amountPaid.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-red-400">₹{loan.outstandingBalance.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {loan.status === "disbursed" ? (
                        <button 
                          onClick={() => openPaymentModal(loan._id, loan.outstandingBalance)}
                          className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg border border-indigo-500/30 transition-all text-xs font-medium"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">Fully Paid</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-400" /> Record Payment
              </h3>
              <button onClick={() => setPaymentModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">UTR Number</label>
                <input
                  type="text"
                  required
                  value={paymentData.utrNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, utrNumber: e.target.value.toUpperCase() })}
                  className="w-full p-3 bg-gray-950 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                  placeholder="e.g. UTR123456789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  required
                  max={paymentData.amount} // initially set to max outstanding
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="w-full p-3 bg-gray-950 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Payment Date</label>
                <input
                  type="date"
                  required
                  value={paymentData.date}
                  onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                  className="w-full p-3 bg-gray-950 border border-gray-800 text-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800 mt-6">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
