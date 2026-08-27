"use client";

import { useRouter } from "next/navigation";
import { Property } from "@/src/types/property";
import { BedDouble, Maximize } from "lucide-react";

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

  // Filter out any draft, unapproved, or invalid price=0 properties
  const validProperties = (properties || []).filter(
    (item) =>
      item &&
      item._id &&
      item.price &&
      item.price > 0 &&
      item.status !== "draft" &&
      (item as any).isDraft !== true
  );

  if (validProperties.length === 0) return null;

  const city = validProperties[0]?.city || "City";

  return (
    <div className="py-4 space-y-3 border-t border-[#ECE7DB] mt-4">
      <h2 className="text-base font-bold text-[#161616]">
        Similar Properties in {city}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {validProperties.slice(0, 4).map((item) => {
          const mainPhoto =
            item.photos && item.photos.length > 0
              ? item.photos[0].startsWith("http")
                ? item.photos[0]
                : `http://localhost:5000/uploads/properties/${item.photos[0]}`
              : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

          const isPlot = item.propertyType === "Plot / Land";
          const isCommercial = item.propertyType === "Commercial Space";

          let title = "";

          if (isPlot) {
            title = `${item.propertyType} — ${item.locality || item.city || "Local"}`;
          } else if (isCommercial) {
            title = `${(item as any).commercialType || item.propertyType} — ${item.locality || item.city || "Local"}`;
          } else {
            title = `${item.bedrooms ? `${item.bedrooms} BHK ` : ""}${item.propertyType} — ${item.locality || item.city || "Local"}`;
          }

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

                <div className="absolute bottom-2 left-2 bg-[#9A720C]/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                  {formatPrice(item.price)}
                </div>
              </div>

              <div className="p-3 space-y-1">
                <h4 className="text-xs font-bold text-gray-900 truncate">
                  {title}
                </h4>
                <div className="flex items-center gap-3.5 text-[10px] text-gray-500 font-semibold mt-1">
                  {isPlot ? (
                    <span className="flex items-center gap-1">
                      <Maximize size={12} className="text-[#C89B1C]" />
                      {item.plotArea ? `${item.plotArea.toLocaleString()} sq ft` : "Plot Area"}
                    </span>
                  ) : isCommercial ? (
                    <span className="flex items-center gap-1">
                      <Maximize size={12} className="text-[#C89B1C]" />
                      {item.area ? `${item.area.toLocaleString()} sq ft` : "Built Area"}
                    </span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1">
                        <BedDouble size={12} className="text-[#C89B1C]" />
                        {item.bedrooms || 0} Beds
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Maximize size={12} className="text-[#C89B1C]" />
                        {item.area ? `${item.area.toLocaleString()} sq ft` : "N/A"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}