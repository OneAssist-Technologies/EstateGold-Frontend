"use client";

import { motion } from "framer-motion";

interface Props {
  active: string;
  onChange: (value: string) => void;

  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    delete_requests?: number;
  };
}

export default function PropertyTabs({
  active,
  onChange,
  counts,
}: Props) {
  const tabs = [
    {
      key: "all",
      label: "All",
      count: counts.all,
    },
    {
      key: "pending",
      label: "Pending",
      count: counts.pending,
    },
    {
      key: "approved",
      label: "Approved",
      count: counts.approved,
    },
    {
      key: "rejected",
      label: "Rejected",
      count: counts.rejected,
    },
    {
      key: "delete_requests",
      label: "Delete Requests",
      count: counts.delete_requests || 0,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5">

      {tabs.map((tab) => {

        const selected =
          active === tab.key;

        return (

          <motion.button
            key={tab.key}
            whileTap={{
              scale: .96,
            }}
            whileHover={{
              y: -1,
            }}
            onClick={() =>
              onChange(tab.key)
            }
            className={`
              relative
              h-10
              rounded-full
              px-5
              flex
              items-center
              gap-2
              text-sm
              font-medium
              transition-all
              ${
                selected
                  ? "bg-[#C89B1C] text-white shadow-md"
                  : "bg-white border border-[#E8E3D8] hover:border-[#C89B1C]"
              }
            `}
          >

            {tab.label}

            <span
              className={`
                h-6
                min-w-[24px]
                px-2
                rounded-full
                flex
                items-center
                justify-center
                text-xs
                font-semibold
                ${
                  selected
                    ? "bg-white/20"
                    : "bg-[#F4F2ED] text-gray-600"
                }
              `}
            >
              {tab.count}
            </span>

          </motion.button>

        );

      })}

    </div>
  );
}