"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

import api from "@/src/services/api";
import { Property } from "@/src/types/property";

interface Props {
  open: boolean;
  property: Property | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeletePropertyModal({
  open,
  property,
  onClose,
  onDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
    }
  }, [open]);

  if (!property) return null;

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleRequestDelete = async () => {
    if (!reason.trim()) {
      setError("Please specify a reason for requesting deletion.");
      return;
    }
    try {
      setLoading(true);
      setError("");

      await api.patch(`/my-properties/${property._id}/request-delete`, {
        reason: reason.trim(),
      });

      onDeleted();
      handleClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit deletion request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <TriangleAlert className="text-red-500" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Request Deletion
                  </h2>
                  <p className="text-gray-400 text-xs">
                    Requires Admin Review
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                To remove this property, please submit a deletion request with a valid reason. The administrator will review and delete the listing upon approval.
              </p>

              {/* Textarea */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Reason for Deletion
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (e.target.value.trim()) setError("");
                  }}
                  placeholder="e.g. Property sold, duplicate listing, temporary pull down..."
                  className="w-full h-24 p-3 border border-[#ECE7DB] rounded-xl text-sm focus:border-[#9A720C] outline-none resize-none placeholder:text-gray-400 font-semibold text-gray-800"
                />
                {error && (
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    {error}
                  </p>
                )}
              </div>

              {/* Property Card Info */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <h3 className="font-bold text-sm text-amber-950">
                  {property.propertyType}
                </h3>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                  {property.locality}, {property.city}
                </p>
                <p className="mt-2 text-sm text-[#9A720C] font-bold">
                  ₹{property.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end gap-2.5">
              <button
                onClick={handleClose}
                disabled={loading}
                className="h-9 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleRequestDelete}
                disabled={loading}
                className="h-9 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                {loading ? "Submitting..." : "Submit Remove Request"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}