"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Clock3,
  Users,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change: string;
  positive?: boolean;
}

function StatCard({
  title,
  value,
  icon,
  color,
  change,
  positive = true,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.2,
      }}
      className="bg-white rounded-3xl border border-[#ECE7DB] p-6 shadow-sm"
    >
      <div className="flex justify-between items-start">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2
            className="text-4xl font-bold mt-3 text-[#161616]"
          >
            {value}
          </h2>

        </div>

        <div
          className={`
            h-16
            w-16
            rounded-2xl
            flex
            items-center
            justify-center
            ${color}
          `}
        >
          {icon}
        </div>

      </div>

      <div className="mt-6 flex items-center gap-2">

        {positive ? (
          <TrendingUp
            size={18}
            className="text-green-600"
          />
        ) : (
          <TrendingDown
            size={18}
            className="text-red-600"
          />
        )}

        <span
          className={`
            text-sm
            font-medium
            ${
              positive
                ? "text-green-600"
                : "text-red-600"
            }
          `}
        >
          {change}
        </span>

      </div>
    </motion.div>
  );
}

interface DashboardCardsProps {
  stats?: {
    totalProperties: number;
    pending: number;
    users: number;
    verifiedAgents: number;
    approved?: number;
    rejected?: number;
  } | null;
  loading?: boolean;
}

export default function DashboardCards({ stats, loading }: DashboardCardsProps) {
  const cards = [
    {
      title: "Total Properties",
      value: loading ? "..." : (stats?.totalProperties ?? 0),
      icon: (
        <Building2
          size={30}
          className="text-[#C89B1C]"
        />
      ),
      color: "bg-[#FFF7E2]",
      change: `${stats?.approved ?? 0} approved listings`,
      positive: true,
    },
    {
      title: "Pending Approval",
      value: loading ? "..." : (stats?.pending ?? 0),
      icon: (
        <Clock3
          size={30}
          className="text-orange-600"
        />
      ),
      color: "bg-[#FFF4E5]",
      change: "Requires admin review",
      positive: (stats?.pending ?? 0) === 0,
    },
    {
      title: "Total Users",
      value: loading ? "..." : (stats?.users ?? 0),
      icon: (
        <Users
          size={30}
          className="text-blue-600"
        />
      ),
      color: "bg-[#EEF5FF]",
      change: "Registered platform users",
      positive: true,
    },
    {
      title: "Verified Agents",
      value: loading ? "..." : (stats?.verifiedAgents ?? 0),
      icon: (
        <ShieldCheck
          size={30}
          className="text-green-600"
        />
      ),
      color: "bg-[#EEFFF3]",
      change: "Verified professionals",
      positive: true,
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: index * 0.1,
          }}
        >
          <StatCard
            {...card}
          />
        </motion.div>
      ))}
    </div>
  );
}