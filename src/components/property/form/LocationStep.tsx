"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  MapPin,
  Building,
  Home,
  CheckCircle2,
  AlertTriangle,
  Info,
  Globe,
  Compass,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { PropertyFormData } from "../../../types/property";
import LocationSearch, { SearchLocationResult } from "../../admin/locations/LocationSearch";
import ServiceAreaMap from "../../admin/locations/ServiceAreaMap";
import api from "../../../lib/api";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

interface ActiveLocation {
  _id: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  status: string;
  propertyTypes?: string[];
  allowedServices?: string[];
}

const REGIONS = [
  "India",
  "United States",
  "United Arab Emirates",
  "United Kingdom",
  "Australia",
  "Canada",
  "Singapore",
];

const STATES_BY_REGION: Record<string, string[]> = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
  "United States": [
    "California",
    "Florida",
    "Illinois",
    "New York",
    "Texas",
    "Washington",
    "Other US States",
  ],
  "United Arab Emirates": [
    "Abu Dhabi",
    "Ajman",
    "Dubai",
    "Fujairah",
    "Ras Al Khaimah",
    "Sharjah",
    "Umm Al Quwain",
  ],
};

function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isTypeAllowed(allowedTypes?: string[], targetType?: string) {
  if (!allowedTypes || allowedTypes.length === 0) return true;
  if (!targetType) return true;

  const target = targetType.trim().toLowerCase();

  return allowedTypes.some((item) => {
    const allowed = item.trim().toLowerCase();
    if (allowed === target) return true;

    if (target.includes("apartment") && allowed.includes("apartment")) return true;
    if (target.includes("villa") && allowed.includes("villa")) return true;
    if (target.includes("plot") && allowed.includes("plot")) return true;
    if (target.includes("house") && allowed.includes("house")) return true;
    if (target.includes("commercial") && allowed.includes("commercial")) return true;
    if (target.includes("office") && allowed.includes("office")) return true;
    if (
      (target.includes("pg") || target.includes("co-living")) &&
      (allowed.includes("pg") || allowed.includes("co-living"))
    )
      return true;

    return false;
  });
}

function isServiceAllowed(allowedServices?: string[], targetPurpose?: string) {
  if (!allowedServices || allowedServices.length === 0) return true;
  if (!targetPurpose) return true;

  const target = targetPurpose.trim().toLowerCase();

  return allowedServices.some((item) => {
    const allowed = item.trim().toLowerCase();
    if (allowed === target) return true;

    if (
      (target === "sell" || target === "sale" || target === "buy") &&
      (allowed === "buy" || allowed === "sell" || allowed === "sale")
    )
      return true;
    if (target === "rent" && allowed === "rent") return true;
    if (target === "lease" && allowed === "lease") return true;

    return false;
  });
}

export default function LocationStep({ formData, setFormData, errors }: Props) {
  const [activeLocations, setActiveLocations] = useState<ActiveLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>("India");
  const [selectedState, setSelectedState] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [flyToTrigger, setFlyToTrigger] = useState<number>(0);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [showUnserviceableModal, setShowUnserviceableModal] = useState<boolean>(false);
  const [requestNotes, setRequestNotes] = useState<string>("");
  const [submittingRequest, setSubmittingRequest] = useState<boolean>(false);
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false);

  // Available states based on selected region
  const availableStates = useMemo(() => {
    return STATES_BY_REGION[selectedRegion] || [
      "State / Province 1",
      "State / Province 2",
      "State / Province 3",
    ];
  }, [selectedRegion]);

  // Fetch active serviceable areas from backend
  useEffect(() => {
    async function fetchActiveLocations() {
      try {
        setLoadingLocations(true);
        const res = await api.get("/locations?status=active");
        if (res.data && res.data.locations) {
          setActiveLocations(res.data.locations);
        }
      } catch (err) {
        console.error("Failed to load active serviceable locations:", err);
      } finally {
        setLoadingLocations(false);
      }
    }
    fetchActiveLocations();
  }, []);

  // Check serviceability against active locations
  const serviceabilityResult = useMemo(() => {
    if (loadingLocations) return { status: "loading" };

    if (!activeLocations || activeLocations.length === 0) {
      return {
        status: "no_areas",
        message: "We currently don't have any serviceable areas available.",
      };
    }

    const { latitude, longitude, city, propertyType, purpose } = formData;

    // 1. Check if coordinates are present
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      const matches: { location: ActiveLocation; distance: number }[] = [];

      for (const loc of activeLocations) {
        const dist = calculateDistanceKm(
          latitude,
          longitude,
          loc.latitude,
          loc.longitude
        );
        if (dist <= loc.radiusKm) {
          matches.push({ location: loc, distance: dist });
        }
      }

      if (matches.length > 0) {
        matches.sort((a, b) => a.distance - b.distance);
        const best = matches[0];
        const loc = best.location;

        if (propertyType && !isTypeAllowed(loc.propertyTypes, propertyType)) {
          return {
            status: "unserviceable",
            message: `${propertyType} listings are currently not allowed in ${loc.city}.`,
            subMessage: "Please choose an allowed property type or select another location.",
          };
        }

        if (purpose && !isServiceAllowed(loc.allowedServices, purpose)) {
          const formattedPurpose =
            purpose.charAt(0).toUpperCase() + purpose.slice(1);
          return {
            status: "unserviceable",
            message: `${formattedPurpose} listings are currently not allowed in ${loc.city}.`,
            subMessage: "Please choose an allowed listing purpose or select another location.",
          };
        }

        return {
          status: "serviceable",
          matchedLocation: loc,
          distance: best.distance,
        };
      } else {
        return {
          status: "unserviceable",
          message: "Sorry, we currently don't provide service in this area.",
          subMessage: "Please select a property location within our serviceable areas.",
        };
      }
    }

    // 2. Fallback check by city name if coordinates not yet provided
    if (city && city.trim()) {
      const cityMatch = activeLocations.find(
        (loc) => loc.city.toLowerCase() === city.trim().toLowerCase()
      );
      if (cityMatch) {
        if (propertyType && !isTypeAllowed(cityMatch.propertyTypes, propertyType)) {
          return {
            status: "unserviceable",
            message: `${propertyType} listings are currently not allowed in ${cityMatch.city}.`,
            subMessage: "Please choose an allowed property type or select another location.",
          };
        }

        if (purpose && !isServiceAllowed(cityMatch.allowedServices, purpose)) {
          const formattedPurpose =
            purpose.charAt(0).toUpperCase() + purpose.slice(1);
          return {
            status: "unserviceable",
            message: `${formattedPurpose} listings are currently not allowed in ${cityMatch.city}.`,
            subMessage: "Please choose an allowed listing purpose or select another location.",
          };
        }

        return {
          status: "serviceable",
          matchedLocation: cityMatch,
          distance: 0,
        };
      } else {
        return {
          status: "unserviceable",
          message: "Sorry, we currently don't provide service in this area.",
          subMessage: "Please select a property location within our serviceable areas.",
        };
      }
    }

    return { status: "prompt" };
  }, [
    formData.latitude,
    formData.longitude,
    formData.city,
    formData.propertyType,
    formData.purpose,
    activeLocations,
    loadingLocations,
  ]);

  // Auto-open unserviceable popup modal when location exceeds radius (only when map modal is closed)
  useEffect(() => {
    if (serviceabilityResult.status === "unserviceable" && !showMapModal) {
      setShowUnserviceableModal(true);
      setRequestSuccess(false);
    }
  }, [serviceabilityResult.status, formData.latitude, formData.longitude, formData.city, showMapModal]);

  // Submit Location Request to Admin
  const handleSendLocationRequest = async () => {
    try {
      setSubmittingRequest(true);
      await api.post("/locations/request-service", {
        city: formData.city || formData.locality || "Requested Area",
        state: selectedState || "Tamil Nadu",
        locality: formData.locality,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        notes: requestNotes,
      });
      setRequestSuccess(true);
    } catch (err: any) {
      console.error("Failed to submit location request:", err);
      alert(err.response?.data?.message || "Failed to submit request to admin.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Handle location selection from search autocomplete
  const handleSelectLocation = useCallback(
    (result: SearchLocationResult) => {
      let cleanLocality = result.locality || "";
      const cityLower = (result.city || "").toLowerCase().trim();
      if (cleanLocality.toLowerCase().trim() === cityLower) {
        cleanLocality = "";
      }
      if (!cleanLocality && result.address) {
        const firstPart = result.address.split(",")[0].trim();
        if (firstPart.toLowerCase() !== cityLower) {
          cleanLocality = firstPart;
        }
      }

      setFormData((prev) => ({
        ...prev,
        city: result.city || prev.city || "",
        state: result.state || prev.state || "",
        locality: cleanLocality || prev.locality || "",
        address: result.address || prev.address,
        latitude: result.lat,
        longitude: result.lng,
      }));
      setFlyToTrigger((prev) => prev + 1);

      if (result.state && !selectedState) {
        setSelectedState(result.state);
      }
    },
    [selectedState, setFormData]
  );

  // Handle map marker drag selection
  const handleMarkerDragEnd = useCallback(
    async (lat: number, lng: number) => {
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));

      // Reverse geocode lat/lng to get address details
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          {
            headers: {
              "User-Agent": "PropertyListingApp/1.0",
              "Accept-Language": "en",
            },
          }
        );
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.county ||
            addr.municipality ||
            "";
          const cityLower = city.toLowerCase().trim();

          let locality =
            addr.suburb ||
            addr.neighbourhood ||
            addr.residential ||
            addr.road ||
            "";
          if (locality.toLowerCase().trim() === cityLower) {
            locality = "";
          }

          const state = addr.state || "";
          const fullAddr = data.display_name || "";

          setFormData((prev) => ({
            ...prev,
            city: city || prev.city,
            state: state || prev.state,
            locality: locality || prev.locality,
            address: fullAddr || prev.address,
          }));

          if (fullAddr) {
            setSearchQuery(fullAddr);
          }

          if (state && !selectedState) {
            setSelectedState(state);
          }
        }
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
      }
    },
    [selectedState, setFormData, setSearchQuery]
  );

  const defaultMapLat = formData.latitude && !isNaN(formData.latitude) ? formData.latitude : 11.0168;
  const defaultMapLng = formData.longitude && !isNaN(formData.longitude) ? formData.longitude : 76.9558;

  return (
    <div className="relative">
      <div className={`transition-all duration-300 ${showMapModal ? "opacity-15 blur-[4px] pointer-events-none select-none" : ""}`}>
        <h2 className="text-4xl font-bold">Where is the property?</h2>

        <p className="text-gray-500 mt-2">
          Accurate location helps buyers find it faster
        </p>

        {/* Serviceable Areas Info Header */}
        {activeLocations.length > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#FFFBF0] border border-[#F5E4B3] flex items-center gap-2.5 text-xs text-[#8B630B]">
            <Info size={16} className="shrink-0 text-[#C89B1C]" />
            <span>
              <strong>Serviceable Cities:</strong>{" "}
              {activeLocations.map((l) => l.city).join(", ")}
            </span>
          </div>
        )}

        <div className="space-y-6 mt-6">
          {/* 1. REGION / COUNTRY SELECTION */}
          <div>
            <label className="font-medium flex items-center gap-1.5 text-sm text-gray-800 mb-1.5">
              <Globe size={16} className="text-[#C89B1C]" />
              <span>Region / Country <span className="text-red-500">*</span></span>
            </label>

            <select
              value={selectedRegion}
              onChange={(e) => {
                const newRegion = e.target.value;
                setSelectedRegion(newRegion);
                setSelectedState("");
                setSearchQuery("");
              }}
              className="w-full h-14 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] px-4 text-sm text-[#161616] outline-none focus:border-[#C89B1C] focus:bg-white focus:ring-2 focus:ring-[#C89B1C]/15 transition-all cursor-pointer"
            >
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* 2. STATE SELECTION */}
          <div>
            <label className="font-medium flex items-center gap-1.5 text-sm text-gray-800 mb-1.5">
              <Compass size={16} className="text-[#C89B1C]" />
              <span>State <span className="text-red-500">*</span></span>
            </label>

            <select
              value={selectedState}
              onChange={(e) => {
                const newSt = e.target.value;
                setSelectedState(newSt);
                setSearchQuery("");
              }}
              className={`w-full h-14 rounded-xl border px-4 text-sm text-[#161616] outline-none focus:border-[#C89B1C] focus:bg-white focus:ring-2 focus:ring-[#C89B1C]/15 transition-all cursor-pointer ${errors?.state ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-[#E8E1D4] bg-[#FAFAF8]"
                }`}
            >
              <option value="">-- Select State --</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {errors?.state && (
              <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.state}</p>
            )}

            {!selectedState && (
              <p className="text-xs text-amber-600 mt-1 font-medium">
                Please manually select state to enable location search.
              </p>
            )}
          </div>

          {/* 3. LOCATION SEARCH (RIDE-BOOKING UX WITH MAP MODAL TRIGGER) */}
          <div>
            <LocationSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onSelectLocation={handleSelectLocation}
              onOpenMap={() => setShowMapModal(true)}
              selectedRegion={selectedRegion}
              selectedState={selectedState}
              disabled={!selectedState}
            />
          </div>

          {/* City Input */}
          <div>
            <label className="font-medium text-sm">City <span className="text-red-500">*</span></label>

            <div className="relative mt-2">
              <MapPin
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                placeholder="e.g. Coimbatore, Chennai"
                className={`w-full border rounded-xl h-14 pl-12 pr-4 outline-none focus:border-[#C89B1C] ${errors?.city ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-200"
                  }`}
              />
            </div>
            {errors?.city && (
              <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.city}</p>
            )}
          </div>

          {/* Locality / Area Input */}
          <div>
            <label className="font-medium text-sm">Locality / Area <span className="text-red-500">*</span></label>

            <div className="relative mt-2">
              <MapPin
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                value={formData.locality}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    locality: e.target.value,
                  }))
                }
                placeholder="e.g. Gandhipuram, Anna Nagar"
                className={`w-full border rounded-xl h-14 pl-12 pr-4 outline-none focus:border-[#C89B1C] ${errors?.locality ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-200"
                  }`}
              />
            </div>
            {errors?.locality && (
              <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.locality}</p>
            )}
          </div>

          {/* Society / Building Name Input */}
          <div>
            <label className="font-medium text-sm">Society / Building Name</label>

            <div className="relative mt-2">
              <Building
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                value={formData.society}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    society: e.target.value,
                  }))
                }
                placeholder="Building Name"
                className="w-full border rounded-xl h-14 pl-12 pr-4 outline-none focus:border-[#C89B1C]"
              />
            </div>
          </div>

          {/* Full Address Input */}
          <div>
            <label className="font-medium text-sm">Full Address <span className="text-red-500">*</span></label>

            <div className="relative mt-2">
              <Home
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Street Address"
                className={`w-full border rounded-xl min-h-[100px] pl-12 p-4 outline-none focus:border-[#C89B1C] ${errors?.address ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-200"
                  }`}
              />
            </div>
            {errors?.address && (
              <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.address}</p>
            )}
          </div>

          {/* INLINE SERVICEABILITY FEEDBACK MESSAGES */}
          {!showMapModal && serviceabilityResult.status === "serviceable" && (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-3 text-green-800">
              <CheckCircle2 size={20} className="shrink-0 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">
                  ✓ Location is Serviceable
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Location falls within{" "}
                  <strong>{serviceabilityResult.matchedLocation?.city}</strong>{" "}
                  service area.
                </p>
              </div>
            </div>
          )}

          {!showMapModal && serviceabilityResult.status === "unserviceable" && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800">
              <AlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">
                  ⚠ Location Not Serviceable
                </p>
                <p className="text-xs text-red-700 mt-1 font-medium">
                  {serviceabilityResult.message || "We currently don't provide service in this location. Please select a location within our serviceable areas."}
                </p>
              </div>
            </div>
          )}

          {!showMapModal && serviceabilityResult.status === "no_areas" && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800">
              <AlertTriangle size={20} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">
                  {serviceabilityResult.message}
                </p>
                <p className="text-xs text-amber-700 mt-1 font-medium">
                  Property listing is currently disabled until admin configures active service areas.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INTERACTIVE PICK LOCATION ON MAP MODAL */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-[#ECE7DB]"
            >
              {/* Modal Header */}
              <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-[#FAFAF8]">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#C89B1C]" />
                  <h3 className="font-bold text-base text-[#161616]">Pick Location on Map</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Interactive Leaflet Map */}
              <div className="w-full h-[380px] relative">
                <ServiceAreaMap
                  latitude={defaultMapLat}
                  longitude={defaultMapLng}
                  radiusKm={10}
                  showRadius={false}
                  flyToTrigger={flyToTrigger}
                  onMarkerDragEnd={handleMarkerDragEnd}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 px-6 bg-white border-t border-gray-100 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 truncate">Selected Location:</p>
                  <p className="text-xs font-bold text-[#161616] truncate mt-0.5">
                    {formData.address || `${defaultMapLat.toFixed(4)}, ${defaultMapLng.toFixed(4)}`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="px-6 h-11 rounded-xl bg-[#C89B1C] hover:bg-[#B38A18] text-white font-bold text-xs transition-colors shadow-md shrink-0 cursor-pointer"
                >
                  Confirm Location
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UNSERVICEABLE LOCATION ADMIN REQUEST POPUP MODAL */}
      <AnimatePresence>
        {showUnserviceableModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col border border-red-100"
            >
              {/* Modal Header */}
              <div className="p-6 text-center bg-[#FFF8F8] border-b border-red-100 relative">
                <button
                  type="button"
                  onClick={() => setShowUnserviceableModal(false)}
                  className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 border border-red-200 shadow-xs">
                  <AlertTriangle size={28} className="text-red-600" />
                </div>

                <h3 className="text-lg font-bold text-red-900">
                  We Are Not Servicing In This Area
                </h3>
                <p className="text-xs text-red-700 mt-1 max-w-xs mx-auto leading-relaxed">
                  The selected location exceeds the radius fixed by the admin. Please send a request to the admin to add your property location!
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {requestSuccess ? (
                  <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-center space-y-2">
                    <CheckCircle2 size={32} className="text-green-600 mx-auto" />
                    <p className="font-bold text-sm text-green-900">
                      Request Submitted to Admin!
                    </p>
                    <p className="text-xs text-green-700 leading-relaxed">
                      Your request for <strong>{formData.locality || formData.city || "this location"}</strong> has been sent to our admin team.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1">
                      <p className="font-semibold text-gray-900">Selected Location:</p>
                      <p className="text-gray-600 truncate font-medium">
                        {formData.address || `${formData.locality || ""}, ${formData.city || ""}`}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Request Notes for Admin (Optional)
                      </label>
                      <textarea
                        value={requestNotes}
                        onChange={(e) => setRequestNotes(e.target.value)}
                        placeholder="Please add this area for property listing..."
                        className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/15 min-h-[75px]"
                      />
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  {!requestSuccess ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowUnserviceableModal(false)}
                        className="flex-1 h-11 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors"
                      >
                        Select Another Area
                      </button>

                      <button
                        type="button"
                        onClick={handleSendLocationRequest}
                        disabled={submittingRequest}
                        className="flex-1 h-11 rounded-xl bg-[#C89B1C] hover:bg-[#B38A18] text-white text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {submittingRequest ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Send Request To Admin</span>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowUnserviceableModal(false)}
                      className="w-full h-11 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-md"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}