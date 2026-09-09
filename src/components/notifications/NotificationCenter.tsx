"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  Tag,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Layers,
  Building2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  X,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

export interface NotificationItem {
  _id: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  propertyId?: {
    _id: string;
    title?: string;
    propertyType?: string;
    locality?: string;
    city?: string;
    price?: number;
    photos?: string[];
    status?: string;
    availabilityStatus?: string;
  } | string | null;
  metadata?: {
    targetUrl?: string;
    oldPrice?: number;
    newPrice?: number;
    isReduction?: boolean;
    confidence?: number;
    distanceMeters?: number;
    buyerName?: string;
    reason?: string;
    successfullyPublished?: number;
    failedCount?: number;
  };
  priority?: "LOW" | "NORMAL" | "HIGH";
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

interface NotificationCenterProps {
  isAdmin?: boolean;
  className?: string;
}

export default function NotificationCenter({ isAdmin = false, className = "" }: NotificationCenterProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch unread count lightweight endpoint
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get("/notifications/unread-count");
      if (res.data?.success) {
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Ignore polling errors quietly
    }
  }, [isAuthenticated]);

  // Fetch full notification list
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params: any = { limit: 25 };
      if (activeFilter === "unread") {
        params.isRead = false;
      }
      const res = await api.get("/notifications", { params });
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        if (typeof res.data.unreadCount === "number") {
          setUnreadCount(res.data.unreadCount);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, activeFilter]);

  // Initial and periodic polling
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // 30s poll

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  // Refetch list when dropdown is opened or filter changes
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchNotifications();
    }
  }, [isOpen, activeFilter, isAuthenticated, fetchNotifications]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Mark single notification as read
  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      if (res.data?.success) {
        setNotifications((prev) =>
          prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    try {
      const res = await api.patch("/notifications/read-all");
      if (res.data?.success) {
        setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  // Handle click on notification item (navigates to relevant page)
  const handleItemClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      handleMarkAsRead(item._id);
    }
    setIsOpen(false);

    // Determine target URL
    let target = item.metadata?.targetUrl;

    if (!target && item.propertyId) {
      const propId = typeof item.propertyId === "object" ? item.propertyId._id : item.propertyId;
      if (propId) {
        target = `/properties/${propId}`;
      }
    }

    if (target) {
      router.push(target);
    } else {
      if (item.type === "ENQUIRY_RECEIVED") {
        router.push("/my-properties");
      } else if (item.type?.startsWith("BULK_UPLOAD")) {
        router.push("/my-properties/bulk-upload");
      } else if (isAdmin) {
        router.push("/admin/properties");
      } else {
        router.push("/my-properties");
      }
    }
  };

  // Format relative time helper
  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffSec < 60) return "Just now";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}h ago`;
      const diffDays = Math.floor(diffHour / 24);
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  };

  // Render Category Icon & Color
  const getCategoryMeta = (type: string, priority?: string) => {
    switch (type) {
      case "PRICE_CHANGED":
        return {
          icon: <TrendingDown size={16} className="text-emerald-700" />,
          bgColor: "bg-emerald-50 border-emerald-200",
          tagColor: "text-emerald-800 bg-emerald-100/60",
          label: "Price Update",
        };
      case "ENQUIRY_RECEIVED":
        return {
          icon: <MessageSquare size={16} className="text-blue-700" />,
          bgColor: "bg-blue-50 border-blue-200",
          tagColor: "text-blue-800 bg-blue-100/60",
          label: "New Enquiry",
        };
      case "PROPERTY_APPROVED":
        return {
          icon: <CheckCircle2 size={16} className="text-emerald-700" />,
          bgColor: "bg-emerald-50 border-emerald-200",
          tagColor: "text-emerald-800 bg-emerald-100/60",
          label: "Approved",
        };
      case "PROPERTY_REJECTED":
        return {
          icon: <XCircle size={16} className="text-red-700" />,
          bgColor: "bg-red-50 border-red-200",
          tagColor: "text-red-800 bg-red-100/60",
          label: "Rejected",
        };
      case "PROPERTY_PENDING_APPROVAL":
        return {
          icon: <Clock size={16} className="text-amber-700" />,
          bgColor: "bg-amber-50 border-amber-200",
          tagColor: "text-amber-800 bg-amber-100/60",
          label: "Pending Review",
        };
      case "DUPLICATE_DETECTED":
        return {
          icon: <AlertTriangle size={16} className="text-amber-700" />,
          bgColor: "bg-amber-50 border-amber-200",
          tagColor: "text-amber-800 bg-amber-100/60",
          label: "Duplicate Alert",
        };
      case "BULK_UPLOAD_COMPLETED":
        return {
          icon: <Layers size={16} className="text-indigo-700" />,
          bgColor: "bg-indigo-50 border-indigo-200",
          tagColor: "text-indigo-800 bg-indigo-100/60",
          label: "Bulk Upload",
        };
      case "BULK_UPLOAD_PARTIAL":
      case "BULK_UPLOAD_FAILED":
        return {
          icon: <Layers size={16} className="text-amber-700" />,
          bgColor: "bg-amber-50 border-amber-200",
          tagColor: "text-amber-800 bg-amber-100/60",
          label: "Bulk Upload",
        };
      case "PROPERTY_AVAILABILITY_CHANGED":
        return {
          icon: <Building2 size={16} className="text-purple-700" />,
          bgColor: "bg-purple-50 border-purple-200",
          tagColor: "text-purple-800 bg-purple-100/60",
          label: "Status Change",
        };
      case "PROPERTY_MATCH":
      default:
        return {
          icon: <Sparkles size={16} className="text-[#9A720C]" />,
          bgColor: "bg-[#FAF6EE] border-[#ECE7DB]",
          tagColor: "text-[#9A720C] bg-[#FAF6EE]",
          label: "Smart Match",
        };
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        aria-expanded={isOpen}
        className={`relative p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isOpen
            ? "border-[#9A720C] bg-[#FAF6EE] text-[#9A720C] shadow-xs"
            : "border-[#E8E1D4] bg-white text-gray-700 hover:border-[#9A720C] hover:bg-[#FAF6EE]"
        }`}
      >
        <Bell size={18} className={unreadCount > 0 ? "animate-[bell-shake_1s_ease-in-out_infinite]" : ""} />

        {/* Live Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-12 sm:top-14 w-[340px] sm:w-[410px] bg-white rounded-2xl shadow-2xl border border-[#ECE7DB] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#FAF9F6] border-b border-[#ECE7DB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#161616] text-sm sm:text-base">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-[#9A720C] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={markingAll}
                  className="text-xs font-semibold text-[#9A720C] hover:text-[#805e08] hover:underline transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                  <span>{markingAll ? "Marking..." : "Mark all read"}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition sm:hidden"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 bg-white">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[#161616] text-white shadow-2xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("unread")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "unread"
                  ? "bg-[#9A720C] text-white shadow-2xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeFilter === "unread" ? "bg-white text-[#9A720C]" : "bg-[#9A720C] text-white"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notification List Scroll Area */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 overscroll-contain">
            {loading ? (
              <div className="p-8 text-center space-y-2">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#9A720C] border-t-transparent"></div>
                <p className="text-xs text-gray-500 font-medium">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 px-6 text-center space-y-2.5">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF6EE] text-[#9A720C] flex items-center justify-center">
                  <Bell size={22} className="opacity-70" />
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {activeFilter === "unread" ? "No unread notifications" : "No notifications yet"}
                </p>
                <p className="text-xs text-gray-500 max-w-[240px] mx-auto leading-relaxed">
                  {activeFilter === "unread"
                    ? "You are all caught up! Switch to 'All' to view history."
                    : "We will notify you here when important updates happen."}
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const meta = getCategoryMeta(item.type, item.priority);
                return (
                  <div
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3.5 sm:p-4 transition-all duration-150 cursor-pointer flex gap-3 relative group hover:bg-[#FAF9F6] ${
                      !item.isRead ? "bg-[#FAF6EE]/45" : "bg-white"
                    }`}
                  >
                    {/* Unread Glow Dot */}
                    {!item.isRead && (
                      <span className="absolute left-1.5 top-5 w-2 h-2 rounded-full bg-[#9A720C] ring-2 ring-[#FAF6EE]" />
                    )}

                    {/* Category Icon */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.bgColor}`}
                    >
                      {meta.icon}
                    </div>

                    {/* Notification Body */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-start justify-between gap-1.5 mb-1">
                        <h4
                          className={`text-xs sm:text-sm leading-snug line-clamp-1 ${
                            !item.isRead ? "font-bold text-[#161616]" : "font-semibold text-gray-800"
                          }`}
                        >
                          {item.title}
                        </h4>

                        {/* Priority Badge if HIGH */}
                        {item.priority === "HIGH" && (
                          <span className="shrink-0 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                            High
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-1.5">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${meta.tagColor}`}>
                            {meta.label}
                          </span>
                          <span>{formatTimeAgo(item.createdAt)}</span>
                        </div>

                        {/* Mark single as read button on hover */}
                        {!item.isRead && (
                          <button
                            type="button"
                            onClick={(e) => handleMarkAsRead(item._id, e)}
                            className="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-[#9A720C] hover:underline flex items-center gap-0.5 transition"
                            title="Mark as read"
                          >
                            <Check size={12} />
                            <span>Mark read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#FAF9F6] border-t border-[#ECE7DB] text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (isAdmin) {
                  router.push("/admin/properties");
                } else {
                  router.push("/my-properties");
                }
              }}
              className="text-xs font-bold text-gray-700 hover:text-[#9A720C] transition inline-flex items-center gap-1"
            >
              <span>{isAdmin ? "View Admin Dashboard" : "Manage My Properties"}</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
