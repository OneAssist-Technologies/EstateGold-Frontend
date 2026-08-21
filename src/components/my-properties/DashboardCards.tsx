"use client";

import { motion } from "framer-motion";

interface Props {
  total: number;
  active: number;
  views: number;
  enquiries: number;
}

export default function DashboardCards({
  total,
  active,
  views,
  enquiries,
}: Props) {
  const cards = [
    {
      title: "Total Listed",
      value: total,
      colorClass: "text-[#9A720C]",
    },
    {
      title: "Active",
      value: active,
      colorClass: "text-green-600",
    },
    {
      title: "Total Views",
      value: views,
      colorClass: "text-blue-600",
    },
    {
      title: "Enquiries",
      value: enquiries,
      colorClass: "text-[#B88A1A]",
    },
  ];

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
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
            y: -2,
          }}
          className="bg-white rounded-2xl p-6 border border-[#ECE7DB] shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col justify-center"
        >
          <span className={`text-4xl font-bold  ${card.colorClass}`}>
            {card.value}
          </span>
          <span className="text-xs font-semibold text-gray-500 mt-1.5 tracking-wide">
            {card.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
}