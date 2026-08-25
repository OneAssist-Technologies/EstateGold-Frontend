"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const isAdminRoute = pathname.startsWith("/admin");

    if (isAdminRoute) {
      if (!user || user.role !== "admin") {
        router.replace("/login");
      }
    } else {
      // If logged-in user is an admin and tries to access any non-admin route (e.g. /, /property-listing, /post-property, etc.)
      if (user && user.role === "admin") {
        router.replace("/admin/properties");
      }
    }
  }, [user, loading, pathname, router]);

  // Block rendering of admin pages for unauthorized users
  if (!loading && pathname.startsWith("/admin") && (!user || user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center text-xs font-bold text-[#9A720C] tracking-wide">
        Redirecting to Login...
      </div>
    );
  }

  // Block rendering of user-side pages for logged-in Admin to avoid flash of content
  if (!loading && user && user.role === "admin" && !pathname.startsWith("/admin")) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center text-xs font-bold text-[#9A720C] tracking-wide">
        Redirecting to Admin Portal...
      </div>
    );
  }

  return <>{children}</>;
}
