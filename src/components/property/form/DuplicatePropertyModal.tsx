"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  X,
  MapPin,
  CheckCircle2,
  Building,
  Ruler,
  Bed,
  DollarSign,
  Layers,
} from "lucide-react";
import { DuplicatePropertyAnalysis } from "@/src/types/property";

interface Props {
  open: boolean;
  onClose: () => void;
  analysis: DuplicatePropertyAnalysis | null;
  onContinueAnyway: () => void;
  loading?: boolean;
}

export default function DuplicatePropertyModal({
  open,
  onClose,
  analysis,
  onContinueAnyway,
  loading = false,
}: Props) {
  if (!open || !analysis || !analysis.isDuplicate) return null;

  const topMatch = analysis.matches && analysis.matches.length > 0 ? analysis.matches[0] : null;
  const isHighConfidence = analysis.confidenceLevel === "high" || analysis.confidence >= 80;

  const formatPrice = (val?: number) => {
    if (!val) return "₹0";
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const getFieldBadgeLabel = (f: string) => {
    switch (f) {
      case "location":
        return "Geographical Location (Lat/Long)";
      case "address":
        return "Street Address";
      case "locality":
        return "Locality & Area";
      case "society":
        return "Society / Project";
      case "propertyType":
        return "Property Type";
      case "area":
        return "Area Dimensions";
      case "bedrooms":
        return "Bedrooms / BHK";
      case "bathrooms":
        return "Bathrooms";
      case "price":
        return "Price Range";
      case "owner":
        return "Owner Contact";
      case "unitNumber":
        return "Unit / Flat No.";
      default:
        return f;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-[#E5D8B3] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8"
        >
          {/* MODAL HEADER */}
          <div
            className={`p-6 border-b flex items-start justify-between ${
              isHighConfidence
                ? "bg-red-50/70 border-red-200"
                : "bg-amber-50/70 border-amber-200"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  isHighConfidence
                    ? "bg-red-100 text-red-600 border border-red-200"
                    : "bg-amber-100 text-[#9A720C] border border-amber-200"
                }`}
              >
                {isHighConfidence ? <ShieldAlert size={26} /> : <AlertTriangle size={26} />}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3
                    className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                      isHighConfidence ? "text-red-900" : "text-gray-900"
                    }`}
                  >
                    {isHighConfidence ? "Duplicate Property Detected" : "Possible Duplicate Property"}
                  </h3>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isHighConfidence
                        ? "bg-red-600 text-white"
                        : "bg-[#9A720C] text-white"
                    }`}
                  >
                    {analysis.confidence}% Match
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                  An existing property in EstateGold appears similar to this listing.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-white/80 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* MODAL BODY */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Top Matched Property Card */}
            {topMatch && (
              <div className="bg-[#FAF8F5] border border-[#E5D8B3] rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5D8B3]/60 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Existing Listing Comparison
                    </span>
                    <h4 className="text-base font-bold text-gray-900">{topMatch.title}</h4>
                  </div>
                  {topMatch.distanceMeters !== null && (
                    <span className="text-xs font-bold text-[#9A720C] bg-[#FFF9EC] border border-[#E5D8B3] px-3 py-1 rounded-full w-fit flex items-center gap-1">
                      <MapPin size={13} /> {topMatch.distanceMeters}m away
                    </span>
                  )}
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {topMatch.details?.propertyType && (
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-medium block">Type</span>
                      <span className="font-bold text-gray-800">{topMatch.details.propertyType}</span>
                    </div>
                  )}
                  {topMatch.details?.price !== undefined && (
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-medium block">Price / Rent</span>
                      <span className="font-bold text-[#C89B1C]">{formatPrice(topMatch.details.price)}</span>
                    </div>
                  )}
                  {topMatch.details?.area !== undefined && topMatch.details.area > 0 && (
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-medium block">Area</span>
                      <span className="font-bold text-gray-800">{topMatch.details.area} sq ft</span>
                    </div>
                  )}
                  {topMatch.details?.bedrooms !== undefined && topMatch.details.bedrooms > 0 && (
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-medium block">BHK</span>
                      <span className="font-bold text-gray-800">{topMatch.details.bedrooms} BHK</span>
                    </div>
                  )}
                </div>

                {/* Matched Attributes Tags */}
                {topMatch.matchedFields && topMatch.matchedFields.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                      Matched Signals:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {topMatch.matchedFields.map((field) => (
                        <span
                          key={field}
                          className="text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle2 size={12} className="text-amber-600" />
                          {getFieldBadgeLabel(field)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Note & Policy */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-600 leading-relaxed space-y-1">
              <p className="font-bold text-gray-800">Why are you seeing this warning?</p>
              <p>
                EstateGold performs automated geographical & structural duplicate property analysis to protect marketplace quality.
                If this listing represents a different flat or unique unit in the same building, ensure you have specified the exact Flat/Door Number or floor.
              </p>
            </div>
          </div>

          {/* MODAL FOOTER ACTIONS */}
          <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 transition-all cursor-pointer"
            >
              Edit Property Details
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {topMatch && topMatch.propertyId && topMatch.source === "database" && (
                <a
                  href={`/property-detail/${topMatch.propertyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E5D8B3] bg-[#FFF9EC] hover:bg-[#FFF2D3] text-xs font-bold text-[#9A720C] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <ExternalLink size={14} /> Review Property
                </a>
              )}

              <button
                type="button"
                onClick={onContinueAnyway}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Continue Anyway"}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
