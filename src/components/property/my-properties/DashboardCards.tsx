"use client";

import { motion } from "framer-motion";

interface Props {
  total: number;
  active: number;
  views: number;
  enquiries: number;
  onEnquiriesClick?: () => void;
}

export default function DashboardCards({
  total,
  active,
  views,
  enquiries,
  onEnquiriesClick,
}: Props) {
  const cards = [
    {
      title: "Total Listed",
      value: total,
      colorClass: "text-[#9A720C]",
      onClick: undefined,
    },
    {
      title: "Active",
      value: active,
      colorClass: "text-green-600",
      onClick: undefined,
    },
    {
      title: "Total Views",
      value: views,
      colorClass: "text-blue-600",
      onClick: undefined,
    },
    {
      title: "Enquiries",
      value: enquiries,
      colorClass: "text-[#B88A1A]",
      onClick: onEnquiriesClick,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: index * 0.08,
            duration: 0.35,
          }}
          whileHover={{
            y: card.onClick ? -4 : -2,
            scale: card.onClick ? 1.01 : 1,
          }}
          onClick={card.onClick}
          className={`bg-white rounded-2xl p-4 sm:p-6 border shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col justify-center text-center sm:text-left ${
            card.onClick
              ? "cursor-pointer border-[#E8DCC1] hover:border-[#B88A1A] hover:bg-[#FFFDF8]"
              : "border-[#ECE7DB]"
          }`}
        >
          <span className={`text-2xl sm:text-4xl font-bold  ${card.colorClass}`}>
            {card.value}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-1 sm:mt-1.5 tracking-wide">
            {card.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
}