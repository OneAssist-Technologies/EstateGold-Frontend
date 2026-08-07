"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  Home,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDashboard } from "../../services/adminPropertyService";

interface MenuItem {
  title: string;
  icon: any;
  href: string;
  initialBadge?: number;
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
    initialBadge: 4,
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
  const [visitedRoutes, setVisitedRoutes] = useState<Record<string, boolean>>({});
  const [dynamicCounts, setDynamicCounts] = useState<Record<string, number>>({});

  // Listen for mobile sidebar toggle event
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-admin-mobile-sidebar", handleToggle);
    return () =>
      window.removeEventListener("toggle-admin-mobile-sidebar", handleToggle);
  }, []);

  // Restore visited routes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_visited_notification_routes");
      if (stored) {
        setVisitedRoutes(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Fetch dynamic counts
  useEffect(() => {
    async function fetchCounts() {
      try {
        const dash = await getDashboard();
        if (dash && dash.stats) {
          setDynamicCounts({
            "/admin/properties": dash.stats.pendingProperties ?? 4,
          });
        } else {
          setDynamicCounts({
            "/admin/properties": 4,
          });
        }
      } catch (err) {
        setDynamicCounts({
          "/admin/properties": 4,
        });
      }
    }
    fetchCounts();
  }, []);

  // Auto-clear notification on route visit & close mobile menu on navigate
  useEffect(() => {
    if (!pathname) return;

    setMobileOpen(false);

    [...menuTop, ...menuBottom].forEach((item) => {
      const isCurrentRoute =
        pathname === item.href ||
        (item.href !== "/admin" && pathname.startsWith(item.href));

      if (isCurrentRoute) {
        setVisitedRoutes((prev) => {
          if (prev[item.href]) return prev;
          const updated = { ...prev, [item.href]: true };
          try {
            localStorage.setItem(
              "admin_visited_notification_routes",
              JSON.stringify(updated)
            );
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
      }
    });
  }, [pathname]);

  const userInitial = user?.fullName ? user.fullName[0].toUpperCase() : "A";
  const userName = user?.fullName || "Admin User";
  const userRole = user?.role === "admin" ? "Administrator" : "Admin User";

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const active =
      pathname === item.href ||
      (item.href !== "/admin" && pathname.startsWith(item.href));

    const rawCount = dynamicCounts[item.href] ?? item.initialBadge ?? 0;
    const isVisited = visitedRoutes[item.href] || active;
    const badgeCount = isVisited ? 0 : rawCount;

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
            <div className="h-11 w-11 rounded-2xl bg-[#C89B1C] flex items-center justify-center text-[#181614] shadow-md">
              <Home size={22} className="fill-[#181614]" />
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                EstateGold
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Admin Console</p>
            </div>
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
      <div className="border-t border-[#2A2724] p-4 bg-[#181614]">
        <div className="flex items-center justify-between">
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
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#26221E] transition-all cursor-pointer shrink-0"
          >
            <LogOut size={18} className="text-[#C89B1C]" />
          </button>
        </div>
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