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
} from "lucide-react";
import { AdminUser, UserStats } from "@/src/types/adminUser";
import {
  getUsers,
  toggleUserVerify,
  toggleUserStatus,
} from "@/src/services/adminUserService";

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [stats, setStats] = useState<UserStats>({
    totalBuyers: 0,
    totalSellers: 0,
    verifiedAgents: 0,
    totalUsers: 0,
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
      });

      if (res.success) {
        setUsers(res.users);
        if (res.stats) {
          setStats({
            totalBuyers: res.stats.totalBuyers || 0,
            totalSellers: res.stats.totalSellers || 0,
            verifiedAgents: res.stats.verifiedAgents || 0,
            totalUsers: res.stats.totalUsers || res.total || 0,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch users from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [activeTab, search]);

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
    <div className="flex-1 flex flex-col min-h-screen bg-[#F7F6F3] font-sans relative">
      {/* Sticky White Header Bar */}
      <header className="h-20 bg-white border-b border-[#ECE7DB] px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#161616] tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{todayDate}</p>
        </div>

        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="w-[360px] h-12 rounded-full border border-[#E8E1D4] bg-[#FAFAF8] px-4 flex items-center gap-3 transition focus-within:border-[#C89B1C] focus-within:shadow-[0_0_0_3px_rgba(200,155,28,.12)]">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-[#161616]"
            />
          </div>

          {/* Notification Bell */}
          <button className="relative h-12 w-12 rounded-xl border border-[#E8E1D4] bg-white flex items-center justify-center hover:border-[#C89B1C] hover:bg-[#FFF9EC] transition-all">
            <Bell size={19} />
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-8 flex-1">
        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-6">
          {[
            { key: "all", label: "All Users" },
            { key: "buyer", label: "Buyers" },
            { key: "seller", label: "Sellers" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-[#B8860B] text-white shadow-sm"
                  : "bg-[#EFECE6] text-[#6B6557] hover:bg-[#E5E0D6]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Users Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-[#ECE7DB] shadow-xs p-6 lg:p-8 mb-8 overflow-hidden"
        >
          <div className="overflow-x-auto">
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8C847B]">
                      <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-[#C89B1C] border-t-transparent mb-2" />
                      <p className="text-sm">Loading users from database...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8C847B]">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
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
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setViewModalOpen(true);
                              }}
                              title="View User Details"
                              className="h-8 w-8 rounded-full bg-[#EBF3FF] text-[#3B82F6] hover:bg-[#DBEAFE] flex items-center justify-center transition-all"
                            >
                              <Eye size={16} />
                            </button>

                            {(user.role === "agent" || user.role === "seller") && (
                              <button
                                onClick={(e) => handleToggleVerify(user._id, e)}
                                title={user.isVerified ? "Verified" : "Verify User"}
                                className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                                  user.isVerified
                                    ? "bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5]"
                                    : "bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
                                }`}
                              >
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 3 Stat Cards Below Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Card 1: Total Buyers */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-[#ECE7DB] p-7 text-center shadow-xs hover:shadow-md transition-shadow"
          >
            <p className="text-3xl lg:text-4xl font-serif font-bold text-[#4338CA] tracking-tight">
              {stats.totalBuyers.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-[#8C847B] mt-1">
              Total Buyers
            </p>
          </motion.div>

          {/* Card 2: Total Sellers */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-[#ECE7DB] p-7 text-center shadow-xs hover:shadow-md transition-shadow"
          >
            <p className="text-3xl lg:text-4xl font-serif font-bold text-[#B8860B] tracking-tight">
              {stats.totalSellers.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-[#8C847B] mt-1">
              Total Sellers
            </p>
          </motion.div>

          {/* Card 3: Verified Agents */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl border border-[#ECE7DB] p-7 text-center shadow-xs hover:shadow-md transition-shadow"
          >
            <p className="text-3xl lg:text-4xl font-serif font-bold text-[#10B981] tracking-tight">
              {stats.verifiedAgents.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-[#8C847B] mt-1">
              Verified Agents
            </p>
          </motion.div>
        </div>
      </div>

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
                <div className="h-16 w-16 rounded-full bg-[#B8860B] text-white font-serif text-2xl font-bold flex items-center justify-center shadow-md">
                  {selectedUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#1C1917]">
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
              <div className="mt-8 pt-6 border-t border-[#F0ECE1] flex items-center justify-between gap-4">
                <button
                  disabled={actionLoading}
                  onClick={() => handleToggleVerify(selectedUser._id)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                    selectedUser.isVerified
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  }`}
                >
                  {selectedUser.isVerified ? "Unverify User" : "Verify User"}
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => handleToggleStatus(selectedUser._id)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                    selectedUser.isActive
                      ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  }`}
                >
                  {selectedUser.isActive ? "Suspend Account" : "Activate Account"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
