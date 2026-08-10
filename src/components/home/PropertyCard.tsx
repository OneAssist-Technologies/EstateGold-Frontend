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
  className="
    property-card
  relative
  group
  bg-white
  rounded-3xl
  overflow-hidden
  shadow-md
  hover:shadow-2xl
  hover:-translate-y-3
  transition-all
  duration-500
  cursor-pointer
  "
>
      <div className="relative h-72 overflow-hidden">
       <img
          src={property.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
<div
  className="
  absolute
  top-4
  left-4
  bg-[#C89B1C]
  text-white
  px-4
  py-2
  rounded-full
  text-sm
  font-medium
  z-10
  "
>
  Featured
</div>
      </div>

      <div className="p-5">
       <h3
  className="
  text-[#C89B1C]
  font-bold
  text-2xl
  transition-all
  duration-500
  group-hover:scale-105
  "
>
          ₹ {property.price.toLocaleString("en-IN")}
        </h3>

        <h4 className="font-semibold text-lg mt-2">
          {property.title}
        </h4>

        <div className="flex items-center gap-2 text-gray-500 mt-2">
          <MapPin size={16} />
          <span>{property.location}</span>
        </div>

        <div className="flex gap-6 mt-5 text-gray-600">
          <div className="flex items-center gap-2">
            <Bed size={18} />
            {property.beds} Beds
          </div>

          <div className="flex items-center gap-2">
            <Bath size={18} />
            {property.baths} Baths
          </div>
        </div>

        <button
  className="
  mt-6
  w-full
  bg-gradient-to-r
  from-[#C89B1C]
  to-[#D9B76D]
  text-white
  py-3
  rounded-xl
  font-medium
  transition-all
  duration-500
  hover:scale-105
  hover:shadow-lg
  "
>
          View Details
        </button>
      </div>
    </div>
  );
}