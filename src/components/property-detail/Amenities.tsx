"use client";
import type { ReactNode } from "react";

import {
  Dumbbell,
  Waves,
  ShieldCheck,
  Car,
  Trees,
  Building2,
  Wifi,
  Zap,
  Wind,
  Gamepad2,
  School,
  Hospital,
  ShoppingBag,
  CircleParking,
  Home,
  CheckCircle2,
} from "lucide-react";

interface Props {
  amenities: string[];
}

export default function Amenities({
  amenities = [],
}: Props) {

const iconMap: Record<string, ReactNode> = {
  "Swimming Pool": <Waves size={26} />,
  Gym: <Dumbbell size={26} />,
  Security: <ShieldCheck size={26} />,
  Parking: <Car size={26} />,
  Garden: <Trees size={26} />,
  Lift: <Building2 size={26} />,
  Wifi: <Wifi size={26} />,
  "Power Backup": <Zap size={26} />,
  AC: <Wind size={26} />,
  "Indoor Games": <Gamepad2 size={26} />,
  School: <School size={26} />,
  Hospital: <Hospital size={26} />,
  Mall: <ShoppingBag size={26} />,
  "Visitor Parking": <CircleParking size={26} />,
  Clubhouse: <Home size={26} />,
};

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

      <div className="flex items-center gap-4 mb-8">

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
          "
        >

          <CheckCircle2 size={30} />

        </div>

        <div>

          <h2 className="text-3xl font-bold">

            Amenities

          </h2>

          <p className="text-gray-500 mt-1">

            Premium facilities available with this property

          </p>

        </div>

      </div>

      {/* Empty */}

      {amenities.length === 0 && (

        <div
          className="
            border-2
            border-dashed
            border-[#E8DCC1]
            rounded-2xl
            py-12
            text-center
            text-gray-500
          "
        >

          No amenities available.

        </div>

      )}

      {/* Amenities */}

      {amenities.length > 0 && (

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-5
          "
        >

          {amenities.map((item) => (

            <div

              key={item}

              className="
                group
                bg-[#FCFBF8]
                border
                border-[#E8DCC1]
                rounded-2xl
                p-5
                hover:border-[#C89B1C]
                hover:shadow-lg
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >

              <div
                className="
                  h-12
                  w-12
                  rounded-xl
                  bg-[#FFF5DA]
                  text-[#C89B1C]
                  flex
                  items-center
                  justify-center
                  mb-4
                  group-hover:bg-[#C89B1C]
                  group-hover:text-white
                  transition
                "
              >

                {iconMap[item] ??
                  <Home size={24} />}

              </div>

              <h3
                className="
                  font-semibold
                  text-[#161616]
                "
              >

                {item}

              </h3>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}