"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { User, Briefcase, X } from "lucide-react";

import api from "../../lib/api";

import { Property } from "../../types/property";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar from "../../components/filters/FilterSidebar";
import SearchHeader from "../../components/search/SearchHeader";
import SortBar from "../../components/property/listing/SortBar";
import PropertyGrid from "../../components/property/listing/PropertyGrid";
import PropertyList from "../../components/property/listing/PropertyList";
import Pagination from "../../components/property/listing/Pagination";
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import { useRouter } from "next/navigation";
import { useCompareSession } from "../../hooks/useCompareSession";
import { removePropertyFromCompare, clearCompareSession } from "../../services/compareService";;

function ListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useCompareSession();
  const fetchIdRef = useRef(0);

  const [properties, setProperties] = useState<Property[]>([]);
  const [suggestedProperties, setSuggestedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState(""); // Default empty for All Properties

  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [furnishing, setFurnishing] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [sort, setSort] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // AI search additional states
  const [showNearby, setShowNearby] = useState(false);
  const [isNearbyResults, setIsNearbyResults] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading verified properties...");

  // Sync state from URL search params on load or navigation
  useEffect(() => {
    if (!searchParams) return;
    const urlPurpose = searchParams.get("purpose");
    const urlCity = searchParams.get("city");
    const urlType = searchParams.get("type") || searchParams.get("propertyType");
    const urlSearch = searchParams.get("search");
    const urlBedrooms = searchParams.get("bedrooms");
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlNearby = searchParams.get("nearby");

    setPurpose(urlPurpose !== null ? urlPurpose : "");
    setCity(urlCity !== null ? urlCity : "");
    setSearch(urlSearch !== null ? urlSearch : "");
    setBedrooms(urlBedrooms !== null ? urlBedrooms : "");
    setMinPrice(urlMinPrice !== null ? urlMinPrice : "");
    setMaxPrice(urlMaxPrice !== null ? urlMaxPrice : "");
    setShowNearby(urlNearby === "true");

    if (urlType !== null) {
      if (urlType === "NewProjects") setPropertyType("Apartment / Flat");
      else if (urlType.toLowerCase() === "commercial" || urlType.toLowerCase() === "commercial space") setPropertyType("Commercial");
      else setPropertyType(urlType);
    } else {
      setPropertyType("");
    }
  }, [searchParams]);

  // Synchronize URL search parameter on initial load to highlight sidebar filters
  useEffect(() => {
    async function syncParsedSearch() {
      if (search && search.trim() !== "" && !city && !propertyType && !bedrooms && !purpose) {
        try {
          const res = await api.post("/ai/parse-search", { query: search.trim() });
          if (res.data && res.data.success) {
            if (res.data.city) setCity(res.data.city);
            if (res.data.propertyType) setPropertyType(res.data.propertyType);
            if (res.data.bedrooms) setBedrooms(res.data.bedrooms);
            if (res.data.purpose) setPurpose(res.data.purpose);
            if (res.data.minPrice) setMinPrice(res.data.minPrice);
            if (res.data.maxPrice) setMaxPrice(res.data.maxPrice);
          }
        } catch (err) {
          console.error("Failed to parse initial search param:", err);
        }
      }
    }
    syncParsedSearch();
  }, [search]);

  // Sync state changes back to the URL search params (Stable & Loop-Free)
  useEffect(() => {
    // If the URL has query parameters, but our states are all empty,
    // it means the component just mounted and has not hydrated/synced the URL params into the state yet.
    // We should skip syncing back in this case to prevent wiping out the URL query params.
    const urlHasParams = typeof window !== "undefined" && window.location.search && window.location.search.length > 1;
    const statesAreEmpty = !search && !purpose && !city && !propertyType && !bedrooms && !furnishing && !minPrice && !maxPrice;
    if (urlHasParams && statesAreEmpty) {
      return;
    }

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (purpose) params.set("purpose", purpose);
    if (city) params.set("city", city);
    if (propertyType) params.set("propertyType", propertyType);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (furnishing) params.set("furnishing", furnishing);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (roleFilter) params.set("role", roleFilter);
    if (page > 1) params.set("page", String(page));
    if (sort !== "latest") params.set("sort", sort);
    if (showNearby) params.set("nearby", "true");

    const newUrl = `/property-listing?${params.toString()}`;
    const currentParams = new URLSearchParams(window.location.search);
    if (params.toString() !== currentParams.toString()) {
      router.push(newUrl);
    }
  }, [
    search,
    purpose,
    city,
    propertyType,
    bedrooms,
    furnishing,
    minPrice,
    maxPrice,
    roleFilter,
    page,
    sort,
    showNearby
  ]);

  // Reset showNearby state when search or other filters change
  useEffect(() => {
    setShowNearby(false);
  }, [
    search,
    purpose,
    city,
    propertyType,
    bedrooms,
    furnishing,
    minPrice,
    maxPrice,
    roleFilter,
  ]);

  const handleSearchSubmit = async (val: string) => {
    setSearch(val);
    setPage(1);

    if (!val || val.trim() === "") {
      setCity("");
      setPropertyType("");
      setBedrooms("");
      setPurpose("");
      setMinPrice("");
      setMaxPrice("");
      return;
    }

    try {
      const res = await api.post("/ai/parse-search", { query: val.trim() });
      if (res.data && res.data.success) {
        if (res.data.city) setCity(res.data.city);
        if (res.data.propertyType) setPropertyType(res.data.propertyType);
        if (res.data.bedrooms) setBedrooms(res.data.bedrooms);
        if (res.data.purpose) setPurpose(res.data.purpose);
        if (res.data.minPrice) setMinPrice(res.data.minPrice);
        if (res.data.maxPrice) setMaxPrice(res.data.maxPrice);
      }
    } catch (err) {
      console.error("Failed to parse search query:", err);
    }
  };

  const fetchProperties = async () => {
    const currentFetchId = ++fetchIdRef.current;
    try {
      setLoading(true);
      if (search && search.trim() !== "") {
        setLoadingMessage("Analyzing your search query...");
      } else {
        setLoadingMessage("Loading verified properties...");
      }

      console.log("API CALL PARAMS:", {
        page,
        limit,
        search,
        purpose,
        city,
        propertyType,
        bedrooms,
        furnishing,
        minPrice,
        maxPrice,
        sort,
        role: roleFilter,
        nearby: showNearby,
      });

      if (typeof window !== "undefined") {
        const prefObject = {
          purpose: purpose || undefined,
          city: city || undefined,
          propertyType: propertyType || undefined,
          bedrooms: bedrooms ? Number(bedrooms) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          furnishing: furnishing || undefined,
          nearby: showNearby ? ["school", "hospital", "metro"] : undefined
        };
        localStorage.setItem("estategold_user_preferences", JSON.stringify(prefObject));
        window.dispatchEvent(new Event("estategold_user_preferences_changed"));
      }

      const response = await api.get("/properties", {
        params: {
          page,
          limit,
          search,
          purpose,
          city,
          propertyType,
          bedrooms,
          furnishing,
          minPrice,
          maxPrice,
          sort,
          role: roleFilter,
          nearby: showNearby ? "true" : "false",
        },
      });

      if (currentFetchId !== fetchIdRef.current) return;

      const items = response.data.data || [];
      setIsNearbyResults(!!response.data.isNearbyResults);

      if (items.length > 0) {
        setProperties(items);
        setSuggestedProperties([]);
      } else {
        setProperties([]);
        if (!showNearby) {
          try {
            const fallbackRes = await api.get("/properties", {
              params: { limit: 4, sort: "latest" }
            });
            if (currentFetchId !== fetchIdRef.current) return;
            setSuggestedProperties(fallbackRes.data.data || []);
          } catch (fallbackErr) {
            console.error("Failed to load suggested properties:", fallbackErr);
          }
        } else {
          setSuggestedProperties([]);
        }
      }
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalProperties(response.data.pagination?.totalProperties || 0);
    } catch (error) {
      if (currentFetchId === fetchIdRef.current) {
        console.error("Failed to fetch properties:", error);
      }
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [
    page,
    limit,
    search,
    purpose,
    city,
    propertyType,
    bedrooms,
    furnishing,
    minPrice,
    maxPrice,
    sort,
    roleFilter,
    showNearby,
  ]);

  const handleClearFilters = () => {
    setSearch("");
    setPurpose("");
    setCity("");
    setPropertyType("");
    setBedrooms("");
    setFurnishing("");
    setMinPrice("");
    setMaxPrice("");
    setSort("latest");
    setRoleFilter("");
    setPage(1);
    setShowNearby(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Navbar />

      {/* Top Search & Filter Bar */}
      <SearchHeader
        purpose={purpose}
        setPurpose={(val) => {
          setPurpose(val);
          setPage(1);
        }}
        search={search}
        setSearch={handleSearchSubmit}
      />

      {/* Main Two-Column Layout */}
      <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Role Filter Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
          {/* Owner Card */}
          <button
            onClick={() => {
              setRoleFilter(roleFilter === "seller" ? "" : "seller");
              setPage(1);
            }}
            className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer text-left ${roleFilter === "seller"
              ? "bg-[#FFF9EC] border-[#D4B04C] shadow-2xs"
              : "bg-white border-gray-200 hover:border-[#D4B04C] hover:bg-[#FAF8F5]"
              }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${roleFilter === "seller" ? "bg-[#D4B04C] text-white" : "bg-[#FFF9EC] text-[#D4B04C]"
              }`}>
              <User size={16} />
            </div>
            <div>
              <span className={`block text-[10px] font-bold ${roleFilter === "seller" ? "text-[#9A720C]" : "text-gray-400"}`}>
                Properties by
              </span>
              <span className="block text-xs font-black text-gray-900 leading-tight">
                Owner / Seller
              </span>
            </div>
          </button>

          {/* Agent Card */}
          <button
            onClick={() => {
              setRoleFilter(roleFilter === "agent" ? "" : "agent");
              setPage(1);
            }}
            className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer text-left ${roleFilter === "agent"
              ? "bg-blue-50 border-blue-400 shadow-2xs"
              : "bg-white border-gray-200 hover:border-blue-400 hover:bg-gray-50/50"
              }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${roleFilter === "agent" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
              }`}>
              <Briefcase size={16} />
            </div>
            <div>
              <span className={`block text-[10px] font-bold ${roleFilter === "agent" ? "text-blue-700" : "text-gray-400"}`}>
                Properties by
              </span>
              <span className="block text-xs font-black text-gray-900 leading-tight">
                Certified Agent
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Filter Button Trigger */}
        <div className="lg:hidden flex items-center justify-between bg-white border border-[#ECE7DB] p-4 rounded-2xl mb-4 shadow-3xs">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 text-xs font-bold text-[#9A720C] border border-[#E8E1D4] bg-[#FAF6EE] hover:bg-[#F3EAD9] px-4 py-2.5 rounded-xl transition-all shadow-3xs cursor-pointer"
          >
            <span>Filters ⚙️</span>
          </button>
          <span className="text-xs text-gray-500 font-bold">{totalProperties} Properties Found</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Sidebar Filter */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <FilterSidebar
              city={city}
              setCity={(val) => {
                setCity(val);
                setPage(1);
              }}
              propertyType={propertyType}
              setPropertyType={(val) => {
                setPropertyType(val);
                setPage(1);
              }}
              bedrooms={bedrooms}
              setBedrooms={(val) => {
                setBedrooms(val);
                setPage(1);
              }}
              furnishing={furnishing}
              setFurnishing={(val) => {
                setFurnishing(val);
                setPage(1);
              }}
              minPrice={minPrice}
              setMinPrice={(val) => {
                setMinPrice(val);
                setPage(1);
              }}
              maxPrice={maxPrice}
              setMaxPrice={(val) => {
                setMaxPrice(val);
                setPage(1);
              }}
              clearFilters={handleClearFilters}
            />
          </aside>

          {/* Right Property Grid Section */}
          <section className="lg:col-span-9 space-y-4">
            <SortBar
              total={totalProperties}
              view={view}
              setView={setView}
              sort={sort}
              setSort={(val) => {
                setSort(val);
                setPage(1);
              }}
              search={search}
              isNearby={isNearbyResults}
            />

            {isNearbyResults && (
              <div className="bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 mb-4 animate-[fadeIn_0.3s_ease_out]">
                <span>📍</span>
                <span>Showing Nearby / Similar Properties matching your criteria</span>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-2xl border border-[#ECE7DB]">
                <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
                <p className="mt-4 text-xs font-semibold text-gray-500">
                  {loadingMessage}
                </p>
              </div>
            ) : properties.length === 0 ? (
              <div className="space-y-8 text-left animate-[fadeIn_0.5s_ease_out]">
                <div className="flex flex-col items-center justify-center p-12 bg-[#FAFAF8] rounded-2xl border border-dashed border-[#ECE7DB] text-center">
                  <div className="h-14 w-14 rounded-2xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] flex items-center justify-center font-bold text-xl mb-4 shadow-2xs">
                    📍
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    No properties found
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mt-2 leading-relaxed font-semibold">
                    {!showNearby
                      ? "We couldn't find properties matching your search. Try looking for nearby properties."
                      : "We couldn't find any nearby properties matching your criteria."}
                  </p>
                  <div className="flex items-center gap-3 justify-center mt-5">
                    {!showNearby && (
                      <button
                        type="button"
                        onClick={() => setShowNearby(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#9A720C] text-white text-xs font-bold hover:bg-[#856108] transition-all shadow-xs cursor-pointer"
                      >
                        View Nearby Properties
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8] text-xs font-bold transition-all cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>

                {!showNearby && !search && suggestedProperties.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-[#ECE7DB]/60">
                    <h3 className="text-lg font-bold text-gray-900 text-left">
                      Explore Other Available Properties
                    </h3>
                    {view === "grid" ? (
                      <PropertyGrid properties={suggestedProperties} />
                    ) : (
                      <PropertyList properties={suggestedProperties} />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {view === "grid" ? (
                    <PropertyGrid properties={properties} />
                  ) : (
                    <PropertyList properties={properties} />
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {!loading && properties.length > 0 && totalPages > 1 && (
              <div className="pt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  setCurrentPage={setPage}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Floating Compare Bar */}
      {session.properties.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border border-[#ECE7DB] shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-6 max-w-4xl w-[90%] md:w-fit transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="h-6 px-2 rounded-full bg-[#FFF9EC] text-[#9A720C] text-xs font-black flex items-center justify-center border border-[#F4E3B5]">
              {session.properties.length}
            </span>
            <span className="text-xs font-black text-gray-800 uppercase tracking-wider hidden md:inline">
              Compare List
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {session.properties.map((p) => {
              const image = p.photos?.[0]
                ? (p.photos[0].startsWith("http") ? p.photos[0] : `http://localhost:5000/uploads/properties/${p.photos[0].replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "")}`)
                : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=80&q=80";
              return (
                <div key={p._id} className="relative group flex items-center gap-2 bg-[#FFFDF6] border border-[#F4E3B5] px-2 py-1.5 rounded-xl shadow-3xs hover:border-[#9A720C] transition-colors shrink-0">
                  <img src={image} className="w-8 h-8 object-cover rounded-lg border border-[#F4E3B5]" />
                  <div className="leading-tight max-w-[120px] truncate text-left">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block truncate">{p.propertyType}</span>
                    <span className="text-xs font-bold text-gray-900 block truncate">{p.bedrooms ? `${p.bedrooms} BHK` : ""} {p.locality || p.city}</span>
                  </div>
                  <button
                    onClick={() => removePropertyFromCompare(p._id)}
                    className="text-gray-400 hover:text-red-500 text-sm font-black ml-1.5 cursor-pointer bg-none border-none"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button onClick={clearCompareSession} className="text-xs font-bold text-gray-400 hover:text-red-500 cursor-pointer bg-none border-none">
              Clear All
            </button>
            <button
              onClick={() => {
                if (session.properties.length < 2) {
                  alert("Select at least 2 properties to compare.");
                  return;
                }
                router.push(`/properties/compare?ids=${session.properties.map(p => p._id).join(",")}`);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5 ${session.properties.length >= 2
                  ? "bg-[#9A720C] hover:bg-[#856108]"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Compare Now {session.properties.length >= 2 ? `(${session.properties.length})` : ""}
            </button>
          </div>
        </div>
      )}
      {/* Mobile Filters Drawer Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 border-l border-[#ECE7DB] shadow-2xl p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-[#ECE7DB] pb-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <FilterSidebar
                city={city}
                setCity={(val) => {
                  setCity(val);
                  setPage(1);
                }}
                propertyType={propertyType}
                setPropertyType={(val) => {
                  setPropertyType(val);
                  setPage(1);
                }}
                bedrooms={bedrooms}
                setBedrooms={(val) => {
                  setBedrooms(val);
                  setPage(1);
                }}
                furnishing={furnishing}
                setFurnishing={(val) => {
                  setFurnishing(val);
                  setPage(1);
                }}
                minPrice={minPrice}
                setMinPrice={(val) => {
                  setMinPrice(val);
                  setPage(1);
                }}
                maxPrice={maxPrice}
                setMaxPrice={(val) => {
                  setMaxPrice(val);
                  setPage(1);
                }}
                clearFilters={handleClearFilters}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function PropertyListingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col font-sans">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
          </div>
          <Footer />
        </div>
      }
    >
      <ListingContent />
    </Suspense>
  );
}