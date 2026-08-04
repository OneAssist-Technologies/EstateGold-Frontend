"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";

import { AdminProperty } from "@/src/types/adminProperty";

import PropertyStatusBadge from "./PropertyStatusBadge";
import { useRouter } from "next/navigation";



interface Props {
  loading: boolean;

  properties: AdminProperty[];

  onView: (id: string) => void;
}

export default function PropertyTable({
  loading,
  properties,
  onView,
}: Props) {
const router = useRouter();
  if (loading) {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border
          p-20
          text-center
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[#ECE7DB]
        bg-white
      "
    >
      {/* Header */}

      <div
        className="
          grid
          grid-cols-8
          px-6
          py-4
          bg-[#FAF9F6]
          border-b
          text-xs
          uppercase
          font-semibold
          tracking-wider
          text-gray-500
        "
      >
        {/* <div>Property</div> */}

        <div>Owner</div>

        <div>Location</div>

        <div>Price</div>

        <div>Type</div>

        <div>Status</div>

        <div>Date</div>

        <div className="text-right">
          Action
        </div>
      </div>

      {properties.map((property) => (

        <motion.div
          key={property._id}
          whileHover={{
            backgroundColor:
              "#FCFBF8",
          }}
          className="
            grid
            grid-cols-8
            items-center
            px-6
            py-5
            border-b
          "
        >

          {/* Property */}
{/* 
          <div>

            <h3 className="font-semibold">

              {property.bedrooms} BHK{" "}

              {property.propertyType}

            </h3>

            <p
              className="
                text-xs
                text-gray-500
                mt-1
              "
            >
              {property.area} sqft
            </p>

          </div> */}

          {/* Owner */}

          <div>

            <h4 className="text-sm">

              {property.ownerName}

            </h4>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              {property.ownerPhone}
            </p>

          </div>

          {/* Location */}

          <div>

            <h4 className="text-sm">

              {property.locality}

            </h4>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              {property.city}
            </p>

          </div>

          {/* Price */}

          <div
            className="
              font-semibold
            "
          >
            ₹
            {property.price.toLocaleString()}
          </div>

          {/* Type */}

          <div>

            {property.propertyType}

          </div>

          {/* Status */}

          <div>

            <PropertyStatusBadge
              status={property.status}
            />

          </div>

          {/* Date */}

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            {new Date(
              property.createdAt
            ).toLocaleDateString()}
          </div>

          {/* Action */}

          <div
            className="
              flex
              justify-end
            "
          >

            <button
              onClick={() =>
  router.push(
    `/admin/properties/${property._id}`
  )
}
              className="
                h-9
                w-9
                rounded-lg
                bg-gray-100
                hover:bg-[#C89B1C]
                hover:text-white
                transition
                flex
                items-center
                justify-center
              "
            >
              <Eye size={16} />
            </button>

          </div>

        </motion.div>

      ))}

      {!loading &&
        properties.length === 0 && (
          <div
            className="
              p-16
              text-center
              text-gray-400
            "
          >
            No properties found.
          </div>
        )}
    </div>
  );
}