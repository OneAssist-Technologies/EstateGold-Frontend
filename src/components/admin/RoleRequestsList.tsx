"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Check,
  X,
  AlertCircle,
  Eye,
  FileText,
  Building2,
  BadgeCheck,
  Phone,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  Shield,
  Clock,
} from "lucide-react";
import {
  getRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
} from "@/src/services/roleRequestService";
import { RoleRequest, RoleRequestStats } from "@/src/types/roleRequest";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function RoleRequestsList() {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [stats, setStats] = useState<RoleRequestStats>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [approveModalReq, setApproveModalReq] = useState<RoleRequest | null>(null);
  const [rejectModalReq, setRejectModalReq] = useState<RoleRequest | null>(null);
  const [detailsModalReq, setDetailsModalReq] = useState<RoleRequest | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getRoleRequests(activeTab, searchQuery);
      if (res && res.success) {
        setRequests(res.requests || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching role requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleConfirmApprove = async () => {
    if (!approveModalReq) return;
    try {
      setActionLoading(true);
      await approveRoleRequest(approveModalReq._id);
      setApproveModalReq(null);
      await fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalReq) return;
    if (!rejectionReasonInput.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }
    try {
      setActionLoading(true);
      await rejectRoleRequest(rejectModalReq._id, rejectionReasonInput.trim());
      setRejectModalReq(null);
      setRejectionReasonInput("");
      await fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper for initial avatar background color
  const getAvatarBg = (name?: string) => {
    const colors = ["bg-[#C89B1C]", "bg-[#9A7B1C]", "bg-[#B38719]", "bg-[#A17C17]", "bg-[#C4951B]"];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Jul 8, 2026";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden font-sans">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Navbar */}
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#161616]">
                Role Change Requests
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Wednesday, 17 June 2026
              </p>
            </div>

            {/* Top Search & Bell */}
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-10 pr-4 w-48 sm:w-64 rounded-full bg-white border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#C89B1C] focus:ring-1 focus:ring-[#C89B1C] transition-all shadow-xs"
                />
              </form>

              <button className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 relative shadow-xs">
                <Bell size={18} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
              </button>
            </div>
          </div>

          {/* Filter Tabs matching Figma design */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#C89B1C] text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              All <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-black/15 text-xs flex items-center justify-center font-bold">{stats.all}</span>
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "pending"
                  ? "bg-[#C89B1C] text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Pending <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-black/15 text-xs flex items-center justify-center font-bold">{stats.pending}</span>
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "approved"
                  ? "bg-[#C89B1C] text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Approved <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-black/15 text-xs flex items-center justify-center font-bold">{stats.approved}</span>
            </button>

            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "rejected"
                  ? "bg-[#C89B1C] text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Rejected <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-black/15 text-xs flex items-center justify-center font-bold">{stats.rejected}</span>
            </button>
          </div>

          {/* Yellow Alert Banner matching Figma design */}
          <div className="mb-6 p-4 rounded-2xl bg-[#FFFBF0] border border-[#F5E7B8] flex items-start gap-3 text-amber-900 shadow-xs">
            <div className="h-6 w-6 rounded-full bg-[#F3DE97] text-[#8C660B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              !
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#8C660B]">
                {stats.pending} role change requests awaiting your decision
              </h4>
              <p className="text-xs text-[#A17C17] mt-0.5">
                Review each request and approve or reject based on user eligibility
              </p>
            </div>
          </div>

          {/* Request Cards Container */}
          {loading ? (
            <div className="py-16 text-center text-gray-500">
              <div className="h-8 w-8 border-2 border-[#C89B1C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading role change requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="py-16 bg-white rounded-3xl border border-[#EBE3CF] text-center text-gray-500 shadow-xs">
              <Shield size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="font-bold text-gray-700 text-base">No role requests found</h3>
              <p className="text-xs text-gray-400 mt-1">There are no requests matching your current filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((reqItem) => {
                const userObj = typeof reqItem.user === "object" ? reqItem.user : null;
                const name = userObj?.fullName || "User Name";
                const email = userObj?.email || "user@gmail.com";
                const dateStr = formatDate(reqItem.createdAt || userObj?.createdAt);
                const initial = name[0]?.toUpperCase() || "U";
                const isPending = reqItem.status === "pending";
                const isApproved = reqItem.status === "approved";
                const isRejected = reqItem.status === "rejected";

                return (
                  <motion.div
                    key={reqItem._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F0E8D7] shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                  >
                    {/* Top Row: User Avatar, Info, Badges, Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Avatar + Details */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-12 w-12 rounded-full ${getAvatarBg(
                            name
                          )} text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0`}
                        >
                          {initial}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-[#161616] leading-tight">
                              {name}
                            </h3>
                          </div>

                          <p className="text-xs text-gray-500 mt-0.5">
                            {email} · {dateStr}
                          </p>

                          {/* Role Transition Pills */}
                          <div className="flex items-center gap-2 mt-2.5">
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 capitalize">
                              {reqItem.currentRole === "none" ? "New User" : reqItem.currentRole}
                            </span>
                            <ArrowRight size={14} className="text-gray-400" />
                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 capitalize">
                              {reqItem.requestedRole}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions or Status Indicator */}
                      <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                        <button
                          onClick={() => setDetailsModalReq(reqItem)}
                          className="px-3.5 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye size={14} /> View Details
                        </button>

                        {isPending ? (
                          <>
                            <button
                              onClick={() => setApproveModalReq(reqItem)}
                              className="px-4 py-1.5 rounded-full bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] text-xs font-bold flex items-center gap-1.5 border border-[#A7F3D0] transition-all cursor-pointer shadow-xs"
                            >
                              <Check size={14} className="stroke-[3]" /> Approve
                            </button>

                            <button
                              onClick={() => {
                                setRejectModalReq(reqItem);
                                setRejectionReasonInput("");
                              }}
                              className="px-4 py-1.5 rounded-full bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-bold flex items-center gap-1.5 border border-[#FCA5A5] transition-all cursor-pointer shadow-xs"
                            >
                              <X size={14} className="stroke-[3]" /> Reject
                            </button>
                          </>
                        ) : isApproved ? (
                          <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                            <Check size={14} /> Approved
                          </span>
                        ) : (
                          <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-1.5">
                            <X size={14} /> Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reason Block matching Figma screenshot */}
                    <div className="mt-4 pt-3.5 border-t border-gray-100">
                      <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-1">
                        REASON
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                        {reqItem.reason || "I would like to upgrade my account privileges to list properties."}
                      </p>
                    </div>

                    {/* Rejection Reason if rejected */}
                    {isRejected && reqItem.rejectionReason && (
                      <div className="mt-3 p-3 rounded-xl bg-red-50/70 border border-red-200 text-xs text-red-700">
                        <strong>Rejection Reason:</strong> {reqItem.rejectionReason}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* APPROVE CONFIRMATION DIALOG */}
      {approveModalReq && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5D7B3] text-center"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <Check size={32} className="stroke-[3]" />
            </div>

            <h3 className="text-xl font-bold text-[#161616] mb-2">Approve Agent / Role Request?</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Are you sure you want to approve{" "}
              <strong>
                {(typeof approveModalReq.user === "object" && approveModalReq.user?.fullName) || "this user"}
              </strong>{" "}
              for the <strong>{approveModalReq.requestedRole}</strong> role? This will grant full permission access.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setApproveModalReq(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md disabled:opacity-50"
              >
                {actionLoading ? "Approving..." : "Confirm & Approve"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* REJECT DIALOG */}
      {rejectModalReq && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5D7B3]"
          >
            <div className="h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
              <X size={28} className="stroke-[3]" />
            </div>

            <h3 className="text-xl font-bold text-[#161616] text-center mb-1">Reject Role Request</h3>
            <p className="text-xs text-gray-500 text-center mb-4">
              Please enter the rejection reason for{" "}
              <strong>
                {(typeof rejectModalReq.user === "object" && rejectModalReq.user?.fullName) || "this user"}
              </strong>
              . This will be shown to the user.
            </p>

            <textarea
              rows={4}
              required
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full p-3 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:border-red-500 mb-5"
              placeholder="e.g. Invalid RERA registration documentation or incomplete experience verification."
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectModalReq(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Reject Request"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* VIEW DETAILS DRAWER / MODAL */}
      {detailsModalReq && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E5D7B3] max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-xl font-bold text-[#161616]">Request Details</h3>
              <button
                onClick={() => setDetailsModalReq(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            {(() => {
              const u = typeof detailsModalReq.user === "object" ? detailsModalReq.user : null;
              return (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8DFC9] space-y-2">
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-gray-500">Applicant Name:</span>
                      <span className="font-bold text-[#161616]">{u?.fullName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-bold text-[#161616]">{u?.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-bold text-[#161616]">{u?.phone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-gray-500">Current Role:</span>
                      <span className="font-bold text-blue-600 capitalize">{detailsModalReq.currentRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Requested Role:</span>
                      <span className="font-bold text-amber-600 capitalize">{detailsModalReq.requestedRole}</span>
                    </div>
                  </div>

                  {(detailsModalReq.agencyName || u?.agencyName) && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                        <Building2 size={16} /> Agency Details
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {detailsModalReq.agencyName || u?.agencyName}
                      </p>
                      {(detailsModalReq.reraNumber || u?.reraNumber) && (
                        <p className="text-xs text-gray-600 mt-1">
                          <strong>RERA Number:</strong> {detailsModalReq.reraNumber || u?.reraNumber}
                        </p>
                      )}
                    </div>
                  )}

                  {detailsModalReq.experience && (
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="text-xs font-bold text-gray-700 mb-1">Experience</div>
                      <p className="text-xs text-gray-600">{detailsModalReq.experience}</p>
                    </div>
                  )}

                  <div>
                    <h5 className="font-bold text-xs text-gray-700 mb-1">Reason for Request</h5>
                    <p className="p-3 rounded-2xl bg-gray-50 border text-xs text-gray-700">
                      {detailsModalReq.reason || "No specific reason provided."}
                    </p>
                  </div>

                  {detailsModalReq.documents && detailsModalReq.documents.length > 0 && (
                    <div>
                      <h5 className="font-bold text-xs text-gray-700 mb-1.5">Uploaded Documents</h5>
                      <div className="space-y-2">
                        {detailsModalReq.documents.map((doc, i) => (
                          <a
                            key={i}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-200 hover:border-[#C89B1C] text-xs font-semibold text-[#C89B1C]"
                          >
                            <span className="flex items-center gap-2">
                              <FileText size={16} /> {doc.name || `Document ${i + 1}`}
                            </span>
                            <ExternalLink size={14} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => setDetailsModalReq(null)}
                      className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}
    </div>
  );
}
