// components/home/FeaturedProperties.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import PropertyCard, { Property as HomeProperty } from "./PropertyCard";
import api from "../../lib/api";
import { Property } from "../../types/property";

export default function FeaturedProperties() {
  const router = useRouter();
  const [properties, setProperties] = useState<HomeProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchFeaturedProperties() {
      try {
        setLoading(true);
        setError(false);
        // Fetch a larger pool of latest properties to filter from
        const res = await api.get("/properties?limit=100&sort=latest");
        const list = res.data.data || res.data.properties || [];

        // Filter for Coimbatore, Chennai, or Bangalore/Bengaluru
        const allowedCities = ["coimbatore", "chennai", "bangalore", "bengaluru","navalur","hosur"];
        const filteredList = list.filter((item: Property) => {
          const cityLower = (item.city || "").toLowerCase().trim();
          return allowedCities.some(allowed => cityLower.includes(allowed));
        });

        // Limit display to exactly three properties
        let limitedList = filteredList.slice(0, 3);

        // Fallback: If we have fewer than 3 properties, pad with any other available properties
        if (limitedList.length < 3) {
          const displayedIds = new Set(limitedList.map((item:any)=> item._id));
          const remainingProps = list.filter((item: Property) => !displayedIds.has(item._id));
          const padCount = 3 - limitedList.length;
          limitedList = [...limitedList, ...remainingProps.slice(0, padCount)];
        }

        const mapped: HomeProperty[] = limitedList.map((item: Property) => {
          let photoUrl = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
          if (item.photos && item.photos.length > 0 && item.photos[0]) {
            if (item.photos[0].startsWith("http://") || item.photos[0].startsWith("https://")) {
              photoUrl = item.photos[0];
            } else {
              const clean = item.photos[0].replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "");
              photoUrl = `http://localhost:5000/uploads/properties/${clean}`;
            }
          }

          const displayTitle =
            item.bedrooms && item.propertyType
              ? `${item.bedrooms} BHK ${item.propertyType}`
              : item.propertyType || "Luxury Property";

          const locationText = item.locality
            ? `${item.locality}, ${item.city}`
            : item.city || "Tamil Nadu";

          return {
            _id: item._id,
            title: displayTitle,
            price: item.price || 0,
            location: locationText,
            image: photoUrl,
            beds: item.bedrooms || 0,
            baths: item.bathrooms || 0,
          };
        });

        setProperties(mapped);
      } catch (err) {
        console.error("Failed to fetch featured properties:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProperties();
  }, []);

  return (
    <section className="py-12 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p className="text-[#C89B1C] uppercase tracking-wider font-semibold text-xs sm:text-sm">
            Featured Listings
          </p>

          <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold mt-2 md:mt-4 text-[#161616]">
            Featured Properties
          </h2>

          <p className="text-gray-500 mt-2 md:mt-4 text-xs xs:text-sm md:text-base max-w-xl mx-auto">
            Explore our handpicked premium properties available directly from verified owners.
          </p>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 sm:gap-8 mt-10 sm:mt-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 sm:h-96 bg-gray-200 animate-pulse rounded-2xl xs:rounded-3xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-gray-500 font-medium">
            No properties published yet. Check back soon!
          </div>
        ) : properties.length > 0 ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 sm:gap-8 mt-10 sm:mt-16">
            {properties.map((property) => (
              <div key={property._id} onClick={() => router.push(`/property-detail/${property._id}`)}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto mt-10 sm:mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#FAF8F5] via-[#F8F4EA] to-[#F2EFE6] border border-[#EBE7DD] shadow-xs text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-[#FAF6EE] to-[#F3EAD9] border border-[#E5C365]/35 flex items-center justify-center text-[#9A720C] mb-5 shadow-xs">
              <Building2 size={26} className="stroke-[1.75]" />
            </div>

            <p className="text-[#C89B1C] uppercase tracking-widest font-bold text-xs sm:text-sm">
              {" LIST YOUR PROPERTY"}
            </p>

            <h3 className="text-xl sm:text-3xl font-bold mt-3 text-[#161616]">
              Have a property to sell or rent?
            </h3>

            <p className="text-gray-500 mt-2 text-xs sm:text-sm max-w-lg mx-auto">
              Be among the first property owners to showcase your property on EstateGold.
            </p>

            <button
              onClick={() => router.push("/post-property")}
              className="mt-6 inline-flex items-center justify-center bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xs transition-all duration-300 hover:shadow-md hover:shadow-[#D4B04C]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              + List Your Property Free
            </button>

            <p className="text-[11px] sm:text-xs text-gray-400 mt-4 font-medium">
              No brokerage • Reach genuine buyers
            </p>
          </div>
        )}
      </div>
    </section>
  );
}