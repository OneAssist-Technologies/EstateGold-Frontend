"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Share2,
  Play,
  Film,
} from "lucide-react";

interface Props {
  photos: string[];
  purpose?: string;
  onShare?: () => void;
  onFavourite?: () => void;
}

const isMediaVideo = (url: string) => {
  if (!url) return false;
  const clean = url.toLowerCase().split("?")[0];
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".mkv")
  );
};

export default function PropertyGallery({
  photos,
  purpose = "Sale",
  onShare,
  onFavourite,
}: Props) {
  const images =
    photos && photos.length > 0
      ? photos.map((p) =>
          p.startsWith("http")
            ? p
            : `http://localhost:5000/uploads/properties/${p}`
        )
      : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"];

  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  const nextImage = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const isSale =
    purpose.toLowerCase() === "sale" ||
    purpose.toLowerCase() === "buy" ||
    purpose.toLowerCase() === "sell";

  const isCurrentVideo = isMediaVideo(images[current]);

  return (
    <div className="space-y-3">
      {/* Main Hero Media Player */}
      <div className="relative h-[340px] sm:h-[400px] w-full rounded-2xl overflow-hidden bg-gray-900 border border-[#ECE7DB] shadow-xs group">
        {isCurrentVideo ? (
          <video
            src={images[current]}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={images[current]}
            alt="Property Main View"
            className="w-full h-full object-cover cursor-pointer"
            loading="eager"
            onClick={() => setOpen(true)}
          />
        )}

        {/* Top-Left Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-10">
          <span className="bg-[#9A720C] text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-2xs">
            {isSale ? "For Sale" : "For Rent"}
          </span>

          <span className="bg-[#0DBB58] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1">
            <span className="text-[10px]">✓</span> Verified
          </span>

          {isCurrentVideo && (
            <span className="bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1">
              <Film size={12} /> Video
            </span>
          )}
        </div>

        {/* Top-Right Action Icons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={onFavourite}
            className="h-9 w-9 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 shadow-2xs transition-colors cursor-pointer"
            title="Save Property"
          >
            <Heart size={18} />
          </button>

          <button
            type="button"
            onClick={onShare}
            className="h-9 w-9 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center text-gray-700 hover:text-[#9A720C] shadow-2xs transition-colors cursor-pointer"
            title="Share Property"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Next / Previous Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-gray-800 transition flex items-center justify-center shadow-2xs cursor-pointer z-10"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-gray-800 transition flex items-center justify-center shadow-2xs cursor-pointer z-10"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image / Video Counter Overlay */}
        <div className="absolute bottom-4 right-4 bg-black/65 backdrop-blur-xs text-white rounded-full px-3 py-1 text-xs font-semibold z-10">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {images.map((media, index) => {
            const isVid = isMediaVideo(media);
            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                className={`relative h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-gray-900 ${
                  current === index
                    ? "border-[#9A720C] ring-1 ring-[#9A720C] opacity-100"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                {isVid ? (
                  <div className="relative w-full h-full">
                    <video
                      src={media}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white">
                        <Play size={10} className="fill-white translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={media}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full cursor-pointer z-20"
            >
              <X size={32} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-6 text-white p-2 hover:bg-white/10 rounded-full cursor-pointer z-20"
                >
                  <ChevronLeft size={40} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-6 text-white p-2 hover:bg-white/10 rounded-full cursor-pointer z-20"
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
              {isCurrentVideo ? (
                <video
                  src={images[current]}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              ) : (
                <img
                  src={images[current]}
                  alt="Property Fullscreen"
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}