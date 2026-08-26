"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Home,
  Warehouse,
  Landmark,
  Map,
} from "lucide-react";

interface PropertyTypeStat {
  type: string;
  count: number;
}

interface PropertyTypesCardProps {
  propertyTypes?: PropertyTypeStat[];
  totalProperties?: number;
  loading?: boolean;
}

const getPropertyTypeMeta = (type: string) => {
  const normalized = type.toLowerCase();
  if (normalized.includes("apartment") || normalized.includes("flat")) {
    return {
      label: "Apartment",
      icon: <Building2 size={20} className="text-[#C89B1C]" />,
      color: "#C89B1C",
    };
  }
  if (normalized.includes("house") || normalized.includes("independent")) {
    return {
      label: "Independent House",
      icon: <Home size={20} className="text-[#C89B1C]" />,
      color: "#D8B75A",
    };
  }
  if (normalized.includes("villa")) {
    return {
      label: "Villa",
      icon: <Warehouse size={20} className="text-[#C89B1C]" />,
      color: "#B68A15",
    };
  }
  if (normalized.includes("commercial") || normalized.includes("office") || normalized.includes("shop")) {
    return {
      label: "Commercial",
      icon: <Landmark size={20} className="text-[#C89B1C]" />,
      color: "#A3780F",
    };
  }
  if (normalized.includes("plot") || normalized.includes("land")) {
    return {
      label: "Plot",
      icon: <Map size={20} className="text-[#C89B1C]" />,
      color: "#8B630B",
    };
  }
  return {
    label: type || "Other",
    icon: <Building2 size={20} className="text-[#C89B1C]" />,
    color: "#C89B1C",
  };
};

export default function PropertyTypesCard({
  propertyTypes = [],
  totalProperties = 0,
  loading,
}: PropertyTypesCardProps) {
  const total = totalProperties || propertyTypes.reduce((acc, item) => acc + item.count, 0) || 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl sm:rounded-3xl border border-[#ECE7DB] p-4 sm:p-7 shadow-xs h-full max-h-[536px] flex flex-col"
    >
      <div className="mb-5 sm:mb-8 shrink-0">
        <h2 className="text-lg sm:text-2xl font-bold text-[#161616]">
          Property Types
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Distribution of active listings
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm flex-1 flex items-center justify-center">
          Loading property types...
        </div>
      ) : propertyTypes.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm flex-1 flex items-center justify-center">
          No property data available.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {propertyTypes.map((item) => {
            const meta = getPropertyTypeMeta(item.type);
            const percentage = (item.count / total) * 100;

            return (
              <div key={item.type}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#FFF9EC] border border-[#F5E8C7] flex items-center justify-center">
                      {meta.icon}
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-[#161616] capitalize">
                        {meta.label}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.count} Properties
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
                    style={{ background: meta.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}