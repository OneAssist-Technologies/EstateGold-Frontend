"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  BedDouble,
  Bath,
  Scan,
  MapPin,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  properties: Property[];
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

export default function SimilarProperties({ properties }: Props) {
  const router = useRouter();

  if (!properties || properties.length === 0) return null;

  const city = properties[0]?.city || "Mumbai";

  return (
    <div className="py-4 space-y-3 border-t border-[#ECE7DB] mt-4">
      <h2 className="text-base font-bold font-serif text-[#161616]">
        Similar Properties in {city}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {properties.slice(0, 2).map((item) => {
          const mainPhoto =
            item.photos && item.photos.length > 0
              ? item.photos[0].startsWith("http")
                ? item.photos[0]
                : `http://localhost:5000/uploads/properties/${item.photos[0]}`
              : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

          const title = `${item.bedrooms || 3} BHK ${item.propertyType || "Property"} — ${item.locality || "City"}`;

          return (
            <div
              key={item._id}
              onClick={() => router.push(`/property-detail/${item._id}`)}
              className="bg-white rounded-xl border border-[#ECE7DB] overflow-hidden hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={mainPhoto}
                  alt={item.propertyType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute bottom-2 left-2 bg-[#9A720C]/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-0.5 rounded-md font-serif">
                  {formatPrice(item.price)}
                </div>
              </div>

              <div className="p-3 space-y-1">
                <h4 className="text-xs font-bold text-gray-900 truncate font-serif">
                  {title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                  <span>🛏️ {item.bedrooms || 3} Beds</span>
                  <span>•</span>
                  <span>📐 {item.area ? `${item.area.toLocaleString()} sq ft` : "1,200 sq ft"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}