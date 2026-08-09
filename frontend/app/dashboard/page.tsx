"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LayoutDashboard, Plus, FileText, CheckCircle2, Clock } from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function BorrowerDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "borrower") {
      router.push("/unauthorized");
      return;
    }

    if (user?.role === "borrower" || user?.role === "admin") {
      fetchMyLoans();
    }
  }, [user, router]);

  const fetchMyLoans = async () => {
    try {
      const { data } = await api.get("/loans/my");
      if (data.success) {
        setLoans(data.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-black font-sans">Loading your dashboard...</div>;
  }

  const activeLoanCount = loans.filter(l => l.status === "disbursed").length;
  const pendingLoanCount = loans.filter(l => ["applied", "sanctioned"].includes(l.status)).length;
  const totalPrincipal = loans.reduce((acc, curr) => acc + curr.principal, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            My Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.fullName}! Here is a summary of your loan applications.</p>
        </div>
        
        {user?.role === "borrower" && (
          <Link
            href="/apply/personal-details"
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Apply for New Loan
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Active Loans</h3>
            <CheckCircle2 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-black">{activeLoanCount}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Pending Approvals</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-black">{pendingLoanCount}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Borrowed</h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-black">₹{totalPrincipal.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-black mb-4">Loan Application History</h2>
      
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Applied Date</th>
                <th className="px-6 py-3">Principal</th>
                <th className="px-6 py-3">Tenure</th>
                <th className="px-6 py-3">Total Repayment</th>
                <th className="px-6 py-3">Outstanding</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    You haven't applied for any loans yet.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{new Date(loan.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-black font-medium">₹{loan.principal.toLocaleString()}</td>
                    <td className="px-6 py-4">{loan.tenureDays} Days</td>
                    <td className="px-6 py-4">₹{loan.totalRepayment.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-black">₹{loan.outstandingBalance.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize border ${
                        loan.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" :
                        loan.status === "closed" ? "bg-green-50 text-green-700 border-green-200" :
                        loan.status === "disbursed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-gray-100 text-gray-700 border-gray-300"
                      }`}>
                        {loan.status}
                      </span>
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
