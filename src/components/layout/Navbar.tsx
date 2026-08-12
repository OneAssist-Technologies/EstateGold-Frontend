"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Building2,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import Logo from "../common/Logo";
import api from "../../services/api";

export default function Navbar() {
 const {
  user,
  loading,
  isAuthenticated,
  logout,
} = useAuth();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] =
    useState(false);
  const [hasPublishedProperties, setHasPublishedProperties] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const role = user?.role;

  const userName =
    user?.fullName;

  const canManageProperties =
    role === "seller" ||
    role === "agent";

  const isLandingPage = pathname === "/";
  const isPropertyListingPage = pathname === "/property-listing";
  const isMyPropertiesPage = pathname === "/my-properties";

  const purposeParam = searchParams ? searchParams.get("purpose") : null;
  const typeParam = searchParams ? searchParams.get("type") : null;

  const isRentActive = isPropertyListingPage && purposeParam?.toLowerCase() === "rent";
  const isNewProjectsActive = isPropertyListingPage && typeParam?.toLowerCase() === "newprojects";
  const isCommercialActive = isPropertyListingPage && typeParam?.toLowerCase() === "commercial";
  const isBuyActive = isPropertyListingPage && !isRentActive && !isNewProjectsActive && !isCommercialActive;

  useEffect(() => {
    if (!isAuthenticated) {
      setHasPublishedProperties(false);
      return;
    }

    const checkPublished = async () => {
      try {
        const res = await api.get("/my-published-count");
        setHasPublishedProperties(res.data.hasPublishedProperties);
      } catch (err) {
        setHasPublishedProperties(false);
      }
    };

    checkPublished();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);
if (loading) {
  return null;
}
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <Logo className="-ml-2 sm:-ml-4 px-1" />

          {/* Menu */}

          {/* Menu Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-gray-800">
            <Link
              href="/property-listing"
              className={`transition-colors ${
                isBuyActive ? "text-[#9A720C] font-bold" : "hover:text-[#9A720C]"
              }`}
            >
              Properties
            </Link>

            <Link
              href="/property-listing?purpose=Rent"
              className={`transition-colors ${
                isRentActive ? "text-[#9A720C] font-bold" : "hover:text-[#9A720C]"
              }`}
            >
              Rent
            </Link>

            <Link
              href="/property-listing?type=NewProjects"
              className={`transition-colors ${
                isNewProjectsActive ? "text-[#9A720C] font-bold" : "hover:text-[#9A720C]"
              }`}
            >
              New Projects
            </Link>

            <Link
              href="/property-listing?type=Commercial"
              className={`transition-colors ${
                isCommercialActive ? "text-[#9A720C] font-bold" : "hover:text-[#9A720C]"
              }`}
            >
              Commercial
            </Link>

            {isAuthenticated && (
              <Link
                href="/my-properties"
                className={`transition-colors flex items-center gap-1.5 ${
                  isMyPropertiesPage ? "text-[#9A720C] font-bold" : "hover:text-[#9A720C]"
                }`}
              >
                <Building2 size={16} className={isMyPropertiesPage ? "text-[#9A720C]" : "text-gray-600"} />
                <span>My Properties</span>
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="font-semibold text-sm hover:text-[#9A720C] transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="
                    bg-gradient-to-r
                    from-[#B88A1A]
                    via-[#D4B04C]
                    to-[#8C6605]
                    text-white
                    px-4
                    py-2.5
                    rounded-xl
                    text-sm
                    font-bold
                    hover:opacity-95
                    transition-all
                    shadow-2xs
                  "
                >
                  Register Free
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link
                  href="/post-property"
                  className="border border-[#B88A1A] text-[#9A720C] hover:bg-[#FFF9EC] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs"
                >
                  + List Property
                </Link>

                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E1D4] bg-[#FAF6EE] hover:bg-[#F3EAD9] cursor-pointer transition-all shadow-2xs"
                  >
                    <div className="h-7 w-7 rounded-full bg-[#B88A1A] text-white flex items-center justify-center text-xs font-bold uppercase shadow-2xs">
                      {userName ? userName.charAt(0) : "U"}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {userName ? userName.split(" ")[0] : "User"}
                    </span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {open && (
                    <div className="absolute right-0 top-14 bg-white shadow-2xl rounded-2xl border border-[#ECE7DB] min-w-[240px] overflow-hidden z-50 animate-in fade-in duration-200">
                      {/* Top Header Card */}
                      <div className="px-5 py-4 bg-[#FAF6EE] border-b border-[#ECE7DB]">
                        <p className="font-bold text-[#161616] text-base leading-snug">
                          {userName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5 capitalize">
                          {role === "agent" ? "Agent / Broker" : role === "seller" ? "Owner / Seller" : role === "admin" ? "Administrator" : "Member"}
                        </p>
                      </div>

                      {/* Dropdown Items */}
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-[#FAF6EE] hover:text-[#9A720C] transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <User size={18} className="text-gray-700" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/my-properties"
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-[#FAF6EE] hover:text-[#9A720C] transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <Building2 size={18} className="text-gray-700" />
                          <span>My Properties</span>
                        </Link>

                        <div className="border-t border-[#ECE7DB] my-1" />

                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut size={18} className="text-red-600" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}