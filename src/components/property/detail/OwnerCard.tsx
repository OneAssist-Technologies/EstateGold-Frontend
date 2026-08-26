"use client";

import { UserCheck, Calendar } from "lucide-react";
import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function OwnerCard({ property }: Props) {
  const ownerName = property.ownerName || "Rajesh Sharma";
  const ownerRole = (property as any).ownerRole || "Agent";
  const postedDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "10 Jan";

  return (
    <div className="py-3 border-b border-[#ECE7DB]">
      <div className="bg-white border border-[#E8E1D4] rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#9A720C] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {ownerName.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-gray-900 leading-none">
                {ownerName}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-semibold text-gray-500">
                {ownerRole}
              </span>
              <span className="text-[9px] font-bold text-[#0DBB58] bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
          <Calendar size={13} className="text-gray-400" />
          <span>Posted {postedDate}</span>
        </div>
      </div>
    </div>
  );
}
