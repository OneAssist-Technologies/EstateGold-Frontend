"use client";

import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import UserManagement from "@/src/components/admin/user-management/UserManagement";

export default function UserManagementPage() {
  return (
    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <UserManagement />
        </main>
      </div>
    </div>
  );
}
