"use client";

import { motion } from "framer-motion";

export type PropertyStatus =
  | "all"
  | "active"
  | "pending"
  | "inactive"
  | "rejected";

interface Counts {
  all: number;
  active: number;
  pending: number;
  inactive: number;
  rejected: number;
}

interface Props {
  activeTab: PropertyStatus;

  setActiveTab: (
    value: PropertyStatus
  ) => void;

  counts: Counts;
}

export default function StatusTabs({
  activeTab,
  setActiveTab,
  counts,
}: Props) {
  const tabs = [
    {
      key: "all",
      label: "All Properties",
      count: counts.all,
    },
    {
      key: "active",
      label: "Active",
      count: counts.active,
    },
    {
      key: "pending",
      label: "Pending",
      count: counts.pending,
    },
    {
      key: "inactive",
      label: "Inactive",
      count: counts.inactive,
    },
    {
      key: "rejected",
      label: "Rejected",
      count: counts.rejected,
    },
  ] as const;

  return (
    <div
      className="bg-white border border-[#E8DCC1] rounded-2xl p-2 mt-8 mb-8"
    >
      <div className="flex flex-wrap sm:flex-nowrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
        {tabs.map((tab) => {
          const active =
            activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key)
              }
              className="relative px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-xs sm:text-sm flex-1 sm:flex-none text-center"
            >
              {active && (
                <motion.div
                  layoutId="activeTab"
                  transition={{
                    duration: 0.25,
                  }}
                  className="absolute inset-0 rounded-xl bg-[#C89B1C]"
                />
              )}

              <div
                className={`
                  relative
                  z-10
                  flex
                  items-center
                  gap-3
                  ${
                    active
                      ? "text-white"
                      : "text-[#444]"
                  }
                `}
              >
                <span>
                  {tab.label}
                </span>

                <span
                  className={`
                    px-2.5
                    py-0.5
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#F5F5F5] text-gray-700"
                    }
                  `}
                >
                  {tab.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}