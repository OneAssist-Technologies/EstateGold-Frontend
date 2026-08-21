"use client";

import { useState } from "react";
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
  ShieldCheck,
  DollarSign,
  User,
  FileText,
  MapPin,
} from "lucide-react";
import { PropertyFormData } from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
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

const constructionStatusOptions = [
  "Under Construction",
  "New Launch",
  "Ready to Move",
  "Resale",
];

const ageOptions = [
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
  errors,
}: Props) {
  const propertyType = formData.propertyType || "Apartment / Flat";
  const [showCustomBedrooms, setShowCustomBedrooms] = useState(formData.bedrooms > 4);
  const [showCustomBathrooms, setShowCustomBathrooms] = useState(formData.bathrooms > 4);
  const [showCustomBalconies, setShowCustomBalconies] = useState(formData.balconies > 3);

  function getFieldNameFromLabel(label: string): string {
    const normalized = label.toLowerCase();
    if (normalized.includes("bedroom")) return "bedrooms";
    if (normalized.includes("bathroom")) return "bathrooms";
    if (normalized.includes("balconies")) return "balconies";
    if (normalized.includes("built-up area") || (normalized.includes("area") && normalized.includes("sq ft") && !normalized.includes("plot") && !normalized.includes("office") && !normalized.includes("production"))) return "area";
    if (normalized.includes("carpet area")) return "carpetArea";
    if (normalized.includes("floor") && !normalized.includes("total") && !normalized.includes("max")) return "floor";
    if (normalized.includes("total floors") || normalized.includes("floors count") || normalized.includes("max tower floors") || normalized.includes("floor count")) return "totalFloors";
    if (normalized.includes("furnishing")) return "furnishing";
    if (normalized.includes("facing")) return "facing";
    if (normalized.includes("association name") || normalized.includes("society")) return "society";
    if (normalized.includes("property age")) return "propertyAge";
    if (normalized.includes("plot area") || normalized.includes("land area")) return "plotArea";
    if (normalized.includes("length")) return "length";
    if (normalized.includes("width") && !normalized.includes("entrance")) return "width";
    if (normalized.includes("road width")) return "roadWidth";
    if (normalized.includes("frontage")) return "frontage";
    if (normalized.includes("land approval") || normalized.includes("approval authority")) return "landApproval";
    if (normalized.includes("land classification")) return "landClassification";
    if (normalized.includes("corner plot")) return "cornerPlot";
    if (normalized.includes("survey number")) return "surveyNumber";
    if (normalized.includes("subdivision")) return "subdivisionNumber";
    if (normalized.includes("taluk")) return "taluk";
    if (normalized.includes("soil type")) return "soilType";
    if (normalized.includes("irrigation")) return "irrigation";
    if (normalized.includes("commercial type") || normalized.includes("project type")) return "commercialType";
    if (normalized.includes("washrooms")) return "washrooms";
    if (normalized.includes("power load")) return "powerLoad";
    if (normalized.includes("entrance width")) return "entranceWidth";
    if (normalized.includes("ceiling height")) return "ceilingHeight";
    if (normalized.includes("main road facing")) return "mainRoadFacing";
    if (normalized.includes("truck access")) return "truckAccess";
    if (normalized.includes("storage capacity")) return "storageCapacity";
    if (normalized.includes("industrial type") || normalized.includes("category type")) return "industrialType";
    if (normalized.includes("production area")) return "productionArea";
    if (normalized.includes("zoning") || normalized.includes("industrial zoning")) return "zoning";
    if (normalized.includes("pollution compliance")) return "pollutionCompliance";
    if (normalized.includes("number of rooms") || normalized.includes("rooms count")) return "numberOfRooms";
    if (normalized.includes("room types")) return "roomTypes";
    if (normalized.includes("occupancy")) return "occupancy";
    if (normalized.includes("gender type")) return "genderType";
    if (normalized.includes("sharing types") || normalized.includes("sharing type")) return "roomSharingType";
    if (normalized.includes("rent per bed")) return "rentPerBed";
    if (normalized.includes("deposit")) return "deposit";
    if (normalized.includes("total beds")) return "totalBeds";
    if (normalized.includes("available beds")) return "availableBeds";
    if (normalized.includes("project name")) return "projectName";
    if (normalized.includes("towers")) return "towers";
    if (normalized.includes("total project units") || normalized.includes("total units")) return "totalUnits";
    if (normalized.includes("available units")) return "availableUnits";
    if (normalized.includes("bhk configurations")) return "bhkTypes";
    if (normalized.includes("possession date")) return "possessionDate";
    if (normalized.includes("payment plan")) return "paymentPlan";
    if (normalized.includes("construction status")) return "constructionStatus";
    return "";
  }

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

  // Reusable Counter Field with custom plus button text input
  const renderCounterField = (
    label: string,
    value: number,
    onChange: (val: number) => void,
    icon: React.ReactNode,
    showCustom: boolean,
    setShowCustom: (val: boolean) => void,
    limit: number,
    isBalcony = false
  ) => {
    const fieldName = getFieldNameFromLabel(label);
    const errorMsg = fieldName ? errors?.[fieldName] : undefined;
    const cleanLabel = label.endsWith("*") ? label.slice(0, -1).trim() : label;

    const startNum = isBalcony ? 0 : 1;
    const nums = [];
    for (let i = startNum; i <= limit; i++) {
      nums.push(i);
    }

    return (
      <div>
        <label className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
          {icon} {cleanLabel}
        </label>
        <div className="flex flex-wrap gap-1.5 items-center">
          {nums.map((item) =>
            numberButton(
              `${fieldName}-${item}`,
              item,
              value === item && !showCustom,
              () => {
                setShowCustom(false);
                onChange(item);
              }
            )
          )}
          {showCustom ? (
            <input
              type="number"
              min={limit + 1}
              value={value}
              onChange={(e) => {
                const val = Math.max(limit + 1, Number(e.target.value));
                onChange(val);
              }}
              className="w-16 h-11 px-2 text-center rounded-xl border border-[#C89B1C] bg-[#FFF8E8] text-[#C89B1C] font-bold outline-none text-xs"
              autoFocus
            />
          ) : (
            numberButton(
              `${fieldName}-plus`,
              "+",
              false,
              () => {
                setShowCustom(true);
                onChange(limit + 1);
              }
            )
          )}
        </div>
        {errorMsg && (
          <p className="text-red-500 text-[10px] font-semibold mt-1 pl-1">{errorMsg}</p>
        )}
      </div>
    );
  };

  // Reusable Input Field
  const renderInput = (
    label: string,
    value: number | string,
    placeholder: string,
    icon: React.ReactNode,
    onChange: (val: string) => void,
    type = "number"
  ) => {
    const fieldName = getFieldNameFromLabel(label);
    const errorMsg = fieldName ? errors?.[fieldName] : undefined;
    const cleanLabel = label.endsWith("*") ? label.slice(0, -1).trim() : label;
    return (
      <div>
        <label className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
          {icon}
          <span>{cleanLabel} <span className="text-red-500 font-bold">*</span></span>
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 px-4 rounded-xl border outline-none text-sm font-semibold text-gray-800 focus:border-[#C89B1C] bg-[#FFFDF9]/30 ${
            errorMsg ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-[#E5D8B3]"
          }`}
        />
        {errorMsg && (
          <p className="text-red-500 text-[10px] font-semibold mt-1 pl-1">
            {errorMsg}
          </p>
        )}
      </div>
    );
  };

  // Reusable Select Field
  const renderSelect = (
    label: string,
    value: string,
    options: string[],
    icon: React.ReactNode,
    onChange: (val: string) => void
  ) => {
    const fieldName = getFieldNameFromLabel(label);
    const errorMsg = fieldName ? errors?.[fieldName] : undefined;
    const cleanLabel = label.endsWith("*") ? label.slice(0, -1).trim() : label;
    return (
      <div>
        <label className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
          {icon}
          <span>{cleanLabel} <span className="text-red-500 font-bold">*</span></span>
        </label>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 px-4 rounded-xl border outline-none text-sm font-bold text-gray-700 bg-white focus:border-[#C89B1C] cursor-pointer ${
            errorMsg ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-[#E5D8B3]"
          }`}
        >
          <option value="">Select Option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errorMsg && (
          <p className="text-red-500 text-[10px] font-semibold mt-1 pl-1">
            {errorMsg}
          </p>
        )}
      </div>
    );
  };

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
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          Property Details
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          Provide dynamic specifications for your selected property type (<strong>{propertyType}</strong>).
        </p>
      </div>

      {/* Common Facing Field */}
      <div className="bg-[#FFFDF9]/40 border border-[#E5D8B3] rounded-2xl p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Compass size={18} className="text-[#C89B1C]" /> Common Property Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {renderSelect("Facing Direction", formData.facing || "", facingOptions, <Compass size={16} />, (val) =>
            setFormData((prev) => ({ ...prev, facing: val }))
          )}
        </div>
      </div>

      {/* RENDER BY PROPERTY TYPE */}

      {/* 1. Apartment / Flat */}
      {propertyType === "Apartment / Flat" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderCounterField("Bedrooms", formData.bedrooms, (val) => setFormData((prev) => ({ ...prev, bedrooms: val })), <Bed size={16} />, showCustomBedrooms, setShowCustomBedrooms, 4)}
            {renderCounterField("Bathrooms", formData.bathrooms, (val) => setFormData((prev) => ({ ...prev, bathrooms: val })), <Bath size={16} />, showCustomBathrooms, setShowCustomBathrooms, 4)}
            {renderCounterField("Balconies", formData.balconies, (val) => setFormData((prev) => ({ ...prev, balconies: val })), <Layers3 size={16} />, showCustomBalconies, setShowCustomBalconies, 3, true)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Carpet Area (sq ft)", (formData as any).carpetArea, "e.g. 900", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Built-up Area (sq ft)", formData.area, "e.g. 1100", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}

            {renderInput("Floor Number", formData.floor, "e.g. 2", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, floor: Number(val) }))
            )}
            {renderInput("Total Floors", (formData as any).totalFloors, "e.g. 10", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
            {renderSelect("Construction Status", (formData as any).constructionStatus, constructionStatusOptions, <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, constructionStatus: val }))
            )}
            {renderSelect("Property Age", (formData as any).propertyAge, ageOptions, <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, propertyAge: val }))
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput("Society / Association Name", (formData as any).society, "e.g. Greenfield Residency", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, society: val })), "text"
            )}
            {renderInput("Monthly Maintenance (INR)", (formData as any).maintenance, "e.g. 2500", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, maintenance: Number(val) }))
            )}
          </div>

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

      {/* 2. Independent House */}
      {propertyType === "Independent House" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderCounterField("Bedrooms", formData.bedrooms, (val) => setFormData((prev) => ({ ...prev, bedrooms: val })), <Bed size={16} />, showCustomBedrooms, setShowCustomBedrooms, 4)}
            {renderCounterField("Bathrooms", formData.bathrooms, (val) => setFormData((prev) => ({ ...prev, bathrooms: val })), <Bath size={16} />, showCustomBathrooms, setShowCustomBathrooms, 4)}
            {renderCounterField("Balconies", formData.balconies, (val) => setFormData((prev) => ({ ...prev, balconies: val })), <Layers3 size={16} />, showCustomBalconies, setShowCustomBalconies, 3, true)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Plot Area (sq ft)", (formData as any).plotArea, "e.g. 1500", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotArea: Number(val) }))
            )}
            {renderInput("Built-up Area (sq ft)", formData.area, "e.g. 2400", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Carpet Area (sq ft)", (formData as any).carpetArea, "e.g. 2000", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Length (ft)", (formData as any).length, "e.g. 50", <Scan size={16} />, (val) => {
              const len = Number(val);
              const wid = Number((formData as any).width || 0);
              setFormData((prev) => ({ ...prev, length: len, plotArea: len && wid ? len * wid : (prev as any).plotArea }));
            })}
            {renderInput("Width (ft)", (formData as any).width, "e.g. 30", <Scan size={16} />, (val) => {
              const wid = Number(val);
              const len = Number((formData as any).length || 0);
              setFormData((prev) => ({ ...prev, width: wid, plotArea: len && wid ? len * wid : (prev as any).plotArea }));
            })}
            {renderInput("Total Floors", (formData as any).totalFloors, "e.g. 2", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
            {renderInput("Road Width (ft)", (formData as any).roadWidth, "e.g. 30", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roadWidth: Number(val) }))
            )}
            {renderInput("Frontage (ft)", (formData as any).frontage, "e.g. 30", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, frontage: Number(val) }))
            )}
            {renderSelect("Construction Status", (formData as any).constructionStatus, constructionStatusOptions, <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, constructionStatus: val }))
            )}
            {renderSelect("Property Age", (formData as any).propertyAge, ageOptions, <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, propertyAge: val }))
            )}
            {renderSelect("Furnishing Status", formData.furnishing, furnishingOptions, <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, furnishing: val }))
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderToggle("Corner Property", (formData as any).cornerPlot, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, cornerPlot: !(prev as any).cornerPlot }))
            )}
            {renderToggle("Compound Wall", (formData as any).compoundWall, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, compoundWall: !(prev as any).compoundWall }))
            )}
            {renderToggle("Car Parking Available", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 3. Villa */}
      {propertyType === "Villa" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderSelect("Villa Type", (formData as any).community, ["Individual Villa", "Gated Community Villa"], <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, community: val }))
            )}
            {renderSelect("Furnishing Status", formData.furnishing, furnishingOptions, <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, furnishing: val }))
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderCounterField("Bedrooms", formData.bedrooms, (val) => setFormData((prev) => ({ ...prev, bedrooms: val })), <Bed size={16} />, showCustomBedrooms, setShowCustomBedrooms, 4)}
            {renderCounterField("Bathrooms", formData.bathrooms, (val) => setFormData((prev) => ({ ...prev, bathrooms: val })), <Bath size={16} />, showCustomBathrooms, setShowCustomBathrooms, 4)}
            {renderCounterField("Balconies", formData.balconies, (val) => setFormData((prev) => ({ ...prev, balconies: val })), <Layers3 size={16} />, showCustomBalconies, setShowCustomBalconies, 3, true)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Plot Area (sq ft)", (formData as any).plotArea, "e.g. 2000", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotArea: Number(val) }))
            )}
            {renderInput("Built-up Area (sq ft)", formData.area, "e.g. 3200", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Carpet Area (sq ft)", (formData as any).carpetArea, "e.g. 2800", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Total Floors", (formData as any).totalFloors, "e.g. 2", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
            {renderInput("Monthly Maintenance (INR)", (formData as any).maintenance, "e.g. 5000", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, maintenance: Number(val) }))
            )}
            {renderSelect("Construction Status", (formData as any).constructionStatus, constructionStatusOptions, <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, constructionStatus: val }))
            )}
            {renderSelect("Villa Age", (formData as any).propertyAge, ageOptions, <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, propertyAge: val }))
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderToggle("Servant Room", (formData as any).servantRoom, <User size={16} />, () =>
              setFormData((prev) => ({ ...prev, servantRoom: !(prev as any).servantRoom }))
            )}
            {renderToggle("Car Parking Available", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 4. Builder Floor */}
      {propertyType === "Builder Floor" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderCounterField("Bedrooms", formData.bedrooms, (val) => setFormData((prev) => ({ ...prev, bedrooms: val })), <Bed size={16} />, showCustomBedrooms, setShowCustomBedrooms, 4)}
            {renderCounterField("Bathrooms", formData.bathrooms, (val) => setFormData((prev) => ({ ...prev, bathrooms: val })), <Bath size={16} />, showCustomBathrooms, setShowCustomBathrooms, 4)}
            {renderCounterField("Balconies", formData.balconies, (val) => setFormData((prev) => ({ ...prev, balconies: val })), <Layers3 size={16} />, showCustomBalconies, setShowCustomBalconies, 3, true)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Carpet Area (sq ft)", (formData as any).carpetArea, "e.g. 1200", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Built-up Area (sq ft)", formData.area, "e.g. 1450", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Floor Number", formData.floor, "e.g. 1", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, floor: Number(val) }))
            )}
            {renderInput("Total Floors", (formData as any).totalFloors, "e.g. 4", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
            {renderInput("Number of Units in Building", (formData as any).numberOfUnits, "e.g. 4", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, numberOfUnits: Number(val) }))
            )}
            {renderInput("Monthly Maintenance (INR)", (formData as any).maintenance, "e.g. 2000", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, maintenance: Number(val) }))
            )}
            {renderSelect("Construction Status", (formData as any).constructionStatus, constructionStatusOptions, <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, constructionStatus: val }))
            )}
            {renderSelect("Floor Age", (formData as any).propertyAge, ageOptions, <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, propertyAge: val }))
            )}
            {renderSelect("Furnishing Status", formData.furnishing, furnishingOptions, <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, furnishing: val }))
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderToggle("Gated Community", (formData as any).gatedLayout || false, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, gatedLayout: !(prev as any).gatedLayout }))
            )}
            {renderToggle("Car Parking Available", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>

          {(formData as any).gatedLayout && (
            <div className="bg-[#FFFDF9]/40 border border-[#E5D8B3] rounded-2xl p-5 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={16} className="text-[#C89B1C]" /> Gated Community Details
              </h4>
              <div className="max-w-md">
                {renderInput("Association Name *", (formData as any).society || "", "e.g. Greenwood Owners Association", <Building2 size={16} />, (val) =>
                  setFormData((prev) => ({ ...prev, society: val })), "text"
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Plot / Land or Residential Plot */}
      {(propertyType === "Plot / Land" || propertyType === "Residential Plot") && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Plot Area (sq ft) *", (formData as any).plotArea, "e.g. 1200", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotArea: Number(val) }))
            )}
            {renderInput("Length (ft)", (formData as any).length, "e.g. 40", <Scan size={16} />, (val) => {
              const len = Number(val);
              const wid = Number((formData as any).width || 0);
              setFormData((prev) => ({ ...prev, length: len, plotArea: len && wid ? len * wid : (prev as any).plotArea }));
            })}
            {renderInput("Width (ft)", (formData as any).width, "e.g. 30", <Scan size={16} />, (val) => {
              const wid = Number(val);
              const len = Number((formData as any).length || 0);
              setFormData((prev) => ({ ...prev, width: wid, plotArea: len && wid ? len * wid : (prev as any).plotArea }));
            })}
            {renderInput("Road Width (ft)", (formData as any).roadWidth, "e.g. 30", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roadWidth: Number(val) }))
            )}
            {renderInput("Frontage (ft)", (formData as any).frontage, "e.g. 40", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, frontage: Number(val) }))
            )}
            {renderInput("Layout / Society Name", (formData as any).layoutName, "e.g. Golden Meadows", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, layoutName: val })), "text"
            )}
            {renderInput("Survey Number", (formData as any).surveyNumber, "e.g. 45/2A", <FileText size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, surveyNumber: val })), "text"
            )}
            {renderInput("Subdivision / Patta Number", (formData as any).subdivisionNumber, "e.g. 124", <FileText size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, subdivisionNumber: val })), "text"
            )}
            {renderInput("GPS Coordinates (Lat, Lng)", (formData as any).gps, "e.g. 12.98, 80.24", <MapPin size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, gps: val })), "text"
            )}
            {renderSelect("Layout Approval Authority", (formData as any).landApproval, approvalOptions, <ShieldCheck size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, landApproval: val }))
            )}
            {renderSelect("Land Classification", (formData as any).landClassification, ["Patta Land", "Revenue Land", "Gramanatham", "Other"], <FileText size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, landClassification: val }))
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderToggle("Gated Layout Community", (formData as any).gatedLayout, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, gatedLayout: !(prev as any).gatedLayout }))
            )}
            {renderToggle("Boundary Wall Constructed", (formData as any).boundaryWall, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, boundaryWall: !(prev as any).boundaryWall }))
            )}
            {renderToggle("Corner Plot", (formData as any).cornerPlot, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, cornerPlot: !(prev as any).cornerPlot }))
            )}
          </div>
        </div>
      )}

      {/* 6. Agricultural Land */}
      {propertyType === "Agricultural Land" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Land Area (Acre/Sq ft) *", (formData as any).plotArea, "e.g. 5 Acres", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotArea: Number(val) }))
            )}
            {renderInput("Price per Acre (INR)", (formData as any).pricePerAcre, "e.g. 4500000", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, pricePerAcre: Number(val) }))
            )}
            {renderInput("Survey Number", (formData as any).surveyNumber, "e.g. 231/1", <FileText size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, surveyNumber: val })), "text"
            )}
            {renderInput("Village", (formData as any).society, "e.g. Navalur Village", <MapPin size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, society: val })), "text"
            )}
            {renderInput("Taluk", (formData as any).taluk, "e.g. Thiruporur", <MapPin size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, taluk: val })), "text"
            )}
            {renderInput("Road Access Type", (formData as any).roadAccess, "e.g. Tar Road / Mud Road", <MapPin size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roadAccess: val })), "text"
            )}
            {renderInput("Road Width (ft)", (formData as any).roadWidth, "e.g. 20", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roadWidth: Number(val) }))
            )}
            {renderInput("Crops Currently Cultivated", (formData as any).crops, "e.g. Paddy / Coconut", <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, crops: val })), "text"
            )}
            {renderInput("Soil Type", (formData as any).soilType, "e.g. Red Soil / Clay", <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, soilType: val })), "text"
            )}
            {renderSelect("Land Classification", (formData as any).landClassification, ["Wet Land (Nanja)", "Dry Land (Punja)", "Estate", "Other"], <FileText size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, landClassification: val }))
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderToggle("Fenced boundary / Compound", (formData as any).boundaryWall, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, boundaryWall: !(prev as any).boundaryWall }))
            )}
            {renderToggle("Farmhouse / Existing Structure", (formData as any).farmhouse, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, farmhouse: !(prev as any).farmhouse }))
            )}
          </div>
        </div>
      )}

      {/* 7. Commercial Space or Office Space */}
      {(propertyType === "Commercial Space" || propertyType === "Office Space") && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Built-up Area (sq ft) *", formData.area, "e.g. 2500", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Carpet Area (sq ft)", (formData as any).carpetArea, "e.g. 2100", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Floor Number", formData.floor, "e.g. 5", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, floor: Number(val) }))
            )}
            {renderInput("Total Floors", (formData as any).totalFloors, "e.g. 12", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
            {renderInput("Number of Workstations", (formData as any).workstations, "e.g. 45", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, workstations: Number(val) }))
            )}
            {renderInput("Number of Cabins", (formData as any).cabins, "e.g. 5", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, cabins: Number(val) }))
            )}
            {renderInput("Number of Meeting Rooms", (formData as any).meetingRooms, "e.g. 2", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, meetingRooms: Number(val) }))
            )}
            {renderInput("Number of Washrooms", (formData as any).washrooms, "e.g. 4", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, washrooms: Number(val) }))
            )}
            {renderInput("Monthly Maintenance (INR)", (formData as any).maintenance, "e.g. 8000", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, maintenance: Number(val) }))
            )}
            {renderInput("Power Load Capacity (KW)", (formData as any).powerLoad, "e.g. 25", <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, powerLoad: Number(val) }))
            )}
            {renderSelect("Furnished Status", formData.furnishing, furnishingOptions, <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, furnishing: val }))
            )}
            {renderSelect("Construction Status", (formData as any).constructionStatus, constructionStatusOptions, <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, constructionStatus: val }))
            )}
            {renderSelect("Property Age", (formData as any).propertyAge, ageOptions, <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, propertyAge: val }))
            )}
          </div>

          <div className="max-w-xs">
            {renderToggle("Car Parking Available", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 8. Shop / Retail */}
      {propertyType === "Shop / Retail" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Built-up Area (sq ft) *", formData.area, "e.g. 800", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Carpet Area (sq ft)", (formData as any).carpetArea, "e.g. 700", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Shop Floor Level", formData.floor, "e.g. 0 (Ground)", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, floor: Number(val) }))
            )}
            {renderInput("Shop Frontage (ft)", (formData as any).frontage, "e.g. 20", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, frontage: Number(val) }))
            )}
            {renderInput("Ceiling Height (ft)", (formData as any).ceilingHeight, "e.g. 12", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, ceilingHeight: Number(val) }))
            )}
            {renderInput("Road Width (ft)", (formData as any).roadWidth, "e.g. 40", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roadWidth: Number(val) }))
            )}
            {renderInput("Number of Shutters", (formData as any).shutters, "e.g. 2", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, shutters: Number(val) }))
            )}
            {renderInput("Monthly Maintenance (INR)", (formData as any).maintenance, "e.g. 1500", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, maintenance: Number(val) }))
            )}
            {renderInput("Footfall Estimate Description", (formData as any).footfallEstimate, "e.g. High / High Street", <User size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, footfallEstimate: val })), "text"
            )}
            {renderInput("Suitable Business Types", (formData as any).suitableBusiness, "e.g. Salon / Boutique", <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, suitableBusiness: val })), "text"
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderToggle("Main-road Facing Shop", (formData as any).mainRoadFacing, <MapPin size={16} />, () =>
              setFormData((prev) => ({ ...prev, mainRoadFacing: !(prev as any).mainRoadFacing }))
            )}
            {renderToggle("Corner Shop Position", (formData as any).cornerShop, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, cornerShop: !(prev as any).cornerShop }))
            )}
            {renderToggle("Private Washroom Attached", (formData as any).washrooms > 0, <Sparkles size={16} />, () =>
              setFormData((prev) => ({ ...prev, washrooms: (prev as any).washrooms > 0 ? 0 : 1 }))
            )}
            {renderToggle("Car Parking for Customers", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 9. Warehouse */}
      {propertyType === "Warehouse" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Warehouse Area (sq ft) *", formData.area, "e.g. 15000", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Ceiling Center Height (ft)", (formData as any).ceilingHeight, "e.g. 24", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, ceilingHeight: Number(val) }))
            )}
            {renderInput("Office Area inside (sq ft)", (formData as any).officeArea, "e.g. 500", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, officeArea: Number(val) }))
            )}
            {renderInput("Truck Access Road Width (ft)", (formData as any).roadWidth, "e.g. 40", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roadWidth: Number(val) }))
            )}
            {renderInput("Power Capacity (HP / KW)", (formData as any).powerLoad, "e.g. 50", <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, powerLoad: Number(val) }))
            )}
            {renderInput("Flooring Type Description", (formData as any).flooring, "e.g. Industrial / VDF", <Layers size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, flooring: val })), "text"
            )}
            {renderInput("Storage Capacity (Metric Tons)", (formData as any).storageCapacity, "e.g. 2000", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, storageCapacity: val })), "text"
            )}
            {renderInput("Truck Access Vehicle Compatibility", (formData as any).truckAccess, "e.g. Multi-Axle Containers", <Car size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, truckAccess: val })), "text"
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderToggle("Loading / Unloading Bays Available", (formData as any).loadingUnloading, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, loadingUnloading: !(prev as any).loadingUnloading }))
            )}
            {renderToggle("Dock Levelers Built-in", (formData as any).dock, <Building2 size={16} />, () =>
              setFormData((prev) => ({ ...prev, dock: !(prev as any).dock }))
            )}
            {renderToggle("Warehouse Parking Area", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 10. Industrial Property */}
      {propertyType === "Industrial Property" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Factory / Land Area (sq ft) *", formData.area, "e.g. 25000", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Production Area (sq ft)", (formData as any).productionArea, "e.g. 18000", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, productionArea: Number(val) }))
            )}
            {renderInput("Power Capacity Connected (HP / KVA)", (formData as any).powerLoad, "e.g. 150", <Sparkles size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, powerLoad: Number(val) }))
            )}
            {renderInput("Road Width (ft)", (formData as any).roadWidth, "e.g. 50", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roadWidth: Number(val) }))
            )}
            {renderInput("Industrial Zoning Authority", (formData as any).zoning, "e.g. SIPCOT / SIDCO / Industrial", <ShieldCheck size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, zoning: val })), "text"
            )}
            {renderInput("Industrial Category Type", (formData as any).industrialType, "e.g. Manufacturing / Chemical", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, industrialType: val })), "text"
            )}
            {renderInput("Pollution Compliance Code / Details", (formData as any).pollutionCompliance, "e.g. Green / Orange Category", <ShieldCheck size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, pollutionCompliance: val })), "text"
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderToggle("Loading Dock Access", (formData as any).loadingUnloading, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, loadingUnloading: !(prev as any).loadingUnloading }))
            )}
            {renderToggle("Machinery Included in Sale", (formData as any).machineryIncluded, <Sparkles size={16} />, () =>
              setFormData((prev) => ({ ...prev, machineryIncluded: !(prev as any).machineryIncluded }))
            )}
            {renderToggle("Car Parking Available", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 11. Hotel / Resort */}
      {propertyType === "Hotel / Resort" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Plot / Built-up Area (sq ft) *", formData.area, "e.g. 50000", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Total Rooms Count", (formData as any).numberOfRooms, "e.g. 60", <Bed size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, numberOfRooms: Number(val) }))
            )}
            {renderInput("Room Types Description", (formData as any).roomTypes, "e.g. 40 Deluxe, 20 Suites", <Bed size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roomTypes: val })), "text"
            )}
            {renderInput("Number of Floors", (formData as any).totalFloors, "e.g. 4", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
            {renderInput("Average Occupancy Rate (%)", (formData as any).occupancy, "e.g. 75%", <User size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, occupancy: val })), "text"
            )}
            {renderInput("Annual Revenue (INR)", (formData as any).revenue, "e.g. 15000000", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, revenue: Number(val) }))
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderToggle("Staff Quarter Rooms Available", (formData as any).servantRoom, <User size={16} />, () =>
              setFormData((prev) => ({ ...prev, servantRoom: !(prev as any).servantRoom }))
            )}
            {renderToggle("Car Parking Yard", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 12. PG / Hostel */}
      {propertyType === "PG / Hostel" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderSelect("Tenant Gender Type", (formData as any).genderType, ["Male", "Female", "Co-ed"], <User size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, genderType: val }))
            )}
            {renderInput("Total Rooms Count", (formData as any).numberOfRooms, "e.g. 15", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, numberOfRooms: Number(val) }))
            )}
            {renderInput("Total Beds Count *", (formData as any).totalBeds, "e.g. 45", <Bed size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalBeds: Number(val) }))
            )}
            {renderInput("Available Beds", (formData as any).availableBeds, "e.g. 5", <Bed size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, availableBeds: Number(val) }))
            )}
            {renderInput("Rent per Bed / Month (INR)", (formData as any).rentPerBed, "e.g. 8500", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, rentPerBed: Number(val) }))
            )}
            {renderInput("Security Deposit (INR)", (formData as any).deposit, "e.g. 15000", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, deposit: Number(val) }))
            )}
            {renderInput("Rules / Curfew Timings", (formData as any).rules, "e.g. Curfew at 10 PM", <ShieldCheck size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, rules: val })), "text"
            )}
            {renderInput("Sharing Types Available", (formData as any).roomSharingType, "e.g. 1, 2, 3 Sharing", <Bed size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, roomSharingType: val })), "text"
            )}
          </div>

          <div className="max-w-xs">
            {renderToggle("Car / Bike Parking Available", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}

      {/* 13. Builder / New Project */}
      {propertyType === "Builder / New Project" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderInput("Project Name *", (formData as any).projectName, "e.g. Marina Vista", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, projectName: val })), "text"
            )}
            {renderInput("Developer / Company Name", (formData as any).community, "e.g. Prestige Group", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, community: val })), "text"
            )}
            {renderInput("Developer Project Type Description", (formData as any).commercialType, "e.g. Residential Luxury / Township", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, commercialType: val })), "text"
            )}
            {renderInput("Total Project Land Area (Acres)", (formData as any).plotArea, "e.g. 12", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, plotArea: Number(val) }))
            )}
            {renderInput("Number of Towers", (formData as any).towers, "e.g. 6", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, towers: Number(val) }))
            )}
            {renderInput("Max Tower Floors", (formData as any).totalFloors, "e.g. 18", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalFloors: Number(val) }))
            )}
            {renderInput("Total Project Units", (formData as any).totalUnits, "e.g. 450", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, totalUnits: Number(val) }))
            )}
            {renderInput("Available Units for Sale", (formData as any).availableUnits, "e.g. 120", <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, availableUnits: Number(val) }))
            )}
            {renderInput("BHK configurations available", (formData as any).bhkTypes, "e.g. 2, 3, 4 BHK", <Bed size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, bhkTypes: val })), "text"
            )}
            {renderInput("Built-up Area / Size Range (sq ft) *", formData.area, "e.g. 1100 - 2400", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, area: Number(val) }))
            )}
            {renderInput("Carpet Area Range (sq ft)", (formData as any).carpetArea, "e.g. 900 - 1800", <Scan size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, carpetArea: Number(val) }))
            )}
            {renderInput("Monthly Maintenance Estimate (INR)", (formData as any).maintenance, "e.g. 3500", <DollarSign size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, maintenance: Number(val) }))
            )}
            {renderInput("Expected Possession Date", (formData as any).possessionDate, "", <Calendar size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, possessionDate: val })), "date"
            )}
            {renderInput("Payment Plan Description", (formData as any).paymentPlan, "e.g. 20:80 Scheme / Construction Linked", <FileText size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, paymentPlan: val })), "text"
            )}
            {renderSelect("Construction Status", (formData as any).constructionStatus, ["New Launch", "Under Construction", "Near Completion", "Ready to Move"], <Building2 size={16} />, (val) =>
              setFormData((prev) => ({ ...prev, constructionStatus: val }))
            )}
          </div>

          <div className="max-w-xs">
            {renderToggle("Project Car Parking Covered", formData.parking, <Car size={16} />, () =>
              setFormData((prev) => ({ ...prev, parking: !prev.parking }))
            )}
          </div>
        </div>
      )}
    </div>
  );
}