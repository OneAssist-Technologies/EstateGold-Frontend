"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, Trash2, X } from "lucide-react";
import { useState } from "react";

import api from "@/src/services/api";
import { Property } from "@/src/types/property";

interface Props {
  open: boolean;
  property: Property | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeletePropertyModal({
  open,
  property,
  onClose,
  onDeleted,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  if (!property) return null;

  const handleDelete =
    async () => {
      try {
        setLoading(true);

        await api.delete(
          `/properties/${property._id}`
        );

        onDeleted();

        onClose();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  return (
    <AnimatePresence>
      {open && (
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
            z-50
            bg-black/60
            flex
            items-center
            justify-center
            p-5
          "
        >
          <motion.div
            initial={{
              scale: 0.85,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.85,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              bg-white
              rounded-3xl
              max-w-lg
              w-full
              overflow-hidden
              shadow-2xl
            "
          >
            {/* Header */}

            <div
              className="
                flex
                justify-between
                items-center
                px-7
                py-6
                border-b
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    h-12
                    w-12
                    rounded-full
                    bg-red-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <TriangleAlert
                    className="text-red-500"
                    size={24}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Delete Property
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    This action cannot be
                    undone
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
              >
                <X />
              </button>
            </div>

            {/* Body */}

            <div className="p-8">

              <p className="text-gray-600 leading-7">

                Are you sure you want to
                permanently delete this
                property?

              </p>

              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-5
                "
              >
                <h3 className="font-semibold text-lg">

                  {property.propertyType}

                </h3>

                <p className="text-gray-500 mt-1">

                  {property.locality},{" "}
                  {property.city}

                </p>

                <p className="mt-3 text-red-600 font-medium">

                  ₹
                  {property.price.toLocaleString(
                    "en-IN"
                  )}

                </p>
              </div>

              <div
                className="
                  mt-6
                  bg-[#FFF8EA]
                  border
                  border-[#F7D48B]
                  rounded-xl
                  p-4
                "
              >
                <p className="text-sm text-[#7A5A00]">

                  Deleting this property
                  will remove all listing
                  details, uploaded images,
                  enquiries and associated
                  records permanently.

                </p>
              </div>

            </div>

            {/* Footer */}

            <div
              className="
                border-t
                p-6
                flex
                justify-end
                gap-4
              "
            >
              <button
                onClick={onClose}
                disabled={loading}
                className="
                  h-12
                  px-8
                  rounded-xl
                  border
                  border-[#E5E5E5]
                  hover:bg-gray-100
                  transition
                "
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="
                  h-12
                  px-8
                  rounded-xl
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  flex
                  items-center
                  gap-2
                  transition
                "
              >
                <Trash2 size={18} />

                {loading
                  ? "Deleting..."
                  : "Delete Property"}
              </button>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}