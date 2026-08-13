"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import api from "../../services/api";

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
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-[#C89B1C] uppercase tracking-widest">
          Top Locations
        </p>

        <h2 className="text-center text-5xl font-bold mt-4 font-serif">
          Search by City
        </h2>

        <div className="flex flex-wrap justify-center gap-5 mt-14">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              className="
              flex
              items-center
              gap-2
              px-8
              py-4
              rounded-full
              border
              border-[#ECE7DB]
              bg-white
              text-gray-800
              font-semibold
              capitalize
              hover:bg-[#C89B1C]
              hover:text-white
              hover:border-[#C89B1C]
              transition
              cursor-pointer
              shadow-2xs
              "
            >
              <MapPin size={16} className="text-[#C89B1C] group-hover:text-white" />
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}