"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  BedDouble,
  Bath,
  Scan,
  MapPin,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  properties: Property[];
}

export default function SimilarProperties({
  properties,
}: Props) {

  const router = useRouter();

  if (!properties.length) return null;

  return (

    <div
      className="
        mt-8
        bg-white
        border
        border-[#E8DCC1]
        rounded-[30px]
        p-8
      "
    >

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-3xl font-bold">

            Similar Properties

          </h2>

          <p className="text-gray-500 mt-2">

            You may also like these properties

          </p>

        </div>

        <button

          onClick={() =>
            router.push("/property-listing")
          }

          className="
            h-12
            px-6
            rounded-xl
            border
            border-[#C89B1C]
            text-[#C89B1C]
            hover:bg-[#FFF7E2]
            transition
          "
        >

          View All

        </button>

      </div>

      {/* Cards */}

      <div
        className="
          grid
          lg:grid-cols-3
          md:grid-cols-2
          gap-8
        "
      >

        {properties.map((property) => {

          const image =
            property.photos?.length
              ? property.photos[0]
              : "/images/property-placeholder.jpg";

          return (

            <div
              key={property._id}
              className="
                bg-white
                rounded-3xl
                border
                border-[#E8DCC1]
                overflow-hidden
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >

              {/* Image */}

              <div className="relative h-60">

                <Image
                  src={image}
                  alt={property.propertyType}
                  fill
                  className="object-cover"
                />

                <div
                  className="
                    absolute
                    left-4
                    top-4
                    bg-[#C89B1C]
                    text-white
                    px-4
                    py-2
                    rounded-full
                    text-sm
                  "
                >

                  {property.purpose}

                </div>

              </div>

              {/* Content */}

              <div className="p-6">

                <h3 className="text-2xl font-semibold">

                  {property.propertyType}

                </h3>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-gray-500
                    mt-3
                  "
                >

                  <MapPin size={16} />

                  {property.locality},{" "}
                  {property.city}

                </div>

                <div
                  className="
                    flex
                    justify-between
                    mt-6
                    text-sm
                  "
                >

                  <div className="flex items-center gap-2">

                    <BedDouble size={18} />

                    {property.bedrooms}

                  </div>

                  <div className="flex items-center gap-2">

                    <Bath size={18} />

                    {property.bathrooms}

                  </div>

                  <div className="flex items-center gap-2">

                    <Scan size={18} />

                    {property.area} sqft

                  </div>

                </div>

                <div className="mt-7">

                  <h2
                    className="
                      text-3xl
                      font-bold
                      text-[#C89B1C]
                    "
                  >

                    ₹

                    {property.price.toLocaleString(
                      "en-IN"
                    )}

                  </h2>

                </div>

                <button

                  onClick={() =>
                    router.push(
                      `/property/${property._id}`
                    )
                  }

                  className="
                    mt-7
                    w-full
                    h-12
                    rounded-xl
                    bg-[#C89B1C]
                    hover:bg-[#B8860B]
                    text-white
                    font-semibold
                    transition
                  "
                >

                  View Details

                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}