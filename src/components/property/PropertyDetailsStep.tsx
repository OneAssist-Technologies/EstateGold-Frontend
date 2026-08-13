"use client";

import { motion } from "framer-motion";
import {
  Bed,
  Bath,
  Layers3,
  Scan,
  Building2,
  Car,
  Compass,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { PropertyFormData } from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

const furnishingOptions = [
  "Unfurnished",
  "Semi Furnished",
  "Fully Furnished",
];

const facingOptions = [
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "South-East",
  "North-West",
  "South-West",
];

const ageOptions = [
  "Under Construction",
  "New Launch",
  "Ready to Move",
  "Resale",
  "0-1 Year Old",
  "1-5 Years Old",
  "5-10 Years Old",
  "10+ Years Old",
];

const plotTypeOptions = [
  "Residential Plot",
  "Commercial Land",
  "Agricultural Land",
  "Industrial Land",
  "Other",
];

const approvalOptions = [
  "RERA Approved",
  "DTCP Approved",
  "Panchayat Approved",
  "Corporation Approved",
  "None",
];

const waterOptions = [
  "Corporation Water",
  "Borewell Water",
  "Both Corporation & Borewell",
  "None Available",
];

const electricityOptions = [
  "Phase 3 Connection",
  "Phase 1 Connection",
  "Solar Power Installed",
  "None Available",
];

const commercialTypeOptions = [
  "Office",
  "Shop",
  "Showroom",
  "Warehouse",
  "Restaurant",
  "Co-working Space",
  "Industrial Space",
];

export default function PropertyDetailsStep({
  formData,
  setFormData,
}: Props) {
  const propertyType = formData.propertyType || "Apartment / Flat";

  // Reusable Styled Number Selection Button
  const numberButton = (
    key: string,
    value: string | number,
    selected: boolean,
    onClick: () => void
  ) => (
    <motion.button
      key={key}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{ scale: selected ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`h-11 min-w-[44px] px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
        selected
          ? "bg-[#C89B1C] border-[#C89B1C] text-white shadow-xs"
          : "border-[#E5D8B3] text-[#161616] bg-white hover:border-[#C89B1C]"
      }`}
    >
      {value}
    </motion.button>
  );

  // Reusable Input Field
  const renderInput = (
    label: string,
    value: number | string,
    placeholder: string,
    icon: React.ReactNode,
    onChange: (val: string) => void,
    type = "number"
  ) => (
    <div>
      <label className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
        {icon}
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-xl border border-[#E5D8B3] outline-none text-sm font-semibold text-gray-800 focus:border-[#C89B1C] bg-[#FFFDF9]/30"
      />
    </div>
  );

  // Reusable Select Field
  const renderSelect = (
    label: string,
    value: string,
    options: string[],
    icon: React.ReactNode,
    onChange: (val: string) => void
  ) => (
    <div>
      <label className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
        {icon}
        {label}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-xl border border-[#E5D8B3] outline-none text-sm font-bold text-gray-700 bg-white focus:border-[#C89B1C] cursor-pointer"
      >
        <option value="">Select Option</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  // Reusable Toggle Field
  const renderToggle = (
    label: string,
    value: boolean,
    icon: React.ReactNode,
    onToggle: () => void,
    subLabel?: string
  ) => (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-[#E5D8B3] bg-[#FCFBF8] shadow-2xs">
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-7 w-14 rounded-full transition-all cursor-pointer shrink-0 ${
          value ? "bg-[#C89B1C]" : "bg-[#E8E0CC]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all shadow-xs ${
            value ? "left-7.5" : "left-0.5"
          }`}
        />
      </button>
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <span className="text-sm font-bold text-[#161616] block leading-none">
            {label}
          </span>
          {subLabel && (
            <span className="text-[10px] text-gray-400 font-semibold block mt-0.5 leading-none">
              {subLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-serif text-gray-900 leading-tight">
          Property Details
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          Provide dynamic specifications for your selected property type (<strong>{propertyType}</strong>).
        </p>
      </div>

      {/* RENDER BY PROPERTY TYPE */}

      {/* 1. Apartment / Flat */}
      {propertyType === "Apartment / Flat" && (
        <div className="space-y-6">
          {/* Bed / Bath / Balcony Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bedrooms */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Bed size={16} /> Bedrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5].map((item) =>
                  numberButton(
                    `bedroom-${item}`,
                    item,
                    formData.bedrooms === item,
                    () => setFormData((prev) => ({ ...prev, bedrooms: item }))
                  )
                )}
                {numberButton(
                  "bedroom-5plus",
                  "5+",
                  formData.bedrooms > 5,
                  () => setFormData((prev) => ({ ...prev, bedrooms: 6 }))
                )}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Bath size={16} /> Bathrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4].map((item) =>
                  numberButton(
                    `bathroom-${item}`,
                    item,
                    formData.bathrooms === item,
                    () => setFormData((prev) => ({ ...prev, bathrooms: item }))
                  )
                )}
                {numberButton(
                  "bathroom-4plus",
                  "4+",
                  formData.bathrooms > 4,
                  () => setFormData((prev) => ({ ...prev, bathrooms: 5 }))
                )}
              </div>
            </div>

            {/* Balconies */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Layers3 size={16} /> Balconies
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[0, 1, 2, 3].map((item) =>
                  numberButton(
                    `balcony-${item}`,
                    item,
                    formData.balconies === item,
                    () => setFormData((prev) => ({ ...prev, balconies: item }))
                  )
                )}
                {numberButton(
                  "balcony-3plus",
                  "3+",
                  formData.balconies > 3,
                  () => setFormData((prev) => ({ ...prev, balconies: 4 }))
                )}
              </div>
            </div>
          </div>

          {/* Area & Floors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderInput("Built-up Area (sq ft)", formData.area, "e.g. 1200", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Carpet Area (sq ft)", (formData as any).carpetArea, "e.g. 1000", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Floor Number", formData.floor, "e.g. 5", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, floor: Number(val) }))
            )}
            {renderInput("Total Floors", (formData as any).totalFloors, "e.g. 15", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
          </div>

          {/* Furnishing */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
              Furnishing Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {furnishingOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, furnishing: item }))}
                  className={`h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.furnishing === item
                      ? "bg-[#FFF8E8] border-[#C89B1C] text-[#C89B1C]"
                      : "border-[#E5D8B3] text-gray-700 bg-white hover:border-[#C89B1C]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Parking Toggle */}
          <div className="max-w-xs">
            {renderToggle(
              "Car Parking Available",
              formData.parking,
              <Car size={18} className="text-gray-500" />,
              () => setFormData((prev) => ({ ...prev, parking: !prev.parking })),
              "Dedicated parking spot"
            )}
          </div>
        </div>
      )}

      {/* 2. Independent House */}
      {propertyType === "Independent House" && (
        <div className="space-y-6">
          {/* Bed / Bath Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bedrooms */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Bed size={16} /> Bedrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5].map((item) =>
                  numberButton(
                    `bedroom-${item}`,
                    item,
                    formData.bedrooms === item,
                    () => setFormData((prev) => ({ ...prev, bedrooms: item }))
                  )
                )}
                {numberButton(
                  "bedroom-5plus",
                  "5+",
                  formData.bedrooms > 5,
                  () => setFormData((prev) => ({ ...prev, bedrooms: 6 }))
                )}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Bath size={16} /> Bathrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4].map((item) =>
                  numberButton(
                    `bathroom-${item}`,
                    item,
                    formData.bathrooms === item,
                    () => setFormData((prev) => ({ ...prev, bathrooms: item }))
                  )
                )}
                {numberButton(
                  "bathroom-4plus",
                  "4+",
                  formData.bathrooms > 4,
                  () => setFormData((prev) => ({ ...prev, bathrooms: 5 }))
                )}
              </div>
            </div>
          </div>

          {/* Area & Floors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderInput("Built-up Area (sq ft)", formData.area, "e.g. 2000", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Plot Area (sq ft)", (formData as any).plotArea, "e.g. 1500", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotArea: Number(val) }))
            )}
            {renderInput("Number of Floors", (formData as any).totalFloors, "e.g. 2", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
          </div>

          {/* Facing & Property Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderSelect("Facing Direction", (formData as any).facing, facingOptions, <Compass size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, facing: val }))
            )}
            {renderSelect("Property Age", (formData as any).propertyAge, ageOptions, <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, propertyAge: val }))
            )}
          </div>

          {/* Furnishing */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
              Furnishing Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {furnishingOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, furnishing: item }))}
                  className={`h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.furnishing === item
                      ? "bg-[#FFF8E8] border-[#C89B1C] text-[#C89B1C]"
                      : "border-[#E5D8B3] text-gray-700 bg-white hover:border-[#C89B1C]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Parking Toggle */}
          <div className="max-w-xs">
            {renderToggle(
              "Car Parking Available",
              formData.parking,
              <Car size={18} className="text-gray-500" />,
              () => setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 3. Villa */}
      {propertyType === "Villa" && (
        <div className="space-y-6">
          {/* Bed / Bath / Balcony Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bedrooms */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Bed size={16} /> Bedrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5].map((item) =>
                  numberButton(
                    `bedroom-${item}`,
                    item,
                    formData.bedrooms === item,
                    () => setFormData((prev) => ({ ...prev, bedrooms: item }))
                  )
                )}
                {numberButton(
                  "bedroom-5plus",
                  "5+",
                  formData.bedrooms > 5,
                  () => setFormData((prev) => ({ ...prev, bedrooms: 6 }))
                )}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Bath size={16} /> Bathrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4].map((item) =>
                  numberButton(
                    `bathroom-${item}`,
                    item,
                    formData.bathrooms === item,
                    () => setFormData((prev) => ({ ...prev, bathrooms: item }))
                  )
                )}
                {numberButton(
                  "bathroom-4plus",
                  "4+",
                  formData.bathrooms > 4,
                  () => setFormData((prev) => ({ ...prev, bathrooms: 5 }))
                )}
              </div>
            </div>

            {/* Balconies */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Layers3 size={16} /> Balconies
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[0, 1, 2, 3].map((item) =>
                  numberButton(
                    `balcony-${item}`,
                    item,
                    formData.balconies === item,
                    () => setFormData((prev) => ({ ...prev, balconies: item }))
                  )
                )}
                {numberButton(
                  "balcony-3plus",
                  "3+",
                  formData.balconies > 3,
                  () => setFormData((prev) => ({ ...prev, balconies: 4 }))
                )}
              </div>
            </div>
          </div>

          {/* Area & Floors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderInput("Built-up Area (sq ft)", formData.area, "e.g. 3500", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Plot Area (sq ft)", (formData as any).plotArea, "e.g. 2400", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotArea: Number(val) }))
            )}
            {renderInput("Number of Floors", (formData as any).totalFloors, "e.g. 3", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
          </div>

          {/* Facing & Property Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderSelect("Facing Direction", (formData as any).facing, facingOptions, <Compass size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, facing: val }))
            )}
            {renderSelect("Property Age", (formData as any).propertyAge, ageOptions, <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, propertyAge: val }))
            )}
          </div>

          {/* Furnishing */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
              Furnishing Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {furnishingOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, furnishing: item }))}
                  className={`h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.furnishing === item
                      ? "bg-[#FFF8E8] border-[#C89B1C] text-[#C89B1C]"
                      : "border-[#E5D8B3] text-gray-700 bg-white hover:border-[#C89B1C]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Parking Toggle */}
          <div className="max-w-xs">
            {renderToggle(
              "Car Parking Available",
              formData.parking,
              <Car size={18} className="text-gray-500" />,
              () => setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 4. Plot / Land */}
      {propertyType === "Plot / Land" && (
        <div className="space-y-6">
          {/* Main Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderInput("Plot Area (sq ft)", (formData as any).plotArea, "e.g. 1200", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotArea: Number(val) }))
            )}
            {renderSelect("Plot Facing", (formData as any).plotFacing, facingOptions, <Compass size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotFacing: val }))
            )}
            {renderInput("Road Width (ft)", (formData as any).roadWidth, "e.g. 40", <Layers size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roadWidth: Number(val) }))
            )}
          </div>

          {/* Configuration Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderSelect("Plot Type", (formData as any).plotType, plotTypeOptions, <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotType: val }))
            )}
            {renderSelect("Land Approval", (formData as any).landApproval, approvalOptions, <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, landApproval: val }))
            )}
            {renderSelect("Water Availability", (formData as any).waterAvailability, waterOptions, <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, waterAvailability: val }))
            )}
            {renderSelect("Electricity Availability", (formData as any).electricityAvailability, electricityOptions, <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, electricityAvailability: val }))
            )}
          </div>

          {/* Corner Plot & Boundary Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderToggle(
              "Corner Plot",
              (formData as any).cornerPlot || false,
              <Layers size={18} className="text-gray-500" />,
              () => setFormData((prev) => ({ ...prev, cornerPlot: !(prev as any).cornerPlot })),
              "Plot has multiple road accesses"
            )}
            {renderToggle(
              "Boundary Wall Constructed",
              (formData as any).boundaryWall || false,
              <Building2 size={18} className="text-gray-500" />,
              () => setFormData((prev) => ({ ...prev, boundaryWall: !(prev as any).boundaryWall })),
              "Fenced or walled plot parameter"
            )}
          </div>
        </div>
      )}

      {/* 5. Commercial Space */}
      {propertyType === "Commercial Space" && (
        <div className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderSelect("Commercial Type", (formData as any).commercialType, commercialTypeOptions, <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, commercialType: val }))
            )}
            {renderSelect("Property Age", (formData as any).propertyAge, ageOptions, <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, propertyAge: val }))
            )}
          </div>

          {/* Space & Floorage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderInput("Built-up Area (sq ft)", formData.area, "e.g. 1500", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Carpet Area (sq ft)", (formData as any).carpetArea, "e.g. 1200", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Floor Number", formData.floor, "e.g. 2", <Layers size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, floor: Number(val) }))
            )}
            {renderInput("Total Floors", (formData as any).totalFloors, "e.g. 6", <Layers size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
          </div>

          {/* Washrooms & Width & Power */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Bath size={16} /> Washrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[0, 1, 2, 3].map((item) =>
                  numberButton(
                    `washroom-${item}`,
                    item,
                    (formData as any).washrooms === item,
                    () => setFormData((prev) => ({ ...prev, washrooms: item }))
                  )
                )}
                {numberButton(
                  "washroom-3plus",
                  "3+",
                  (formData as any).washrooms > 3,
                  () => setFormData((prev) => ({ ...prev, washrooms: 4 }))
                )}
              </div>
            </div>

            {renderInput("Entrance Width (ft)", (formData as any).entranceWidth, "e.g. 15", <Layers size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, entranceWidth: Number(val) }))
            )}
            {renderInput("Power Load (kW)", (formData as any).powerLoad, "e.g. 10", <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, powerLoad: Number(val) }))
            )}
          </div>

          {/* Furnishing */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
              Furnishing Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {furnishingOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, furnishing: item }))}
                  className={`h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.furnishing === item
                      ? "bg-[#FFF8E8] border-[#C89B1C] text-[#C89B1C]"
                      : "border-[#E5D8B3] text-gray-700 bg-white hover:border-[#C89B1C]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Parking Toggle */}
          <div className="max-w-xs">
            {renderToggle(
              "Car Parking Available",
              formData.parking,
              <Car size={18} className="text-gray-500" />,
              () => setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 6. Builder Floor */}
      {propertyType === "Builder Floor" && (
        <div className="space-y-6">
          {/* Bed / Bath / Balcony Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bedrooms */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Bed size={16} /> Bedrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5].map((item) =>
                  numberButton(
                    `bedroom-${item}`,
                    item,
                    formData.bedrooms === item,
                    () => setFormData((prev) => ({ ...prev, bedrooms: item }))
                  )
                )}
                {numberButton(
                  "bedroom-5plus",
                  "5+",
                  formData.bedrooms > 5,
                  () => setFormData((prev) => ({ ...prev, bedrooms: 6 }))
                )}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Bath size={16} /> Bathrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4].map((item) =>
                  numberButton(
                    `bathroom-${item}`,
                    item,
                    formData.bathrooms === item,
                    () => setFormData((prev) => ({ ...prev, bathrooms: item }))
                  )
                )}
                {numberButton(
                  "bathroom-4plus",
                  "4+",
                  formData.bathrooms > 4,
                  () => setFormData((prev) => ({ ...prev, bathrooms: 5 }))
                )}
              </div>
            </div>

            {/* Balconies */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Layers3 size={16} /> Balconies
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[0, 1, 2, 3].map((item) =>
                  numberButton(
                    `balcony-${item}`,
                    item,
                    formData.balconies === item,
                    () => setFormData((prev) => ({ ...prev, balconies: item }))
                  )
                )}
                {numberButton(
                  "balcony-3plus",
                  "3+",
                  formData.balconies > 3,
                  () => setFormData((prev) => ({ ...prev, balconies: 4 }))
                )}
              </div>
            </div>
          </div>

          {/* Area & Floors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderInput("Built-up Area (sq ft)", formData.area, "e.g. 1800", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Carpet Area (sq ft)", (formData as any).carpetArea, "e.g. 1500", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Floor Number", formData.floor, "e.g. 3", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, floor: Number(val) }))
            )}
            {renderInput("Total Floors", (formData as any).totalFloors, "e.g. 4", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
          </div>

          {/* Facing & Property Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderSelect("Facing Direction", (formData as any).facing, facingOptions, <Compass size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, facing: val }))
            )}
            {renderSelect("Property Age", (formData as any).propertyAge, ageOptions, <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, propertyAge: val }))
            )}
          </div>

          {/* Furnishing Status */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
              Furnishing Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {furnishingOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, furnishing: item }))}
                  className={`h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.furnishing === item
                      ? "bg-[#FFF8E8] border-[#C89B1C] text-[#C89B1C]"
                      : "border-[#E5D8B3] text-gray-700 bg-white hover:border-[#C89B1C]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Parking Toggle */}
          <div className="max-w-xs">
            {renderToggle(
              "Car Parking Available",
              formData.parking,
              <Car size={18} className="text-gray-500" />,
              () => setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}
    </div>
  );
}