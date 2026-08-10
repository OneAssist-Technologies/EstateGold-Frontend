"use client";

import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import AnalyticsContent from "@/src/components/admin/analytics/AnalyticsContent";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden">
      {/* Sidebar - UNTOUCHED */}
      <AdminSidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnalyticsContent />
        </main>
      </div>
    </div>
  );
}
