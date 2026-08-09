"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UploadCloud, File, X } from "lucide-react";
import api from "../../../lib/api";

export default function UploadSlipPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("salarySlip", file);

    try {
      const { data } = await api.post("/borrower/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success("Document uploaded successfully!");
        // Save the document data to session storage so next step can use it
        sessionStorage.setItem("documentData", JSON.stringify(data.data));
        router.push("/apply/loan-config");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
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
        <div className="flex items-center text-indigo-400">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-400 flex items-center justify-center font-bold">2</div>
          <span className="ml-2 font-medium">Upload Slip</span>
        </div>
        <div className="w-12 h-1 bg-gray-800 rounded"></div>
        <div className="flex items-center text-gray-500">
          <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center font-bold">3</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(79,70,229,0.15)] text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Salary Slip</h2>
        <p className="text-gray-400 mb-8">Please upload your latest salary slip (PDF, JPG, PNG). Max size 5MB.</p>

        <form onSubmit={handleSubmit}>
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-950 hover:bg-gray-800/50 hover:border-indigo-500 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-12 h-12 text-indigo-400 mb-4" />
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
              </div>
              <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-950 border border-gray-700 rounded-xl">
              <div className="flex items-center space-x-3 overflow-hidden">
                <File className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                <div className="text-left truncate">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full py-3.5 px-4 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
          >
            {loading ? "Uploading..." : "Upload & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
