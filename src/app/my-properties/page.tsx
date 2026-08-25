"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/src/lib/api";

import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";

import DashboardCards from "@/src/components/property/my-properties/DashboardCards";
import StatusTabs, {
  PropertyStatus,
} from "@/src/components/property/my-properties/StatusTabs";
import PropertyRow from "@/src/components/property/my-properties/PropertyRow";
import Pagination from "@/src/components/property/listing/Pagination";
import DeletePropertyModal from "@/src/components/property/my-properties/DeletePropertyModal";

import { useAuth } from "@/src/hooks/useAuth";;
import { Property } from "@/src/types/property";

import {
Search,
Plus
} from "lucide-react";

import { motion } from "framer-motion";
export default function MyPropertiesPage() {
const { user, isAuthenticated, loading: authLoading } = useAuth();
const router = useRouter();

useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    router.push("/login");
  }
}, [authLoading, isAuthenticated, router]);
const [properties,setProperties]=
useState<Property[]>([]);

const [loading,setLoading]=
useState(true);

const [page,setPage]=
useState(1);

const [limit,setLimit]=
useState(10);

const [totalPages,setTotalPages]=
useState(1);

const [totalProperties,setTotalProperties]=
useState(0);

const [search,setSearch]=
useState("");
const [status, setStatus] =
useState<PropertyStatus>("all");

const [selectedProperty,setSelectedProperty]=
useState<Property|null>(null);

const [deleteProperty,setDeleteProperty]=
useState<Property|null>(null);

const [openDelete,setOpenDelete]=
useState(false);

const [counts,setCounts]=
useState({

all:0,

active:0,

pending:0,

inactive:0,

rejected:0

});
// const totalViews=

// properties.reduce(

// (sum,item)=>

// sum+(item.views||0),

// 0

// );

// const totalEnquiries=

// properties.reduce(

// (sum,item)=>

// sum+(item.enquiries||0),

// 0

// );
  const fetchProperties = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const response = await api.get("/my-properties", {
        params: {
          page,
          limit,
          search,
          status: status === "all" ? "" : status,
        },
      });

      setProperties(response.data.data);
      setCounts(response.data.counts);
      setTotalPages(response.data.pagination.totalPages);
      setTotalProperties(response.data.pagination.totalProperties);
    } catch (err) {
      console.log(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleStatusChange = async (property: Property) => {
    try {
      const isActive = ["approved", "active", "published"].includes(property.status);
      const newStatus = isActive ? "inactive" : "approved";

      // 1. Optimistic instant UI update for card toggle
      setProperties((prev) =>
        prev.map((item) =>
          item._id === property._id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      // 2. Optimistic instant counts update
      setCounts((prev) => ({
        ...prev,
        active: isActive ? Math.max(0, prev.active - 1) : prev.active + 1,
        inactive: isActive ? prev.inactive + 1 : Math.max(0, prev.inactive - 1),
      }));

      // 3. Background API request
      await api.patch(`/properties/${property._id}/status`, {
        status: newStatus,
      });

      // 4. Silent background sync without triggering full page loading state (zero flicker)
      fetchProperties(false);
    } catch (err) {
      console.log("Status change error:", err);
      // Revert silent update on error
      fetchProperties(false);
    }
  };
const handleView=(

id:string

)=>{

router.push(

`/property-detail/${id}`

);

}
const handleEdit=(

property:Property

)=>{

router.push(

`/my-properties/edit/${property._id}`

);

}
const handleDelete=(

property:Property

)=>{

setDeleteProperty(

property

);

setOpenDelete(

true

);

}
useEffect(() => {
  const timer = setTimeout(() => {
    fetchProperties();
  }, 400);

  return () => clearTimeout(timer);
}, [page, limit, search, status]);
const fade={

initial:{

opacity:0,

y:20

},

animate:{

opacity:1,

y:0

}

};

  const totalViews = properties.reduce(
    (sum, item) => sum + (item.views || 0),
    0
  );

  const totalEnquiries = properties.reduce(
    (sum, item) => sum + (item.enquiries?.length || 0),
    0
  );

return (
  <>
    <Navbar />

    <div className="min-h-screen bg-[#FAFAFA]">

      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-6 sm:py-10">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.fullName ? `${user.fullName}'s Listed Properties` : "My Properties"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Showing property listings owned by {user?.fullName || "your account"} ({user?.email || "Authenticated"})
            </p>
          </div>

          <button
            onClick={() => router.push("/post-property")}
            className="h-10 px-4 rounded-xl bg-[#C89B1C] hover:bg-[#B88D18] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus size={14} />
            Add Property
          </button>
        </motion.div>

        {/* Dashboard */}

      <DashboardCards
        total={counts.all}
        active={counts.active}
        views={totalViews}
        enquiries={totalEnquiries}
      />

        {/* Status */}

        <StatusTabs
          activeTab={status}
          setActiveTab={(value) => {
            setStatus(value);
            setPage(1);
          }}
          counts={counts}
        />

        {/* Search */}

        <div
          className="bg-white border border-[#E8DCC1] rounded-2xl px-6 h-16 flex items-center mt-8 mb-8"
        >

          <Search
            size={22}
            className="text-gray-400"
          />

        <input
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}
  placeholder="Search by city, locality, property type..."
  className="flex-1 ml-4 outline-none text-lg"
/>

        </div>

        {/* Loading */}

        {loading ? (

          <div className="flex justify-center py-32">

            <div
              className="h-14 w-14 rounded-full border-4 border-[#E8DCC1] border-t-[#C89B1C] animate-spin"
            />

          </div>

        ) : properties.length === 0 ? (

          <div
            className="bg-white rounded-3xl border border-dashed border-[#E8DCC1] py-28 text-center"
          >

            <img
              src="/images/no-properties.svg"
              className="w-52 mx-auto"
            />

            <h2 className="text-3xl font-semibold mt-8">

              No Properties Found

            </h2>

            <p className="text-gray-500 mt-4">

              No property matches your search.

            </p>

            <button
              onClick={() => {

                setSearch("");

                setStatus("all");

              }}
              className="mt-8 px-7 h-12 rounded-xl bg-[#C89B1C] text-white"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <>
            {/* Property List */}

            <div className="space-y-7">

              {properties.map(
                (property) => (

                  <PropertyRow
                    key={property._id}
                    property={property}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={() =>
                      handleStatusChange(
                        property
                      )
                    }
                  />

                )
              )}

            </div>

            {/* Pagination */}

            {totalPages > 1 && (

              <div className="mt-12">

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  setCurrentPage={setPage}
                />

              </div>

            )}

          </>

        )}

      </div>



<DeletePropertyModal
  open={openDelete}
  property={deleteProperty}
  onClose={() => {
    setOpenDelete(false);
    setDeleteProperty(null);
  }}
  onDeleted={() => {
    setOpenDelete(false);
    fetchProperties();
  }}
/>

    </div>

    <Footer />

  </>
);
}