"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const toggleMobileSidebar = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toggle-admin-mobile-sidebar"));
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = user?.fullName || "Admin User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="h-20 bg-white border-b border-[#ECE7DB] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-[#E8E1D4] text-gray-700 hover:bg-[#FAFAF8] transition cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-3xl font-bold text-[#161616]"
          >
            Welcome Back 👋
          </motion.h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
            {today}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Responsive Search Box */}
        <div className="hidden md:flex w-[200px] lg:w-[320px] h-11 sm:h-12 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] px-4 items-center gap-3 transition focus-within:border-[#C89B1C] focus-within:shadow-[0_0_0_3px_rgba(200,155,28,.12)]">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            placeholder="Search properties..."
            className="w-full bg-transparent outline-none text-sm text-[#161616]"
          />
        </div>

        {/* Notification Button */}
        <motion.button
          onClick={() => {
            try {
              localStorage.setItem("admin_bell_read", "true");
              window.dispatchEvent(new Event("storage"));
            } catch (e) {}
          }}
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-[#E8E1D4] bg-white flex items-center justify-center hover:border-[#C89B1C] hover:bg-[#FFF9EC] transition-all cursor-pointer"
        >
          <Bell size={19} />
        </motion.button>

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <motion.button
            onClick={() => setDropdownOpen((prev) => !prev)}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5 cursor-pointer select-none border-0 bg-transparent outline-none"
          >
            <div className="relative">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white font-bold text-base sm:text-lg flex items-center justify-center shadow-md">
                {userInitial}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500 border-2 border-white" />
            </div>

            <span className="hidden sm:inline text-sm font-semibold text-[#161616]">
              {userName}
            </span>
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-[#ECE7DB] shadow-xl overflow-hidden z-50 p-2"
              >
                <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                  <p className="text-sm font-bold text-[#161616] truncate">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || "Administrator"}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}