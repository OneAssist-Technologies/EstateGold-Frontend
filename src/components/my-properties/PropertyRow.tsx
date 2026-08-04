"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import {
  BedDouble,
  Bath,
  Scan,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";

import { Property } from "@/src/types/property";
import StatusToggle from "./StatusToggle";

interface Props {
  property: Property;

  onView: (id: string) => void;

  onEdit: (property: Property) => void;

  onDelete: (property: Property) => void;

  onStatusChange: () => void;
}

export default function PropertyRow({
  property,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const image =
    property.photos?.length > 0
      ? `http://localhost:5000/uploads/properties/${property.photos[0]}`
      : "/images/property-placeholder.jpg";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        bg-white
        rounded-3xl
        border
        border-[#ECE2C8]
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        transition-all
      "
    >
      <div className="grid lg:grid-cols-12">

        {/* IMAGE */}

        <div className="lg:col-span-4 relative h-[300px]">

          <Image
            src={image}
            alt={property.propertyType}
            fill
            unoptimized
            className="object-cover"
          />

          <div
            className="
              absolute
              top-5
              left-5
              bg-[#C89B1C]
              text-white
              px-5
              py-2
              rounded-full
              text-sm
              font-medium
            "
          >
            {property.purpose}
          </div>

        </div>

        {/* DETAILS */}

        <div className="lg:col-span-8 p-8">

          {/* Header */}

          <div className="flex justify-between items-start">

            <div>

              <h2 className="text-3xl font-bold text-[#161616]">

                {property.propertyType}

              </h2>

              <div className="flex items-center gap-2 mt-3 text-gray-500">

                <MapPin size={18} />

                <span>

                  {property.locality},

                  {property.city}

                </span>

              </div>

            </div>

            <StatusToggle
              checked={
                property.status ===
                "active"
              }
              onChange={onStatusChange}
            />

          </div>

          {/* Features */}

          <div className="grid grid-cols-4 gap-5 mt-8">

            <div className="flex items-center gap-2">

              <BedDouble
                className="text-[#C89B1C]"
              />

              <div>

                <p className="text-xs text-gray-500">

                  Bedrooms

                </p>

                <h4 className="font-semibold">

                  {property.bedrooms}

                </h4>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <Bath
                className="text-[#C89B1C]"
              />

              <div>

                <p className="text-xs text-gray-500">

                  Bathrooms

                </p>

                <h4 className="font-semibold">

                  {property.bathrooms}

                </h4>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <Scan
                className="text-[#C89B1C]"
              />

              <div>

                <p className="text-xs text-gray-500">

                  Area

                </p>

                <h4 className="font-semibold">

                  {property.area} sqft

                </h4>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <CalendarDays
                className="text-[#C89B1C]"
              />

              <div>

                <p className="text-xs text-gray-500">

                  Available

                </p>

                <h4 className="font-semibold">

                  {new Date(
                    property.availableFrom
                  ).toLocaleDateString()}

                </h4>

              </div>

            </div>

          </div>

          {/* Description */}

          <p className="mt-7 text-gray-600 leading-7 line-clamp-2">

            {property.description}

          </p>

          {/* Amenities */}

          <div className="flex flex-wrap gap-3 mt-7">

            {property.amenities
              ?.slice(0, 4)
              .map((item) => (
                <span
                  key={item}
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-[#FFF8EA]
                    border
                    border-[#E8DCC1]
                    text-sm
                  "
                >
                  {item}
                </span>
              ))}

          </div>

          {/* Footer */}

          <div className="flex justify-between items-end mt-10">

            <div>

              <p className="text-gray-500">

                Price

              </p>

              <h2 className="text-4xl font-bold text-[#C89B1C]">

                ₹
                {property.price.toLocaleString(
                  "en-IN"
                )}

              </h2>

            </div>

            <div className="flex gap-4">

              <button
                onClick={() =>
                  onView(
                    property._id
                  )
                }
                className="
                  h-12
                  px-6
                  rounded-xl
                  border
                  border-[#C89B1C]
                  text-[#C89B1C]
                  hover:bg-[#FFF8EA]
                  transition
                "
              >
                View
              </button>

              <button
                onClick={() =>
                  onEdit(
                    property
                  )
                }
                className="
                  h-12
                  w-12
                  rounded-xl
                  bg-[#C89B1C]
                  text-white
                  flex
                  items-center
                  justify-center
                  hover:bg-[#B88D18]
                  transition
                "
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() =>
                  onDelete(
                    property
                  )
                }
                className="
                  h-12
                  w-12
                  rounded-xl
                  bg-red-50
                  text-red-500
                  flex
                  items-center
                  justify-center
                  hover:bg-red-100
                  transition
                "
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}