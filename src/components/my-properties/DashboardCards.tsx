"use client";

import { motion } from "framer-motion";
import {
  Home,
  CircleCheckBig,
  Clock3,
  EyeOff,
} from "lucide-react";

interface Props {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

export default function DashboardCards({
  total,
  active,
  pending,
  inactive,
}: Props) {
  const cards = [
    {
      title: "Total Properties",
      value: total,
      icon: Home,
      bg: "bg-[#FFF8EA]",
      iconBg: "bg-[#C89B1C]",
    },
    {
      title: "Active",
      value: active,
      icon: CircleCheckBig,
      bg: "bg-[#F0FFF5]",
      iconBg: "bg-green-500",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      bg: "bg-[#FFF8E8]",
      iconBg: "bg-yellow-500",
    },
    {
      title: "Inactive",
      value: inactive,
      icon: EyeOff,
      bg: "bg-[#F6F6F6]",
      iconBg: "bg-gray-500",
    },
  ];

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
            }}
            whileHover={{
              y: -5,
              scale: 1.02,
            }}
            className={`
              ${card.bg}
              rounded-2xl
              p-4
              border
              border-[#EFE4C9]
              shadow-sm
              hover:shadow-xl
              transition-all
              duration-300
            `}
          >
            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500 text-sm font-medium">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold text-[#161616] mt-3">
                  {card.value}
                </h2>

              </div>

              <div
                className={`
                  ${card.iconBg}
                  h-16
                  w-16
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  shadow-lg
                `}
              >
                <Icon
                  size={30}
                  className="text-white"
                />
              </div>

            </div>
          </motion.div>
        );
      })}
    </div>
  );
}