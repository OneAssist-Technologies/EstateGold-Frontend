"use client";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";

interface Props {
  status: "pending" | "approved" | "rejected";
}

export default function PropertyStatusBadge({
  status,
}: Props) {
  const config = {
    pending: {
      text: "Pending",
      icon: <Clock3 size={14} />,
      className:
        "bg-amber-100 text-amber-700 border border-amber-200",
    },

    approved: {
      text: "Approved",
      icon: <CheckCircle2 size={14} />,
      className:
        "bg-green-100 text-green-700 border border-green-200",
    },

    rejected: {
      text: "Rejected",
      icon: <XCircle size={14} />,
      className:
        "bg-red-100 text-red-700 border border-red-200",
    },
  };

  const item = config[status];

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