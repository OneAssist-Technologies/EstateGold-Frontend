"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  Globe,
  Compass,
  FileText,
  Sliders,
  Check,
  Building2,
  Trash2,
} from "lucide-react";
import { ServiceLocation } from "@/src/types/location";
import { updateLocation, deleteLocation } from "@/src/services/locationService";

interface Props {
  open: boolean;
  request: ServiceLocation | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ALL_PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Independent House",
  "Plot / Land",
  "Commercial Office",
  "Commercial Shop",
  "PG / Co-Living",
];

const ALL_SERVICES = ["Buy", "Sell", "Rent", "Lease"];

export default function CityRequestModal({
  open,
  request,
  onClose,
  onSuccess,
}: Props) {
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "Apartment",
    "Villa",
    "Independent House",
    "Plot / Land",
    "Commercial Office",
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Buy",
    "Sell",
    "Rent",
  ]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (request) {
      setRadiusKm(request.radiusKm || 15);
      if (request.propertyTypes && request.propertyTypes.length > 0) {
        setSelectedTypes(request.propertyTypes);
      } else {
        setSelectedTypes([
          "Apartment",
          "Villa",
          "Independent House",
          "Plot / Land",
          "Commercial Office",
        ]);
      }
      if (request.allowedServices && request.allowedServices.length > 0) {
        setSelectedServices(request.allowedServices);
      } else {
        setSelectedServices(["Buy", "Sell", "Rent"]);
      }
      setErrorMsg("");
    }
  }, [request]);

  if (!open || !request) return null;

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleApproveAndAddCity = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      await updateLocation(request._id, {
        status: "active",
        radiusKm: Number(radiusKm) || 15,
        propertyTypes: selectedTypes,
        allowedServices: selectedServices,
        isFeatured: true,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to approve city request:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to approve city request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRejectDismiss = async () => {
    if (!window.confirm("Are you sure you want to dismiss this city request?")) {
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      await deleteLocation(request._id);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to dismiss request:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to dismiss request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#ECE7DB] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#1E1B18] via-[#2A241E] to-[#1E1B18] text-white flex items-center justify-between border-b border-white/10 relative shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#B88A1A] via-[#E5C365] to-[#8C6605] flex items-center justify-center text-white shadow-md">
                <Building2 size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-white">
                    New City Property Addition Request
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                    Pending Review
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">
                  Review and configure service parameters to enable property listings in this city.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-800">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={18} className="shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Requested Location Details Box */}
            <div className="bg-[#FFFBF0] border border-[#F5E4B3] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0DFA8] pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="text-[#C89B1C]" size={20} />
                  <span className="text-xs font-bold text-[#8C6605] uppercase tracking-wider">
                    Requested Target City
                  </span>
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {formattedDate}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                    City Name
                  </label>
                  <p className="text-base font-bold text-gray-900 mt-0.5">
                    {request.city}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                    State & Country
                  </label>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
                    <Globe size={14} className="text-[#C89B1C]" />
                    {request.state || "Tamil Nadu"}, {request.country || "India"}
                  </p>
                </div>

                {request.requestedLocality && (
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                      Locality / Area
                    </label>
                    <p className="text-xs font-medium text-gray-800 mt-0.5">
                      {request.requestedLocality}
                    </p>
                  </div>
                )}

                {(request.latitude !== undefined && request.longitude !== undefined) && (
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                      Geo Coordinates
                    </label>
                    <p className="text-xs font-mono font-medium text-gray-700 mt-0.5 flex items-center gap-1">
                      <Compass size={14} className="text-gray-400" />
                      {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>

              {request.requestedAddress && (
                <div className="pt-2 border-t border-[#F0DFA8]">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                    Full Property Address
                  </label>
                  <p className="text-xs text-gray-700 font-medium mt-0.5 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-[#F5E4B3]">
                    {request.requestedAddress}
                  </p>
                </div>
              )}

              {request.notes && (
                <div className="pt-2 border-t border-[#F0DFA8]">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                    <FileText size={13} className="text-[#C89B1C]" />
                    User Notes & Request Context
                  </label>
                  <p className="text-xs text-gray-700 mt-0.5 italic bg-white/70 p-2.5 rounded-xl border border-[#F5E4B3]">
                    "{request.notes}"
                  </p>
                </div>
              )}

              {/* Requester User Card */}
              {request.requestedBy && (
                <div className="pt-3 border-t border-[#F0DFA8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[#9A720C] text-white flex items-center justify-center font-bold text-xs">
                      {request.requestedBy.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">
                        {request.requestedBy.fullName || "Registered User"}
                      </span>
                      {request.requestedBy.email && (
                        <span className="text-gray-500 ml-2">
                          ({request.requestedBy.email})
                        </span>
                      )}
                    </div>
                  </div>
                  {request.requestedBy.role && (
                    <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 font-semibold capitalize text-[10px] text-gray-700">
                      {request.requestedBy.role}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Admin Controls to Configure and Add the New City */}
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <Sliders size={18} className="text-[#C89B1C]" />
                <h4 className="font-bold text-sm text-gray-900">
                  Configure City Service Parameters
                </h4>
              </div>

              {/* Service Radius */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Coverage Radius (Km)
                  </label>
                  <span className="text-xs font-bold text-[#9A720C] bg-[#FFF9EC] px-2.5 py-0.5 rounded-lg border border-[#E8E1D4]">
                    {radiusKm} km radius
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9A720C]"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Properties listed within this radius will be marked as serviceable for {request.city}.
                </p>
              </div>

              {/* Allowed Property Types */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  Allowed Property Types in {request.city}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_PROPERTY_TYPES.map((type) => {
                    const active = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                          active
                            ? "bg-[#9A720C] text-white border-[#9A720C] shadow-2xs"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {active && <Check size={13} />}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allowed Services */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  Allowed Listing Purpose / Services
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SERVICES.map((service) => {
                    const active = selectedServices.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                          active
                            ? "bg-[#9A720C] text-white border-[#9A720C] shadow-2xs"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {active && <Check size={13} />}
                        {service}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 px-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4 shrink-0">
            <button
              type="button"
              onClick={handleRejectDismiss}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={15} />
              Dismiss Request
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApproveAndAddCity}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white text-xs font-bold hover:opacity-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                {loading ? "Adding City..." : `Approve & Activate ${request.city}`}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
