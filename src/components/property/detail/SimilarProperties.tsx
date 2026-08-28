"use client";

import { useRouter } from "next/navigation";
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

  const city = validProperties[0]?.city || "Mumbai";

  return (
    <div className="py-6 space-y-5 border-t border-[#ECE7DB] mt-6">
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#161616]">
        Similar Properties in {city}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            const bhkStr = item.bedrooms ? `${item.bedrooms} BHK` : "";
            const typeStr = item.propertyType || "Apartment";
            const mainTypeBhk = `${typeStr} ${bhkStr}`.trim();
            const locStr = item.locality || item.city || "";
            title = locStr ? `${mainTypeBhk} — ${locStr}` : mainTypeBhk;
          }

          // Format sub-text e.g. "4 BHK · 5,500 sq ft"
          const detailParts: string[] = [];
          if (!isPlot && !isCommercial && item.bedrooms) {
            detailParts.push(`${item.bedrooms} BHK`);
          }
          const areaVal = isPlot ? item.plotArea : item.area;
          if (areaVal) {
            detailParts.push(`${areaVal.toLocaleString("en-IN")} sq ft`);
          }
          const detailsStr = detailParts.join(" · ");

          return (
            <div
              key={item._id}
              onClick={() => router.push(`/property-detail/${item._id}`)}
              className="bg-white rounded-[20px] border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col w-full max-w-[300px] overflow-hidden"
            >
              {/* Photo Header */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={mainPhoto}
                  alt={item.propertyType || "Property"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col space-y-1 bg-white">
                {/* Price in Gold */}
                <div className="text-[#C89B1C] text-lg sm:text-xl font-bold tracking-tight">
                  {formatPrice(item.price)}
                </div>

                {/* Title */}
                <h4
                  className="text-base font-semibold text-gray-900 truncate"
                  title={title}
                >
                  {title}
                </h4>

                {/* Subtitle / Spec details */}
                {detailsStr && (
                  <p className="text-sm text-gray-500 font-normal truncate">
                    {detailsStr}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}