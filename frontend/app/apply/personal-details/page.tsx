"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User, Briefcase, CreditCard, Calendar } from "lucide-react";
import api from "../../../lib/api";

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    pan: "",
    dob: "",
    monthlySalary: "",
    employmentMode: "salaried",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/borrower/profile", formData);
      if (data.success) {
        if (data.data.breStatus === "passed") {
          toast.success("Eligibility check passed!");
          router.push("/apply/upload-slip");
        } else {
          toast.error("Eligibility check failed: " + data.data.breFailReasons.join(", "));
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-12 px-4">
      {/* Steps indicator */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center text-indigo-400">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-400 flex items-center justify-center font-bold">1</div>
          <span className="ml-2 font-medium">Personal Details</span>
        </div>
        <div className="w-12 h-1 bg-gray-800 rounded"></div>
        <div className="flex items-center text-gray-500">
          <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center font-bold">2</div>
        </div>
        <div className="w-12 h-1 bg-gray-800 rounded"></div>
        <div className="flex items-center text-gray-500">
          <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center font-bold">3</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(79,70,229,0.15)]">
        <h2 className="text-2xl font-bold text-white mb-2">Check Eligibility</h2>
        <p className="text-gray-400 mb-6">Enter your details to check if you qualify for a loan.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name (as per PAN)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">PAN Card Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                required
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                placeholder="ABCDE1234F"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Date of Birth</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 text-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Monthly Salary (₹)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium px-1">₹</span>
              </div>
              <input
                type="number"
                required
                value={formData.monthlySalary}
                onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="50000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Employment Mode</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-500" />
              </div>
              <select
                value={formData.employmentMode}
                onChange={(e) => setFormData({ ...formData, employmentMode: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="salaried">Salaried</option>
                <option value="self_employed">Self Employed</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
          >
            {loading ? "Checking Eligibility..." : "Check Eligibility & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
