"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  Home,
  Map,
  Landmark,
  Award,
} from "lucide-react";

const propertyTypes = [
  {
    title: "Flat / Apartment",
    count: "4.2L+ properties",
    icon: Building2,
    typeParam: "Apartment / Flat",
  },
  {
    title: "Independent House",
    count: "1.8L+ properties",
    icon: Home,
    typeParam: "Independent House",
  },
  {
    title: "Villa",
    count: "42K+ properties",
    icon: Award,
    typeParam: "Villa",
  },
  {
    title: "Plot / Land",
    count: "93K+ properties",
    icon: Map,
    typeParam: "Plot / Land",
  },
  {
    title: "Commercial",
    count: "31K+ properties",
    icon: Landmark,
    typeParam: "Commercial Space",
  },
];

export default function PropertyTypes() {
  const router = useRouter();

  const handleTypeClick = (typeParam: string) => {
    router.push(`/property-listing?propertyType=${encodeURIComponent(typeParam)}`);
  };

  return (
    <section className="bg-[#F8F3E8] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[#C89B1C] text-center uppercase tracking-widest">
          Explore Categories
        </p>

        <h2 className="text-5xl font-bold text-center mt-4 font-serif">
          Browse by Property Type
        </h2>

        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-6 mt-16">
          {propertyTypes.map((item) => (
            <div
              key={item.title}
              onClick={() => handleTypeClick(item.typeParam)}
              className="
              bg-white
              rounded-3xl
              border
              border-[#ECE7DB]
              p-8
              text-center
              hover:shadow-xl
              transition
              cursor-pointer
              group
              "
            >
              <div
                className="
                h-16
                w-16
                rounded-2xl
                bg-[#F8F3E8]
                mx-auto
                flex
                items-center
                justify-center
                group-hover:bg-[#C89B1C]
                transition-colors
                "
              >
                <item.icon
                  size={28}
                  className="text-[#C89B1C] group-hover:text-white transition-colors"
                />
              </div>

              <h3 className="font-semibold mt-6 text-lg text-gray-900 group-hover:text-[#9A720C] transition-colors">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-2 text-xs">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}