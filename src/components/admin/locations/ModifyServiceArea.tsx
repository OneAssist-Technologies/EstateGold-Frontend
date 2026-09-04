"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Building2,
  MapPin,
  Search,
  ArrowLeft,
  Check,
  Send,
  Plus,
  Minus,
  Maximize2,
  Lock,
  X,
} from "lucide-react";
import LocationSearch, { SearchLocationResult } from "./LocationSearch";
import ServiceAreaMap from "./ServiceAreaMap";
import RadiusSelector from "./RadiusSelector";
import { getLocationById, updateLocation } from "@/src/services/locationService";

interface ModifyServiceAreaProps {
  locationId: string;
}

export default function ModifyServiceArea({ locationId }: ModifyServiceAreaProps) {
  const router = useRouter();

  // Section 1: Basic Information
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("India");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // Section 2: Location Information
  const [locationSearch, setLocationSearch] = useState("");
  const [latitude, setLatitude] = useState("13.0827");
  const [longitude, setLongitude] = useState("80.2707");
  const [radiusKm, setRadiusKm] = useState("10");

  // Section 3: Service Coverage
  const [pincodes, setPincodes] = useState<string[]>(["600001", "600002", "600003"]);
  const [pincodeInput, setPincodeInput] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<string[]>([
    "Apartment / Flat",
    "Independent House",
    "Villa",
    "Builder Floor",
    "Plot / Land",
    "Residential Plot",
    "Agricultural Land",
    "Commercial Space",
    "Office Space",
    "Shop / Retail",
    "Warehouse",
    "Industrial Property",
    "Hotel / Resort",
    "PG / Hostel",
    "Builder / New Project",
  ]);
  const [allowedServices, setAllowedServices] = useState<string[]>([
    "Buy",
    "Rent",
    "Lease",
    "PG / Co-Living",
  ]);

  // Section 4: Additional Settings
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayPriority, setDisplayPriority] = useState("1");
  const [internalNotes, setInternalNotes] = useState("");

  // UI State
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toastBanner, setToastBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [flyToTrigger, setFlyToTrigger] = useState(1);

  const handleSelectLocation = (result: SearchLocationResult) => {
    setLatitude(result.lat.toFixed(6));
    setLongitude(result.lng.toFixed(6));
    if (result.city && !cityName) setCityName(result.city);
    if (result.state && !stateName) setStateName(result.state);
    setFlyToTrigger((prev) => prev + 1);
  };

  const handleMarkerDragEnd = (lat: number, lng: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
  };

  useEffect(() => {
    async function loadLocation() {
      if (!locationId) return;
      try {
        setFetching(true);
        const res = await getLocationById(locationId);
        if (res.success && res.location) {
          const loc = res.location;
          setCityName(loc.city || "");
          setStateName(loc.state || "");
          setCountry(loc.country || "India");
          setStatus(loc.status || "active");
          setLatitude(loc.latitude ? String(loc.latitude) : "13.0827");
          setLongitude(loc.longitude ? String(loc.longitude) : "80.2707");
          setRadiusKm(loc.radiusKm ? String(loc.radiusKm) : "10");
          if (loc.pincodes && loc.pincodes.length > 0) setPincodes(loc.pincodes);
          if (loc.propertyTypes && loc.propertyTypes.length > 0) setPropertyTypes(loc.propertyTypes);
          if (loc.allowedServices && loc.allowedServices.length > 0) setAllowedServices(loc.allowedServices);
          setIsFeatured(loc.isFeatured !== undefined ? loc.isFeatured : true);
          setDisplayPriority(loc.displayPriority ? String(loc.displayPriority) : "1");
          setInternalNotes(loc.notes || "");
          setLocationSearch(`${loc.city}, ${loc.state}, ${loc.country || "India"}`);
        }
      } catch (err) {
        console.error("Failed to fetch location:", err);
      } finally {
        setFetching(false);
      }
    }
    loadLocation();
  }, [locationId]);

  const addPincodeTag = (val: string) => {
    const trimmed = val.trim().replace(/,/g, "");
    if (trimmed && !pincodes.includes(trimmed)) {
      setPincodes([...pincodes, trimmed]);
      setPincodeInput("");
    }
  };

  const removePincodeTag = (tag: string) => {
    setPincodes(pincodes.filter((p) => p !== tag));
  };

  const handlePincodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addPincodeTag(pincodeInput);
    }
  };

  const togglePropertyType = (type: string) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAllowedService = (service: string) => {
    setAllowedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSave = async (isDraft: boolean) => {
    if (!cityName.trim()) {
      const msg = "Please enter a City Name.";
      toast.error(msg);
      setToastBanner({ type: "error", message: msg });
      return;
    }

    if (!stateName.trim()) {
      const msg = "Please select a State.";
      toast.error(msg);
      setToastBanner({ type: "error", message: msg });
      return;
    }

    try {
      setLoading(true);
      setToastBanner(null);

      const res = await updateLocation(locationId, {
        city: cityName.trim(),
        state: stateName.trim(),
        country,
        status: isDraft ? "inactive" : status,
        latitude: parseFloat(latitude) || 13.0827,
        longitude: parseFloat(longitude) || 80.2707,
        radiusKm: parseInt(radiusKm) || 10,
        pincodes,
        propertyTypes,
        allowedServices,
        displayPriority: parseInt(displayPriority) || 1,
        isFeatured,
        notes: internalNotes,
      });

      if (res.success) {
        const msg = "Service area updated successfully!";
        toast.success(msg);
        setToastBanner({ type: "success", message: msg });
        setTimeout(() => {
          router.push("/admin/locations");
        }, 1000);
      }
    } catch (err: any) {
      console.error("Failed to update location:", err);
      const errMsg =
        err.response?.data?.message || "Failed to update service area.";
      toast.error(errMsg);
      setToastBanner({ type: "error", message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 text-center text-gray-500 font-medium bg-white rounded-2xl border border-[#ECE7DB]">
        Loading service area details...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE7DB] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1 font-medium">
            <Link href="/admin/locations" className="hover:text-[#C89B1C] transition">
              Locations
            </Link>
            <span>&gt;</span>
            <Link href="/admin/locations" className="hover:text-[#C89B1C] transition">
              Serviceable Locations
            </Link>
            <span>&gt;</span>
            <span className="text-gray-700 font-semibold">Modify Service Area</span>
          </div>
          <h1 className="text-3xl font-bold text-[#161616] tracking-tight">
            Modify Service Area
          </h1>
        </div>

        <Link
          href="/admin/locations"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E1D4] bg-white text-sm font-semibold text-gray-700 hover:bg-[#FAFAF8] hover:border-[#C89B1C] transition-all w-fit shadow-xs"
        >
          <ArrowLeft size={16} />
          Back to Locations
        </Link>
      </div>

      {/* Toast Banner Alert */}
      {toastBanner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-3 shadow-xs ${
            toastBanner.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toastBanner.type === "success" ? (
            <Check size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <X size={18} className="text-red-600 shrink-0" />
          )}
          <span>{toastBanner.message}</span>
        </motion.div>
      )}

      {/* SECTION 1 - Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[#ECE7DB] shadow-xs p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#B8860B] flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-bold text-[#161616]">
            1. Basic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              City Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] pl-10 pr-4 text-sm text-[#161616] outline-none focus:border-[#C89B1C] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] px-4 text-sm text-[#161616] outline-none focus:border-[#C89B1C] focus:bg-white transition-all cursor-pointer font-medium"
            >
              <option value="">Select state</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Delhi">Delhi NCR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] px-4 text-sm text-[#161616] outline-none focus:border-[#C89B1C] focus:bg-white transition-all cursor-pointer font-medium"
            >
              <option value="India">India</option>
              <option value="UAE">United Arab Emirates</option>
              <option value="Singapore">Singapore</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              className="w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] px-4 text-sm text-[#161616] outline-none focus:border-[#C89B1C] focus:bg-white transition-all cursor-pointer font-semibold"
            >
              <option value="active">🟢 Active</option>
              <option value="inactive">🔴 Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 2 - Location Information */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#ECE7DB] shadow-xs p-6 lg:p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#B8860B] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-xl font-bold text-[#161616]">
                2. Location Information
              </h2>
            </div>

            {/* Search Location */}
            <div className="mb-5">
              <LocationSearch
                value={locationSearch}
                onChange={setLocationSearch}
                onSelectLocation={handleSelectLocation}
              />
            </div>

            {/* Interactive React Leaflet Map */}
            <div className="mb-6">
              <ServiceAreaMap
                latitude={parseFloat(latitude) || 13.0827}
                longitude={parseFloat(longitude) || 80.2707}
                radiusKm={parseInt(radiusKm) || 10}
                flyToTrigger={flyToTrigger}
                onMarkerDragEnd={handleMarkerDragEnd}
              />
            </div>

            {/* Latitude, Longitude, Radius (KM) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Latitude (Read-only) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={latitude}
                    className="w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#F2EFE9] pl-4 pr-10 text-sm text-[#161616] outline-none font-mono font-semibold cursor-not-allowed select-none"
                  />
                  <Lock size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Longitude (Read-only) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={longitude}
                    className="w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#F2EFE9] pl-4 pr-10 text-sm text-[#161616] outline-none font-mono font-semibold cursor-not-allowed select-none"
                  />
                  <Lock size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Radius Selector (Editable) */}
              <RadiusSelector value={radiusKm} onChange={setRadiusKm} />
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Properties within this radius will be considered in this service area. Drag the marker to fine-tune location.
          </p>
        </motion.div>

        {/* SECTION 3 - Service Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-[#ECE7DB] shadow-xs p-6 lg:p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#B8860B] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-xl font-bold text-[#161616]">
                3. Service Coverage
              </h2>
            </div>



            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-3">
                Property Types <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Apartment / Flat",
                  "Independent House",
                  "Villa",
                  "Builder Floor",
                  "Plot / Land",
                  "Residential Plot",
                  "Agricultural Land",
                  "Commercial Space",
                  "Office Space",
                  "Shop / Retail",
                  "Warehouse",
                  "Industrial Property",
                  "Hotel / Resort",
                  "PG / Hostel",
                  "Builder / New Project",
                ].map((type) => {
                  const isChecked = propertyTypes.includes(type);
                  return (
                    <label
                      key={type}
                      onClick={() => togglePropertyType(type)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
                        isChecked
                          ? "bg-[#FFFDF6] border-[#C89B1C] text-[#161616]"
                          : "bg-[#FAFAF8] border-[#E8E1D4] text-gray-600"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-md flex items-center justify-center border transition-all ${
                          isChecked
                            ? "bg-[#C89B1C] border-[#C89B1C] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span>{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3">
                Allow For <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4 flex-wrap">
                {["Buy", "Rent", "Lease", "PG / Co-Living"].map((service) => {
                  const isChecked = allowedServices.includes(service);
                  return (
                    <label
                      key={service}
                      onClick={() => toggleAllowedService(service)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
                        isChecked
                          ? "bg-[#FFFDF6] border-[#C89B1C] text-[#161616]"
                          : "bg-[#FAFAF8] border-[#E8E1D4] text-gray-600"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-md flex items-center justify-center border transition-all ${
                          isChecked
                            ? "bg-[#C89B1C] border-[#C89B1C] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span>{service}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 4 - Additional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-[#ECE7DB] shadow-xs p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#B8860B] flex items-center justify-center font-bold text-sm">
            4
          </div>
          <h2 className="text-xl font-bold text-[#161616]">
            4. Additional Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-3">
              Featured City
            </label>
            <label
              onClick={() => setIsFeatured(!isFeatured)}
              className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#161616]"
            >
              <div
                className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                  isFeatured
                    ? "bg-[#C89B1C] border-[#C89B1C] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isFeatured && <Check size={14} strokeWidth={3} />}
              </div>
              <span>Show this city on homepage</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Display Priority <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={displayPriority}
              onChange={(e) => setDisplayPriority(e.target.value)}
              className="w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] px-4 text-sm text-[#161616] outline-none font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700">
                Internal Notes
              </label>
              <span className="text-[11px] text-gray-400 font-mono">
                {internalNotes.length}/300
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] p-3 text-sm text-[#161616] outline-none resize-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Action Buttons Footer */}
      <div className="pt-6 border-t border-[#ECE7DB] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8">
        <Link
          href="/admin/locations"
          className="px-6 py-3 rounded-xl border border-[#E8E1D4] bg-white text-sm font-semibold text-gray-700 hover:bg-[#FAFAF8] transition-all shadow-2xs text-center flex items-center justify-center"
        >
          Cancel
        </Link>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave(true)}
            className="px-6 py-3 rounded-xl border border-[#C89B1C] bg-white text-sm font-semibold text-[#B8860B] hover:bg-[#FFFDF6] transition-all cursor-pointer shadow-2xs w-full sm:w-auto text-center"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={loading || !cityName}
            onClick={() => handleSave(false)}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#C89B1C] to-[#D8B75A] hover:from-[#b68c17] hover:to-[#c7a74a] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <Send size={16} />
            <span>{loading ? "Updating..." : "Update Service Area"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
