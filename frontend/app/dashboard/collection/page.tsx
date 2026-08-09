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
    return <div className="p-8 text-black font-sans">Loading active loans...</div>;
  }

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Collections
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Record payments and track outstanding balances.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Borrower</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total Repayment</th>
                <th className="px-6 py-3">Paid</th>
                <th className="px-6 py-3">Outstanding</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No active or closed loans found.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-black">{loan.borrowerProfile?.fullName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{loan.borrowerProfile?.pan}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase border ${
                        loan.status === "closed" ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-black font-medium">₹{loan.totalRepayment.toLocaleString()}</td>
                    <td className="px-6 py-4 text-black">₹{loan.amountPaid.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-black">₹{loan.outstandingBalance.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {loan.status === "disbursed" ? (
                        <button 
                          onClick={() => openPaymentModal(loan._id, loan.outstandingBalance)}
                          className="px-3 py-1.5 bg-white text-black hover:bg-gray-100 rounded-lg border border-gray-300 transition-all text-xs font-medium"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md shadow-xl overflow-hidden font-sans">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-base font-bold text-black flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Record Payment
              </h3>
              <button onClick={() => setPaymentModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">UTR Number</label>
                <input
                  type="text"
                  required
                  value={paymentData.utrNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, utrNumber: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-white border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-black outline-none uppercase"
                  placeholder="e.g. UTR123456789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  required
                  max={paymentData.amount} 
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Date</label>
                <input
                  type="date"
                  required
                  value={paymentData.date}
                  onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-5">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-black font-medium text-sm rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-black hover:bg-gray-800 text-white font-medium text-sm rounded-lg transition-all"
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
