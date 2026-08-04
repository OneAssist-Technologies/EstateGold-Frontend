"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Property } from "@/src/types/property";

interface Props {
  open: boolean;
  property: Property | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditPropertyModal({
  open,
  property,
  onClose,
  onUpdated,
}: Props) {
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!property) return;

    setPrice(property.price.toString());
    setDescription(property.description);
  }, [property]);

  if (!property) return null;

  const formatPrice = (value: string) => {
    const num = Number(value);

    if (!num) return "₹0";

    if (num >= 10000000)
      return `₹${(num / 10000000).toFixed(2)} Cr`;

    if (num >= 100000)
      return `₹${(num / 100000).toFixed(1)} L`;

    return `₹${num.toLocaleString("en-IN")}`;
  };

  const handleSave = async () => {
    // API call in Part 2
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
              y: 40,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
              y: 40,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              w-full
              max-w-2xl
              bg-white
              rounded-[30px]
              shadow-2xl
              overflow-hidden
            "
          >
            <div className="p-8">

              {/* Header */}

              <div className="flex justify-between">

                <div>

                  <h2 className="text-3xl font-bold text-[#161616]">
                    Edit Listing
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {property.propertyType} • {property.city}
                  </p>

                </div>

                <button
                  onClick={onClose}
                  className="
                    h-11
                    w-11
                    rounded-xl
                    bg-[#F7F3EA]
                    hover:bg-[#EFE8D7]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <X size={22} />
                </button>

              </div>

              {/* Price */}

              <div className="mt-8">

                <label className="font-semibold text-lg">
                  Sale Price (₹)
                </label>

                <div className="relative mt-3">

                  <input
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      border
                      border-[#E8DCC1]
                      pl-14
                      pr-28
                      outline-none
                      focus:border-[#C89B1C]
                    "
                  />

                  <span className="absolute left-6 top-4 text-lg">
                    ₹
                  </span>

                  <span className="absolute right-6 top-4 text-gray-500">
                    {formatPrice(price)}
                  </span>

                </div>

              </div>

              {/* Description */}

              <div className="mt-8">

                <label className="font-semibold text-lg">
                  Property Description
                </label>

                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="
                    mt-3
                    w-full
                    rounded-2xl
                    border
                    border-[#E8DCC1]
                    p-5
                    outline-none
                    resize-none
                    focus:border-[#C89B1C]
                  "
                />

              </div>

              {/* Info */}

              <div
                className="
                  mt-8
                  rounded-2xl
                  bg-[#FCF8F1]
                  border
                  border-[#E8DCC1]
                  p-5
                  flex
                  gap-4
                "
              >
                <Pencil
                  className="text-[#C89B1C] mt-1"
                  size={20}
                />

                <p className="text-gray-600 leading-7">
                  To change photos, location, amenities,
                  specifications or ownership details,
                  please use the complete property edit page.
                </p>

              </div>

              {/* Footer */}

              <div className="flex gap-5 mt-8">

                <button
                  onClick={onClose}
                  className="
                    flex-1
                    h-14
                    rounded-2xl
                    border
                    border-[#E8DCC1]
                    font-semibold
                    hover:bg-gray-50
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="
                    flex-1
                    h-14
                    rounded-2xl
                    bg-[#C89B1C]
                    hover:bg-[#B88D18]
                    text-white
                    font-semibold
                    transition
                  "
                >
                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}