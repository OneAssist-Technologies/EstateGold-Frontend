"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

import { AdminProperty } from "@/src/types/adminProperty";
import { approveProperty, rejectProperty } from "@/src/services/adminPropertyService";
import PropertyViewModal from "./property-management/PropertyViewModal";

interface PendingApprovalCardProps {
  pendingProperties?: AdminProperty[];
  loading?: boolean;
  onRefresh?: () => void;
}

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours === 1) return "1 Hour Ago";
  if (diffHours < 24) return `${diffHours} Hours Ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} Days Ago`;
}

export default function PendingApprovalCard({
  pendingProperties = [],
  loading,
  onRefresh,
}: PendingApprovalCardProps) {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);
      await approveProperty(id);
      toast.success("Property approved successfully!");
      if (modalOpen && selectedProperty?._id === id) {
        setModalOpen(false);
        setSelectedProperty(null);
      }
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve property");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string, reason?: string) => {
    const rejectReason = reason || prompt("Enter rejection reason:");
    if (!rejectReason || !rejectReason.trim()) return;

    try {
      setActionLoadingId(id);
      await rejectProperty(id, rejectReason.trim());
      toast.success("Property rejected!");
      if (modalOpen && selectedProperty?._id === id) {
        setModalOpen(false);
        setSelectedProperty(null);
      }
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject property");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleView = (property: AdminProperty) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          bg-white
          rounded-3xl
          border
          border-[#ECE7DB]
          shadow-sm
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            px-6
            sm:px-8
            py-6
            border-b
            border-[#ECE7DB]
            flex
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h2
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-[#161616]
              "
            >
              Pending Property Approval
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Review newly submitted properties
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/properties?status=pending")}
            className="
              h-11
              px-5
              rounded-xl
              bg-[#C89B1C]
              text-white
              hover:bg-[#B8860B]
              transition
              text-sm
              font-medium
              cursor-pointer
              self-start
              sm:self-auto
            "
          >
            View All
          </button>
        </div>

        {/* List / Table */}
        <div>
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              Loading pending properties...
            </div>
          ) : pendingProperties.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              No pending properties to review.
            </div>
          ) : (
            pendingProperties.map((item) => {
              const imageSrc =
                item.photos && item.photos.length > 0
                  ? item.photos[0]
                  : "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600";
              const title = item.bedrooms
                ? `${item.bedrooms} BHK ${item.propertyType}`
                : item.propertyType || "Property";
              const owner = item.ownerName || item.createdBy?.fullName || "Property Owner";
              const priceText = item.price ? `₹ ${item.price.toLocaleString("en-IN")}` : "N/A";

              return (
                <div
                  key={item._id}
                  className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    justify-between
                    px-6
                    sm:px-8
                    py-6
                    border-b
                    border-[#F3F0E8]
                    hover:bg-[#FCFBF8]
                    transition
                    gap-4
                  "
                >
                  {/* Property */}
                  <div className="flex items-center gap-5">
                    <img
                      src={imageSrc}
                      alt={title}
                      className="
                        h-20
                        w-28
                        rounded-2xl
                        object-cover
                        shrink-0
                        bg-gray-100
                      "
                    />

                    <div>
                      <h3
                        className="
                          font-semibold
                          text-base
                          sm:text-lg
                          text-[#161616]
                        "
                      >
                        {title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Owner: <span className="font-medium text-gray-700">{owner}</span>
                      </p>

                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-xs
                          text-gray-400
                          mt-1.5
                        "
                      >
                        <MapPin size={14} className="shrink-0" />
                        <span>{item.locality ? `${item.locality}, ${item.city}` : item.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions Row */}
                  <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-8 mt-2 md:mt-0">
                    {/* Price */}
                    <div className="text-left md:text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                        Price
                      </p>
                      <h4 className="font-bold text-base sm:text-lg text-[#161616]">
                        {priceText}
                      </h4>
                    </div>

                    {/* Relative Submitted Time */}
                    <div className="hidden lg:block text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                        Submitted
                      </p>
                      <h4 className="text-sm text-gray-600 font-medium flex items-center gap-1 justify-center">
                        <Clock size={13} className="text-gray-400" />
                        {formatRelativeTime(item.createdAt)}
                      </h4>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => handleView(item)}
                        title="View Details"
                        className="
                          h-10
                          w-10
                          sm:h-11
                          sm:w-11
                          rounded-xl
                          border
                          border-[#ECE7DB]
                          hover:bg-[#F6F6F6]
                          transition
                          flex
                          items-center
                          justify-center
                          text-gray-600
                          cursor-pointer
                        "
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        disabled={actionLoadingId === item._id}
                        onClick={() => handleApprove(item._id)}
                        className="
                          h-10
                          sm:h-11
                          px-4
                          sm:px-5
                          rounded-xl
                          bg-green-600
                          text-white
                          hover:bg-green-700
                          disabled:opacity-50
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-medium
                          cursor-pointer
                          transition
                        "
                      >
                        <CheckCircle2 size={17} />
                        <span className="hidden sm:inline">Approve</span>
                      </button>

                      <button
                        type="button"
                        disabled={actionLoadingId === item._id}
                        onClick={() => handleReject(item._id)}
                        className="
                          h-10
                          sm:h-11
                          px-4
                          sm:px-5
                          rounded-xl
                          bg-red-600
                          text-white
                          hover:bg-red-700
                          disabled:opacity-50
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-medium
                          cursor-pointer
                          transition
                        "
                      >
                        <XCircle size={17} />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* View Property Modal */}
      {selectedProperty && (
        <PropertyViewModal
          open={modalOpen}
          property={selectedProperty}
          onClose={() => {
            setModalOpen(false);
            setSelectedProperty(null);
          }}
          onApprove={() => handleApprove(selectedProperty._id)}
          onReject={(reason) => handleReject(selectedProperty._id, reason)}
        />
      )}
    </>
  );
}