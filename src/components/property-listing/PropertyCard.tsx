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
export default function PropertyCard({
  property,
}: Props) {
  const router = useRouter();
  return (
    <motion.div
  whileHover={{
    y: -10,
    scale: 1.02,
  }}
  transition={{
    type: "spring",
    stiffness: 250,
    damping: 18,
  }}
    onClick={() =>
    router.push(`/property-detail/${property._id}`)
  }
>
    <div
      className="
        bg-white
        rounded-[28px]
        overflow-hidden
        border
        border-[#E8DCC1]
        shadow-[0_10px_30px_rgba(0,0,0,0.05)]
        hover:-translate-y-1
        transition-all
      "
    >
      <div className="relative">

        <img
          src={`http://localhost:5000/uploads/properties/${property.photos?.[0]}`}
          alt=""
          className="
            h-[260px]
            w-full
            object-cover
          "
        />

        <div className="absolute top-5 left-5 flex gap-2">

          <span
            className="
              bg-[#C89B1C]
              text-white
              px-4
              py-1.5
              rounded-full
              text-sm
              font-medium
            "
          >
            {property.purpose}
          </span>

          <span
            className="
              bg-[#0DBB58]
              text-white
              px-4
              py-1.5
              rounded-full
              text-sm
              font-medium
            "
          >
            Verified
          </span>
        </div>

        <button
          className="
            absolute
            top-5
            right-5
            h-12
            w-12
            bg-white
            rounded-full
            flex
            items-center
            justify-center
          "
        >
          <Heart size={20} />
        </button>

        <div
          className="
            absolute
            bottom-5
            left-5
            text-white
            font-playfair
            text-5xl
            font-bold
          "
        >
          ₹
          {Number(
            property.price
          ).toLocaleString()}
        </div>

      </div>

      <div className="p-6">

        <h3
          className="
            text-2xl
            font-semibold
            line-clamp-1
          "
        >
          {property.propertyType}
        </h3>

        <div
          className="
            flex
            items-center
            gap-2
            text-gray-500
            mt-2
          "
        >
          <MapPin size={16} />

          <span>
            {property.locality},{" "}
            {property.city}
          </span>
        </div>

        <div
          className="
            border-t
            border-[#EEE5D4]
            mt-5
            pt-5
            flex
            justify-between
          "
        >
          <div className="flex gap-2">
            <BedDouble size={18} />
            {property.bedrooms} Beds
          </div>

          <div className="flex gap-2">
            <Bath size={18} />
            {property.bathrooms} Baths
          </div>

          <div>
            {property.area} sq ft
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
}