"use client";

import { use } from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import ModifyServiceArea from "@/src/components/admin/locations/ModifyServiceArea";

export default function ModifyServiceAreaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <ModifyServiceArea locationId={resolvedParams.id} />
        </main>
      </div>
    </div>
  );
}
