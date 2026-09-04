"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";;
import { getUnreadCounts } from "../../services/adminPropertyService";
import Logo from "../common/Logo";

interface MenuItem {
  title: string;
  icon: any;
  href: string;
}

const menuTop: MenuItem[] = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Properties",
    icon: Building2,
    href: "/admin/properties",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Locations",
    icon: MapPin,
    href: "/admin/locations",
  },
];

const menuBottom: MenuItem[] = [
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({
    properties: 0,
    users: 0,
    locations: 0,
  });

  // Listen for mobile sidebar toggle event
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-admin-mobile-sidebar", handleToggle);
    return () =>
      window.removeEventListener("toggle-admin-mobile-sidebar", handleToggle);
  }, []);

  // Update timestamps and fetch dynamic unread counts relative to last visits
  useEffect(() => {
    if (!pathname) return;

    setMobileOpen(false);

    // Save visit timestamp for active page instantly
    const nowStr = new Date().toISOString();
    if (pathname === "/admin/properties" || pathname.startsWith("/admin/properties/")) {
      localStorage.setItem("admin_last_visited_properties", nowStr);
    } else if (pathname === "/admin/users" || pathname.startsWith("/admin/users/")) {
      localStorage.setItem("admin_last_visited_users", nowStr);
    } else if (pathname === "/admin/locations" || pathname.startsWith("/admin/locations/")) {
      localStorage.setItem("admin_last_visited_locations", nowStr);
    }

    async function fetchCounts() {
      // Guard: Only fetch unread notification counts if user is logged in as an admin
      if (!user || user.role !== "admin") return;

      try {
        const lastVisitedProperties = localStorage.getItem("admin_last_visited_properties") || "";
        const lastVisitedUsers = localStorage.getItem("admin_last_visited_users") || "";
        const lastVisitedLocations = localStorage.getItem("admin_last_visited_locations") || "";

        const res = await getUnreadCounts({
          lastVisitedProperties,
          lastVisitedUsers,
          lastVisitedLocations,
        });

        if (res && res.success) {
          const activeProperties = pathname === "/admin/properties" || pathname.startsWith("/admin/properties/");
          const activeUsers = pathname === "/admin/users" || pathname.startsWith("/admin/users/");
          const activeLocations = pathname === "/admin/locations" || pathname.startsWith("/admin/locations/");

          setUnreadCounts({
            properties: activeProperties ? 0 : (res.unreadProperties || 0),
            users: activeUsers ? 0 : (res.unreadUsers || 0),
            locations: activeLocations ? 0 : (res.unreadLocations || 0),
          });
        }
      } catch (err) {
        // Silent catch for background notification polling errors (e.g. server restart, temporary network drop)
      }
    }

    fetchCounts();

    // Check periodically for new arrivals (every 15s)
    const interval = setInterval(fetchCounts, 15000);
    return () => clearInterval(interval);
  }, [pathname, user]);

  const userInitial = user?.fullName ? user.fullName[0].toUpperCase() : "A";
  const userName = user?.fullName || "Admin User";
  const userRole = user?.role === "admin" ? "Administrator" : "Admin User";

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const active =
      pathname === item.href ||
      (item.href !== "/admin" && pathname.startsWith(item.href));

    let badgeCount = 0;
    if (item.href === "/admin/properties") {
      badgeCount = unreadCounts.properties;
    } else if (item.href === "/admin/users") {
      badgeCount = unreadCounts.users;
    } else if (item.href === "/admin/locations") {
      badgeCount = unreadCounts.locations;
    }

    return (
      <Link
        key={item.title}
        href={item.href}
        className={`
          flex
          items-center
          justify-between
          px-4
          py-3
          rounded-2xl
          transition-all
          duration-200
          ${
            active
              ? "bg-[#382E15] border border-[#C89B1C]/40 text-[#C89B1C] font-bold shadow-xs"
              : "hover:bg-[#23201D] text-[#C9C2B8] hover:text-white font-medium"
          }
        `}
      >
        <div className="flex items-center gap-3.5">
          <Icon size={20} className={active ? "text-[#C89B1C]" : "text-[#C9C2B8]"} />
          <span className="text-sm tracking-wide">{item.title}</span>
        </div>

        {badgeCount > 0 && (
          <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-[11px] font-bold flex items-center justify-center text-white shadow-xs">
            {badgeCount}
          </span>
        )}
      </Link>
    );
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full bg-[#181614] text-white">
      {/* Top Section */}
      <div>
        {/* Logo Header */}
        <div className="px-6 py-6 border-b border-[#2A2724] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Logo lightText />
          </div>

          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#23201D]"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Section 1 */}
        <nav className="px-4 py-5 space-y-1.5">
          {menuTop.map(renderMenuItem)}
        </nav>

        {/* Section Divider */}
        <div className="px-4 my-2">
          <div className="border-t border-[#2A2724]" />
        </div>

        {/* Navigation Section 2 */}
        <nav className="px-4 py-3 space-y-1.5">
          {menuBottom.map(renderMenuItem)}
        </nav>
      </div>

      {/* Footer Profile & Sign Out */}
      <div className="border-t border-[#2A2724] p-4 bg-[#181614] space-y-3">
        <div className="flex items-center gap-3 px-1 overflow-hidden">
          <div className="h-10 w-10 rounded-full bg-[#C89B1C] text-[#181614] font-bold flex items-center justify-center text-sm shadow-md shrink-0">
            {userInitial}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white leading-tight truncate">
              {userName}
            </h4>
            <p className="text-xs text-gray-400 truncate">{userRole}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          title="Sign Out"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer text-sm font-medium"
        >
          <LogOut size={17} className="text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[270px] h-screen sticky top-0 bg-[#181614] text-white flex-col justify-between border-r border-[#2A2724] shrink-0 z-30">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-[270px] bg-[#181614] text-white z-50 border-r border-[#2A2724] shadow-2xl lg:hidden"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}