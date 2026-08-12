"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import DashboardCards from "./DashboardCards";
import ActivityChart from "./ActivityChart";
import PropertyTypesCard from "./PropertyTypeCard";
import PendingApprovalCard from "./PendingApprovalCard";
import { getDashboard } from "@/src/services/adminPropertyService";

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashboard();
      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!children) {
      fetchDashboardData();
    }
  }, [children]);

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto">
          {children ? (
            children
          ) : (
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8"
              >
                <h1 className="text-2xl sm:text-4xl font-bold text-[#161616]">
                  Dashboard Overview
                </h1>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  {todayStr}
                </p>
              </motion.div>

              {/* Stats Cards */}
              <DashboardCards stats={data} loading={loading} />

              {/* Grid Layout */}
              <div className="mt-6 sm:mt-8 grid grid-cols-12 gap-6 lg:gap-8">
                {/* Chart */}
                <div className="col-span-12 lg:col-span-8">
                  <ActivityChart monthlyStats={data?.monthlyStats} loading={loading} />
                </div>

                {/* Property Types */}
                <div className="col-span-12 lg:col-span-4">
                  <PropertyTypesCard
                    propertyTypes={data?.propertyTypes}
                    totalProperties={data?.totalProperties}
                    loading={loading}
                  />
                </div>
              </div>

              {/* Pending Approval Section */}
              <div className="mt-6 sm:mt-8">
                <PendingApprovalCard
                  pendingProperties={data?.pendingProperties}
                  loading={loading}
                  onRefresh={fetchDashboardData}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}