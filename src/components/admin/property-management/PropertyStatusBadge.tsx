"use client";

import { CheckCircle2, Clock3, XCircle, HelpCircle } from "lucide-react";

interface Props {
  status?: string;
}

export default function PropertyStatusBadge({ status }: Props) {
  const normalizedStatus = (status || "pending").toLowerCase();

  const config: Record<string, { text: string; icon: React.ReactNode; className: string }> = {
    pending: {
      text: "Pending",
      icon: <Clock3 size={14} />,
      className: "bg-amber-100 text-amber-700 border border-amber-200",
    },
    approved: {
      text: "Approved",
      icon: <CheckCircle2 size={14} />,
      className: "bg-green-100 text-green-700 border border-green-200",
    },
    active: {
      text: "Approved",
      icon: <CheckCircle2 size={14} />,
      className: "bg-green-100 text-green-700 border border-green-200",
    },
    rejected: {
      text: "Rejected",
      icon: <XCircle size={14} />,
      className: "bg-red-100 text-red-700 border border-red-200",
    },
  };

  const item = config[normalizedStatus] || {
    text: status || "Pending",
    icon: <Clock3 size={14} />,
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${item.className}
      `}
    >
      {item.icon}
      {item.text}
    </span>
  );
}