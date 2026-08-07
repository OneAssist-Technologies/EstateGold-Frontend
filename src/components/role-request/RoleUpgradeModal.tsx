"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  BadgeCheck,
  FileText,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { submitRoleRequest } from "@/src/services/roleRequestService";

interface RoleUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RoleUpgradeModal({
  isOpen,
  onClose,
  onSuccess,
}: RoleUpgradeModalProps) {
  const { user, refreshUser } = useAuth();

  const currentRoles = user?.roles && user.roles.length > 0 ? user.roles : [user?.role || "buyer"];
  const isAgent = currentRoles.includes("agent") || user?.role === "agent";
  const isSeller = currentRoles.includes("seller") || user?.role === "seller";
  const isBuyer = currentRoles.includes("buyer") || user?.role === "buyer";

  // Determine selectable target roles
  const availableTargetRoles: Array<{ id: "seller" | "agent"; label: string; desc: string }> = [];
  if (!isSeller && !isAgent) {
    availableTargetRoles.push({
      id: "seller",
      label: "Seller (Owner)",
      desc: "List and manage your own residential and commercial properties.",
    });
  }
  if (!isAgent) {
    availableTargetRoles.push({
      id: "agent",
      label: "Licensed Agent",
      desc: "Represent clients, list third-party properties, and earn commissions.",
    });
  }

  const [requestedRole, setRequestedRole] = useState<"seller" | "agent">(
    availableTargetRoles[0]?.id || "seller"
  );
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");
  const [agencyName, setAgencyName] = useState(user?.agencyName || "");
  const [reraNumber, setReraNumber] = useState(user?.reraNumber || "");
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [documents, setDocuments] = useState<Array<{ name: string; url: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen || isAgent) return null;

  const handleAddDocument = () => {
    if (!docName.trim() || !docUrl.trim()) return;
    setDocuments((prev) => [...prev, { name: docName.trim(), url: docUrl.trim() }]);
    setDocName("");
    setDocUrl("");
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!reason.trim()) {
      setErrorMsg("Please provide a reason for your role upgrade request.");
      return;
    }

    if (requestedRole === "agent") {
      if (!agencyName.trim()) {
        setErrorMsg("Agency name is required for Agent upgrade.");
        return;
      }
      if (!reraNumber.trim()) {
        setErrorMsg("RERA registration number is required for Agent upgrade.");
        return;
      }
    }

    try {
      setLoading(true);
      const res = await submitRoleRequest({
        requestedRole,
        reason: reason.trim(),
        experience: experience.trim(),
        agencyName: agencyName.trim(),
        reraNumber: reraNumber.trim(),
        documents,
      });

      setSuccessMsg(res.message || "Role request submitted successfully!");
      await refreshUser();

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to submit role request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5D7B3] relative max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#FFF8E7] text-[#C89B1C] flex items-center justify-center border border-[#F6E4A6]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#171412]">Request Additional Role</h3>
                <p className="text-xs text-gray-500">Upgrade your account capabilities on EstateGold</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Target Role Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Select Requested Role
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableTargetRoles.map((roleOpt) => {
                  const selected = requestedRole === roleOpt.id;
                  return (
                    <button
                      type="button"
                      key={roleOpt.id}
                      onClick={() => setRequestedRole(roleOpt.id)}
                      className={`
                        p-4 rounded-2xl border text-left transition-all relative cursor-pointer
                        ${
                          selected
                            ? "bg-[#FFFBF0] border-[#C89B1C] shadow-sm ring-1 ring-[#C89B1C]"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#171412]">
                          {roleOpt.label}
                        </span>
                        <span
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            selected ? "border-[#C89B1C] bg-[#C89B1C]" : "border-gray-300"
                          }`}
                        >
                          {selected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-snug">{roleOpt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FileText size={15} className="text-[#C89B1C]" />
                Reason for Request <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-gray-200 focus:border-[#C89B1C] focus:ring-1 focus:ring-[#C89B1C] outline-none text-sm"
                placeholder={
                  requestedRole === "seller"
                    ? "e.g. I inherited a property and want to list it for sale."
                    : "e.g. I have been working as a freelance consultant and want to list properties on EstateGold."
                }
              />
            </div>

            {/* Agent Specific Fields */}
            {requestedRole === "agent" && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Building2 size={15} className="text-[#C89B1C]" />
                    Agency Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#C89B1C] focus:ring-1 focus:ring-[#C89B1C] outline-none text-sm"
                    placeholder="e.g. Crestline Properties Pvt Ltd"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <BadgeCheck size={15} className="text-[#C89B1C]" />
                    RERA Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reraNumber}
                    onChange={(e) => setReraNumber(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#C89B1C] focus:ring-1 focus:ring-[#C89B1C] outline-none text-sm"
                    placeholder="e.g. PRM/KA/RERA/1251/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Briefcase size={15} className="text-[#C89B1C]" />
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#C89B1C] focus:ring-1 focus:ring-[#C89B1C] outline-none text-sm"
                    placeholder="e.g. 7 years in luxury residential sales"
                  />
                </div>

                {/* Uploaded Documents List */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Upload size={15} className="text-[#C89B1C]" />
                    Upload Supporting Documents (Optional)
                  </label>

                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Document Label (e.g. RERA Certificate)"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="flex-1 h-10 px-3 border border-gray-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Doc URL / Reference Link"
                      value={docUrl}
                      onChange={(e) => setDocUrl(e.target.value)}
                      className="flex-1 h-10 px-3 border border-gray-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="px-3 h-10 bg-[#C89B1C] hover:bg-[#b68c17] text-white text-xs font-bold rounded-xl shrink-0"
                    >
                      Add
                    </button>
                  </div>

                  {documents.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs"
                        >
                          <span className="font-medium text-gray-800 truncate">
                            📄 {doc.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#C89B1C] to-[#D8B75A] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Submitting Request..." : "Submit Role Request"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
