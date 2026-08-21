"use client";

import { motion } from "framer-motion";
import { Eye, CheckCircle2, XCircle } from "lucide-react";

import { AdminProperty } from "@/src/types/adminProperty";

import PropertyStatusBadge from "./PropertyStatusBadge";
import { useRouter } from "next/navigation";

interface Props {
  loading: boolean;
  properties: AdminProperty[];
  onView: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onApproveDelete?: (id: string, reason: string) => void;
  onRejectDeleteRequest?: (id: string) => void;
  onAvailabilityStatusChange?: (id: string, newStatus: "on_sale" | "hold" | "sold") => void;
}

export default function PropertyTable({
  loading,
  properties,
  onView,
  onApprove,
  onReject,
  onApproveDelete,
  onRejectDeleteRequest,
  onAvailabilityStatusChange,
}: Props) {
  const router = useRouter();
  if (loading) {
    return (
      <div
        className="bg-white rounded-2xl border p-20 text-center text-gray-500 font-medium"
      >
        Loading properties...
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#ECE7DB] bg-white"
    >
      <div className="overflow-x-auto">
        <div className="min-w-[950px]">
          {/* Header */}

          <div
            className="grid grid-cols-8 px-6 py-4 bg-[#FAF9F6] border-b text-xs uppercase font-semibold tracking-wider text-gray-500"
          >
            <div>Owner</div>

            <div>Location</div>

            <div>Price</div>

            <div>Type</div>

            <div>Status & Availability</div>

            <div>Date</div>

            <div className="col-span-2 text-right">Action</div>
          </div>

          {properties.map((property) => (
            <motion.div
              key={property._id}
              whileHover={{
                backgroundColor: "#FCFBF8",
              }}
              className="grid grid-cols-8 items-center px-6 py-5 border-b"
            >
              {/* Owner */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  {property.ownerName || property.createdBy?.fullName || "N/A"}
                </h4>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {property.ownerPhone || property.createdBy?.phone || ""}
                </p>

                {property.listingType === "another_owner" && property.createdBy && (
                  <div className="mt-2 pt-1.5 border-t border-dashed border-[#ECE7DB]">
                    <span className="inline-block text-[9px] font-bold bg-amber-50 text-[#9A720C] border border-amber-200/50 rounded-sm px-1 leading-none uppercase">
                      Agent Posted
                    </span>
                    <p className="text-[11px] font-bold text-gray-700 mt-0.5">
                      {property.createdBy.fullName}
                    </p>
                    {property.createdBy.phone && (
                      <p className="text-[10px] text-gray-400 font-medium leading-none">
                        {property.createdBy.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="text-sm font-semibold text-gray-950 pr-4">
                <span className="block truncate capitalize">{property.locality || "N/A"}</span>
                <span className="block text-xs text-gray-450 truncate capitalize mt-0.5">
                  {property.city || ""}
                </span>
              </div>

              {/* Price */}
              <div className="text-sm font-bold text-[#9A720C]">
                ₹{(property.price || 0).toLocaleString("en-IN")}
              </div>

              {/* Type */}
              <div className="text-sm text-gray-700 font-semibold truncate pr-4">
                {property.propertyType || "N/A"}
              </div>

              {/* Status & Availability */}
              <div className="space-y-1.5">
                <PropertyStatusBadge status={property.status} />

                {property.status === "approved" && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-400">Available:</span>
                    <select
                      value={property.availabilityStatus || "on_sale"}
                      onChange={(e) =>
                        onAvailabilityStatusChange &&
                        onAvailabilityStatusChange(
                          property._id,
                          e.target.value as "on_sale" | "hold" | "sold"
                        )
                      }
                      className="text-[11px] font-bold bg-[#FAF9F6] border border-[#ECE7DB] rounded px-1.5 py-0.5 outline-none cursor-pointer text-gray-800"
                    >
                      <option value="on_sale">On Sale</option>
                      <option value="hold">On Hold</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="text-xs text-gray-500 font-semibold">
                {property.createdAt
                  ? new Date(property.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2.5">
                {/* View/Edit Button */}
                <button
                  onClick={() => onView(property._id)}
                  title="View Details"
                  className="h-9 w-9 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 hover:bg-[#FAF9F6] hover:text-[#9A720C] hover:border-[#9A720C] transition-all flex items-center justify-center cursor-pointer shadow-3xs"
                >
                  <Eye size={16} />
                </button>

                {property.deleteRequested ? (
                  <>
                    <button
                      onClick={() =>
                        onApproveDelete &&
                        onApproveDelete(
                          property._id,
                          property.deleteRequestedReason || "Admin Delete Request"
                        )
                      }
                      title="Approve Delete Request"
                      className="h-9 px-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <XCircle size={15} />
                      <span>Confirm Delete</span>
                    </button>

                    <button
                      onClick={() =>
                        onRejectDeleteRequest && onRejectDeleteRequest(property._id)
                      }
                      title="Reject Delete Request"
                      className="h-9 px-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer border"
                    >
                      Reject Request
                    </button>
                  </>
                ) : (
                  <>
                    {/* Quick Approve Button */}
                    {property.status !== "approved" && onApprove && (
                      <button
                        onClick={() => onApprove(property._id)}
                        title="Approve Property"
                        className="h-9 px-2.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
                      >
                        <CheckCircle2 size={15} />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Quick Reject Button */}
                    {property.status !== "rejected" && onReject && (
                      <button
                        onClick={() => onReject(property._id)}
                        title="Reject Property"
                        className="h-9 px-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
                      >
                        <XCircle size={15} />
                        <span>Reject</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}

          {!loading && properties.length === 0 && (
            <div
              className="p-16 text-center text-gray-400"
            >
              No properties found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}