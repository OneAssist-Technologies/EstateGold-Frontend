"use client";

import {
  BedDouble,
  Bath,
  Building2,
  Home,
  Sofa,
  Car,
  Layers3,
  Ruler,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function PropertyFeatures({ property }: Props) {
  const features = [
    {
      icon: <BedDouble size={16} />,
      title: "Bedrooms",
      value: property.bedrooms ? `${property.bedrooms} BHK` : "N/A",
    },
    {
      icon: <Bath size={16} />,
      title: "Bathrooms",
      value: property.bathrooms ? `${property.bathrooms} Bath` : "N/A",
    },
    {
      icon: <Ruler size={16} />,
      title: "Area",
      value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A",
    },
    {
      icon: <Layers3 size={16} />,
      title: "Floor",
      value: property.floor !== undefined ? `${property.floor}th Floor` : "Ground Floor",
    },
    {
      icon: <Sofa size={16} />,
      title: "Furnishing",
      value: property.furnishing || "Unfurnished",
    },
    {
      icon: <Car size={16} />,
      title: "Parking",
      value: property.parking ? "Available" : "Available",
    },
    {
      icon: <Home size={16} />,
      title: "Type",
      value: property.propertyType || "Apartment",
    },
    {
      icon: <Building2 size={16} />,
      title: "Status",
      value: "Verified",
    },
  ];

  return (
    <div className="py-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-[#FFFDF6] border border-[#F4E3B5] rounded-xl p-3 flex items-center gap-3 transition-all hover:border-[#9A720C]"
          >
            <div className="h-8 w-8 rounded-lg bg-[#FFF9EC] text-[#9A720C] flex items-center justify-center shrink-0 border border-[#F4E3B5]">
              {item.icon}
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider leading-none">
                {item.title}
              </span>
              <span className="text-xs font-bold text-gray-900 block truncate mt-1">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}