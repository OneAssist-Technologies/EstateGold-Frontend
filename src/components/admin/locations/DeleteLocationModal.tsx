"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import { ServiceLocation } from "@/src/types/location";

interface DeleteLocationModalProps {
  open: boolean;
  onClose: () => void;
  location: ServiceLocation | null;
  onConfirm: (location: ServiceLocation, reason: string) => Promise<void>;
}

export default function DeleteLocationModal({
  open,
  onClose,
  location,
  onConfirm,
}: DeleteLocationModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || !location) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for deleting this service area.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onConfirm(location, reason.trim());
      setReason("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete service area.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl border border-[#ECE7DB] shadow-2xl p-6 overflow-hidden z-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-11 w-11 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-[#161616]">
            Delete Service Area?
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Are you sure you want to remove <strong className="text-gray-800">{location.city}, {location.state}</strong> from serviceable locations?
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Reason for Deletion <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Enter deletion rationale (e.g. Service area discontinued)..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                className="w-full rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] p-3 text-xs text-[#161616] outline-none focus:border-red-500 transition-all resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#E8E1D4] bg-white text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !reason.trim()}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={15} />
                <span>{loading ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
