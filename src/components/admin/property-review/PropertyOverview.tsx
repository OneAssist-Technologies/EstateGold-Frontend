"use client";

import {
  BedDouble,
  Bath,
  Ruler,
  Layers3,
  DoorOpen,
  Sofa,
  Car,
  MapPin,
  IndianRupee,
} from "lucide-react";

import { AdminProperty } from "@/src/types/adminProperty";

interface Props {
  property: AdminProperty;
}

export default function PropertySummary({
  property,
}: Props) {
  return (
    <section className="mt-6">

      {/* Title */}

      <div className="flex items-start justify-between gap-6">

        <div>

          <h1
            className="
              text-3xl
              font-playfair
              font-bold
              text-[#161616]
            "
          >
            {property.propertyType}
          </h1>

          <div
            className="
              mt-2
              flex
              items-center
              gap-2
              text-[15px]
              text-[#6B7280]
            "
          >
            <MapPin
              size={16}
              className="text-[#C89B1C]"
            />

            <span>
              {property.locality}
              {property.city && `, ${property.city}`}
            </span>

          </div>

        </div>

        <div
          className="
            flex
            items-center
            gap-1
            text-[#C89B1C]
            shrink-0
          "
        >

          <IndianRupee size={22} />

          <h2
            className="
              text-3xl
              font-bold
              text-[#C89B1C]
            "
          >
            {property.price.toLocaleString()}
          </h2>

        </div>

      </div>

      {/* Overview */}

              <div

  className="
  mt-4
    flex
    flex-wrap
    gap-3
  "
>
      

        <OverviewCard
          icon={<BedDouble size={17} />}
          title="Bedrooms"
          value={`${property.bedrooms} BHK`}
        />

        <OverviewCard
          icon={<Bath size={17} />}
          title="Bathrooms"
          value={`${property.bathrooms} Bath`}
        />

        <OverviewCard
          icon={<Ruler size={17} />}
          title="Area"
          value={`${property.area} sqft`}
        />

        <OverviewCard
          icon={<Layers3 size={17} />}
          title="Floor"
          value={`${property.floor}`}
        />

        <OverviewCard
          icon={<DoorOpen size={17} />}
          title="Balconies"
          value={`${property.balconies}`}
        />

        <OverviewCard
          icon={<Sofa size={17} />}
          title="Furnishing"
          value={property.furnishing}
        />

        <OverviewCard
          icon={<Car size={17} />}
          title="Parking"
          value={
            property.parking
              ? "Available"
              : "Not Available"
          }
        />

      </div>

      {/* Description */}

      <div className="mt-8">

        <h2
          className="
            text-2xl
            font-playfair
            font-bold
            text-[#161616]
          "
        >
          Description
        </h2>

        <p
          className="
            mt-3
            text-[15px]
            leading-7
            text-gray-600
          "
        >
          {property.description ||
            "No description available."}
        </p>

      </div>

    </section>
  );
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function OverviewCard({
  icon,
  title,
  value,
}: CardProps) {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2.5
        rounded-full
        border
        border-[#E7D8B6]
        bg-[#FFFDF8]
        px-4
        py-2
        hover:bg-[#FFF8EA]
        transition
      "
    >
      <div
        className="
          h-8
          w-8
          rounded-full
          bg-[#FFF3D8]
          text-[#C89B1C]
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        {icon}
      </div>

      <div className="leading-tight">

        <p
          className="
            text-[10px]
            uppercase
            tracking-wide
            text-gray-500
          "
        >
          {title}
        </p>

        <p
          className="
            text-sm
            font-semibold
            text-[#161616]
            whitespace-nowrap
          "
        >
          {value}
        </p>

      </div>

    </div>
  );
}