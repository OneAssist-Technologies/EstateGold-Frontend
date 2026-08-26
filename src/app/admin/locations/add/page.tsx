"use client";

import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import AddServiceArea from "@/src/components/admin/locations/AddServiceArea";

export default function AddServiceAreaPage() {
  return (
    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AddServiceArea />
        </main>
      </div>
    </div>
  );
}
