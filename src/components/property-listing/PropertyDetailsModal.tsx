"use client";

import { X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Property } from "@/src/types/property";

interface Props {
  open: boolean;
  onClose: () => void;
  property: Property | null;
}

export default function PropertyDetailsModal({
  open,
  onClose,
  property,
}: Props) {
  if (!property) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
            fixed
            inset-0
            bg-black/50
            z-50
            "
            onClick={onClose}
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            className="
            fixed
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2

            z-50

            w-[95%]
            max-w-5xl

            bg-white

            rounded-3xl
            overflow-hidden
            "
          >
            <button
              onClick={onClose}
              className="
              absolute
              top-5
              right-5
              z-10
              "
            >
              <X />
            </button>

            <img
              src={
                property.images?.[0]
              }
              alt=""
              className="
              w-full
              h-[400px]
              object-cover
              "
            />

            <div className="p-8">

              <h2 className="text-3xl font-bold">
                {property.title}
              </h2>

              <div className="flex items-center gap-2 mt-3 text-[#666]">
                <MapPin size={18} />

                {property.locality},{" "}
                {property.city}
              </div>

              <h3 className="text-4xl font-bold text-[#C6A664] mt-6">
                ₹
                {property.price.toLocaleString(
                  "en-IN"
                )}
              </h3>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div>
                  Bedrooms
                  <div className="font-semibold">
                    {
                      property.bedrooms
                    }
                  </div>
                </div>

                <div>
                  Bathrooms
                  <div className="font-semibold">
                    {
                      property.bathrooms
                    }
                  </div>
                </div>

                <div>
                  Area
                  <div className="font-semibold">
                    {
                      property.area
                    }{" "}
                    Sq.ft
                  </div>
                </div>
              </div>

              <p className="mt-8 text-[#666] leading-relaxed">
                {
                  property.description
                }
              </p>

              <div className="mt-8 border-t pt-6">
                <h4 className="font-semibold mb-2">
                  Owner Details
                </h4>

                <p>
                  {
                    property.ownerName
                  }
                </p>

                <p>
                  {property.phone}
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}