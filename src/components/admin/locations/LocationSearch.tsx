"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, X, Loader2, Navigation, Clock, AlertCircle } from "lucide-react";

export interface SearchLocationResult {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  locality?: string;
  primaryName?: string;
  secondaryAddress?: string;
}

interface LocationSearchProps {
  value: string;
  onChange: (val: string) => void;
  onSelectLocation: (result: SearchLocationResult) => void;
  onOpenMap?: () => void;
  selectedRegion?: string;
  selectedState?: string;
  disabled?: boolean;
}

interface RecentLocation {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  locality?: string;
  primaryName: string;
  secondaryAddress: string;
}

const RECENT_STORAGE_KEY = "recent_property_locations";

export default function LocationSearch({
  value,
  onChange,
  onSelectLocation,
  onOpenMap,
  selectedRegion = "India",
  selectedState = "",
  disabled = false,
}: LocationSearchProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [recentLocations, setRecentLocations] = useState<RecentLocation[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load recent locations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) {
        setRecentLocations(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load recent locations:", err);
    }
  }, []);

  // Save selected location to recent locations
  const saveToRecent = useCallback((loc: RecentLocation) => {
    try {
      const existing = localStorage.getItem(RECENT_STORAGE_KEY);
      let list: RecentLocation[] = existing ? JSON.parse(existing) : [];

      list = list.filter(
        (item) =>
          item.primaryName.toLowerCase() !== loc.primaryName.toLowerCase() ||
          item.secondaryAddress.toLowerCase() !== loc.secondaryAddress.toLowerCase()
      );

      list.unshift(loc);
      const trimmed = list.slice(0, 4);
      setRecentLocations(trimmed);
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.error("Failed to save recent location:", err);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced & bounded search logic using OpenStreetMap Nominatim
  useEffect(() => {
    setSearchError(null);

    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const searchParts = [value.trim()];
        if (selectedState && selectedState.trim()) {
          searchParts.push(selectedState.trim());
        }
        if (selectedRegion && selectedRegion.trim()) {
          searchParts.push(selectedRegion.trim());
        }

        const fullQuery = searchParts.join(", ");
        const countryCodeParam = selectedRegion.toLowerCase() === "india" ? "&countrycodes=in" : "";

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullQuery
          )}&addressdetails=1&limit=6${countryCodeParam}`,
          {
            signal: controller.signal,
            headers: {
              "User-Agent": "PropertyListingApp/1.0",
              "Accept-Language": "en",
            },
          }
        );

        const data = await res.json();
        if (Array.isArray(data)) {
          const filtered = selectedState
            ? data.filter((item: any) => {
                const itemState = (item.address?.state || "").toLowerCase();
                return itemState.includes(selectedState.toLowerCase()) || !itemState;
              })
            : data;

          const results = filtered.length > 0 ? filtered : data;
          setSuggestions(results.slice(0, 6));
        } else {
          setSuggestions([]);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Geocoding search failed:", err);
          setSearchError("Unable to search location right now. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, selectedRegion, selectedState]);

  // Helper to parse display_name into primary name & secondary address
  const parseAddressDetails = (item: any) => {
    const rawName = item.display_name || item.formatted || "";
    const parts = rawName.split(",").map((s: string) => s.trim());
    const primaryName = parts[0] || rawName;
    const secondaryAddress = parts.slice(1).join(", ") || "";

    const addressObj = item.address || {};
    const city =
      addressObj.city ||
      addressObj.town ||
      addressObj.village ||
      addressObj.county ||
      addressObj.municipality ||
      item.city ||
      "";
    const state = addressObj.state || item.state || selectedState || "";
    const locality =
      addressObj.suburb ||
      addressObj.neighbourhood ||
      addressObj.residential ||
      addressObj.road ||
      primaryName;

    return { primaryName, secondaryAddress, city, state, locality, fullAddress: rawName };
  };

  const handleSelect = (item: any) => {
    const lat = parseFloat(item.lat || item.latitude);
    const lng = parseFloat(item.lon || item.longitude);
    const { primaryName, secondaryAddress, city, state, locality, fullAddress } =
      parseAddressDetails(item);

    onChange(fullAddress);
    setShowDropdown(false);

    if (!isNaN(lat) && !isNaN(lng)) {
      const resultObj = {
        lat,
        lng,
        address: fullAddress,
        city,
        state,
        locality,
        primaryName,
        secondaryAddress,
      };

      saveToRecent(resultObj);
      onSelectLocation(resultObj);
    }
  };

  const handleSelectRecent = (recent: RecentLocation) => {
    onChange(recent.address);
    setShowDropdown(false);
    onSelectLocation(recent);
  };

  // Current location handler using browser Geolocation
  const handleUseCurrentLocation = () => {
    setGeoMessage(null);
    if (!navigator.geolocation) {
      setGeoMessage("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
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
            const { primaryName, secondaryAddress, city, state, locality, fullAddress } =
              parseAddressDetails(data);

            onChange(fullAddress);
            setShowDropdown(false);

            const resultObj = {
              lat,
              lng,
              address: fullAddress,
              city,
              state,
              locality,
              primaryName,
              secondaryAddress,
            };

            saveToRecent(resultObj);
            onSelectLocation(resultObj);
          }
        } catch (err) {
          console.error("Reverse geocoding failed for current location:", err);
          setGeoMessage("Could not retrieve location details. Please search manually.");
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoMessage("Location permission was denied. You can search for your location manually.");
        } else {
          setGeoMessage("Unable to retrieve location. Please search manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const isTyping = value.trim().length > 0;
  const isMinCharsMet = value.trim().length >= 3;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Search Property Location <span className="text-red-500">*</span>
      </label>

      {/* Clean input bar with small map button next to search input field */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            placeholder={
              disabled
                ? "Please select Region & State first..."
                : "Search for area, street, locality or landmark..."
            }
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className={`w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] pl-10 pr-10 text-sm font-medium text-[#161616] truncate outline-none focus:border-[#C89B1C] focus:bg-white focus:ring-2 focus:ring-[#C89B1C]/15 transition-all shadow-xs ${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />

          {loading ? (
            <Loader2
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C89B1C] animate-spin"
            />
          ) : value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setSuggestions([]);
                setShowDropdown(true);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        {/* Small Map logo button placed next to search input field */}
        <button
          type="button"
          onClick={() => {
            if (onOpenMap) {
              onOpenMap();
            } else {
              const mapElement = document.getElementById("property-location-map");
              if (mapElement) {
                mapElement.scrollIntoView({ behavior: "smooth" });
              }
            }
          }}
          className="h-12 px-3.5 rounded-xl border border-[#E8E1D4] bg-[#FFFBF0] hover:bg-[#FFF5DB] text-[#8B630B] hover:text-[#9A720C] flex items-center gap-2 text-xs font-bold shrink-0 transition-colors shadow-xs group cursor-pointer"
          title="Pick location on map"
        >
          <div className="w-6 h-6 rounded-full bg-[#C89B1C] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <MapPin size={13} className="fill-white" />
          </div>
          <span className="hidden sm:inline">Map</span>
        </button>
      </div>

      {/* Geolocation Denial / Error Banner */}
      {geoMessage && (
        <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
          <AlertCircle size={15} className="shrink-0 text-amber-600" />
          <span>{geoMessage}</span>
        </div>
      )}

      {/* RIDE-BOOKING STYLE EXPANDED LOCATION PICKER PANEL */}
      {showDropdown && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#ECE7DB] shadow-2xl z-50 overflow-hidden divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {/* 1. USE CURRENT LOCATION (Always present when not typing long query) */}
          {!isMinCharsMet && (
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="w-full p-4 text-left hover:bg-[#FFFDF6] transition-colors flex items-center gap-3.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#FFF5DB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-[#F7E7BE]">
                {geoLoading ? (
                  <Loader2 size={18} className="text-[#C89B1C] animate-spin" />
                ) : (
                  <Navigation size={18} className="text-[#C89B1C]" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#161616] group-hover:text-[#9A720C] transition-colors">
                  {geoLoading ? "Detecting current location..." : "Use current location"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Using GPS / browser location
                </p>
              </div>
            </button>
          )}

          {/* 2. RECENT LOCATIONS (Shown when input is empty or < 3 chars) */}
          {!isTyping && recentLocations.length > 0 && (
            <div className="p-3 bg-[#FAFAF8]">
              <div className="px-2 py-1 flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <Clock size={12} />
                <span>Recent Locations</span>
              </div>

              <div className="space-y-1 mt-1">
                {recentLocations.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectRecent(item)}
                    className="w-full p-2.5 text-left rounded-xl hover:bg-white transition-colors flex items-start gap-3 group cursor-pointer border border-transparent hover:border-[#ECE7DB]"
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FFF9EA]">
                      <Clock size={14} className="text-gray-500 group-hover:text-[#C89B1C]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#161616] truncate">
                        {item.primaryName}
                      </p>
                      {item.secondaryAddress && (
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {item.secondaryAddress}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. MINIMUM CHARACTERS HINT */}
          {isTyping && !isMinCharsMet && (
            <div className="p-4 text-center text-xs text-gray-500">
              Type at least 3 characters to search locations in{" "}
              <strong>{selectedState || selectedRegion}</strong>...
            </div>
          )}

          {/* 4. LOADING STATE */}
          {loading && (
            <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <Loader2 size={16} className="text-[#C89B1C] animate-spin" />
              <span>Searching locations...</span>
            </div>
          )}

          {/* 5. SEARCH RESULTS LIST (RAPIDO / RIDE-BOOKING STYLE) */}
          {!loading && isMinCharsMet && suggestions.length > 0 && (
            <div className="divide-y divide-gray-100">
              {suggestions.map((item, idx) => {
                const { primaryName, secondaryAddress } = parseAddressDetails(item);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full p-3.5 text-left hover:bg-[#FFFDF6] transition-colors flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FFF9EA] transition-colors">
                      <MapPin
                        size={16}
                        className="text-gray-500 group-hover:text-[#C89B1C] transition-colors"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#161616] group-hover:text-[#9A720C] transition-colors truncate">
                        {primaryName}
                      </p>
                      {secondaryAddress && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {secondaryAddress}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 6. NO RESULTS STATE */}
          {!loading && isMinCharsMet && suggestions.length === 0 && (
            <div className="p-5 text-center text-xs text-gray-500">
              Couldn&apos;t find this location. Try searching with a nearby area or landmark in{" "}
              <strong>{selectedState || selectedRegion}</strong>.
            </div>
          )}

          {/* 7. ERROR STATE */}
          {searchError && (
            <div className="p-4 text-center text-xs text-red-600 bg-red-50">
              {searchError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
