"use client";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import LocationManagement from "@/src/components/admin/locations/LocationManagement";

export default function LocationsPage() {
  return <div className="flex h-screen bg-[#F7F6F3] overflow-hidden">
    
          {/* Sidebar */}
    
          <AdminSidebar />
    
          {/* Content */}
    
          <div className="flex-1 flex flex-col overflow-hidden">
    
            <AdminNavbar /> 
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <LocationManagement />
          </main>
            </div></div>;
}