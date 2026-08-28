"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

import {
  BedDouble,
  Bath,
  Scan,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  Building,
  MessageSquare,
  ChevronDown,
  Tag,
  Check,
} from "lucide-react";

import { Property } from "@/src/types/property";
import { propertyApi } from "@/src/services/property.service";

interface Props {
  property: Property;
  onView: (id: string) => void;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onStatusChange?: () => void;
  onAvailabilityStatusChange?: (id: string, newStatus: string) => void;
  onViewEnquiries: (id: string) => void;
}

function formatPrice(price?: number, purpose?: string): string {
  if (!price || isNaN(price)) return "₹0";
  const isRent = (purpose || "").toLowerCase().includes("rent") || (purpose || "").toLowerCase().includes("lease");

  let formatted = "";
  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2);
    formatted = `₹${cr.replace(/\.00$/, "")} Cr`;
  } else if (price >= 100000) {
    const l = (price / 100000).toFixed(1);
    formatted = `₹${l.replace(/\.0$/, "")} L`;
  } else {
    formatted = `₹${price.toLocaleString("en-IN")}`;
  }

  return isRent ? `${formatted}/mo` : formatted;
}

export default function PropertyRow({
  property,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onAvailabilityStatusChange,
  onViewEnquiries,
}: Props) {
  const [currentAvailStatus, setCurrentAvailStatus] = useState<string>(
    property.availabilityStatus || "on_sale"
  );
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const isRent = (property.purpose || "").toLowerCase().includes("rent") || (property.purpose || "").toLowerCase().includes("lease");

  const mainPhoto =
    property.photos && property.photos.length > 0
      ? property.photos[0].startsWith("http")
        ? property.photos[0]
        : `http://localhost:5000/uploads/properties/${property.photos[0]}`
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

  const isActive = ["approved", "active", "published"].includes(property.status);

  // Dynamic clean title
  const isPlot = property.propertyType === "Plot / Land";
  const isCommercial = property.propertyType === "Commercial Space";

  let displayTitle = "";
  if (isPlot) {
    displayTitle = `${property.propertyType} in ${property.locality || "Local"}`;
  } else if (isCommercial) {
    displayTitle = `${(property as any).commercialType || "Commercial Space"} in ${property.locality || "Local"}`;
  } else {
    displayTitle = `${property.bedrooms ? `${property.bedrooms} BHK ` : ""}${property.propertyType} in ${property.locality || "Local"}`;
  }

  // Determine availability status badge properties
  let statusLabel = isActive ? "Active" : "Inactive";
  let statusColor = isActive ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500";
  let dotColor = isActive ? "bg-green-500" : "bg-gray-400";

  if (property.deleteRequested) {
    statusLabel = "Delete Requested";
    statusColor = "bg-amber-50 border-amber-200 text-amber-700";
    dotColor = "bg-amber-500 animate-pulse";
  } else if (property.status === "pending") {
    statusLabel = "Pending Review";
    statusColor = "bg-yellow-50 border-yellow-200 text-yellow-700";
    dotColor = "bg-yellow-500";
  } else if (property.status === "rejected") {
    statusLabel = "Rejected";
    statusColor = "bg-red-50 border-red-200 text-red-700";
    dotColor = "bg-red-500";
  } else if (currentAvailStatus === "on_sale") {
    statusLabel = isRent ? "Available for Rent" : "On Sale";
    statusColor = "bg-emerald-50 border-emerald-200 text-emerald-700";
    dotColor = "bg-emerald-500";
  } else if (currentAvailStatus === "hold") {
    statusLabel = "On Hold";
    statusColor = "bg-amber-50 border-amber-200 text-amber-700";
    dotColor = "bg-amber-500";
  } else if (currentAvailStatus === "sold") {
    statusLabel = "Sold";
    statusColor = "bg-red-50 border-red-200 text-red-700";
    dotColor = "bg-red-500";
  } else if (currentAvailStatus === "rented") {
    statusLabel = "Rented";
    statusColor = "bg-blue-50 border-blue-200 text-blue-700";
    dotColor = "bg-blue-500";
  }

  // Handle owner status update
  const handleSelectStatus = async (newStatus: string) => {
    if (newStatus === currentAvailStatus) {
      setShowStatusMenu(false);
      return;
    }

    try {
      setUpdatingStatus(true);
      setCurrentAvailStatus(newStatus);
      setShowStatusMenu(false);

      await propertyApi.updateStatus(property._id, { availabilityStatus: newStatus });

      let label = "On Sale";
      if (newStatus === "hold") label = "On Hold";
      if (newStatus === "sold") label = isRent ? "Rented" : "Sold";
      if (newStatus === "rented") label = "Rented";
      if (newStatus === "on_sale") label = isRent ? "Available for Rent" : "On Sale";

      toast.success(`Property status updated to ${label}.`);

      if (onAvailabilityStatusChange) {
        onAvailabilityStatusChange(property._id, newStatus);
      }
    } catch (err: any) {
      console.error("Status update error:", err);
      setCurrentAvailStatus(property.availabilityStatus || "on_sale");
      toast.error(err?.response?.data?.message || "Failed to update property status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Construct specs details list
  const specs: { icon: any; text: string }[] = [];
  if (isPlot) {
    if ((property as any).plotArea) specs.push({ icon: <Scan size={14} className="text-[#C89B1C]" />, text: `${(property as any).plotArea.toLocaleString()} sq ft` });
    if ((property as any).plotFacing) specs.push({ icon: <MapPin size={14} className="text-[#C89B1C]" />, text: `${(property as any).plotFacing} Facing` });
    if ((property as any).roadWidth) specs.push({ icon: <Building size={14} className="text-[#C89B1C]" />, text: `${(property as any).roadWidth} ft Road` });
    specs.push({ icon: <Building size={14} className="text-[#C89B1C]" />, text: "Plot / Land" });
  } else if (isCommercial) {
    if ((property as any).commercialType) specs.push({ icon: <Building size={14} className="text-[#C89B1C]" />, text: String((property as any).commercialType) });
    if (property.area) specs.push({ icon: <Scan size={14} className="text-[#C89B1C]" />, text: `${property.area.toLocaleString()} sq ft` });
    if (property.floor !== undefined) specs.push({ icon: <Building size={14} className="text-[#C89B1C]" />, text: `${property.floor}th Floor` });
    specs.push({ icon: <Building size={14} className="text-[#C89B1C]" />, text: "Commercial" });
  } else {
    if (property.bedrooms) specs.push({ icon: <BedDouble size={14} className="text-[#C89B1C]" />, text: `${property.bedrooms} BHK` });
    if (property.bathrooms) specs.push({ icon: <Bath size={14} className="text-[#C89B1C]" />, text: `${property.bathrooms} Bath` });
    if (property.area) specs.push({ icon: <Scan size={14} className="text-[#C89B1C]" />, text: `${property.area.toLocaleString()} sq ft` });
    specs.push({ icon: <Building size={14} className="text-[#C89B1C]" />, text: property.propertyType });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-[#ECE7DB] overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-300 relative"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        {/* IMAGE */}
        <div className="md:col-span-3 relative min-h-[160px] md:min-h-0 bg-gray-100 overflow-hidden">
          <Image
            src={mainPhoto}
            alt={property.propertyType}
            fill
            unoptimized
            loading="eager"
            className="object-cover"
          />

          {/* Badge Overlay */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs border ${statusColor}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              {statusLabel}
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="md:col-span-9 p-5 flex flex-col justify-between space-y-4">
          <div>
            {/* Header: Title and Price */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                {displayTitle}
              </h3>
              <span className="text-base sm:text-lg font-bold text-[#9A720C] shrink-0">
                {formatPrice(property.price, property.purpose)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold mt-1">
              <MapPin size={13} className="text-gray-400" />
              <span>
                {property.locality}, {property.city}
              </span>
            </div>

            {/* Inline Specs Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-bold pt-2.5">
              {specs.map((spec, index) => (
                <span key={index} className="flex items-center gap-1">
                  {spec.icon}
                  {spec.text}
                </span>
              ))}
            </div>
          </div>

          {/* Footer stats metrics & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
            {/* Left Metrics */}
            <div className="flex flex-wrap items-center gap-3.5 text-xs text-gray-400 font-semibold">
              <span className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                <Eye size={14} className="text-gray-400" />
                {property.views || 0} views
              </span>
              {property.enquiries && property.enquiries.length > 0 ? (
                <span
                  onClick={() => onViewEnquiries(property._id)}
                  className="flex items-center gap-1.5 hover:text-[#9A720C] text-[#C89B1C] transition-colors cursor-pointer bg-[#FFF9EC] px-2 py-0.5 rounded-full border border-[#FAF0D4]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  <span className="font-black">{(property.enquiries?.length || 0)} enquiries</span>
                </span>
              ) : (
                <span
                  onClick={() => onViewEnquiries(property._id)}
                  className="flex items-center gap-1 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <MessageSquare size={14} className="text-gray-400" />
                  0 enquiries
                </span>
              )}
              {property.furnishing && !isPlot && (
                <span className="px-2 py-0.5 rounded-md bg-[#FFF8EA] border border-[#E8DCC1] text-[#9D791E] text-[10px] font-bold capitalize">
                  {property.furnishing}
                </span>
              )}
            </div>

            {/* Right Action buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end shrink-0">
              {/* Owner Status Management: Change Status Control */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  disabled={updatingStatus}
                  className="h-8 px-3 rounded-lg border border-[#E5D8B3] bg-[#FFF9EC] hover:bg-[#FFF2D3] text-[#9A720C] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-97"
                >
                  <Tag size={13} className="text-[#C89B1C]" />
                  <span>Change Status</span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${showStatusMenu ? "rotate-180" : ""}`} />
                </button>

                {showStatusMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowStatusMenu(false)}
                    />
                    <div className="absolute right-0 bottom-full mb-1.5 z-50 bg-white rounded-2xl border border-[#ECE7DB] shadow-xl p-2 min-w-[210px] space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2.5 py-1 border-b border-gray-100 mb-1">
                        Select Availability Status
                      </p>

                      <button
                        type="button"
                        onClick={() => handleSelectStatus("on_sale")}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          currentAvailStatus === "on_sale"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>{isRent ? "Available for Rent" : "On Sale"}</span>
                        </div>
                        {currentAvailStatus === "on_sale" && <Check size={14} className="text-emerald-600 shrink-0" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectStatus("hold")}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          currentAvailStatus === "hold"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span>On Hold</span>
                        </div>
                        {currentAvailStatus === "hold" && <Check size={14} className="text-amber-600 shrink-0" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectStatus(isRent ? "rented" : "sold")}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          currentAvailStatus === "sold" || currentAvailStatus === "rented"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                          <span>{isRent ? "Rented" : "Sold"}</span>
                        </div>
                        {(currentAvailStatus === "sold" || currentAvailStatus === "rented") && <Check size={14} className="text-red-600 shrink-0" />}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => onView(property._id)}
                className="h-8 px-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye size={13} />
                View
              </button>

              <button
                onClick={() => onViewEnquiries(property._id)}
                className={`h-8 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                  property.enquiries && property.enquiries.length > 0
                    ? "border-red-300 text-white bg-red-600 hover:bg-red-700"
                    : "border-[#E8DCC1] text-[#9A720C] bg-[#FFFDF6] hover:bg-[#FFF9EC]"
                }`}
              >
                <MessageSquare size={13} />
                Enquiries
                {property.enquiries && property.enquiries.length > 0 && (
                  <span className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-white text-red-600 text-[9px] font-black leading-none shrink-0 ml-0.5">
                    {property.enquiries.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => onEdit(property)}
                className="h-8 px-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Pencil size={13} />
                Edit
              </button>

              <button
                onClick={() => onDelete(property)}
                disabled={property.deleteRequested}
                className={`h-8 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${property.deleteRequested
                    ? "border-amber-200 text-amber-600 bg-amber-50/50 cursor-not-allowed opacity-75"
                    : "border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100/50"
                  }`}
              >
                <Trash2 size={13} />
                {property.deleteRequested ? "Delete Pending" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}