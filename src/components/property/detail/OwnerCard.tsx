"use client";

import { Calendar } from "lucide-react";
import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function OwnerCard({ property }: Props) {
  const createdByObj =
    property.createdBy && typeof property.createdBy === "object"
      ? property.createdBy
      : null;

  const isAgent = createdByObj?.role === "agent" || (property as any).ownerRole === "agent";

  // If published by Agent: display Agent's details, NOT the property owner's details!
  // If published by Owner: display Owner's name.
  const displayName = isAgent
    ? (createdByObj?.fullName || createdByObj?.agencyName || "Listing Agent")
    : (property.ownerName || "Property Owner");

  const displayRole = isAgent ? "Agent / Broker" : "Property Owner";
  const subtitle = isAgent && createdByObj?.agencyName ? createdByObj.agencyName : null;

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
          <div className="h-10 w-10 rounded-full bg-[#9A720C] text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
            {displayName.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-gray-900 leading-none">
                {displayName}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-semibold text-gray-500">
                {displayRole} {subtitle ? `• ${subtitle}` : ""}
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
