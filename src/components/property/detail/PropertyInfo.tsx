"use client";

import {
  MapPin,
  Calendar,
  Share2,
  Heart,
  Flag,
  BadgeCheck,
  Hash,
  Sparkles,
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

  const isRent = (property.purpose || "").toLowerCase().includes("rent") || (property.purpose || "").toLowerCase().includes("lease");

  const isUnderConstruction = /under construction|new launch|near completion/i.test((property as any).constructionStatus || "");
  const isNewAge = /0-1|0|1|under 1|new/i.test((property as any).propertyAge || "");
  const isNewProject = isUnderConstruction || isNewAge;

  const getStatusText = (status?: string) => {
    switch ((status || "on_sale").toLowerCase()) {
      case "hold":
        return "On Hold";
      case "sold":
        return isRent ? "Rented" : "Sold";
      case "rented":
        return "Rented";
      default:
        return isRent ? "Available for Rent" : "On Sale";
    }
  };

  return (
    <div className="py-3 border-b border-[#ECE7DB] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      {/* Title & Location */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-[#161616] leading-tight">
          {displayTitle}
        </h1>

        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pt-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400 shrink-0" />
            <span>
              {property.locality ? `${property.locality}, ` : ""}
              {property.city}
            </span>
          </div>

          <span className="text-gray-300">•</span>

          <div className="inline-flex items-center gap-1.5 font-bold text-xs">
            <span className="text-gray-500 font-normal">Status:</span>
            <span
              className={
                property.availabilityStatus === "hold"
                  ? "text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider text-[10px]"
                  : property.availabilityStatus === "sold"
                  ? "text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200 uppercase tracking-wider text-[10px]"
                  : property.availabilityStatus === "rented"
                  ? "text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider text-[10px]"
                  : "text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider text-[10px]"
              }
            >
              {getStatusText(property.availabilityStatus)}
            </span>
          </div>

          {isNewProject && (
            <>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#9A720C] bg-[#FFF9EC] border border-[#F4E3B5] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles size={11} /> NEW PROJECT
              </span>
            </>
          )}
        </div>
      </div>

      {/* Price & Rate */}
      <div className="text-left sm:text-right shrink-0">
        <div className="text-2xl sm:text-3xl font-bold text-[#9A720C]">
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