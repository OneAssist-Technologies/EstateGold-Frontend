"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Building2,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { ServiceLocation } from "@/src/types/location";

interface Props {
  requests: ServiceLocation[];
  onSelectRequest: (request: ServiceLocation) => void;
}

export default function CityRequestNotificationCard({
  requests,
  onSelectRequest,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!requests || requests.length === 0) return null;

  const currentReq = requests[currentIndex] || requests[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % requests.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + requests.length) % requests.length);
  };

  const formattedTime = currentReq.createdAt
    ? new Date(currentReq.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "New";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FCFAF5] via-[#FFFDF9] to-[#FCFAF5] text-gray-800 p-6 shadow-md border border-[#E9DEC1]"
    >
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#C89B1C]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#E5C365]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Section: Icon & Summary */}
        <div className="flex items-start gap-4 flex-1">
          {/* Animated Pulse Icon Badge */}
          <div className="relative shrink-0 mt-0.5">
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#B88A1A] via-[#E5C365] to-[#8C6605] flex items-center justify-center text-white shadow-md border border-[#F5E4B3]/30">
              <Building2 size={24} />
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4DC] text-[#9A720C] border border-[#E9DEC1] uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-[#B88A1A]" />
                New City Request
              </span>

              {requests.length > 1 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                  Request {currentIndex + 1} of {requests.length}
                </span>
              )}

              <span className="text-[11px] text-gray-400 flex items-center gap-1 ml-auto md:ml-0">
                <Clock size={12} />
                {formattedTime}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span>New Property Listing Request in</span>
              <span className="text-[#9A720C] underline underline-offset-4 decoration-[#C89B1C]">
                {currentReq.city}
              </span>
            </h3>

            <p className="text-xs text-gray-600 max-w-2xl leading-relaxed font-semibold">
              A user requested to add a property in{" "}
              <strong className="text-gray-900 font-bold">{currentReq.city}</strong>,{" "}
              {currentReq.state || "Karnataka"}. Click to view full location details, coordinates, and configure service parameters to approve.
            </p>

            {currentReq.requestedBy?.fullName && (
              <p className="text-[11px] text-[#9A720C]/80 font-bold">
                Requested by: <span className="text-gray-800 font-semibold">{currentReq.requestedBy.fullName}</span> ({currentReq.requestedBy.role || "User"})
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Pagination & View Request Modal CTA */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          {requests.length > 1 && (
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                title="Previous Request"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                title="Next Request"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => onSelectRequest(currentReq)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:from-[#C89B1C] hover:to-[#A87B15] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer border border-[#E9DEC1]"
          >
            <span>View Details & Add City</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
