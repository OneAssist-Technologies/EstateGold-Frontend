// components/home/Cities.tsx

import { MapPin } from "lucide-react";

const cities = [
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
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        <p className="text-center text-[#C89B1C] uppercase tracking-widest">
          Top Locations
        </p>

        <h2 className="text-center text-5xl font-bold mt-4">
          Search by City
        </h2>

        <div className="flex flex-wrap justify-center gap-5 mt-14">
          {cities.map((city) => (
            <button
              key={city}
              className="
              flex
              items-center
              gap-2
              px-8
              py-4
              rounded-full
              border
              hover:bg-[#C89B1C]
              hover:text-white
              transition
              "
            >
              <MapPin size={16} />
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}