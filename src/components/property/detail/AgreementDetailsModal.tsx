"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AgreementDetails } from "@/src/types/property";

interface Props {
  open: boolean;
  onClose: () => void;
  onAgree?: () => void;
  agreementDetails?: AgreementDetails;
  purpose?: string;
  propertyTitle?: string;
}

export default function AgreementDetailsModal({
  open,
  onClose,
  onAgree,
  agreementDetails,
  purpose = "Rent",
  propertyTitle,
}: Props) {
  const [isAgreed, setIsAgreed] = useState(false);

  // Reset agreement checkbox state whenever modal is opened
  useEffect(() => {
    if (open) {
      setIsAgreed(false);
    }
  }, [open]);

  // Listen for Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !agreementDetails) return null;

  const isLease = (purpose || "").toLowerCase() === "lease";
  const purposeTitle = isLease ? "LEASE" : "RENT";

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return null;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const fields = [
    { label: "Agreement Type", value: agreementDetails.agreementType },
    { label: isLease ? "Lease Amount" : "Monthly Rent", value: formatCurrency(agreementDetails.amount) },
    { label: "Security Deposit", value: formatCurrency(agreementDetails.securityDeposit) },
    { label: "Advance / Token Amount", value: formatCurrency(agreementDetails.advanceAmount) },
    { label: "Agreement Duration", value: agreementDetails.duration },
    { label: "Available / Start Date", value: formatDate(agreementDetails.startDate) },
    { label: "Notice Period", value: agreementDetails.noticePeriod },
    { label: "Lock-in Period", value: agreementDetails.lockInPeriod },
    { label: "Rent Escalation", value: agreementDetails.rentEscalation },
    { label: "Maintenance Responsibility", value: agreementDetails.maintenanceResponsibility },
    { label: "Utilities Responsibility", value: agreementDetails.utilitiesResponsibility },
    { label: "Parking Details", value: agreementDetails.parkingDetails },
    { label: "Furnishing Condition", value: agreementDetails.furnishingCondition },
  ].filter((f) => f.value !== undefined && f.value !== null && f.value !== "");

  const handleAgreeAndContinue = () => {
    if (!isAgreed) return;
    if (onAgree) {
      onAgree();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-[#E5D7B3] shadow-2xl overflow-hidden my-auto max-h-[92vh] sm:max-h-[90vh] flex flex-col font-sans text-left"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agreement-modal-title"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FFFDF6] via-[#FFF9EC] to-[#FAF3E0] p-4 sm:p-6 border-b border-[#ECE7DB] flex items-start justify-between relative shrink-0">
            <div className="flex items-center gap-3 pr-8">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#FFF5D6] border border-[#E8DCC1] flex items-center justify-center text-[#9A720C] shadow-2xs shrink-0">
                <FileText size={22} className="sm:size-24" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 id="agreement-modal-title" className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                    Agreement & Tenancy Terms
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#9A720C]/10 text-[#9A720C] border border-[#9A720C]/20 text-[10px] font-extrabold uppercase tracking-wider">
                    {purposeTitle}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Owner's preferred terms for this property {propertyTitle ? `(${propertyTitle})` : ""}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-4 sm:p-7 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
            
            {/* Populated Fields Grid */}
            {fields.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {fields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FAFAFA] border border-[#F0ECE1] hover:border-[#E8DCC1] transition-all"
                  >
                    <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#9A720C] mb-0.5 sm:mb-1">
                      {field.label}
                    </span>
                    <span className="block text-xs sm:text-sm font-extrabold text-gray-900 break-words">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs italic">
                No specific agreement terms provided for this property.
              </div>
            )}

            {/* Additional Terms / Conditions */}
            {agreementDetails.additionalTerms && agreementDetails.additionalTerms.trim() !== "" && (
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FFFDF6] border border-[#E8DCC1] space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9A720C] flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Additional Terms & Conditions
                </h4>
                <p className="text-xs sm:text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                  {agreementDetails.additionalTerms}
                </p>
              </div>
            )}

            {/* Legal UX Disclaimer */}
            <div className="bg-[#FAF6ED] border border-[#E8DCC1] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-[#9A720C] shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-gray-700 leading-relaxed">
                <strong className="font-bold text-gray-900">Important:</strong> These are property listing terms provided by the owner and are not a legal agreement.
              </p>
            </div>

          </div>

          {/* Footer Actions with Checkbox */}
          <div className="p-4 sm:p-5 bg-white border-t border-[#ECE7DB] space-y-3 shrink-0">
            {/* Agreement Checkbox */}
            <div className="flex items-center gap-2.5 bg-[#FFFDF6] border border-[#E8DCC1] px-3.5 py-2.5 rounded-xl">
              <input
                type="checkbox"
                id="agree-terms-checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#9A720C] focus:ring-[#9A720C] cursor-pointer accent-[#9A720C] shrink-0"
              />
              <label
                htmlFor="agree-terms-checkbox"
                className="text-xs text-gray-800 font-semibold cursor-pointer select-none leading-snug"
              >
                I have read and agree to the owner's property listing & tenancy terms.
              </label>
            </div>

            <div className="flex flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-bold transition-all cursor-pointer text-center"
              >
                Close
              </button>

              <button
                type="button"
                disabled={!isAgreed}
                onClick={handleAgreeAndContinue}
                className={`flex-1 sm:flex-initial px-5 py-2.5 sm:px-7 sm:py-3 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all text-center ${
                  isAgreed
                    ? "bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 opacity-60"
                }`}
              >
                I Agree & Continue
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
