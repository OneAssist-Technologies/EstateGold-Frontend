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
  onAvailabilityStatusChange?: (id: string, newStatus: "on_sale" | "hold" | "sold") => void;
}

export default function PropertyTable({
  loading,
  properties,
  onView,
  onApprove,
  onReject,
  onAvailabilityStatusChange,
}: Props) {
  const router = useRouter();
  if (loading) {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border
          p-20
          text-center
          text-gray-500
          font-medium
        "
      >
        Loading properties...
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[#ECE7DB]
        bg-white
      "
    >
      {/* Header */}

      <div
        className="
          grid
          grid-cols-8
          px-6
          py-4
          bg-[#FAF9F6]
          border-b
          text-xs
          uppercase
          font-semibold
          tracking-wider
          text-gray-500
        "
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
          className="
            grid
            grid-cols-8
            items-center
            px-6
            py-5
            border-b
          "
        >
          {/* Owner */}

          <div>
            <h4 className="text-sm font-medium">{property.ownerName}</h4>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              {property.ownerPhone}
            </p>
          </div>

          {/* Location */}

          <div>
            <h4 className="text-sm">{property.locality}</h4>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              {property.city}
            </p>
          </div>

          {/* Price */}

          <div
            className="
              font-semibold
            "
          >
            ₹{property.price?.toLocaleString()}
          </div>

          {/* Type */}

          <div className="text-sm text-gray-700">{property.propertyType}</div>

          {/* Status & Availability Selector */}

          <div className="space-y-1.5">
            <PropertyStatusBadge status={property.status} />
            {onAvailabilityStatusChange && (
              <div>
                <select
                  value={property.availabilityStatus || "on_sale"}
                  onChange={(e) =>
                    onAvailabilityStatusChange(
                      property._id,
                      e.target.value as "on_sale" | "hold" | "sold"
                    )
                  }
                  className="text-[11px] font-bold bg-[#FAF9F5] hover:bg-white border border-[#E5DEC9] rounded-lg px-2 py-1 text-gray-800 outline-none focus:border-[#C89B1C] transition-all cursor-pointer shadow-2xs"
                >
                  <option value="on_sale">🟢 On Sale</option>
                  <option value="hold">🔒 Hold</option>
                  <option value="sold">🔴 Sold</option>
                </select>
              </div>
            )}
          </div>

          {/* Date */}

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            {new Date(property.createdAt).toLocaleDateString()}
          </div>

          {/* Action Buttons */}

          <div className="col-span-2 flex items-center justify-end gap-2">
            {/* View Details Button */}
            <button
              onClick={() => router.push(`/admin/properties/${property._id}`)}
              title="View Property Details"
              className="h-9 px-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#C89B1C] hover:text-white transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
            >
              <Eye size={15} />
              <span>View</span>
            </button>

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
          </div>
        </motion.div>
      ))}

      {!loading && properties.length === 0 && (
        <div
          className="
              p-16
              text-center
              text-gray-400
            "
          >
            No properties found.
          </div>
        )}
    </div>
  );
}