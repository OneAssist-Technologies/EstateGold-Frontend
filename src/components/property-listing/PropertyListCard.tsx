"use client";

import Image from "next/image";
import {
  BedDouble,
  Bath,
  Scan,
  MapPin,
  Heart,
  Share2,
} from "lucide-react";

import { Property } from "../../types/property";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
interface Props {
  property: Property;
}

export default function PropertyListCard({
  property,
}: Props) {
  const router = useRouter();
  const image =
    property.photos?.length > 0
      ? property.photos[0]
      : "../../assests/auth.jpg";

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
        rounded-3xl
        border
        border-[#E8DCC1]
        overflow-hidden
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      <div className="grid grid-cols-12">

        {/* Image */}

        <div className="col-span-4 relative h-[260px]">

          <img
  src={image}
  alt={property.propertyType}
  className="w-full h-full object-cover"
/>

          <div
            className="
              absolute
              top-5
              left-5
              bg-[#C89B1C]
              text-white
              text-xs
              px-4
              py-2
              rounded-full
            "
          >
            {property.purpose}
          </div>

        </div>

        {/* Content */}

        <div className="col-span-8 p-7 flex flex-col justify-between">

          <div>

            <div className="flex justify-between">

              <div>

                <h2 className="text-2xl font-semibold text-[#161616]">
                  {property.propertyType}
                </h2>

                <div className="flex items-center gap-2 text-gray-500 mt-2">

                  <MapPin size={16} />

                  <span>
                    {property.locality}, {property.city}
                  </span>

                </div>

              </div>

              <div className="flex gap-3">

                <button
                  className="
                    h-11
                    w-11
                    rounded-full
                    border
                    border-[#E8DCC1]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Heart size={18} />
                </button>

                <button
                  className="
                    h-11
                    w-11
                    rounded-full
                    border
                    border-[#E8DCC1]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Share2 size={18} />
                </button>

              </div>

            </div>

            <div className="flex gap-8 mt-7">

              <div className="flex items-center gap-2">

                <BedDouble size={18} />

                <span>
                  {property.bedrooms} Beds
                </span>

              </div>

              <div className="flex items-center gap-2">

                <Bath size={18} />

                <span>
                  {property.bathrooms} Baths
                </span>

              </div>

              <div className="flex items-center gap-2">

                <Scan size={18} />

                <span>
                  {property.area} sq.ft
                </span>

              </div>

            </div>

            <p className="text-gray-600 mt-6 line-clamp-2">
              {property.description}
            </p>

          </div>

          <div className="flex justify-between items-end mt-8">

            <div>

              <p className="text-sm text-gray-500">
                Starting From
              </p>

              <h2 className="text-4xl font-bold text-[#C89B1C]">
                ₹
                {property.price?.toLocaleString(
                  "en-IN"
                )}
              </h2>

            </div>

            <button
              className="
                bg-[#C89B1C]
                hover:bg-[#B68A16]
                text-white
                rounded-2xl
                px-8
                h-14
                font-medium
                transition
              "
            >
              View Details
            </button>

          </div>

        </div>

      </div>
    </div>
    </motion.div>
  );
}