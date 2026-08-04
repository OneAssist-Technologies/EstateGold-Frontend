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

export default function PropertyFeatures({
  property,
}: Props) {
  const features = [
    {
      icon: <BedDouble size={26} />,
      title: "Bedrooms",
      value: `${property.bedrooms} BHK`,
    },
    {
      icon: <Bath size={26} />,
      title: "Bathrooms",
      value: property.bathrooms,
    },
    {
      icon: <Building2 size={26} />,
      title: "Balconies",
      value: property.balconies,
    },
    {
      icon: <Ruler size={26} />,
      title: "Area",
      value: `${property.area} Sq.ft`,
    },
    {
      icon: <Layers3 size={26} />,
      title: "Floor",
      value: property.floor,
    },
    {
      icon: <Sofa size={26} />,
      title: "Furnishing",
      value: property.furnishing,
    },
    {
      icon: <Car size={26} />,
      title: "Parking",
      value: property.parking ? "Available" : "Not Available",
    },
    {
      icon: <Home size={26} />,
      title: "Property Type",
      value: property.propertyType,
    },
  ];

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
      <h2
        className="
          text-3xl
          font-bold
          text-[#161616]
          mb-8
        "
      >
        Property Features
      </h2>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >
        {features.map((item, index) => (
          <div
            key={index}
            className="
              bg-[#FCFBF8]
              border
              border-[#E8DCC1]
              rounded-3xl
              p-6
              hover:shadow-lg
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-[#FFF5DA]
                text-[#C89B1C]
                flex
                items-center
                justify-center
                mb-5
              "
            >
              {item.icon}
            </div>

            <p className="text-gray-500 text-sm">
              {item.title}
            </p>

            <h3
              className="
                mt-2
                text-xl
                font-semibold
                text-[#161616]
                break-words
              "
            >
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}