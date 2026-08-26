"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Eye,
  Check,
  CheckCircle2,
  X,
  HelpCircle,
  Shield,
  Building,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { AdminUser, UserStats } from "@/src/types/adminUser";
import {
  getUsers,
  toggleUserVerify,
  toggleUserStatus,
  deleteUser,
} from "@/src/services/adminUserService";

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit] = useState<number>(10);

  const [stats, setStats] = useState<UserStats>({
    totalBuyers: 0,
    totalSellers: 0,
    verifiedAgents: 0,
    totalUsers: 0,
    verifiedUsers: 0,
  });

  const todayDate = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const res = await getUsers({
        role: activeTab,
        search,
        page,
        limit,
      });

      if (res.success) {
        setUsers(res.users);
        setTotalPages(res.pages || 1);
        setTotal(res.total || 0);

        if (res.stats) {
          setStats({
            totalBuyers: res.stats.totalBuyers || 0,
            verifiedBuyers: res.stats.verifiedBuyers || 0,
            totalSellers: res.stats.totalSellers || 0,
            verifiedSellers: res.stats.verifiedSellers || 0,
            totalAgents: res.stats.totalAgents || 0,
            verifiedAgents: res.stats.verifiedAgents || 0,
            totalUsers: res.stats.totalUsers || res.total || 0,
            verifiedUsers: res.stats.verifiedUsers || 0,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch users from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 on tab or search change
  useEffect(() => {
    setPage(1);
  }, [activeTab, search]);

  useEffect(() => {
    loadUserData();
  }, [activeTab, search, page]);

  const [reasonModalOpen, setReasonModalOpen] = useState<boolean>(false);
  const [reasonType, setReasonType] = useState<"suspend" | "delete">("suspend");
  const [targetUser, setTargetUser] = useState<AdminUser | null>(null);
  const [actionReason, setActionReason] = useState<string>("");
  const [reasonError, setReasonError] = useState<string>("");

  const openReasonModal = (user: AdminUser, type: "suspend" | "delete") => {
    setTargetUser(user);
    setReasonType(type);
    setActionReason("");
    setReasonError("");
    setReasonModalOpen(true);
  };

  const handleConfirmReasonAction = async () => {
    if (!actionReason.trim()) {
      setReasonError(`Please provide a reason to ${reasonType} this user.`);
      return;
    }

    if (!targetUser) return;

    try {
      setActionLoading(true);
      if (reasonType === "delete") {
        await deleteUser(targetUser._id, actionReason.trim());
        if (selectedUser && selectedUser._id === targetUser._id) {
          setViewModalOpen(false);
        }
      } else {
        await toggleUserStatus(targetUser._id, actionReason.trim());
        if (selectedUser && selectedUser._id === targetUser._id) {
          setSelectedUser((prev) =>
            prev ? { ...prev, isActive: false } : null
          );
        }
      }

      setReasonModalOpen(false);
      await loadUserData();
    } catch (err: unknown) {
      console.error(`Failed to ${reasonType} user:`, err);
      setReasonError(`Failed to ${reasonType} user. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateUser = async (userId: string) => {
    try {
      setActionLoading(true);
      await toggleUserStatus(userId);
      await loadUserData();
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) =>
          prev ? { ...prev, isActive: true } : null
        );
      }
    } catch (err) {
      console.error("Failed to reactivate user:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVerify = async (userId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setActionLoading(true);
      await toggleUserVerify(userId);
      await loadUserData();
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) =>
          prev ? { ...prev, isVerified: !prev.isVerified } : null
        );
      }
    } catch (err) {
      console.error("Failed to toggle verify status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setActionLoading(true);
      await toggleUserStatus(userId);
      await loadUserData();
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) =>
          prev ? { ...prev, isActive: !prev.isActive } : null
        );
      }
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case "buyer":
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-[#EBF3FF] text-[#3B82F6] border border-blue-200/50">
            Buyer
          </span>
        );
      case "seller":
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#D97706] border border-amber-200/50">
            Seller
          </span>
        );
      case "agent":
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-[#F3E8FF] text-[#9333EA] border border-purple-200/50">
            Agent
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#059669] border border-emerald-200/50">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-[#161616] tracking-tight">
          User Management
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage user accounts, verification status, and suspensions.
        </p>
      </motion.div>

      {/* Local Search input */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ y: -1 }}
          className="flex-1 max-w-[360px] flex items-center gap-3 h-12 rounded-xl border border-[#ECE7DB] bg-white px-4 transition focus-within:border-[#C89B1C]"
        >
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search user, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-[#161616] placeholder:text-gray-400"
          />
        </motion.div>
      </div>
        {/* Top Header Controls: Filter Tabs (Left) & Dynamic Small Stat Cards (Right) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Left: Filter Tabs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {[
              { key: "all", label: "All Users" },
              { key: "buyer", label: "Buyers" },
              { key: "seller", label: "Sellers" },
              { key: "agent", label: "Agents" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-[#B8860B] text-white shadow-sm"
                    : "bg-[#EFECE6] text-[#6B6557] hover:bg-[#E5E0D6]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right: Dynamic Small Stat Cards */}
          <div className="flex items-center gap-3 flex-wrap">
            {activeTab === "all" && (
              <>
                <div className="bg-white rounded-2xl border border-[#ECE7DB] px-4 py-2 shadow-xs flex items-center gap-3">
                  <span className="text-lg font-bold text-[#4338CA]">
                    {stats.totalUsers.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#8C847B]">Total Users</span>
                </div>
                <div className="bg-[#ECFDF5] rounded-2xl border border-emerald-200 px-4 py-2 shadow-xs flex items-center gap-3">
                  <span className="text-lg font-bold text-[#10B981]">
                    {(stats.verifiedUsers || 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#047857]">Verified Users</span>
                </div>
              </>
            )}

            {activeTab === "buyer" && (
              <>
                <div className="bg-white rounded-2xl border border-[#ECE7DB] px-4 py-2 shadow-xs flex items-center gap-3">
                  <span className="text-lg font-bold text-[#4338CA]">
                    {stats.totalBuyers.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#8C847B]">Total Buyers</span>
                </div>
                <div className="bg-[#ECFDF5] rounded-2xl border border-emerald-200 px-4 py-2 shadow-xs flex items-center gap-3">
                  <span className="text-lg font-bold text-[#10B981]">
                    {(stats.verifiedBuyers || 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#047857]">Verified Buyers</span>
                </div>
              </>
            )}

            {activeTab === "seller" && (
              <>
                <div className="bg-white rounded-2xl border border-[#ECE7DB] px-4 py-2 shadow-xs flex items-center gap-3">
                  <span className="text-lg font-bold text-[#B8860B]">
                    {stats.totalSellers.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#8C847B]">Total Sellers</span>
                </div>
                <div className="bg-[#FFF4E5] rounded-2xl border border-amber-200 px-4 py-2 shadow-xs flex items-center gap-3">
                  <span className="text-lg font-bold text-[#D97706]">
                    {(stats.verifiedSellers || 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#B45309]">Verified Sellers</span>
                </div>
              </>
            )}

            {activeTab === "agent" && (
              <>
                <div className="bg-white rounded-2xl border border-[#ECE7DB] px-4 py-2 shadow-xs flex items-center gap-3">
                  <span className="text-lg font-bold text-[#9333EA]">
                    {(stats.totalAgents || 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#8C847B]">Total Agents</span>
                </div>
                <div className="bg-[#ECFDF5] rounded-2xl border border-emerald-200 px-4 py-2 shadow-xs flex items-center gap-3">
                  <span className="text-lg font-bold text-[#10B981]">
                    {stats.verifiedAgents.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#047857]">Verified Agents</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Users Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-[#ECE7DB] shadow-xs p-4 sm:p-6 lg:p-8 mb-8 overflow-hidden"
        >
          {loading ? (
            <div className="py-12 text-center text-[#8C847B]">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-[#C89B1C] border-t-transparent mb-2" />
              <p className="text-sm">Loading users from database...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-[#8C847B]">
              No users found matching your search.
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#F0ECE1]">
                      <th className="py-4 px-4 text-xs font-semibold text-[#8C847B] tracking-wide">
                        User
                      </th>
                      <th className="py-4 px-4 text-xs font-semibold text-[#8C847B] tracking-wide">
                        Email
                      </th>
                      <th className="py-4 px-4 text-xs font-semibold text-[#8C847B] tracking-wide">
                        Role
                      </th>
                      <th className="py-4 px-4 text-xs font-semibold text-[#8C847B] tracking-wide">
                        City
                      </th>
                      <th className="py-4 px-4 text-xs font-semibold text-[#8C847B] tracking-wide">
                        Joined
                      </th>
                      <th className="py-4 px-4 text-xs font-semibold text-[#8C847B] tracking-wide text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const initial = user.fullName
                        ? user.fullName.charAt(0).toUpperCase()
                        : "U";

                      return (
                        <tr
                          key={user._id}
                          className="border-b border-[#F6F4EF] last:border-b-0 hover:bg-[#FAF9F5]/70 transition-colors"
                        >
                          {/* User Avatar + Name */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#B8860B] text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                                {initial}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#1C1917] text-sm">
                                  {user.fullName}
                                </span>
                                {!user.isActive && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFEBEB] text-[#E53E3E] border border-red-200">
                                    Suspended
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-4 px-4 text-sm text-[#736B63]">
                            {user.email}
                          </td>

                          {/* Role */}
                          <td className="py-4 px-4">
                            {getRoleBadge(user.role)}
                          </td>

                          {/* City */}
                          <td className="py-4 px-4 text-sm text-[#4A453F]">
                            {user.city || "-"}
                          </td>

                          {/* Joined */}
                          <td className="py-4 px-4 text-sm text-[#736B63]">
                            {formatDate(user.createdAt)}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Eye Button */}
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setViewModalOpen(true);
                                }}
                                title="View User Details"
                                className="h-8 w-8 rounded-full bg-[#EBF3FF] text-[#3B82F6] hover:bg-[#DBEAFE] flex items-center justify-center transition-all cursor-pointer"
                              >
                                <Eye size={16} />
                              </button>

                              {/* Delete User Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openReasonModal(user, "delete");
                                }}
                                title="Delete User"
                                className="h-8 w-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile/iPad portrait Card View */}
              <div className="block md:hidden space-y-4">
                {users.map((user) => {
                  const initial = user.fullName
                    ? user.fullName.charAt(0).toUpperCase()
                    : "U";
                  return (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-2xl border border-[#ECE7DB] p-5 space-y-4 shadow-xs relative hover:shadow-md transition-all duration-200"
                    >
                      {/* Header: Avatar, Name & Status */}
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#B8860B] text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                          {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#1C1917] text-sm truncate">
                              {user.fullName}
                            </span>
                            {!user.isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFEBEB] text-[#E53E3E] border border-red-200">
                                Suspended
                              </span>
                            )}
                          </div>
                          <span className="block mt-1">{getRoleBadge(user.role)}</span>
                        </div>
                      </div>

                      {/* User Details */}
                      <div className="space-y-2.5 text-xs text-[#736B63] border-t border-dashed border-[#F0ECE1] pt-3">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400 shrink-0" />
                          <span>City: {user.city || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400 shrink-0" />
                          <span>Joined: {formatDate(user.createdAt)}</span>
                        </div>
                      </div>

                      {/* Actions Bar */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0ECE1]">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setViewModalOpen(true);
                          }}
                          className="h-9 px-4 rounded-xl bg-[#EBF3FF] text-[#3B82F6] hover:bg-[#DBEAFE] flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openReasonModal(user, "delete");
                          }}
                          className="h-9 px-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {/* Premium Pagination Footer */}
          <div className="mt-6 pt-4 border-t border-[#F0ECE1] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-[#736B63]">
            {/* Left: Range Info */}
            <div>
              Showing{" "}
              <span className="font-bold text-[#1C1917]">
                {total === 0 ? 0 : (page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#1C1917]">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-bold text-[#1C1917]">{total}</span> users
            </div>

            {/* Center: Pagination Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1 || loading}
                className="h-9 px-3 rounded-xl border border-[#E8E1D4] bg-white flex items-center gap-1 hover:border-[#C89B1C] hover:bg-[#FFF9EC] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#E8E1D4] transition-all cursor-pointer"
              >
                <ChevronLeft size={15} />
                <span>Prev</span>
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                })
                .map((p, idx, array) => {
                  const prevPage = array[idx - 1];
                  const showEllipsis = prevPage && p - prevPage > 1;

                  return (
                    <div key={p} className="flex items-center gap-1.5">
                      {showEllipsis && <span className="px-1 text-gray-400">...</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          page === p
                            ? "bg-[#B8860B] text-white shadow-sm"
                            : "border border-[#E8E1D4] bg-white text-[#4A453F] hover:border-[#C89B1C] hover:bg-[#FFF9EC]"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages || loading}
                className="h-9 px-3 rounded-xl border border-[#E8E1D4] bg-white flex items-center gap-1 hover:border-[#C89B1C] hover:bg-[#FFF9EC] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#E8E1D4] transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Right: Direct Page Selector */}
            <div className="flex items-center gap-2">
              <span>Go to page:</span>
              <select
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className="h-9 px-3 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] text-xs font-bold text-[#1C1917] outline-none focus:border-[#C89B1C] cursor-pointer"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    Page {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

      {/* Floating Help Button */}
      <button className="fixed bottom-6 right-6 h-10 w-10 bg-[#1C1917] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-black transition-all z-40">
        <HelpCircle size={20} />
      </button>

      {/* User Details Modal */}
      <AnimatePresence>
        {viewModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-[#ECE7DB] relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setViewModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
              >
                <X size={20} />
              </button>

              {/* User Avatar & Header */}
              <div className="flex items-center gap-4 border-b border-[#F0ECE1] pb-6 mb-6">
                <div className="h-16 w-16 rounded-full bg-[#B8860B] text-white text-2xl font-bold flex items-center justify-center shadow-md">
                  {selectedUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1C1917]">
                    {selectedUser.fullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(selectedUser.role)}
                    {selectedUser.isVerified && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 size={13} /> Verified
                      </span>
                    )}
                    {!selectedUser.isActive && (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                        Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4 text-sm text-[#4A453F]">
                <div className="flex items-center gap-3">
                  <Mail size={17} className="text-[#8C847B]" />
                  <span className="font-medium text-[#1C1917]">Email:</span>
                  <span>{selectedUser.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={17} className="text-[#8C847B]" />
                  <span className="font-medium text-[#1C1917]">Phone:</span>
                  <span>{selectedUser.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={17} className="text-[#8C847B]" />
                  <span className="font-medium text-[#1C1917]">City:</span>
                  <span>{selectedUser.city || "-"}</span>
                </div>

                {selectedUser.agencyName && (
                  <div className="flex items-center gap-3">
                    <Building size={17} className="text-[#8C847B]" />
                    <span className="font-medium text-[#1C1917]">Agency:</span>
                    <span>{selectedUser.agencyName}</span>
                  </div>
                )}

                {selectedUser.reraNumber && (
                  <div className="flex items-center gap-3">
                    <Shield size={17} className="text-[#8C847B]" />
                    <span className="font-medium text-[#1C1917]">RERA:</span>
                    <span>{selectedUser.reraNumber}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar size={17} className="text-[#8C847B]" />
                  <span className="font-medium text-[#1C1917]">Joined:</span>
                  <span>{formatDate(selectedUser.createdAt)}</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-8 pt-6 border-t border-[#F0ECE1] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  disabled={actionLoading}
                  onClick={() => handleToggleVerify(selectedUser._id)}
                  className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center ${
                    selectedUser.isVerified
                      ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  }`}
                >
                  {selectedUser.isVerified ? "Unverify User" : "Verify User"}
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => {
                    if (selectedUser.isActive) {
                      openReasonModal(selectedUser, "suspend");
                    } else {
                      handleReactivateUser(selectedUser._id);
                    }
                  }}
                  className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center ${
                    selectedUser.isActive
                      ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  }`}
                >
                  {selectedUser.isActive ? "Suspend Account" : "Activate Account"}
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => openReasonModal(selectedUser, "delete")}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm transition-all cursor-pointer flex items-center justify-center"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reason Modal for Suspend & Delete */}
      <AnimatePresence>
        {reasonModalOpen && targetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 lg:p-8 shadow-2xl border border-[#ECE7DB] relative"
            >
              <button
                onClick={() => setReasonModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                    reasonType === "delete"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {reasonType === "delete" ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1C1917]">
                    {reasonType === "delete" ? "Delete User Account" : "Suspend User Account"}
                  </h3>
                  <p className="text-xs text-gray-500">{targetUser.fullName} ({targetUser.email})</p>
                </div>
              </div>

              <p className="text-sm text-[#4A453F] mb-4">
                Please provide a reason to {reasonType} this user account. This reason is required and will be logged.
              </p>

              <div className="mb-5">
                <textarea
                  rows={3}
                  value={actionReason}
                  onChange={(e) => {
                    setActionReason(e.target.value);
                    if (reasonError) setReasonError("");
                  }}
                  placeholder={`Enter reason for ${reasonType === "delete" ? "deletion" : "suspension"}...`}
                  className={`w-full p-3 text-sm rounded-xl border ${
                    reasonError ? "border-red-500 focus:ring-red-500" : "border-[#E8E1D4] focus:border-[#C89B1C]"
                  } outline-none transition-all`}
                />
                {reasonError && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{reasonError}</p>
                )}
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setReasonModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E1D4] text-sm font-semibold text-[#4A453F] hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading || !actionReason.trim()}
                  onClick={handleConfirmReasonAction}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-50 ${
                    reasonType === "delete"
                      ? "bg-red-600 hover:bg-red-700 shadow-sm"
                      : "bg-amber-600 hover:bg-amber-700 shadow-sm"
                  }`}
                >
                  {actionLoading
                    ? "Processing..."
                    : reasonType === "delete"
                    ? "Confirm Delete"
                    : "Confirm Suspend"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
