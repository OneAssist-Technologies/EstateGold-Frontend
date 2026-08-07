"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { motion } from "framer-motion";
import {
  Clock,
  XCircle,
  CheckCircle2,
  Building2,
  FileText,
  Send,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { submitRoleRequest } from "@/src/services/roleRequestService";

export default function AgentPendingVerification() {
  const { user, logout, refreshUser } = useAuth();
  const [showReapplyModal, setShowReapplyModal] = useState(false);
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState(user?.experience || "");
  const [agencyName, setAgencyName] = useState(user?.agencyName || "");
  const [reraNumber, setReraNumber] = useState(user?.reraNumber || "");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const isRejected = user?.verificationStatus === "rejected";

  const handleReapply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await submitRoleRequest({
        requestedRole: "agent",
        reason: reason.trim(),
        experience: experience.trim(),
        agencyName: agencyName.trim(),
        reraNumber: reraNumber.trim(),
      });
      setSuccessMsg("Your verification request has been re-submitted for admin review!");
      setShowReapplyModal(false);
      await refreshUser();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to resubmit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E8DFC9] text-center relative overflow-hidden"
      >
        {/* Decorative Luxury Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#C89B1C] via-[#E6CA65] to-[#C89B1C]" />

        {/* Icon & Status Badge */}
        <div className="flex justify-center mb-6">
          {isRejected ? (
            <div className="h-20 w-20 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-inner">
              <XCircle size={44} />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full bg-[#FFFBF0] border border-[#F6E4A6] text-[#C89B1C] flex items-center justify-center shadow-inner">
              <Clock size={44} className="animate-pulse" />
            </div>
          )}
        </div>

        {/* Status Badge Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border shadow-xs"
          style={{
            backgroundColor: isRejected ? "#FEF2F2" : "#FEFCE8",
            borderColor: isRejected ? "#FECACA" : "#FEF08A",
            color: isRejected ? "#DC2626" : "#CA8A04",
          }}
        >
          <span className={`h-2 w-2 rounded-full ${isRejected ? "bg-red-500" : "bg-yellow-500 animate-ping"}`} />
          {isRejected ? "Verification Rejected" : "Verification Pending"}
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171412] leading-tight mb-3">
          Your Agent account is awaiting admin verification.
        </h1>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
          {isRejected
            ? "Unfortunately, your agent verification request was not approved by our compliance team."
            : "Thank you for registering with EstateGold as an Agent. Our admin team is reviewing your agency details & credentials. Full portal access will be granted upon verification approval."}
        </p>

        {/* Rejection Details Box */}
        {isRejected && user?.rejectionReason && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50/80 border border-red-200 text-left">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider mb-1">
              <AlertTriangle size={15} /> Rejection Reason from Admin
            </div>
            <p className="text-sm text-red-700 font-medium">"{user.rejectionReason}"</p>
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* Account Details Brief */}
        <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#EBE3CF] text-left mb-8 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between items-center py-1 border-b border-gray-200">
            <span className="text-gray-500 font-medium">Full Name</span>
            <span className="font-bold text-[#171412]">{user?.fullName}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-200">
            <span className="text-gray-500 font-medium">Email Address</span>
            <span className="font-bold text-[#171412]">{user?.email}</span>
          </div>
          {user?.agencyName && (
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Agency Name</span>
              <span className="font-bold text-[#171412]">{user.agencyName}</span>
            </div>
          )}
          {user?.reraNumber && (
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">RERA Registration</span>
              <span className="font-bold text-[#C89B1C]">{user.reraNumber}</span>
            </div>
          )}
        </div>

        {/* Restricted Permissions Note */}
        <div className="text-xs text-gray-500 bg-amber-50/60 rounded-xl p-3 border border-amber-200/60 mb-6 text-left flex items-start gap-2.5">
          <Building2 size={16} className="text-[#C89B1C] shrink-0 mt-0.5" />
          <span>
            While your verification status is <strong>Pending</strong>, actions like buying, listing properties, selling, contacting buyers, and agent dashboard access remain locked.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => refreshUser()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#C89B1C] hover:bg-[#b68c17] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock size={16} /> Check Status
          </button>

          {isRejected && (
            <button
              onClick={() => setShowReapplyModal(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#171412] hover:bg-[#2c2825] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={16} /> Re-submit Verification Request
            </button>
          )}

          <button
            onClick={logout}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-all flex items-center justify-center gap-2 border border-gray-300 cursor-pointer"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </motion.div>

      {/* Resubmit Modal */}
      {showReapplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E5D7B3]"
          >
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-xl font-bold text-[#171412] flex items-center gap-2">
                <FileText className="text-[#C89B1C]" size={22} />
                Re-submit Agent Verification
              </h3>
              <button
                onClick={() => setShowReapplyModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReapply} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Agency Name
                </label>
                <input
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#C89B1C] text-sm"
                  placeholder="e.g. Skyline Luxury Realty"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  RERA Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={reraNumber}
                  onChange={(e) => setReraNumber(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#C89B1C] text-sm"
                  placeholder="e.g. PRM/KA/RERA/1251/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#C89B1C] text-sm"
                  placeholder="e.g. 5+ Years in High-end Commercial & Residential"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Additional Notes / Reason
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#C89B1C] text-sm"
                  placeholder="Explain your clarification or provide corrected details..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReapplyModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#C89B1C] hover:bg-[#b68c17] text-white text-sm font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Verification"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
