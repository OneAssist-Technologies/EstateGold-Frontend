"use client";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import PropertyManagement from "@/src/components/admin/property-management/PropertyManagement";

export default function PropertyManagementPage() {
  return    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden">
  
        {/* Sidebar */}
  
        <AdminSidebar />
  
        {/* Content */}
  
        <div className="flex-1 flex flex-col overflow-hidden">
  
          <AdminNavbar /> 
        <main
          className="
            flex-1
            overflow-y-auto
            p-8
          "
        ><PropertyManagement /></main>
          </div></div>;
}