"use client";

import Link from "next/link";
import {
  Building2,
  UserCircle2,
} from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import RoleUpgradeModal from "../role-request/RoleUpgradeModal";
import Logo from "../common/Logo";
import api from "../../services/api";

export default function Navbar() {
 const {
  user,
  loading,
  isAuthenticated,
  logout,
} = useAuth();

  const [open, setOpen] =
    useState(false);
  const [showRoleModal, setShowRoleModal] =
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <Logo />

          {/* Menu */}

          {/* Menu Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-gray-800">
            <Link
              href="/property-listing"
              className="text-[#9A720C] hover:text-[#9A720C] font-bold transition-colors"
            >
              Buy
            </Link>

            <Link
              href="/property-listing?purpose=Rent"
              className="hover:text-[#9A720C] transition-colors"
            >
              Rent
            </Link>

            <Link
              href="/property-listing?type=NewProjects"
              className="hover:text-[#9A720C] transition-colors"
            >
              New Projects
            </Link>

            <Link
              href="/property-listing?type=Commercial"
              className="hover:text-[#9A720C] transition-colors"
            >
              Commercial
            </Link>

            {isAuthenticated && (
              <Link
                href="/my-properties"
                className="hover:text-[#9A720C] transition-colors flex items-center gap-1.5"
              >
                <span className="text-gray-500 font-normal">🔖</span>
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
                  className="
                    border
                    border-[#B88A1A]
                    text-[#9A720C]
                    hover:bg-[#FFF9EC]
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                    font-bold
                    transition-all
                  "
                >
                  + List Property
                </Link>

                <div
                  ref={dropdownRef}
                  className="relative"
                >
                  <button
                    onClick={() => setOpen(!open)}
                    className="
                      flex
                      items-center
                      gap-2
                      px-2.5
                      py-1.5
                      rounded-full
                      border
                      border-[#E8E1D4]
                      bg-white
                      hover:bg-[#FAFAF8]
                      cursor-pointer
                      transition-all
                    "
                  >
                    <div className="h-7 w-7 rounded-full bg-[#9A720C] text-white flex items-center justify-center text-xs font-bold uppercase">
                      {userName ? userName.charAt(0) : "U"}
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      {userName ? userName.split(" ")[0] : "User"}
                    </span>
                    <span className="text-xs text-gray-400">▾</span>
                  </button>

                {open && (
                  <div
                    className="
                      absolute
                      right-0
                      top-14
                      bg-white
                      shadow-xl
                      rounded-2xl
                      border
                      min-w-[240px]
                      overflow-hidden
                      z-50
                    "
                  >
                    <div className="px-4 py-4 border-b">
                      <p className="font-semibold">
                        {userName}
                      </p>

                      <p className="text-sm text-gray-500 capitalize">
                        {role === "agent" ? "Agent / Broker" : role === "seller" ? "Owner / Seller" : role === "admin" ? "Administrator" : "Buyer"}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="
                        block
                        px-4
                        py-3
                        hover:bg-gray-50
                      "
                      onClick={() => setOpen(false)}
                    >
                      My Profile
                    </Link>

                    <Link
                      href="/my-properties"
                      className="
                        block
                        px-4
                        py-3
                        hover:bg-gray-50
                      "
                      onClick={() => setOpen(false)}
                    >
                      My Properties
                    </Link>

                    <Link
                      href="/post-property"
                      className="
                        block
                        px-4
                        py-3
                        hover:bg-gray-50
                        text-[#C89B1C]
                        font-medium
                      "
                      onClick={() => setOpen(false)}
                    >
                      + List Property
                    </Link>

                    <button
                      onClick={logout}
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        text-red-500
                        hover:bg-red-50
                        cursor-pointer
                      "
                    >
                      Logout
                    </button>
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