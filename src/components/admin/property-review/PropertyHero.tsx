"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { AdminProperty } from "@/src/types/adminProperty";

interface Props {
  property: AdminProperty;
}

export default function PropertyHero({
  property,
}: Props) {
  const getPhotoUrl = (raw?: string) => {
    if (!raw) return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    const clean = raw.replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "");
    return `http://localhost:5000/uploads/properties/${clean}`;
  };

  const images =
    property.photos?.length > 0
      ? property.photos.map((p) => getPhotoUrl(p))
      : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"];

  const [current, setCurrent] =
    useState(0);

  const nextImage = () => {
    setCurrent((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    );
  };

  const previousImage = () => {
    setCurrent((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="relative"
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-[#ECE7DB]
          bg-[#F7F5F1]
        "
      >
        <AnimatePresence mode="wait">

          <motion.img
            key={current}
            src={images[current]}
            alt=""
            onError={(e: any) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
            }}
            initial={{
              opacity: 0,
              scale: 1.05,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="
              w-full
              h-[520px]
              object-cover
            "
          />

        </AnimatePresence>

        {/* Property Type */}

        <div
          className="
            absolute
            top-6
            right-6
            rounded-full
            bg-black/60
            backdrop-blur-md
            px-5
            py-2
            text-white
            text-sm
            font-medium
          "
        >
          {property.propertyType}
        </div>

        {/* Purpose */}

        <div
          className="
            absolute
            bottom-6
            left-6
            rounded-full
            bg-[#C89B1C]
            px-5
            py-2
            text-white
            text-sm
            font-semibold
          "
        >
          {property.purpose}
        </div>

        {/* Image Counter */}

        {images.length > 1 && (
          <div
            className="
              absolute
              bottom-6
              right-6
              rounded-full
              bg-black/60
              backdrop-blur-md
              px-4
              py-2
              text-white
              text-sm
            "
          >
            {current + 1} / {images.length}
          </div>
        )}

        {/* Previous */}

        {images.length > 1 && (
          <button
            onClick={previousImage}
            className="
              absolute
              left-5
              top-1/2
              -translate-y-1/2
              h-12
              w-12
              rounded-full
              bg-white/90
              backdrop-blur-md
              shadow-lg
              flex
              items-center
              justify-center
              hover:scale-105
              transition
            "
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next */}

        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="
              absolute
              right-5
              top-1/2
              -translate-y-1/2
              h-12
              w-12
              rounded-full
              bg-white/90
              backdrop-blur-md
              shadow-lg
              flex
              items-center
              justify-center
              hover:scale-105
              transition
            "
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </motion.div>
  );
}