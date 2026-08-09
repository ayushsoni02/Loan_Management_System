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
    const storedDoc = sessionStorage.getItem("documentData");
    if (storedDoc) {
      setDocumentData(JSON.parse(storedDoc));
    } else {
      toast.error("Missing document. Please upload salary slip.");
      router.push("/apply/upload-slip");
    }
  }, [router]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center py-12 px-4 font-sans transition-colors">
      {/* Steps indicator */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center text-black dark:text-white">
          <div className="w-8 h-8 rounded-full border-2 border-black dark:border-white flex items-center justify-center font-bold bg-black dark:bg-white text-white dark:text-black">1</div>
        </div>
        <div className="w-12 h-1 bg-black dark:bg-white rounded"></div>
        <div className="flex items-center text-black dark:text-white">
          <div className="w-8 h-8 rounded-full border-2 border-black dark:border-white flex items-center justify-center font-bold bg-black dark:bg-white text-white dark:text-black">2</div>
        </div>
        <div className="w-12 h-1 bg-black dark:bg-white rounded"></div>
        <div className="flex items-center text-black dark:text-white">
          <div className="w-8 h-8 rounded-full border-2 border-black dark:border-white flex items-center justify-center font-bold">3</div>
          <span className="ml-2 font-medium">Configure Loan</span>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center mb-6 space-x-3 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800">
            <Calculator className="w-5 h-5 text-black dark:text-white" />
          </div>
          <h2 className="text-xl font-bold text-black dark:text-white">Configure Your Loan</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount (Principal)</label>
                <span className="text-black dark:text-white font-bold border-b-2 border-black dark:border-white pb-0.5">₹ {principal.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-medium">
                <span>₹ 50K</span>
                <span>₹ 5L</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenure (Days)</label>
                <span className="text-black dark:text-white font-bold border-b-2 border-black dark:border-white pb-0.5">{tenureDays} Days</span>
              </div>
              <input
                type="range"
                min="30"
                max="365"
                step="1"
                value={tenureDays}
                onChange={(e) => setTenureDays(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-medium">
                <span>30 Days</span>
                <span>365 Days</span>
              </div>
            </div>
          </div>

          {/* Breakdown Preview */}
          <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center border-b border-gray-200 dark:border-gray-800 pb-2">
              <CheckCircle2 className="w-4 h-4 mr-2 text-black dark:text-white" />
              Repayment Breakdown
            </h3>
            
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
              <span>Principal Amount</span>
              <span className="font-medium text-black dark:text-white">₹ {principal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
              <span>Interest Rate (Fixed)</span>
              <span className="font-medium text-black dark:text-white">12% p.a.</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
              <span>Total Simple Interest</span>
              <span className="font-medium text-black dark:text-white">₹ {math.simpleInterest.toLocaleString("en-IN")}</span>
            </div>
            
            <div className="h-px bg-gray-200 dark:bg-gray-800 w-full my-2"></div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">Total Repayment</span>
              <span className="font-bold text-black dark:text-white text-xl">₹ {math.totalRepayment.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-medium text-base rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 transition-all disabled:opacity-70"
          >
            {loading ? "Submitting Application..." : "Apply Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
