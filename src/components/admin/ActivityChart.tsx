"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { motion } from "framer-motion";

interface MonthlyStat {
  month: string;
  properties: number;
}

interface ActivityChartProps {
  monthlyStats?: MonthlyStat[];
  loading?: boolean;
}

export default function ActivityChart({ monthlyStats = [], loading }: ActivityChartProps) {
  const chartData = monthlyStats.length > 0
    ? monthlyStats
    : [
        { month: "Jan", properties: 0 },
        { month: "Feb", properties: 0 },
        { month: "Mar", properties: 0 },
        { month: "Apr", properties: 0 },
        { month: "May", properties: 0 },
        { month: "Jun", properties: 0 },
        { month: "Jul", properties: 0 },
        { month: "Aug", properties: 0 },
        { month: "Sep", properties: 0 },
        { month: "Oct", properties: 0 },
        { month: "Nov", properties: 0 },
        { month: "Dec", properties: 0 },
      ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="bg-white rounded-3xl border border-[#ECE7DB] p-8 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-bold text-[#161616]"
          >
            Property Listings
          </h2>

          <p className="text-gray-500 mt-2">
            Monthly property publishing statistics
          </p>
        </div>

        <div className="text-xs font-semibold text-[#C89B1C] bg-[#FFF9EC] px-3 py-1.5 rounded-lg border border-[#F5E8C7]">
          Trailing 12 Months
        </div>
      </div>

      <div className="mt-8 h-[380px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Loading chart analytics...
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="gold"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#C89B1C"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="#C89B1C"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F0ECE2"
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#666",
                }}
              />

              <YAxis
                tick={{
                  fill: "#666",
                }}
                allowDecimals={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="properties"
                stroke="#C89B1C"
                strokeWidth={4}
                fill="url(#gold)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}