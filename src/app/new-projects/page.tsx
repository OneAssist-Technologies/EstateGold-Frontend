"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, Building2, User, Briefcase, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../lib/api";
import { Property } from "../../types/property";
import FilterSidebar from "../../components/filters/FilterSidebar";
import SearchHeader from "../../components/search/SearchHeader";
import SortBar from "../../components/property/listing/SortBar";
import PropertyGrid from "../../components/property/listing/PropertyGrid";
import PropertyList from "../../components/property/listing/PropertyList";
import Pagination from "../../components/property/listing/Pagination";
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import { useCompareSession } from "../../hooks/useCompareSession";
import { removePropertyFromCompare, clearCompareSession } from "../../services/compareService";

function NewProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useCompareSession();
  const fetchIdRef = useRef(0);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [constructionStatus, setConstructionStatus] = useState("");
  const [sort, setSort] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state from URL search params on load
  useEffect(() => {
    if (!searchParams) return;
    const urlPurpose = searchParams.get("purpose");
    const urlCity = searchParams.get("city");
    const urlType = searchParams.get("type") || searchParams.get("propertyType");
    const urlSearch = searchParams.get("search");
    const urlBedrooms = searchParams.get("bedrooms");
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlConstructionStatus = searchParams.get("constructionStatus");

    if (urlPurpose !== null) setPurpose(urlPurpose);
    if (urlCity !== null) setCity(urlCity);
    if (urlSearch !== null) setSearch(urlSearch);
    if (urlBedrooms !== null) setBedrooms(urlBedrooms);
    if (urlMinPrice !== null) setMinPrice(urlMinPrice);
    if (urlMaxPrice !== null) setMaxPrice(urlMaxPrice);
    if (urlConstructionStatus !== null) setConstructionStatus(urlConstructionStatus);

    if (urlType !== null) {
      if (urlType === "NewProjects") setPropertyType("");
      else setPropertyType(urlType);
    }
  }, [searchParams]);

  const fetchNewProjects = async () => {
    const currentFetchId = ++fetchIdRef.current;
    try {
      setLoading(true);
      let response;
      const queryParams = {
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
        constructionStatus,
        sort,
      };

      try {
        response = await api.get("/new-projects", { params: queryParams });
      } catch (firstErr: any) {
        if (firstErr?.response?.status === 404) {
          response = await api.get("/properties/new-projects", { params: queryParams });
        } else {
          throw firstErr;
        }
      }

      if (currentFetchId !== fetchIdRef.current) return;

      const items = response.data.data || [];
      setProperties(items);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalProperties(response.data.pagination?.totalProperties || 0);
    } catch (error) {
      if (currentFetchId === fetchIdRef.current) {
        console.error("Failed to fetch new projects:", error);
      }
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNewProjects();
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
    constructionStatus,
    sort,
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
    setConstructionStatus("");
    setSort("latest");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Navbar />

      {/* Top Light Banner Header */}
      <section className="bg-gradient-to-r from-[#FAF8F5] via-[#FFFDF8] to-[#FAF8F5] text-[#161616] py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#ECE7DB]">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] text-xs font-bold uppercase tracking-wider shadow-3xs">
              <Sparkles size={14} /> New Construction & Launches
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#161616] tracking-tight">
              New Projects & Developments
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed font-medium">
              Discover newly launched, under-construction, and brand new properties directly from top builders, sellers, and verified developers.
            </p>
          </div>

          <div className="bg-white border border-[#E8DCC1] rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] flex items-center justify-center font-bold text-xl shrink-0">
              <Building2 size={24} />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#9A720C]">
                {totalProperties}
              </div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                Eligible New Projects
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Header */}
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

      {/* Main Content Layout */}
      <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center justify-between bg-white border border-[#ECE7DB] p-4 rounded-2xl mb-4 shadow-3xs">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 text-xs font-bold text-[#9A720C] border border-[#E8E1D4] bg-[#FAF6EE] hover:bg-[#F3EAD9] px-4 py-2.5 rounded-xl transition-all shadow-3xs cursor-pointer"
          >
            <span>Filters ⚙️</span>
          </button>
          <span className="text-xs text-gray-500 font-bold">{totalProperties} New Projects Found</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sidebar Filters */}
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

          {/* Right Main Grid */}
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
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-2xl border border-[#ECE7DB]">
                <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
                <p className="mt-4 text-xs font-semibold text-gray-500">
                  Loading verified new projects...
                </p>
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-[#FAFAF8] rounded-2xl border border-dashed border-[#ECE7DB] text-center">
                <div className="h-14 w-14 rounded-2xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] flex items-center justify-center font-bold text-xl mb-4 shadow-2xs">
                  🏗️
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No New Projects Found
                </h3>
                <p className="text-xs text-gray-500 max-w-md mt-2 leading-relaxed font-semibold">
                  We couldn't find any newly launched or under-construction properties matching your current filter criteria.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#9A720C] text-white text-xs font-bold hover:bg-[#856108] transition-all cursor-pointer shadow-xs"
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

      {/* Mobile Filters Overlay */}
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

export default function NewProjectsPage() {
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
      <NewProjectsContent />
    </Suspense>
  );
}
