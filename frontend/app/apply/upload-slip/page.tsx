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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      {/* Steps indicator */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center text-black">
          <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold bg-black text-white">1</div>
        </div>
        <div className="w-12 h-1 bg-black rounded"></div>
        <div className="flex items-center text-black">
          <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold">2</div>
          <span className="ml-2 font-medium">Upload Slip</span>
        </div>
        <div className="w-12 h-1 bg-gray-300 rounded"></div>
        <div className="flex items-center text-gray-400">
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold">3</div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Upload Salary Slip</h2>
        <p className="text-gray-500 mb-8 text-sm">Please upload your latest salary slip (PDF, JPG, PNG). Max size 5MB.</p>

        <form onSubmit={handleSubmit}>
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-black transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 text-gray-400 mb-4" />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold text-black">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">PDF, PNG, JPG (MAX. 5MB)</p>
              </div>
              <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center space-x-3 overflow-hidden">
                <File className="w-8 h-8 text-gray-600 flex-shrink-0" />
                <div className="text-left truncate">
                  <p className="text-sm font-medium text-black truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full py-2.5 px-4 mt-8 bg-black hover:bg-gray-800 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all disabled:opacity-70"
          >
            {loading ? "Uploading..." : "Upload & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
