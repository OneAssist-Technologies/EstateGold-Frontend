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
    count: "",
    icon: Building2,
    typeParam: "Apartment / Flat",
  },
  {
    title: "Independent House",
    count: "",
    icon: Home,
    typeParam: "Independent House",
  },
  {
    title: "Villa",
    count: "",
    icon: Award,
    typeParam: "Villa",
  },
  {
    title: "Plot / Land",
    count: "",
    icon: Map,
    typeParam: "Plot / Land",
  },
  {
    title: "Commercial",
    count: "",
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
    <section className="bg-[#F8F3E8] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[#C89B1C] text-center uppercase tracking-wider text-xs md:text-sm">
          Explore Categories
        </p>

        <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold text-center mt-2 md:mt-4">
          Browse by Property Type
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-10 md:mt-16">
          {propertyTypes.map((item) => (
            <div
              key={item.title}
              onClick={() => handleTypeClick(item.typeParam)}
              className="bg-white rounded-2xl xs:rounded-3xl border border-[#ECE7DB] p-4 sm:p-6 md:p-8 text-center hover:shadow-xl transition cursor-pointer group last:col-span-2 md:last:col-span-1 max-w-[240px] md:max-w-none mx-auto w-full"
            >
              <div
                className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-[#F8F3E8] mx-auto flex items-center justify-center group-hover:bg-[#C89B1C] transition-colors"
              >
                <item.icon
                  className="text-[#C89B1C] group-hover:text-white transition-colors h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                />
              </div>

              <h3 className="font-semibold mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-900 group-hover:text-[#9A720C] transition-colors">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-1 sm:mt-2 text-[10px] sm:text-xs">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}