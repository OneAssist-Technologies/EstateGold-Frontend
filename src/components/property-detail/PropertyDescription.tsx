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
    <div className="py-3 border-b border-[#ECE7DB] space-y-2">
      <h2 className="text-base font-bold font-serif text-[#161616]">
        About This Property
      </h2>

      <p className="text-xs text-gray-600 leading-relaxed font-medium">
        {displayDescription}
        {!expanded && shouldShowButton && "..."}
      </p>

      {shouldShowButton && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[#9A720C] font-semibold hover:underline cursor-pointer"
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
}