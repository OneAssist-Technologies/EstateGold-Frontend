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
  Compass,
  Calendar,
  Sparkles,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function PropertyFeatures({ property }: Props) {
  const propertyType = property.propertyType || "Apartment / Flat";
  let features: { icon: any; title: string; value: string }[] = [];

  switch (propertyType) {
    case "Apartment / Flat":
    case "Builder Floor":
      features = [
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
          icon: <Layers3 size={16} />,
          title: "Balconies",
          value: property.balconies !== undefined ? `${property.balconies} Balconies` : "N/A",
        },
        {
          icon: <Ruler size={16} />,
          title: "Built-up Area",
          value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A",
        },
        {
          icon: <Ruler size={16} />,
          title: "Carpet Area",
          value: (property as any).carpetArea ? `${(property as any).carpetArea.toLocaleString()} sq ft` : "N/A",
        },
        {
          icon: <Building2 size={16} />,
          title: "Floor",
          value: property.floor !== undefined ? `${property.floor}th of ${(property as any).totalFloors || 'N/A'} Floors` : "N/A",
        },
        {
          icon: <Sofa size={16} />,
          title: "Furnishing",
          value: property.furnishing || "N/A",
        },
        {
          icon: <Car size={16} />,
          title: "Parking",
          value: property.parking ? "Available" : "Not Available",
        },
      ];
      break;

    case "Independent House":
    case "Villa":
      features = [
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
          title: "Built-up Area",
          value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A",
        },
        {
          icon: <Ruler size={16} />,
          title: "Plot Area",
          value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A",
        },
        {
          icon: <Building2 size={16} />,
          title: "Total Floors",
          value: (property as any).totalFloors ? `${(property as any).totalFloors} Floors` : "N/A",
        },
        {
          icon: <Sofa size={16} />,
          title: "Furnishing",
          value: property.furnishing || "N/A",
        },
        {
          icon: <Car size={16} />,
          title: "Parking",
          value: property.parking ? "Available" : "Not Available",
        },
        {
          icon: <Compass size={16} />,
          title: "Facing",
          value: (property as any).facing || "N/A",
        },
        {
          icon: <Calendar size={16} />,
          title: "Property Age",
          value: (property as any).propertyAge || "N/A",
        },
      ];
      break;

    case "Plot / Land":
      features = [
        {
          icon: <Ruler size={16} />,
          title: "Plot Area",
          value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A",
        },
        {
          icon: <Compass size={16} />,
          title: "Plot Facing",
          value: (property as any).plotFacing || "N/A",
        },
        {
          icon: <Ruler size={16} />,
          title: "Road Width",
          value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A",
        },
        {
          icon: <Compass size={16} />,
          title: "Corner Plot",
          value: (property as any).cornerPlot ? "Yes" : "No",
        },
        {
          icon: <Building2 size={16} />,
          title: "Boundary Wall",
          value: (property as any).boundaryWall ? "Yes" : "No",
        },
        {
          icon: <Building2 size={16} />,
          title: "Plot Type",
          value: (property as any).plotType || "N/A",
        },
        {
          icon: <Building2 size={16} />,
          title: "Land Approval",
          value: (property as any).landApproval || "N/A",
        },
        {
          icon: <Sparkles size={16} />,
          title: "Water Source",
          value: (property as any).waterAvailability || "N/A",
        },
        {
          icon: <Sparkles size={16} />,
          title: "Electricity",
          value: (property as any).electricityAvailability || "N/A",
        },
      ];
      break;

    case "Commercial Space":
      features = [
        {
          icon: <Building2 size={16} />,
          title: "Commercial Type",
          value: (property as any).commercialType || "N/A",
        },
        {
          icon: <Ruler size={16} />,
          title: "Built-up Area",
          value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A",
        },
        {
          icon: <Ruler size={16} />,
          title: "Carpet Area",
          value: (property as any).carpetArea ? `${(property as any).carpetArea.toLocaleString()} sq ft` : "N/A",
        },
        {
          icon: <Building2 size={16} />,
          title: "Floor",
          value: property.floor !== undefined ? `${property.floor}th of ${(property as any).totalFloors || 'N/A'} Floors` : "N/A",
        },
        {
          icon: <Bath size={16} />,
          title: "Washrooms",
          value: (property as any).washrooms !== undefined ? `${(property as any).washrooms} Washrooms` : "N/A",
        },
        {
          icon: <Car size={16} />,
          title: "Parking",
          value: property.parking ? "Available" : "Not Available",
        },
        {
          icon: <Ruler size={16} />,
          title: "Entrance Width",
          value: (property as any).entranceWidth ? `${(property as any).entranceWidth} ft` : "N/A",
        },
        {
          icon: <Sparkles size={16} />,
          title: "Power Load",
          value: (property as any).powerLoad ? `${(property as any).powerLoad} kW` : "N/A",
        },
        {
          icon: <Calendar size={16} />,
          title: "Property Age",
          value: (property as any).propertyAge || "N/A",
        },
      ];
      break;

    default:
      features = [
        {
          icon: <Home size={16} />,
          title: "Type",
          value: property.propertyType || "N/A",
        },
        {
          icon: <Building2 size={16} />,
          title: "Status",
          value: "Verified",
        },
      ];
      break;
  }

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