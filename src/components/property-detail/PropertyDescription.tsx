"use client";

import { useState } from "react";

import {
  Calendar,
  Clock3,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function PropertyDescription({ property }: Props) {
  const [expanded, setExpanded] = useState(false);
  const description = property.description || "Stunning residence in the heart of prime location offering breathtaking views. This premium residence features high-end finishes, modular kitchen with premium appliances, and floor-to-ceiling windows. The society offers world-class amenities including a rooftop pool and fully equipped gymnasium.";

  const shouldShowButton = description.length > 350;
  const displayDescription = expanded ? description : description.slice(0, 350);

  return (
    <div className="py-3 border-b border-[#ECE7DB] space-y-3">
      <div>
        <h2 className="text-base font-bold font-serif text-[#161616]">
          About This Property
        </h2>

        <p className="text-xs text-gray-600 leading-relaxed font-medium mt-2">
          {displayDescription}
          {!expanded && shouldShowButton && "..."}
        </p>

        {shouldShowButton && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#9A720C] font-semibold hover:underline cursor-pointer mt-1"
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>

      {/* Negotiable & Ready to Meet badges */}
      <div className="flex flex-wrap gap-2 pt-1">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
          property.ownerNegotiable
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-gray-50 border-gray-200 text-gray-500"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${property.ownerNegotiable ? "bg-green-500" : "bg-gray-400"}`} />
          {property.ownerNegotiable ? "Price Negotiable" : "Non-Negotiable"}
        </span>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
          property.ownerReadyToMeet
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-gray-50 border-gray-200 text-gray-500"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${property.ownerReadyToMeet ? "bg-amber-500" : "bg-gray-400"}`} />
          {property.ownerReadyToMeet ? "Owner Ready to Meet" : "Owner Prefers Indirect Meeting"}
        </span>
      </div>
    </div>
  );
}