"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Building2,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Upload,
} from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
  Suspense,
} from "react";

import { useAuth } from "../../hooks/useAuth";;

import Logo from "../common/Logo";
import api from "../../lib/api";

function NavbarContent() {
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
  const [mobileMenuOpen, setMobileMenuOpen] =
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
        const res = await api.get("/users/me/published-count");
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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

            <Link
              href="/eyva"
              className={`transition-all flex flex-col items-center justify-center min-w-[60px] ${
                pathname === "/eyva" ? "scale-105 font-bold" : ""
              }`}
            >
              <img
                src="/eyva 1.png"
                alt="Ask Eyva"
                className="h-14 w-14 object-contain"
              />
              <span className="text-[11px] font-bold mt-0.5 whitespace-nowrap">
                <span className="text-[#B88A1A]">Ask </span>
                <span className="text-[#1F2937]">Eyva</span>
              </span>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="sm:hidden p-2.5 rounded-xl border border-[#E8E1D4] text-gray-700 hover:bg-[#FAFAF8] transition cursor-pointer"
                  aria-label="Login / Sign In"
                >
                  <User size={18} />
                </Link>

                <Link
                  href="/login"
                  className="hidden sm:inline-flex font-semibold text-sm hover:text-[#9A720C] transition-colors"
                >
                  Sign In
                </Link>
 
                <Link
                  href="/register"
                  className="hidden sm:inline-flex bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-95 transition-all shadow-2xs"
                >
                  Register Free
                </Link>
              </>
            )}
 
            {isAuthenticated && (
              <>
                {role === "agent" && (
                  <Link
                    href="/my-properties/bulk-upload"
                    className="hidden md:inline-flex border border-[#B88A1A] bg-white text-[#9A720C] hover:bg-[#FFF9EC] px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs whitespace-nowrap items-center gap-1.5"
                  >
                    <Upload size={15} />
                    Bulk Listing
                  </Link>
                )}

                <Link
                  href="/post-property"
                  className="hidden sm:inline-flex border border-[#B88A1A] bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white hover:opacity-95 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs whitespace-nowrap"
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
                    <span className="hidden xs:inline text-sm font-semibold text-gray-900">
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

                        {role === "agent" && (
                          <Link
                            href="/my-properties/bulk-upload"
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-[#FAF6EE] hover:text-[#9A720C] transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            <Upload size={18} className="text-[#9A720C]" />
                            <span>Bulk Upload Properties</span>
                          </Link>
                        )}
 
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

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-[#E8E1D4] text-gray-700 hover:bg-[#FAFAF8] transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
 
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer (Left to Right) */}
      <div
        className={`fixed inset-y-0 left-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col p-5 transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header with Logo & Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ECE7DB]">
          <Logo className="-ml-1" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl border border-[#E8E1D4] text-gray-700 hover:bg-[#FAFAF8] transition cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          <Link
            href="/property-listing"
            className={`block py-2 text-sm font-semibold ${isBuyActive ? "text-[#9A720C] font-bold" : "text-gray-800"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Properties
          </Link>
          <Link
            href="/property-listing?purpose=Rent"
            className={`block py-2 text-sm font-semibold ${isRentActive ? "text-[#9A720C] font-bold" : "text-gray-800"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Rent
          </Link>
          <Link
            href="/property-listing?type=NewProjects"
            className={`block py-2 text-sm font-semibold ${isNewProjectsActive ? "text-[#9A720C] font-bold" : "text-gray-800"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            New Projects
          </Link>
          <Link
            href="/property-listing?type=Commercial"
            className={`block py-2 text-sm font-semibold ${isCommercialActive ? "text-[#9A720C] font-bold" : "text-gray-800"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Commercial
          </Link>
          
          {isAuthenticated && (
            <Link
              href="/my-properties"
              className={`block py-2 text-sm font-semibold flex items-center gap-1.5 ${isMyPropertiesPage ? "text-[#9A720C] font-bold" : "text-gray-800"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building2 size={16} />
              <span>My Properties</span>
            </Link>
          )}

          <Link
            href="/eyva"
            className="flex items-center gap-2 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/eyva 1.png" alt="Ask Eyva" className="h-8 w-8 object-contain" />
            <span className="text-sm font-bold">
              <span className="text-[#B88A1A]">Ask </span>
              <span className="text-[#1F2937]">Eyva Chatbot</span>
            </span>
          </Link>
        </div>

        {/* Bottom Section (Auth/CTA) */}
        <div className="border-t border-[#ECE7DB] pt-4">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full h-11 rounded-xl border border-[#ECE7DB] flex items-center justify-center text-sm font-semibold text-gray-800 hover:bg-[#FAFAF8] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white flex items-center justify-center text-sm font-bold hover:opacity-95 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register Free
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {role === "agent" && (
                <Link
                  href="/my-properties/bulk-upload"
                  className="w-full h-11 rounded-xl border border-[#B88A1A] text-[#9A720C] flex items-center justify-center text-sm font-bold hover:bg-[#FFF9EC] transition gap-1.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Upload size={16} /> Bulk Upload Properties
                </Link>
              )}

              <Link
                href="/post-property"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white flex items-center justify-center text-sm font-bold hover:opacity-95 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                + List Property
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-[73px] bg-white border-b border-[#ECE7DB] w-full" />}>
      <NavbarContent />
    </Suspense>
  );
}