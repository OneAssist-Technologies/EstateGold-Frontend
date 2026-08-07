"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Home,
  Warehouse,
  Landmark,
  Map,
} from "lucide-react";

interface PropertyType {
  title: string;
  value: number;
  total: number;
  color: string;
  icon: React.ReactNode;
}

export default function PropertyTypesCard() {
  const propertyTypes: PropertyType[] = [
    {
      title: "Apartment",
      value: 482,
      total: 600,
      color: "#C89B1C",
      icon: <Building2 size={20} className="text-[#C89B1C]" />,
    },
    {
      title: "Independent House",
      value: 295,
      total: 600,
      color: "#D8B75A",
      icon: <Home size={20} className="text-[#C89B1C]" />,
    },
    {
      title: "Villa",
      value: 168,
      total: 600,
      color: "#B68A15",
      icon: <Warehouse size={20} className="text-[#C89B1C]" />,
    },
    {
      title: "Commercial",
      value: 124,
      total: 600,
      color: "#A3780F",
      icon: <Landmark size={20} className="text-[#C89B1C]" />,
    },
    {
      title: "Plot",
      value: 86,
      total: 600,
      color: "#8B630B",
      icon: <Map size={20} className="text-[#C89B1C]" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl border border-[#ECE7DB] p-7 shadow-xs h-full"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#161616]">
          Property Types
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Distribution of active listings
        </p>
      </div>

      <div className="space-y-6">
        {propertyTypes.map((item) => {
          const percentage = (item.value / item.total) * 100;

          return (
            <div key={item.title}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#FFF9EC] border border-[#F5E8C7] flex items-center justify-center">
                    {item.icon}
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-[#161616]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {item.value} Properties
                    </p>
                  </div>
                </div>

                <span className="font-bold text-sm text-[#161616]">
                  {Math.round(percentage)}%
                </span>
              </div>

              <div className="mt-2.5 h-2 rounded-full bg-[#F5F2EC] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}