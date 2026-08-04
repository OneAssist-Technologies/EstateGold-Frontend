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

export default function Navbar() {
 const {
  user,
  loading,
  isAuthenticated,
  logout,
} = useAuth();

  const [open, setOpen] =
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

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-[#C89B1C] flex items-center justify-center">
              <Building2
                size={20}
                className="text-white"
              />
            </div>

            <span className="text-3xl font-bold text-[#C89B1C]">
              EstateGold
            </span>
          </Link>

          {/* Menu */}

          <nav className="hidden md:flex items-center gap-10 font-medium">
            <Link href="/buy">
              Buy
            </Link>

            <Link href="/rent">
              Rent
            </Link>

            <Link href="/new-projects">
              New Projects
            </Link>

            <Link href="/commercial">
              Commercial
            </Link>

            {canManageProperties && (
              <Link href="/my-properties">
                My Properties
              </Link>
            )}
          </nav>

          {/* Right Section */}

          <div className="flex items-center gap-4">

            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="font-medium"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="
                    bg-[#C89B1C]
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    font-medium
                    hover:opacity-90
                  "
                >
                  Register Free
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                {canManageProperties && (
                  <Link
                    href="/post-property"
                    className="
                      border
                      border-[#C89B1C]
                      text-[#C89B1C]
                      px-5
                      py-3
                      rounded-xl
                      font-medium
                      hover:bg-[#FFF8E6]
                    "
                  >
                    + List Property
                  </Link>
                )}

                <div
                  ref={dropdownRef}
                  className="relative"
                >
                  <button
                    onClick={() =>
                      setOpen(
                        !open
                      )
                    }
                    className="
                      h-11
                      w-11
                      rounded-full
                      bg-[#C89B1C]
                      text-white
                      flex
                      items-center
                      justify-center
                      hover:opacity-90
                    "
                  >
                    {userName ? (
                      <span className="font-semibold">
                        {userName
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    ) : (
                      <UserCircle2
                        size={22}
                      />
                    )}
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
                          {
                            userName
                          }
                        </p>

                        <p className="text-sm text-gray-500 capitalize">
                          {role}
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
                        onClick={() =>
                          setOpen(
                            false
                          )
                        }
                      >
                        My Profile
                      </Link>

                      {canManageProperties && (
                        <>
                          <Link
                            href="/my-properties"
                            className="
                              block
                              px-4
                              py-3
                              hover:bg-gray-50
                            "
                            onClick={() =>
                              setOpen(
                                false
                              )
                            }
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
                            "
                            onClick={() =>
                              setOpen(
                                false
                              )
                            }
                          >
                            List Property
                          </Link>
                        </>
                      )}

                      <button
                        onClick={
                          logout
                        }
                        className="
                          w-full
                          text-left
                          px-4
                          py-3
                          text-red-500
                          hover:bg-red-50
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