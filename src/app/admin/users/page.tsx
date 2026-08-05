"use client";

import AdminSidebar from "@/src/components/admin/AdminSidebar";
import UserManagement from "@/src/components/admin/user-management/UserManagement";

export default function UserManagementPage() {
  return (
    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <UserManagement />
        </main>
      </div>
    </div>
  );
}
