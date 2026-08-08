"use client";

import {
  MapPin,
  Calendar,
  Share2,
  Heart,
  Flag,
  BadgeCheck,
  Hash,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  property: Property;

  isLoggedIn?: boolean;

  onLoginRequired?: () => void;

  onShare?: () => void;

  onFavourite?: () => void;

  onReport?: () => void;
}

function formatPrice(price?: number): string {
  if (!price || isNaN(price)) return "₹0";
  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2);
    return `₹${cr.replace(/\.00$/, "")} Cr`;
  } else if (price >= 100000) {
    const l = (price / 100000).toFixed(1);
    return `₹${l.replace(/\.0$/, "")} L`;
  } else {
    return `₹${price.toLocaleString("en-IN")}`;
  }
}

function calculatePerSqFt(price?: number, area?: number): string {
  if (!price || !area || isNaN(price) || isNaN(area) || area === 0) return "";
  const rate = Math.round(price / area);
  return `₹${rate.toLocaleString("en-IN")}/sq ft`;
}

export default function PropertyInfo({ property }: Props) {
  const displayTitle =
    property.bedrooms && property.propertyType
      ? `${property.bedrooms} BHK ${property.propertyType}${
          property.locality ? " at " + property.locality : ""
        }`
      : property.propertyType || "Luxury Property";

  const perSqFt = calculatePerSqFt(property.price, property.area);

  return (
    <div className="py-3 border-b border-[#ECE7DB] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      {/* Title & Location */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#161616] leading-tight">
          {displayTitle}
        </h1>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <MapPin size={14} className="text-gray-400 shrink-0" />
          <span>
            {property.locality ? `${property.locality}, ` : ""}
            {property.city}
          </span>
        </div>
      </div>

      {/* Price & Rate */}
      <div className="text-left sm:text-right shrink-0">
        <div className="text-2xl sm:text-3xl font-bold font-serif text-[#9A720C]">
          {formatPrice(property.price)}
        </div>
        {perSqFt && (
          <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
            {perSqFt}
          </p>
        )}
      </div>
    </div>
  );
}