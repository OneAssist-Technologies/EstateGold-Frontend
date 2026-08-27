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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            className="relative z-10 w-full max-w-5xl max-h-[85vh] my-auto flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 h-10 w-10 bg-white/80 backdrop-blur-xs rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-sm"
            >
              <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto">
              <img
                src={
                  property.photos?.[0] || "/placeholder.jpg"
                }
                alt=""
                className="w-full h-[300px] sm:h-[400px] object-cover"
              />

              <div className="p-6 sm:p-8">

                <h2 className="text-2xl sm:text-3xl font-bold">
                  {property.bedrooms} BHK {property.propertyType} in {property.locality}
                </h2>

                <div className="flex items-center gap-2 mt-3 text-[#666]">
                  <MapPin size={18} />

                  {property.locality},{" "}
                  {property.city}
                </div>

                <h3 className="text-3xl sm:text-4xl font-bold text-[#C6A664] mt-6">
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
                    {property.ownerPhone}
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}