"use client";

import { Tag, Lock, CheckCircle2 } from "lucide-react";

interface Props {
  availabilityStatus?: "on_sale" | "hold" | "sold" | string;
  className?: string;
}

export default function PropertyAvailabilityBadge({ availabilityStatus, className = "" }: Props) {
  const statusKey = (availabilityStatus || "on_sale").toLowerCase();

  const config: Record<string, { label: string; icon: React.ReactNode; badgeClass: string }> = {
    on_sale: {
      label: "On Sale",
      icon: <Tag size={13} />,
      badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    },
    hold: {
      label: "Hold",
      icon: <Lock size={13} />,
      badgeClass: "bg-amber-50 text-amber-700 border border-amber-200/80",
    },
    sold: {
      label: "Sold",
      icon: <CheckCircle2 size={13} />,
      badgeClass: "bg-gray-100 text-gray-700 border border-gray-200",
    },
    rented: {
      label: "Rented",
      icon: <CheckCircle2 size={13} />,
      badgeClass: "bg-blue-50 text-blue-700 border border-blue-200/80",
    },
  };

  const item = config[statusKey] || config.on_sale;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xs tracking-tight ${item.badgeClass} ${className}`}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
}
