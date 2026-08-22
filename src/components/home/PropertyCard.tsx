// components/home/PropertyCard.tsx

import Image from "next/image";
import { MapPin, Bed, Bath } from "lucide-react";

export interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  beds: number;
  baths: number;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({
  property,
}: PropertyCardProps) {
  return (
    <div
      className="property-card relative group bg-white rounded-2xl xs:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-48 xs:h-56 sm:h-64 md:h-72 overflow-hidden">
        <img
          src={property.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute top-3 left-3 xs:top-4 xs:left-4 bg-[#C89B1C] text-white px-3 py-1.5 xs:px-4 xs:py-2 rounded-full text-xs xs:text-sm font-medium z-10"
        >
          Featured
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3
          className="text-[#C89B1C] font-bold text-xl xs:text-2xl transition-all duration-500 group-hover:scale-105"
        >
          ₹ {property.price.toLocaleString("en-IN")}
        </h3>

        <h4 className="font-semibold text-base xs:text-lg mt-1.5 xs:mt-2 line-clamp-1">
          {property.title}
        </h4>

        <div className="flex items-center gap-2 text-gray-500 mt-1.5 xs:mt-2 text-xs xs:text-sm">
          <MapPin size={14} className="shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="flex gap-4 xs:gap-6 mt-4 xs:mt-5 text-gray-600 text-xs xs:text-sm">
          <div className="flex items-center gap-1.5 xs:gap-2">
            <Bed size={16} />
            {property.beds} Beds
          </div>

          <div className="flex items-center gap-1.5 xs:gap-2">
            <Bath size={16} />
            {property.baths} Baths
          </div>
        </div>

        <button
          className="mt-5 xs:mt-6 w-full bg-gradient-to-r from-[#C89B1C] to-[#D9B76D] text-white py-2.5 xs:py-3 rounded-xl text-sm xs:text-base font-medium transition-all duration-500 hover:scale-105 hover:shadow-lg"
        >
          View Details
        </button>
      </div>
    </div>
  );
}