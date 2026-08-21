"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import HeroImage from "../../assests/hero.jpg";
import api from "../../services/api";

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Buy" | "Rent" | "Commercial">("Buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [popularLocations, setPopularLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    async function fetchPopularLocations() {
      try {
        setLoadingLocations(true);
        const res = await api.get("/admin/locations?status=active");
        if (res.data && res.data.locations && res.data.locations.length > 0) {
          // Extract city names from admin configured active serviceable locations
          const activeCities = Array.from(
            new Set(
              res.data.locations
                .map((loc: { city: string }) => loc.city)
                .filter((c: string) => Boolean(c && c.trim()))
            )
          ) as string[];
          setPopularLocations(activeCities.slice(0, 4));
        } else {
          setPopularLocations(["Coimbatore", "Chennai", "Bengaluru", "Kollengode"]);
        }
      } catch (err) {
        console.error("Failed to fetch serviceable locations for search:", err);
        setPopularLocations(["Coimbatore", "Chennai", "Bengaluru", "Kollengode"]);
      } finally {
        setLoadingLocations(false);
      }
    }

    fetchPopularLocations();
  }, []);

  const [searching, setSearching] = useState(false);

  const handleSearch = async (queryOverride?: string) => {
    const q = queryOverride !== undefined ? queryOverride : searchQuery;
    if (!q || !q.trim()) {
      const params = new URLSearchParams();
      if (activeTab === "Rent") params.set("purpose", "Rent");
      else if (activeTab === "Commercial") params.set("type", "Commercial");
      else params.set("purpose", "Buy");
      router.push(`/property-listing?${params.toString()}`);
      return;
    }

    try {
      setSearching(true);
      const res = await api.post("/api/ai/parse-search", { query: q.trim() });
      if (res.data && res.data.success) {
        const params = new URLSearchParams();

        let hasStructured = false;
        if (res.data.purpose) { params.set("purpose", res.data.purpose); hasStructured = true; }
        else if (activeTab === "Rent") params.set("purpose", "Rent");
        else if (activeTab === "Commercial") params.set("type", "Commercial");
        else params.set("purpose", "Buy");

        if (res.data.propertyType) { params.set("propertyType", res.data.propertyType); hasStructured = true; }
        if (res.data.city) { params.set("city", res.data.city); hasStructured = true; }
        if (res.data.locality) { params.set("locality", res.data.locality); hasStructured = true; }
        if (res.data.bedrooms) { params.set("bedrooms", res.data.bedrooms); hasStructured = true; }
        if (res.data.minPrice) { params.set("minPrice", res.data.minPrice); hasStructured = true; }
        if (res.data.maxPrice) { params.set("maxPrice", res.data.maxPrice); hasStructured = true; }

        // ALWAYS set the search parameter to the original query so it populates the search bar on the listing page
        params.set("search", q.trim());

        router.push(`/property-listing?${params.toString()}`);
      } else {
        const params = new URLSearchParams();
        params.set("search", q.trim());
        router.push(`/property-listing?${params.toString()}`);
      }
    } catch (err) {
      console.error("AI Search Parse failed, proceeding with fallback redirect:", err);
      const params = new URLSearchParams();
      params.set("search", q.trim());
      router.push(`/property-listing?${params.toString()}`);
    } finally {
      setSearching(false);
    }
  };

  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await api.get("/properties?limit=1");
        if (res.data && res.data.pagination && res.data.pagination.totalProperties !== undefined) {
          setTotalCount(res.data.pagination.totalProperties);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCount();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      <Image
        src={HeroImage}
        alt="Luxury Property"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover animate-[kenburns_20s_ease-in-out_infinite]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28 w-full">
        <div className="inline-flex border border-[#C89B1C] rounded-full px-5 py-2 text-[#C89B1C] font-medium text-sm backdrop-blur-md bg-black/30">
          #1 Trusted Real Estate Platform
        </div>

        <h1 className="mt-8 text-2xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-white max-w-5xl leading-tight tracking-tight">
          Every Property has a Story
          <span className="block text-sm xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#C89B1C] mt-2 sm:mt-3 tracking-wide">
            Find the one that Fits for you
          </span>
        </h1>

        <p className="text-white/80 text-base sm:text-lg mt-4 sm:mt-6 max-w-3xl font-sans">
          Search from {totalCount !== null ? `${totalCount.toLocaleString("en-IN")}+` : "verified"} properties and connect directly with owners.
        </p>

        {/* Seamless Single-Panel Glassmorphic Search Box */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/25 shadow-2xl rounded-3xl mt-10 max-w-4xl overflow-hidden transition-all duration-300">
          {/* Tabs */}
          <div className="flex border-b border-white/15 px-6">
            {(["Buy", "Rent", "Commercial"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-8 font-bold text-base transition-all cursor-pointer relative ${activeTab === tab
                    ? "text-[#F5C438]"
                    : "text-white/80 hover:text-white"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#F5C438] rounded-t-full shadow-xs" />
                )}
              </button>
            ))}
          </div>

          {/* Search Input Row */}
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <MapPin
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by city, locality, society or project..."
                  className="hero-search-input w-full h-14 border border-white/25 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/70 outline-none focus:border-[#F5C438] focus:bg-white/20 transition-all text-base bg-white/10 backdrop-blur-sm shadow-inner font-medium"
                />
              </div>

              <button
                onClick={() => handleSearch()}
                disabled={searching}
                className="w-full sm:w-auto bg-[#C89B1C] hover:bg-[#b28917] text-white font-bold px-8 h-14 rounded-2xl flex items-center justify-center gap-2 text-base transition-all shadow-lg cursor-pointer shrink-0 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searching ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin shrink-0" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            {/* Serviceable Popular Locations fetched dynamically from Admin */}
            {!loadingLocations && popularLocations.length > 0 && (
              <div className="flex items-center gap-2.5 pt-1 flex-wrap text-sm">
                <span className="text-white/80 font-semibold text-xs tracking-wide">Popular:</span>
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSearchQuery(loc);
                      handleSearch(loc);
                    }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 hover:bg-[#C89B1C] hover:text-white hover:border-[#C89B1C] font-semibold text-xs px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs capitalize"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}