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
    // Both admin and borrower can view the general dashboard
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
      // In a real scenario for Admin, you might fetch all loans. For now, this hits the "my loans" endpoint
      // which uses req.user.id
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
    return <div className="p-8 text-white">Loading your dashboard...</div>;
  }

  const activeLoanCount = loans.filter(l => l.status === "disbursed").length;
  const pendingLoanCount = loans.filter(l => ["applied", "sanctioned"].includes(l.status)).length;
  const totalPrincipal = loans.reduce((acc, curr) => acc + curr.principal, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-indigo-400" />
            My Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.fullName}! Here is a summary of your loan applications.</p>
        </div>
        
        {user?.role === "borrower" && (
          <Link
            href="/apply/personal-details"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            Apply for New Loan
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Active Loans</h3>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{activeLoanCount}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Pending Approvals</h3>
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{pendingLoanCount}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Total Borrowed</h3>
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">₹{totalPrincipal.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Loan Application History</h2>
      
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-gray-300 uppercase font-medium border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Principal</th>
                <th className="px-6 py-4">Tenure</th>
                <th className="px-6 py-4">Total Repayment</th>
                <th className="px-6 py-4">Outstanding</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    You haven't applied for any loans yet.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">{new Date(loan.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-white font-medium">₹{loan.principal.toLocaleString()}</td>
                    <td className="px-6 py-4">{loan.tenureDays} Days</td>
                    <td className="px-6 py-4">₹{loan.totalRepayment.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-indigo-400">₹{loan.outstandingBalance.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${
                        loan.status === "rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        loan.status === "closed" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        loan.status === "disbursed" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                        "bg-orange-500/10 text-orange-400 border border-orange-500/20"
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
