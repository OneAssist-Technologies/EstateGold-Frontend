"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface Props {
  photos: string[];
}

export default function PropertyGallery({
  photos,
}: Props) {
  const images =
    photos?.length
      ? photos
      : ["/images/property-placeholder.jpg"];

  const [current, setCurrent] =
    useState(0);

  const [open, setOpen] =
    useState(false);

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
    <>

      {/* Hero */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="
          relative
          h-[620px]
          rounded-[32px]
          overflow-hidden
          shadow-xl
        "
      >

      <img
  src={images[current]}
  alt="Property"
  className="w-full h-full object-cover"
  loading="eager"
/>

        {/* Previous */}

        <button
          onClick={previousImage}
          className="
            absolute
            left-6
            top-1/2
            -translate-y-1/2
            h-14
            w-14
            rounded-full
            bg-white/80
            backdrop-blur
            hover:bg-white
            transition
            flex
            items-center
            justify-center
          "
        >
          <ChevronLeft />
        </button>

        {/* Next */}

        <button
          onClick={nextImage}
          className="
            absolute
            right-6
            top-1/2
            -translate-y-1/2
            h-14
            w-14
            rounded-full
            bg-white/80
            backdrop-blur
            hover:bg-white
            transition
            flex
            items-center
            justify-center
          "
        >
          <ChevronRight />
        </button>

        {/* Counter */}

        <div
          className="
            absolute
            top-6
            right-6
            bg-black/60
            backdrop-blur
            text-white
            rounded-full
            px-5
            py-2
            text-sm
          "
        >
          {current + 1} / {images.length}
        </div>

        {/* View Button */}

        <button
          onClick={() => setOpen(true)}
          className="
            absolute
            bottom-6
            right-6
            px-6
            h-12
            rounded-full
            bg-[#C89B1C]
            hover:bg-[#B8860B]
            text-white
            font-medium
          "
        >
          View All Photos
        </button>

      </motion.div>

      {/* Thumbnails */}

      <div className="grid grid-cols-5 gap-4 mt-6">

        {images.map((image, index) => (

          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            key={index}
            onClick={() =>
              setCurrent(index)
            }
            className={`
              relative
              h-28
              rounded-2xl
              overflow-hidden
              cursor-pointer
              border-4
              transition
              ${
                current === index
                  ? "border-[#C89B1C]"
                  : "border-transparent"
              }
            `}
          >

           <img
  src={image}
  alt="Property"
  className="w-full h-full object-cover"
/>

          </motion.div>

        ))}

      </div>

      {/* Fullscreen */}

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
              bg-black/90
              z-[999]
              flex
              items-center
              justify-center
            "
          >

            <button
              onClick={() =>
                setOpen(false)
              }
              className="
                absolute
                top-8
                right-8
                text-white
              "
            >
              <X size={40} />
            </button>

            <button
              onClick={previousImage}
              className="
                absolute
                left-8
                text-white
              "
            >
              <ChevronLeft size={50} />
            </button>

            <motion.div
              key={current}
              initial={{
                opacity: 0,
                scale: .95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="
                relative
                w-[90vw]
                h-[85vh]
              "
            >

               <img
  src={images[current]}
  alt="Property"
  className="w-full h-full object-cover"
  loading="eager"
/>
            </motion.div>

            <button
              onClick={nextImage}
              className="
                absolute
                right-8
                text-white
              "
            >
              <ChevronRight size={50} />
            </button>

          </motion.div>

        )}

      </AnimatePresence>

    </>
  );
}