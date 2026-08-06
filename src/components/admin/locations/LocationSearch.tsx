"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";

export interface SearchLocationResult {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
}

interface LocationSearchProps {
  value: string;
  onChange: (val: string) => void;
  onSelectLocation: (result: SearchLocationResult) => void;
}

export default function LocationSearch({
  value,
  onChange,
  onSelectLocation,
}: LocationSearchProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Debounced search logic using OpenStreetMap Nominatim or Geoapify
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const geoapifyKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

        if (geoapifyKey) {
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
              value
            )}&apiKey=${geoapifyKey}`
          );
          const data = await res.json();
          if (data && data.features) {
            const formatted = data.features.map((f: any) => ({
              display_name: f.properties.formatted,
              lat: f.properties.lat,
              lon: f.properties.lon,
              city: f.properties.city || f.properties.county,
              state: f.properties.state,
            }));
            setSuggestions(formatted);
            setShowDropdown(formatted.length > 0);
          }
        } else {
          // OpenStreetMap Nominatim Geocoding
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              value
            )}&addressdetails=1&limit=6`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );
          const data = await res.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
            setShowDropdown(data.length > 0);
          }
        }
      } catch (err) {
        console.error("Geocoding search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (item: any) => {
    const lat = parseFloat(item.lat || item.latitude);
    const lng = parseFloat(item.lon || item.longitude);
    const address = item.display_name || item.formatted || value;

    const addressObj = item.address || {};
    const city =
      addressObj.city ||
      addressObj.town ||
      addressObj.village ||
      addressObj.county ||
      item.city ||
      "";
    const state = addressObj.state || item.state || "";

    onChange(address);
    setShowDropdown(false);

    if (!isNaN(lat) && !isNaN(lng)) {
      onSelectLocation({ lat, lng, address, city, state });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Search Location <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search city, area, or landmark (e.g. Gandhipuram, Coimbatore)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          className="w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] pl-10 pr-10 text-sm text-[#161616] outline-none focus:border-[#C89B1C] focus:bg-white focus:ring-2 focus:ring-[#C89B1C]/15 transition-all"
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
              setShowDropdown(false);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {/* Autocomplete Dropdown List */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#ECE7DB] shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-gray-100">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full p-3.5 text-left text-xs text-[#161616] hover:bg-[#FFFDF6] transition-colors flex items-start gap-3 group cursor-pointer"
            >
              <MapPin
                size={16}
                className="text-[#C89B1C] shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
              />
              <span className="font-medium leading-relaxed">{item.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
