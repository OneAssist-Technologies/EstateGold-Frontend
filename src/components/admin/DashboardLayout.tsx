"use client";

import { motion } from "framer-motion";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import DashboardCards from "./DashboardCards";
import ActivityChart from "./ActivityChart";
import PropertyTypesCard from "./PropertyTypeCard";
import PendingApprovalCard from "./PendingApprovalCard";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden">

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
        >

          {/* Header */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8"
          >

            <h1
              className="
                text-4xl
                font-bold
                text-[#161616]
              "
            >
              Dashboard Overview
            </h1>

            <p className="text-gray-500 mt-2">
              Wednesday, 17 June 2026
            </p>

          </motion.div>

          {/* Stats */}

          <DashboardCards />

          {/* Grid */}

          <div
            className="
              mt-8
              grid
              grid-cols-12
              gap-8
            "
          >

            {/* Chart */}

            <div className="col-span-8">

              <ActivityChart />

            </div>

            {/* Property Types */}

            <div className="col-span-4">

              <PropertyTypesCard />

            </div>

          </div>

          {/* Pending */}

          <div className="mt-8">

            <PendingApprovalCard />

          </div>

        </main>

      </div>

    </div>
  );
}