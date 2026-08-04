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

const data = [
  { month: "Jan", properties: 35 },
  { month: "Feb", properties: 48 },
  { month: "Mar", properties: 62 },
  { month: "Apr", properties: 58 },
  { month: "May", properties: 81 },
  { month: "Jun", properties: 96 },
  { month: "Jul", properties: 115 },
  { month: "Aug", properties: 130 },
  { month: "Sep", properties: 122 },
  { month: "Oct", properties: 141 },
  { month: "Nov", properties: 165 },
  { month: "Dec", properties: 190 },
];

export default function ActivityChart() {
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
      className="
        bg-white
        rounded-3xl
        border
        border-[#ECE7DB]
        p-8
        shadow-sm
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <h2
            className="
              text-2xl
              font-bold
              text-[#161616]
            "
          >
            Property Listings
          </h2>

          <p className="text-gray-500 mt-2">
            Monthly property publishing statistics
          </p>

        </div>

        <select
          className="
            h-11
            rounded-xl
            border
            border-[#ECE7DB]
            px-4
            outline-none
          "
        >
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>

      </div>

      <div className="mt-8 h-[380px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>

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

      </div>

    </motion.div>
  );
}