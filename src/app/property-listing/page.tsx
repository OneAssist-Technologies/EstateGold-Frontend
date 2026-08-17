"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { User, Briefcase } from "lucide-react";

import api from "../../services/api";

import { Property } from "../../types/property";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar from "../../components/property-listing/FilterSidebar";
import SearchHeader from "../../components/property-listing/SearchHeader";
import SortBar from "../../components/property-listing/SortBar";
import PropertyGrid from "../../components/property-listing/PropertyGrid";
import PropertyList from "../../components/property-listing/PropertyList";
import Pagination from "../../components/property-listing/Pagination";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

function ListingContent() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
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

  // Sync state from URL search params on load or navigation
  useEffect(() => {
    if (!searchParams) return;
    const urlPurpose = searchParams.get("purpose");
    const urlCity = searchParams.get("city");
    const urlType = searchParams.get("type") || searchParams.get("propertyType");
    const urlSearch = searchParams.get("search");

    setPurpose(urlPurpose !== null ? urlPurpose : "");
    setCity(urlCity !== null ? urlCity : "");
    setSearch(urlSearch !== null ? urlSearch : "");

    if (urlType !== null) {
      if (urlType === "NewProjects") setPropertyType("Apartment / Flat");
      else if (urlType === "Commercial") setPropertyType("Commercial Space");
      else setPropertyType(urlType);
    } else {
      setPropertyType("");
    }
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

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
        },
      });

      setProperties(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalProperties(response.data.pagination?.totalProperties || 0);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
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
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
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
            className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer text-left ${
              roleFilter === "seller"
                ? "bg-[#FFF9EC] border-[#D4B04C] shadow-2xs"
                : "bg-white border-gray-200 hover:border-[#D4B04C] hover:bg-[#FAF8F5]"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              roleFilter === "seller" ? "bg-[#D4B04C] text-white" : "bg-[#FFF9EC] text-[#D4B04C]"
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
            className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer text-left ${
              roleFilter === "agent"
                ? "bg-blue-50 border-blue-400 shadow-2xs"
                : "bg-white border-gray-200 hover:border-blue-400 hover:bg-gray-50/50"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              roleFilter === "agent" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Sidebar Filter */}
          <aside className="lg:col-span-3 space-y-6">
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
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-2xl border border-[#ECE7DB]">
                <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
                <p className="mt-4 text-xs font-semibold text-gray-500">
                  Loading verified properties...
                </p>
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-[#FAFAF8] rounded-2xl border border-dashed border-[#ECE7DB] text-center">
                <div className="h-14 w-14 rounded-2xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] flex items-center justify-center font-bold text-xl mb-4 shadow-2xs">
                  📍
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-serif">
                  {city ? `No Properties in ${city}` : "No Properties Found"}
                </h3>
                <p className="text-xs text-gray-500 max-w-md mt-2 leading-relaxed font-semibold">
                  {city ? (
                    "no properties are available currently on this city you have reminder message if any new property arrive on this location thankyou"
                  ) : (
                    "We couldn't find any properties matching your selected filters. Try clearing some filters or searching for another location."
                  )}
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#9A720C] text-white text-xs font-bold hover:bg-[#856108] transition-all shadow-xs cursor-pointer"
                >
                  Clear All Filters
                </button>
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