"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/src/services/api";

import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

import DashboardCards from "@/src/components/my-properties/DashboardCards";
import StatusTabs, {
  PropertyStatus,
} from "@/src/components/my-properties/StatusTabs";
import PropertyRow from "@/src/components/my-properties/PropertyRow";
import Pagination from "@/src/components/property-listing/Pagination";
import EditPropertyModal from "@/src/components/my-properties/EditPropertyModal";
import DeletePropertyModal from "@/src/components/my-properties/DeletePropertyModal";

import { Property } from "@/src/types/property";

import {
Search,
Plus
} from "lucide-react";

import { motion } from "framer-motion";
export default function MyPropertiesPage() {

const router = useRouter();
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

const [openEdit,setOpenEdit]=
useState(false);

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
const fetchProperties=
async()=>{

try{

setLoading(true);

const response=
await api.get("/my-properties", {
  params: {
    page,
    limit,
    search,
    status:
      status === "all" ? "" : status,
  },
});

setProperties(

response.data.data

);

setCounts(

response.data.counts

);

setTotalPages(

response.data.pagination.totalPages

);

setTotalProperties(

response.data.pagination.totalProperties

);

}catch(err){

console.log(err);

}

finally{

setLoading(false);

}

}
const handleStatusChange = async (
  property: Property
) => {
  try {
    const newStatus =
      property.status === "active"
        ? "inactive"
        : "active";

    await api.patch(
      `/properties/${property._id}/status`,
      {
        status: newStatus,
      }
    );

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

    fetchProperties();
  } catch (err) {
    console.log(err);
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

setSelectedProperty(

property

);

setOpenEdit(

true

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
return (
  <>
    <Navbar />

    <div className="min-h-screen bg-[#FAFAFA]">

      <div className="max-w-[1500px] mx-auto px-8 py-10">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .4 }}
          className="flex justify-between items-center mb-10"
        >

          <div>

            <h1 className="text-5xl font-bold text-[#161616]">
              My Properties
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
              Manage all your listed properties
            </p>

          </div>

          <button
            onClick={() =>
              router.push("/post-property")
            }
            className="
              h-14
              px-7
              rounded-2xl
              bg-[#C89B1C]
              hover:bg-[#B88D18]
              text-white
              font-semibold
              flex
              items-center
              gap-3
              transition
            "
          >

            <Plus size={20} />

            Add Property

          </button>

        </motion.div>

        {/* Dashboard */}

      <DashboardCards
  total={totalProperties}
  active={counts.active}
  pending={counts.pending}
  inactive={counts.inactive}
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
          className="
            bg-white
            border
            border-[#E8DCC1]
            rounded-2xl
            px-6
            h-16
            flex
            items-center
            mt-8
            mb-8
          "
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
  className="
    flex-1
    ml-4
    outline-none
    text-lg
  "
/>

        </div>

        {/* Loading */}

        {loading ? (

          <div className="flex justify-center py-32">

            <div
              className="
                h-14
                w-14
                rounded-full
                border-4
                border-[#E8DCC1]
                border-t-[#C89B1C]
                animate-spin
              "
            />

          </div>

        ) : properties.length === 0 ? (

          <div
            className="
              bg-white
              rounded-3xl
              border
              border-dashed
              border-[#E8DCC1]
              py-28
              text-center
            "
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
              className="
                mt-8
                px-7
                h-12
                rounded-xl
                bg-[#C89B1C]
                text-white
              "
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

      {/* Edit */}

 <EditPropertyModal
  open={openEdit}
  property={selectedProperty}
  onClose={() => {
    setOpenEdit(false);
    setSelectedProperty(null);
  }}
  onUpdated={() => {
    setOpenEdit(false);
    fetchProperties();
  }}
/>

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