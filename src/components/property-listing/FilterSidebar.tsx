"use client";
import {motion} from "framer-motion";
interface Props {
  city: string;
  setCity: (value: string) => void;

  propertyType: string;
  setPropertyType: (value: string) => void;

  bedrooms: string;
  setBedrooms: (value: string) => void;

  furnishing: string;
  setFurnishing: (value: string) => void;

  minPrice?: string;
  setMinPrice?: (value: string) => void;

  maxPrice?: string;
  setMaxPrice?: (value: string) => void;

  clearFilters: () => void;
}

export default function FilterSidebar({
  city,
  setCity,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  furnishing,
  setFurnishing,
  minPrice = "",
  setMinPrice,
  maxPrice = "",
  setMaxPrice,
  clearFilters,
}: Props) {
  const cities = [
    "Coimbatore",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Delhi",
    "Pune",
    "Hyderabad",
  ];

  const budgetOptions = [
    { label: "Any Budget", min: "", max: "" },
    { label: "Under ₹20L", min: "", max: "2000000" },
    { label: "₹20L–₹50L", min: "2000000", max: "5000000" },
    { label: "Under ₹50L", min: "", max: "5000000" },
    { label: "₹50L–₹1Cr", min: "5000000", max: "10000000" },
    { label: "₹1Cr–₹2Cr", min: "10000000", max: "20000000" },
    { label: "₹2Cr+", min: "20000000", max: "" },
  ];

  const propertyTypes = [
    "Apartment / Flat",
    "Independent House",
    "Villa",
    "Plot / Land",
    "Commercial Space",
    "Builder Floor",
  ];

  const bedroomOptions = [
    { label: "Any", value: "" },
    { label: "1 BHK", value: "1" },
    { label: "2 BHK", value: "2" },
    { label: "3 BHK", value: "3" },
    { label: "4 BHK", value: "4" },
    { label: "5+ BHK", value: "5" },
  ];

  const furnishingOptions = [
    { label: "Any", value: "" },
    { label: "Fully Furnished", value: "Fully Furnished" },
    { label: "Semi Furnished", value: "Semi Furnished" },
    { label: "Unfurnished", value: "Unfurnished" },
  ];

  const setBudgetRange = (min: string, max: string) => {
    if (setMinPrice) setMinPrice(min);
    if (setMaxPrice) setMaxPrice(max);
  };

  const isBudgetActive = (min: string, max: string) => {
    return minPrice === min && maxPrice === max;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ECE7DB] p-5 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-bold text-[#9A720C] hover:underline cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* CITY */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-800 tracking-wider uppercase mb-3">
          CITY
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setCity("")}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              city === ""
                ? "bg-[#9A720C] text-white shadow-2xs"
                : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
            }`}
          >
            All Cities
          </button>
          {cities.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCity(item)}
              className={`py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                city.toLowerCase() === item.toLowerCase()
                  ? "bg-[#9A720C] text-white font-semibold shadow-2xs"
                  : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#F2EFE9]" />

      {/* BUDGET */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-800 tracking-wider uppercase mb-3">
          BUDGET
        </h4>
        <div className="space-y-2">
          {budgetOptions.map((opt) => {
            const active = isBudgetActive(opt.min, opt.max);
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setBudgetRange(opt.min, opt.max)}
                className={`w-full py-2 px-4 rounded-xl text-xs text-left transition-all cursor-pointer ${
                  active
                    ? "bg-[#9A720C] text-white font-semibold shadow-2xs"
                    : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#F2EFE9]" />

      {/* PROPERTY TYPE */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-800 tracking-wider uppercase mb-3">
          PROPERTY TYPE
        </h4>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setPropertyType("")}
            className={`w-full py-2 px-4 rounded-xl text-xs text-left transition-all cursor-pointer ${
              propertyType === ""
                ? "bg-[#9A720C] text-white font-semibold shadow-2xs"
                : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
            }`}
          >
            All Types
          </button>
          {propertyTypes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPropertyType(item)}
              className={`w-full py-2 px-4 rounded-xl text-xs text-left transition-all cursor-pointer ${
                propertyType.toLowerCase() === item.toLowerCase()
                  ? "bg-[#9A720C] text-white font-semibold shadow-2xs"
                  : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#F2EFE9]" />

      {/* BEDROOMS */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-800 tracking-wider uppercase mb-3">
          BEDROOMS
        </h4>
        <div className="flex flex-wrap gap-2">
          {bedroomOptions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setBedrooms(item.value)}
              className={`py-1.5 px-3.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                bedrooms === item.value
                  ? "bg-[#9A720C] text-white font-semibold shadow-2xs"
                  : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#F2EFE9]" />

      {/* FURNISHING */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-800 tracking-wider uppercase mb-3">
          FURNISHING
        </h4>
        <div className="space-y-2">
          {furnishingOptions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setFurnishing(item.value)}
              className={`w-full py-2 px-4 rounded-xl text-xs text-left transition-all cursor-pointer ${
                furnishing === item.value
                  ? "bg-[#9A720C] text-white font-semibold shadow-2xs"
                  : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}