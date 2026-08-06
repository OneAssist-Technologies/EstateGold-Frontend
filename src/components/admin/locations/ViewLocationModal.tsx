"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  MapPin,
  Pencil,
  Ruler,
  Globe,
  Sliders,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ServiceLocation } from "@/src/types/location";
import ServiceAreaMap from "./ServiceAreaMap";

interface ViewLocationModalProps {
  open: boolean;
  onClose: () => void;
  location: ServiceLocation | null;
  onEdit: (loc: ServiceLocation) => void;
}

export default function ViewLocationModal({
  open,
  onClose,
  location,
  onEdit,
}: ViewLocationModalProps) {
  if (!open || !location) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#ECE7DB] shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Top Header */}
          <div className="px-6 py-5 border-b border-[#ECE7DB] flex items-center justify-between bg-[#FAFAF8]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#B8860B] flex items-center justify-center font-bold">
                <Building2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-serif text-[#161616]">
                    {location.city}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      location.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {location.status === "active" ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {location.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {location.state}, {location.country || "India"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Map Preview */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <MapPin size={15} className="text-[#C89B1C]" />
                Interactive Coverage Area
              </label>
              <ServiceAreaMap
                latitude={location.latitude || 13.0827}
                longitude={location.longitude || 80.2707}
                radiusKm={location.radiusKm || 10}
                onMarkerDragEnd={() => {}}
              />
            </div>

            {/* Grid Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E8E1D4]">
                <span className="text-[11px] font-semibold text-gray-400 block mb-1">
                  Latitude
                </span>
                <span className="text-sm font-bold font-mono text-[#161616]">
                  {(location.latitude || 0).toFixed(4)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E8E1D4]">
                <span className="text-[11px] font-semibold text-gray-400 block mb-1">
                  Longitude
                </span>
                <span className="text-sm font-bold font-mono text-[#161616]">
                  {(location.longitude || 0).toFixed(4)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E8E1D4]">
                <span className="text-[11px] font-semibold text-gray-400 block mb-1">
                  Service Radius
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {location.radiusKm} KM
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E8E1D4]">
                <span className="text-[11px] font-semibold text-gray-400 block mb-1">
                  Active Listings
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {location.activeListings || 0}
                </span>
              </div>
            </div>

            {/* Pincodes Tag List */}
            {location.pincodes && location.pincodes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Covered Pincodes ({location.pincodes.length})
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#FAFAF8] border border-[#E8E1D4]">
                  {location.pincodes.map((pin) => (
                    <span
                      key={pin}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E1D4] text-xs font-mono font-semibold text-gray-700 shadow-2xs"
                    >
                      {pin}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Property Types & Services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Allowed Property Types
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(location.propertyTypes && location.propertyTypes.length > 0
                    ? location.propertyTypes
                    : ["Apartment", "Villa", "Plot", "Commercial"]
                  ).map((type) => (
                    <span
                      key={type}
                      className="px-2.5 py-1 rounded-lg bg-[#FFFDF6] border border-[#F4E3B5] text-xs font-medium text-[#B8860B]"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Allowed Operations
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(location.allowedServices && location.allowedServices.length > 0
                    ? location.allowedServices
                    : ["Buy", "Rent", "Lease"]
                  ).map((service) => (
                    <span
                      key={service}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            {location.notes && (
              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E8E1D4]">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Internal Notes
                </label>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {location.notes}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-[#ECE7DB] bg-[#FAFAF8] flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E8E1D4] bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(location);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#C89B1C] hover:bg-[#b68c17] text-white text-sm font-bold shadow-md flex items-center gap-2 transition"
            >
              <Pencil size={16} />
              <span>Edit Service Area</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
