"use client";

import {
  BedDouble,
  Bath,
  Heart,
  MapPin,
} from "lucide-react";
import { Property } from "../../types/property";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  property: Property;
}
function formatPrice(price?: number): string {
  if (price === undefined || price === null || isNaN(price)) return "₹0";
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

export default function PropertyCard({ property }: Props) {
  const router = useRouter();

  const getPhotoUrl = (raw?: string) => {
    if (!raw) return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    const clean = raw.replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "");
    return `http://localhost:5000/uploads/properties/${clean}`;
  };

  const photoUrl = getPhotoUrl(property.photos?.[0]);

  const displayTitle =
    property.bedrooms && property.propertyType
      ? `${property.bedrooms} BHK ${property.propertyType}${
          property.locality ? " in " + property.locality : ""
        }`
      : property.propertyType || "Luxury Property";

  const isSale =
    (property.purpose || "").toLowerCase() === "sale" ||
    (property.purpose || "").toLowerCase() === "buy" ||
    (property.purpose || "").toLowerCase() === "sell" ||
    (property.purpose || "").toLowerCase() === "for sale";

  const isVideo = (url: string) => {
    if (!url) return false;
    const clean = url.toLowerCase().split("?")[0];
    return (
      clean.endsWith(".mp4") ||
      clean.endsWith(".webm") ||
      clean.endsWith(".ogg") ||
      clean.endsWith(".mov") ||
      clean.endsWith(".m4v") ||
      clean.endsWith(".mkv")
    );
  };

  const isCoverVideo = isVideo(photoUrl);

  return (
    <div
      onClick={() => router.push(`/property-detail/${property._id}`)}
      className="bg-white rounded-2xl border border-[#ECE7DB] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Section */}
      <div className="relative h-[210px] sm:h-[220px] w-full overflow-hidden bg-gray-900">
        {isCoverVideo ? (
          <video
            src={photoUrl}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
        ) : (
          <img
            src={photoUrl}
            alt={displayTitle}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Gradient Overlay for Price Visibility */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <span className="bg-[#9A720C] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
            {isSale ? "For Sale" : "For Rent"}
          </span>

          {property.availabilityStatus === "hold" && (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
              <span>🔒</span> On Hold
            </span>
          )}

          {property.availabilityStatus === "sold" && (
            <span className="bg-gray-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
              <span>✓</span> Sold
            </span>
          )}

          <span className="bg-[#0DBB58] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
            <span className="text-[10px]">✓</span> Verified
          </span>
        </div>

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 shadow-2xs transition-colors cursor-pointer"
        >
          <Heart size={16} />
        </button>

        {/* Price Overlay on Bottom-Left */}
        <div className="absolute bottom-3 left-3.5 text-white font-serif text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-md">
          {formatPrice(property.price)}
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-[#9A720C] transition-colors">
            {displayTitle}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span className="line-clamp-1">
              {property.locality ? `${property.locality}, ` : ""}
              {property.city}
            </span>
          </div>
        </div>

        {/* Specs Row */}
        <div className="border-t border-[#F2EFE9] pt-3 flex items-center justify-between text-xs text-gray-600 font-medium">
          <div className="flex items-center gap-3">
            <span>{property.bedrooms || 0} Beds</span>
            <span>•</span>
            <span>{property.bathrooms || 0} Baths</span>
            <span>•</span>
            <span>{(property.area || 0).toLocaleString()} sq ft</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#FAFAF8] border border-[#E8E1D4] text-[10px] font-semibold text-gray-500">
            {property.furnishing === "Fully Furnished"
              ? "Fully"
              : property.furnishing === "Semi Furnished"
              ? "Semi"
              : property.furnishing || "Unfurnished"}
          </span>
        </div>
      </div>
    </div>
  );
}