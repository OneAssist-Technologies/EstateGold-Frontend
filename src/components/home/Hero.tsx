"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import HeroImage from "../../assets/images/hero.jpg";
import api from "../../lib/api";

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
        const res = await api.get("/locations?status=active");
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
      const res = await api.post("/ai/parse-search", { query: q.trim() });
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
    <section className="relative min-h-[500px] md:min-h-screen overflow-hidden flex items-center">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-28 w-full">
        <div className="inline-flex border border-[#C89B1C] rounded-full px-5 py-2 text-[#C89B1C] font-medium text-sm backdrop-blur-md bg-black/30">
          #1 Trusted Real Estate Platform
        </div>

        <h1 className="mt-4 md:mt-8 text-2xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-white max-w-5xl leading-tight tracking-tight">
          Every Property has a Story
          <span className="block text-sm xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#C89B1C] mt-2 sm:mt-3 tracking-wide">
            Find the one that Fits for you
          </span>
        </h1>

        <p className="text-white/80 text-sm xs:text-base sm:text-lg mt-3 md:mt-6 max-w-3xl font-sans">
          Search from {totalCount !== null ? `${totalCount.toLocaleString("en-IN")}+` : "verified"} properties and connect directly with owners.
        </p>

        {/* Animated Eyva AI Floating Widget */}
        <div className="mt-8 md:mt-10 flex flex-col items-center sm:items-start justify-center animate-float w-full sm:w-auto sm:hidden">
          {/* Tooltip bubble */}
          <div className="relative bg-[#1a1715]/95 border border-[#C89B1C] rounded-2xl px-5 py-2.5 shadow-2xl text-center backdrop-blur-xs max-w-[210px] mb-3 ml-0 sm:ml-4">
            <p className="text-white text-xs font-semibold leading-relaxed">
              Need help finding a property?
            </p>
            {/* Bubble Arrow pointing downwards */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#1a1715] border-r border-b border-[#C89B1C] rotate-45" />
          </div>

          <Link
            href="/eyva"
            className="group flex flex-col items-center sm:items-start cursor-pointer ml-0 sm:ml-[72px]"
          >
            {/* Golden Circle Wrapper */}
            <div className="relative h-24 w-24 rounded-full border-[4px] border-[#C89B1C] bg-[#1a1715]/85 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-[#F5C438] group-hover:shadow-[#C89B1C]/30">
              {/* Pulsing outer aura glow */}
              <div className="absolute inset-0 rounded-full bg-[#C89B1C]/20 animate-ping opacity-75 pointer-events-none" />
              
              {/* Sparkle Icon on top-right of ring */}
              <span className="absolute -top-1.5 -right-1 text-white text-xl animate-pulse select-none z-20">✨</span>
              
              {/* Eyva Logo Image */}
              <img
                src="/eyva 1.png"
                alt="Ask Eyva"
                className="h-16 w-16 object-contain relative z-10"
              />
            </div>

            {/* Ask Eyva Text label below circle */}
            <span className="mt-3 text-white font-bold text-sm sm:text-base tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex items-center gap-1 group-hover:text-[#F5C438] transition-colors w-24 justify-center">
              Ask Eyva <span className="text-[#C89B1C] group-hover:text-[#F5C438] animate-pulse">✨</span>
            </span>
          </Link>
        </div>


        {/* Seamless Single-Panel Glassmorphic Search Box */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/25 shadow-2xl rounded-2xl xs:rounded-3xl mt-5 md:mt-10 max-w-4xl overflow-hidden transition-all duration-300">
          {/* Tabs */}
          <div className="flex border-b border-white/15 px-4 xs:px-6">
            {(["Buy", "Rent", "Commercial"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 xs:py-4 xs:px-8 font-bold text-sm xs:text-base flex-1 text-center xs:flex-none transition-all cursor-pointer relative ${activeTab === tab
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
          <div className="p-4 xs:p-6 space-y-3 xs:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 items-center">
              <div className="flex-1 w-full relative">
                <MapPin
                  size={18}
                  className="absolute left-3.5 xs:left-4 top-1/2 -translate-y-1/2 text-white/80"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by city, locality, project..."
                  className="hero-search-input w-full h-12 xs:h-14 border border-white/25 rounded-xl xs:rounded-2xl pl-10 xs:pl-12 pr-4 text-white placeholder:text-white/70 outline-none focus:border-[#F5C438] focus:bg-white/20 transition-all text-sm xs:text-base bg-white/10 backdrop-blur-sm shadow-inner font-medium"
                />
              </div>

              <button
                onClick={() => handleSearch()}
                disabled={searching}
                className="w-full sm:w-auto bg-[#C89B1C] hover:bg-[#b28917] text-white font-bold px-6 xs:px-8 h-12 xs:h-14 rounded-xl xs:rounded-2xl flex items-center justify-center gap-2 text-sm xs:text-base transition-all shadow-lg cursor-pointer shrink-0 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searching ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin shrink-0" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            {/* Serviceable Popular Locations fetched dynamically from Admin */}
            {!loadingLocations && popularLocations.length > 0 && (
              <div className="flex items-center gap-1.5 xs:gap-2.5 pt-1 flex-wrap text-xs xs:text-sm">
                <span className="text-white/80 font-semibold text-[10px] xs:text-xs tracking-wide">Popular:</span>
                {popularLocations.map((loc, idx) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSearchQuery(loc);
                      handleSearch(loc);
                    }}
                    className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 hover:bg-[#C89B1C] hover:text-white hover:border-[#C89B1C] font-semibold text-[10px] xs:text-xs px-3 py-1 xs:px-4 xs:py-1.5 rounded-full transition-all cursor-pointer shadow-2xs capitalize ${
                      idx >= 2 ? "hidden sm:inline-block" : "inline-block"
                    }`}
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