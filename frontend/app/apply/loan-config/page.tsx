"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Calculator, CheckCircle2 } from "lucide-react";
import api from "../../../lib/api";
import { calculateLoanMathClient } from "../../../lib/loanMath";

export default function LoanConfigPage() {
  const router = useRouter();
  const [principal, setPrincipal] = useState(100000);
  const [tenureDays, setTenureDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] = useState<any>(null);

  useEffect(() => {
    // Retrieve uploaded document data from session storage
    const storedDoc = sessionStorage.getItem("documentData");
    if (storedDoc) {
      setDocumentData(JSON.parse(storedDoc));
    } else {
      toast.error("Missing document. Please upload salary slip.");
      router.push("/apply/upload-slip");
    }
  }, [router]);

  // Live calculation
  const math = calculateLoanMathClient(principal, tenureDays);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/loans/apply", {
        principal,
        tenureDays,
        documentData,
      });

      if (data.success) {
        toast.success("Loan application submitted successfully!");
        sessionStorage.removeItem("documentData");
        router.push("/apply/success");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-12 px-4">
      {/* Steps indicator */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center text-gray-500">
          <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center font-bold">1</div>
        </div>
        <div className="w-12 h-1 bg-indigo-500 rounded"></div>
        <div className="flex items-center text-gray-500">
          <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center font-bold">2</div>
        </div>
        <div className="w-12 h-1 bg-indigo-500 rounded"></div>
        <div className="flex items-center text-indigo-400">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-400 flex items-center justify-center font-bold">3</div>
          <span className="ml-2 font-medium">Configure Loan</span>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(79,70,229,0.15)]">
        <div className="flex items-center mb-6 space-x-3">
          <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20">
            <Calculator className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Configure Your Loan</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sliders */}
          <div className="space-y-6 bg-gray-950 p-6 rounded-xl border border-gray-800">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Loan Amount (Principal)</label>
                <span className="text-indigo-400 font-bold">₹ {principal.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹ 50K</span>
                <span>₹ 5L</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Tenure (Days)</label>
                <span className="text-indigo-400 font-bold">{tenureDays} Days</span>
              </div>
              <input
                type="range"
                min="30"
                max="365"
                step="1"
                value={tenureDays}
                onChange={(e) => setTenureDays(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>30 Days</span>
                <span>365 Days</span>
              </div>
            </div>
          </div>

          {/* Breakdown Preview */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
              Repayment Breakdown
            </h3>
            
            <div className="flex justify-between text-gray-300">
              <span>Principal Amount</span>
              <span className="font-medium text-white">₹ {principal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Interest Rate (Fixed)</span>
              <span className="font-medium text-white">12% p.a.</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Total Simple Interest</span>
              <span className="font-medium text-orange-400">₹ {math.simpleInterest.toLocaleString("en-IN")}</span>
            </div>
            
            <div className="h-px bg-gray-700 w-full my-2"></div>
            
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium text-gray-200">Total Repayment</span>
              <span className="font-bold text-green-400 text-xl">₹ {math.totalRepayment.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg rounded-xl shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
          >
            {loading ? "Submitting Application..." : "Apply Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
