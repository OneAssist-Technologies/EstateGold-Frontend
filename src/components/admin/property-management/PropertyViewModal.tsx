"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  MapPin,
  User,
  Phone,
  Mail,
  BedDouble,
  Bath,
  Ruler,
  IndianRupee,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { AdminProperty } from "@/src/types/adminProperty";
import PropertyAvailabilityBadge from "./PropertyAvailabilityBadge";

interface Props {
  open: boolean;

  property: AdminProperty | null;

  onClose: () => void;

  onApprove: () => void;

  onReject: (reason: string) => void;
}

export default function PropertyViewModal({
  open,
  property,
  onClose,
  onApprove,
  onReject,
}: Props) {
  if (!property) return null;

  return (
    <AnimatePresence>

      {open && (
        <>
          {/* Overlay */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}

          <motion.div
            initial={{
              opacity: 0,
              scale: .95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: .95,
            }}
            className="
              fixed
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              z-50
              w-[1000px]
              max-h-[90vh]
              overflow-y-auto
              rounded-3xl
              bg-white
              shadow-2xl
            "
          >

            {/* Header */}

            <div className="flex justify-between items-center p-6 border-b">
              <div>

                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">

                    {property.bedrooms} BHK {property.propertyType}

                  </h2>

                  <PropertyAvailabilityBadge availabilityStatus={property.availabilityStatus} />
                </div>

                <p className="text-gray-500 mt-1">

                  {property.locality}, {property.city}

                </p>

              </div>

              <button
                onClick={onClose}
                className="
                  h-10
                  w-10
                  rounded-xl
                  hover:bg-gray-100
                  flex
                  items-center
                  justify-center
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* Image */}

            <div className="p-6">
              {(() => {
                const getPhotoUrl = (raw?: string) => {
                  if (!raw) return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
                  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
                  const clean = raw.replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "");
                  return `http://localhost:5000/uploads/properties/${clean}`;
                };

                return (
                  <img
                    src={getPhotoUrl(property.photos?.[0])}
                    alt={property.locality || "Property"}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="
                      w-full
                      h-[350px]
                      object-cover
                      rounded-2xl
                    "
                  />
                );
              })()}
            </div>

            {/* Details */}

            <div className="grid grid-cols-2 gap-10 px-6 pb-6">

              {/* Left */}

              <div className="space-y-8">

                <section>

                  <h3 className="font-semibold text-lg mb-4">
                    Property Details
                  </h3>

                  <div className="space-y-3">

                    <Item
                      icon={<MapPin size={18} />}
                      label="Location"
                      value={`${property.locality}, ${property.city}`}
                    />

                    <Item
                      icon={<BedDouble size={18} />}
                      label="Bedrooms"
                      value={String(property.bedrooms)}
                    />

                    <Item
                      icon={<Bath size={18} />}
                      label="Bathrooms"
                      value={String(property.bathrooms)}
                    />

                    <Item
                      icon={<Ruler size={18} />}
                      label="Area"
                      value={`${property.area} Sq.ft`}
                    />

                    <Item
                      icon={<Calendar size={18} />}
                      label="Posted On"
                      value={new Date(
                        property.createdAt
                      ).toLocaleDateString()}
                    />

                  </div>

                </section>

                <section>

                  <h3 className="font-semibold text-lg mb-4">
                    Price
                  </h3>

                  <div className="flex items-center gap-2">

                    <IndianRupee
                      className="text-[#C89B1C]"
                    />

                    <span className="text-3xl font-bold">

                      {property.price.toLocaleString()}

                    </span>

                  </div>

                </section>

              </div>

              {/* Right */}

              <div className="space-y-8">

                <section>

                  <h3 className="font-semibold text-lg mb-4">
                    Owner Details
                  </h3>

                  <div className="space-y-3">

                    <Item
                      icon={<User size={18} />}
                      label="Owner"
                      value={property.ownerName}
                    />

                    <Item
                      icon={<Phone size={18} />}
                      label="Phone"
                      value={property.ownerPhone}
                    />

                    <Item
                      icon={<Mail size={18} />}
                      label="Email"
                      value={
                        property.ownerEmail || "-"
                      }
                    />

                  </div>

                </section>

                <section>

                  <h3 className="font-semibold text-lg mb-4">
                    Description
                  </h3>

                  <p className="text-sm leading-7 text-gray-600">

                    {property.description || "No description available."}

                  </p>

                </section>

              </div>

            </div>

            {/* Amenities */}

            {property.amenities?.length > 0 && (

              <div className="px-6 pb-6">

                <h3 className="font-semibold text-lg mb-4">

                  Amenities

                </h3>

                <div className="flex flex-wrap gap-3">

                  {property.amenities.map((item) => (

                    <span
                      key={item}
                      className="
                        rounded-full
                        bg-[#F7F2E5]
                        px-4
                        py-2
                        text-sm
                        text-[#8B6A11]
                      "
                    >
                      {item}
                    </span>

                  ))}

                </div>

              </div>

            )}

            {/* Footer */}

            <div className="border-t p-6 flex justify-end gap-3">

              {property.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      onReject("Rejected by Admin")
                    }
                    className="
                      h-11
                      px-6
                      rounded-xl
                      bg-red-100
                      text-red-600
                      hover:bg-red-200
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <XCircle size={18} />

                    Reject
                  </button>

                  <button
                    onClick={onApprove}
                    className="
                      h-11
                      px-6
                      rounded-xl
                      bg-[#C89B1C]
                      text-white
                      hover:bg-[#B58A16]
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <CheckCircle2 size={18} />

                    Approve
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="
                  h-11
                  px-6
                  rounded-xl
                  border
                "
              >
                Close
              </button>

            </div>

          </motion.div>

        </>
      )}

    </AnimatePresence>
  );
}

interface ItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Item({
  icon,
  label,
  value,
}: ItemProps) {
  return (
    <div className="flex gap-3">

      <div className="text-[#C89B1C] mt-1">

        {icon}

      </div>

      <div>

        <p className="text-xs text-gray-500">

          {label}

        </p>

        <p className="font-medium">

          {value}

        </p>

      </div>

    </div>
  );
}