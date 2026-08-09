"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Users, Mail } from "lucide-react";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

export default function SalesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "sales") {
      router.push("/unauthorized");
      return;
    }

    const fetchLeads = async () => {
      try {
        const { data } = await api.get("/dashboard/sales/leads");
        if (data.success) {
          setLeads(data.data);
        }
      } catch (error: any) {
        toast.error("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [user, router]);

  if (loading) {
    return <div className="p-8 text-black dark:text-white font-sans">Loading leads...</div>;
  }

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto transition-colors">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            Sales Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage borrower leads who haven't applied for a loan yet.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-medium border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No leads available at the moment.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-6 py-4 font-medium text-black dark:text-white">{lead.fullName}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      {lead.email}
                    </td>
                    <td className="px-6 py-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toast.success(`Reminder sent to ${lead.email}`)}
                        className="px-3 py-1.5 bg-white dark:bg-[#111] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 transition-all text-xs font-medium"
                      >
                        Send Reminder
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
