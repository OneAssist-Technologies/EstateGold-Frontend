"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  MapPin,
  Tag,
  Key,
  X,
  AlertCircle,
  Building,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { propertyApi } from "@/src/services/property.service";
import { Property } from "@/src/types/property";

export interface DuePropertyItem {
  propertyId: string;
  _id: string;
  title: string;
  propertyType?: string;
  bedrooms?: number;
  city?: string;
  locality?: string;
  price?: number;
  purpose?: string;
  photos?: string[];
  availabilityStatus?: string;
  lastConfirmedAt?: string | null;
  nextConfirmationDueAt?: string | null;
  confirmationStatus?: string;
  missedConfirmationCount?: number;
  lastConfirmationReason?: string | null;
}

interface Props {
  open: boolean;
  dueProperties: DuePropertyItem[];
  onClose: () => void;
  onConfirmed: (propertyId: string, action: string) => void;
}

function formatPrice(price?: number, purpose?: string): string {
  if (!price || isNaN(price)) return "₹0";
  const isRent = (purpose || "").toLowerCase().includes("rent") || (purpose || "").toLowerCase().includes("lease");

  let formatted = "";
  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2).replace(/\.00$/, "");
    formatted = `₹${cr} Cr`;
  } else if (price >= 100000) {
    const l = (price / 100000).toFixed(2).replace(/\.00$/, "");
    formatted = `₹${l} Lakhs`;
  } else {
    formatted = `₹${price.toLocaleString("en-IN")}`;
  }

  return isRent ? `${formatted}/month` : formatted;
}

export default function AvailabilityConfirmationModal({
  open,
  dueProperties,
  onClose,
  onConfirmed,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setSelectedOption(null);
      setOtherReason("");
      setError("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // If index exceeds remaining properties or list is empty
  const currentProperty = dueProperties[currentIndex] || null;

  if (!open || !currentProperty) return null;

  const totalDue = dueProperties.length;
  const isLast = currentIndex >= totalDue - 1;

  const isRent =
    (currentProperty.purpose || "").toLowerCase().includes("rent") ||
    (currentProperty.purpose || "").toLowerCase().includes("lease");

  const mainPhoto =
    currentProperty.photos && currentProperty.photos.length > 0
      ? currentProperty.photos[0].startsWith("http")
        ? currentProperty.photos[0]
        : `http://localhost:5000/uploads/properties/${currentProperty.photos[0]}`
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

  const handleConfirmAction = async (confirmationType: "STILL_AVAILABLE" | "SOLD" | "RENTED" | "OTHER") => {
    if (confirmationType === "OTHER" && !otherReason.trim()) {
      setError("Please enter a reason why the property is unavailable.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await propertyApi.submitAvailabilityConfirmation(currentProperty.propertyId || currentProperty._id, {
        confirmation: confirmationType,
        reason: confirmationType === "OTHER" ? otherReason.trim() : undefined,
      });

      const actionMessage = {
        STILL_AVAILABLE: "Availability confirmed! Next reminder scheduled in 7 days.",
        SOLD: "Property marked as Sold.",
        RENTED: "Property marked as Rented.",
        OTHER: "Property status updated with specified reason.",
      }[confirmationType];

      toast.success(actionMessage);
      onConfirmed(currentProperty.propertyId || currentProperty._id, confirmationType);

      // Move to next property or close
      if (!isLast) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setOtherReason("");
      } else {
        onClose();
      }
    } catch (err: any) {
      console.error("[CONFIRMATION_SUBMIT_ERROR]", err);
      setError(err.response?.data?.message || "Failed to submit availability confirmation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8DCC1]"
        >
          {/* Top Modal Header */}
          <div className="flex justify-between items-center px-6 py-5 bg-[#FFFDF6] border-b border-[#ECE7DB]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#FFF9EC] border border-[#F5E8C7] flex items-center justify-center text-[#9A720C] shadow-2xs">
                <Clock size={20} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    Property Availability
                  </h2>
                  {totalDue > 1 && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#9A720C] text-white">
                      {currentIndex + 1} of {totalDue}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  Weekly Publisher Confirmation
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="h-8 w-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title="Close for now"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Core Question Headline */}
            <div className="text-center py-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9A720C] bg-[#FFF9EC] border border-[#F5E8C7] px-3 py-1 rounded-full inline-block mb-2 shadow-2xs">
                7-Day Status Check
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Is this property still available?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Help buyers and tenants see up-to-date availability on EstateGold.
              </p>
            </div>

            {/* Property Showcase Card */}
            <div className="rounded-2xl border border-[#ECE7DB] bg-[#FFFDF6] p-4 flex gap-4 items-center shadow-2xs">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
                <Image
                  src={mainPhoto}
                  alt={currentProperty.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                  {currentProperty.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <MapPin size={13} className="text-[#9A720C] shrink-0" />
                  <span className="truncate">
                    {[currentProperty.locality, currentProperty.city].filter(Boolean).join(", ") || "Location"}
                  </span>
                </div>
                <div className="pt-1 flex items-baseline gap-1.5">
                  <span className="text-xs text-gray-500 font-semibold">Listed Price:</span>
                  <span className="text-base font-extrabold text-[#9A720C]">
                    {formatPrice(currentProperty.price, currentProperty.purpose)}
                  </span>
                </div>
              </div>
            </div>

            {/* Error banner if any */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Option A: Default Choices State */}
            {selectedOption !== "OTHER" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Still Available */}
                <button
                  type="button"
                  onClick={() => handleConfirmAction("STILL_AVAILABLE")}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#0DBB58] hover:bg-[#0BA64E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer sm:col-span-2"
                >
                  <CheckCircle2 size={18} />
                  <span>Yes, Still Available</span>
                </button>

                {/* 2. Sold */}
                <button
                  type="button"
                  onClick={() => handleConfirmAction("SOLD")}
                  disabled={loading}
                  className="py-3 px-3.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <Tag size={16} className="text-rose-600" />
                  <span>No, Property Sold</span>
                </button>

                {/* 3. Rented */}
                <button
                  type="button"
                  onClick={() => handleConfirmAction("RENTED")}
                  disabled={loading}
                  className="py-3 px-3.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <Key size={16} className="text-blue-600" />
                  <span>No, Property Rented</span>
                </button>

                {/* 4. Other Reason */}
                <button
                  type="button"
                  onClick={() => setSelectedOption("OTHER")}
                  disabled={loading}
                  className="py-3 px-3.5 rounded-2xl bg-white border border-dashed border-[#D8B56A] hover:bg-[#FFFDF6] text-[#9A720C] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer sm:col-span-2"
                >
                  <HelpCircle size={16} />
                  <span>No, Other Reason</span>
                </button>
              </div>
            ) : (
              /* Option B: Other Reason Expandable Input */
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                    <span>Specify Reason for Unavailability</span>
                    <span className="text-[10px] text-red-500 uppercase font-semibold">Required</span>
                  </label>
                  <textarea
                    rows={3}
                    value={otherReason}
                    onChange={(e) => {
                      setOtherReason(e.target.value);
                      if (e.target.value.trim()) setError("");
                    }}
                    placeholder="e.g. Under renovation, lease dispute, temporarily unavailable for viewing..."
                    className="w-full p-3 border border-[#ECE7DB] rounded-xl text-xs sm:text-sm focus:border-[#9A720C] outline-none resize-none placeholder:text-gray-400 font-medium text-gray-800"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOption(null);
                      setOtherReason("");
                      setError("");
                    }}
                    disabled={loading}
                    className="w-1/3 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => handleConfirmAction("OTHER")}
                    disabled={loading || !otherReason.trim()}
                    className={`w-2/3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      loading || !otherReason.trim()
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#9A720C] hover:bg-[#856108] text-white cursor-pointer shadow-sm"
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit Reason"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Weekly schedule calculated from published date.</span>
            {totalDue > 1 && (
              <span className="font-semibold text-gray-700">
                {totalDue - currentIndex - 1} more pending
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
