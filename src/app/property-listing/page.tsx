"use client";

import { useEffect, useState } from "react";

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

export default function PropertyListingPage() {
 const [properties, setProperties] = useState<Property[]>([]);
const [loading, setLoading] = useState(true);

const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);

const [totalPages, setTotalPages] = useState(1);
const [totalProperties, setTotalProperties] = useState(0);

const [search, setSearch] = useState("");
const [purpose, setPurpose] = useState("");

const [city, setCity] = useState("");
const [propertyType, setPropertyType] = useState("");
const [bedrooms, setBedrooms] = useState("");
const [furnishing, setFurnishing] = useState("");

const [sort, setSort] = useState("latest");

const [view, setView] = useState<"grid" | "list">("grid");
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
        sort,
      },
    });

    setProperties(response.data.data || []);

    setTotalPages(
      response.data.pagination?.totalPages || 1
    );

    setTotalProperties(
      response.data.pagination?.totalProperties || 0
    );
  } catch (error) {
    console.error(error);
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
  sort,
]);

  return (
      <>
        <Navbar/>
    <div className="h-screen bg-white flex flex-col">

      {/* Sticky Search Header */}

     <motion.div
  initial={{
    y: -40,
    opacity: 0,
  }}
  animate={{
    y: 0,
    opacity: 1,
  }}
  transition={{
    duration: 0.5,
  }}
  className="
    sticky
    top-0
    z-40
    bg-white
    border-b
    border-[#E8DCC1]
  "
>
        <SearchHeader
          purpose={purpose}
          setPurpose={setPurpose}
          search={search}
          setSearch={setSearch}
        />
      </motion.div>

      {/* Content */}

      <div
        className="
          flex-1
          max-w-[1450px]
          mx-auto
          w-full
          px-8
          py-8
          overflow-hidden
        "
      >
        <div
          className="
            grid
            grid-cols-12
            gap-8
            h-full
          "
        >
          {/* Filter Sidebar */}

<motion.div
  initial={{
    opacity: 0,
    x: -40,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: 0.6,
  }}
  className="
    col-span-3
    overflow-y-auto
    pr-2
  "
>
      <FilterSidebar
  city={city}
  setCity={(value) => {
    setCity(value);
    setPage(1);
  }}
  propertyType={propertyType}
  setPropertyType={(value) => {
    setPropertyType(value);
    setPage(1);
  }}
  bedrooms={bedrooms}
  setBedrooms={(value) => {
    setBedrooms(value);
    setPage(1);
  }}
  furnishing={furnishing}
  setFurnishing={(value) => {
    setFurnishing(value);
    setPage(1);
  }}
  clearFilters={() => {
    setSearch("");
    setPurpose("");
    setCity("");
    setPropertyType("");
    setBedrooms("");
    setFurnishing("");
    setSort("latest");
    setPage(1);
  }}
/>
          </motion.div>

          {/* Property Section */}

          <motion.div
  initial={{
    opacity: 0,
    x: 40,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: 0.6,
  }}
  className="
    col-span-9
    overflow-y-auto
    pr-2
  "
>
            <div className="flex justify-between items-center mb-6">

    <SortBar
  total={totalProperties}
  view={view}
  setView={setView}
  sort={sort}
  setSort={setSort}
/>
             
            </div>

          {loading ? (
 <motion.div
  initial={{
    opacity: 0,
  }}
  animate={{
    opacity: 1,
  }}
  transition={{
    duration: 0.4,
  }}
  className="flex items-center justify-center h-[500px]"
>
    <div className="text-center">

      <div
        className="
          h-12
          w-12
          mx-auto
          rounded-full
          border-4
          border-[#E8DCC1]
          border-t-[#C89B1C]
          animate-spin
        "
      />

      <p className="mt-5 text-gray-500 text-lg">
        Loading Properties...
      </p>

    </div>
  </motion.div>
) : properties.length === 0 ? (
  <div
    className="
      flex
      flex-col
      items-center
      justify-center
      h-[500px]
      border
      border-dashed
      border-[#E8DCC1]
      rounded-3xl
      bg-[#FCFBF8]
    "
  >
    <img
      src="/images/no-properties.svg"
      alt="No Properties"
      className="w-48 mb-6"
    />

    <h2 className="text-3xl font-semibold text-[#161616]">
      No Properties Found
    </h2>

    <p className="text-gray-500 mt-3 max-w-md text-center">
      We couldnt find any properties matching your
      search or filters. Try changing the filters or
      clearing your search.
    </p>

    <button
      onClick={() => {
        setSearch("");
        setPurpose("");
        setPage(1);
      }}
      className="
        mt-8
        px-8
        py-3
        rounded-xl
        bg-[#C89B1C]
        text-white
        hover:bg-[#B68B17]
        transition
      "
    >
      Clear Filters
    </button>
  </div>
) : <AnimatePresence mode="wait">

<motion.div
  key={view}
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  exit={{
    opacity: 0,
    y: -20,
  }}
  transition={{
    duration: 0.35,
  }}
>

{view === "grid" ? (
  <PropertyGrid
    properties={properties}
  />
) : (
  <PropertyList
    properties={properties}
  />
)}

</motion.div>

</AnimatePresence>}

         {!loading &&
  properties.length > 0 &&
  totalPages > 1 && (
  <motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    delay: 0.2,
  }}
>
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    setCurrentPage={setPage}
  />
</motion.div>
)}
          </motion.div>
        </div>
      </div>
    </div>
     <Footer/>
        </>
  );
}