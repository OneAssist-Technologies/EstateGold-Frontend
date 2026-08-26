"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import api from "../../lib/api";

const fallbackCities = [
  "Mumbai",
  "Delhi NCR",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Noida",
];

export default function Cities() {
  const router = useRouter();
  const [cities, setCities] = useState<string[]>(fallbackCities);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await api.get("/admin/locations?status=active");
        if (res.data && res.data.locations && res.data.locations.length > 0) {
          const activeCities = Array.from(
            new Set(
              res.data.locations
                .map((loc: { city: string }) => loc.city)
                .filter((c: string) => Boolean(c && c.trim()))
            )
          ) as string[];
          if (activeCities.length > 0) {
            setCities(activeCities);
          }
        }
      } catch (err) {
        console.error("Failed to fetch serviceable locations for search:", err);
      }
    }

    fetchCities();
  }, []);

  const handleCityClick = (city: string) => {
    router.push(`/property-listing?city=${encodeURIComponent(city)}`);
  };

  return (
    <section className="py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-[#C89B1C] uppercase tracking-wider text-xs md:text-sm">
          Top Locations
        </p>

        <h2 className="text-center text-2xl xs:text-3xl md:text-5xl font-bold mt-2 md:mt-4">
          Search by City
        </h2>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-5 mt-10 sm:mt-14">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              className="flex items-center justify-center gap-1.5 xs:gap-2 px-4 py-3 sm:px-8 sm:py-4 rounded-full border border-[#ECE7DB] bg-white text-gray-800 font-semibold capitalize hover:bg-[#C89B1C] hover:text-white hover:border-[#C89B1C] transition cursor-pointer shadow-2xs text-xs xs:text-sm sm:text-base w-full sm:w-auto"
            >
              <MapPin className="text-[#C89B1C] group-hover:text-white h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span>{city}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}