"use client";

import React from "react";
import { PropertyFormData, PgDetails } from "@/src/types/property";
import { Users, Calendar, Utensils, Home, ShieldCheck } from "lucide-react";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

export default function PgDetailsStep({ formData, setFormData, errors }: Props) {
  const pgDetails: PgDetails = formData.pgDetails || {};

  const updatePgField = (field: keyof PgDetails, value: any) => {
    setFormData((prev) => ({
      ...prev,
      pgDetails: {
        ...(prev.pgDetails || {}),
        [field]: value,
      },
    }));
  };

  const toggleMeal = (meal: string) => {
    const currentMeals = pgDetails.mealsIncluded || [];
    const updated = currentMeals.includes(meal)
      ? currentMeals.filter((m) => m !== meal)
      : [...currentMeals, meal];
    updatePgField("mealsIncluded", updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          PG / Co-Living Details
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Specify accommodation type, suitable occupants, meal policies, and move-in terms.
        </p>
      </div>

      {/* PG / Co-Living Name & Publisher Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            PG / Co-Living Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Royal Stays Co-Living / Sunshine PG"
            value={pgDetails.pgName || ""}
            onChange={(e) => updatePgField("pgName", e.target.value)}
            className={`w-full h-12 px-4 rounded-xl border text-sm focus:outline-none transition-all ${
              errors?.pgName ? "border-red-500 bg-red-50/20" : "border-[#E6DCC2] focus:border-[#C89B1C]"
            }`}
          />
          {errors?.pgName && <p className="text-xs text-red-500 mt-1.5">{errors.pgName}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Publisher Role / Type <span className="text-red-500">*</span>
          </label>
          <select
            value={pgDetails.publisherType || "PG Owner"}
            onChange={(e) => updatePgField("publisherType", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white transition-all"
          >
            <option value="PG Owner">PG Owner</option>
            <option value="PG In-charge / Manager">PG In-charge / Manager</option>
            <option value="House Owner – Co-Living">House Owner – Co-Living</option>
          </select>
        </div>
      </div>

      {/* Accommodation Type */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Accommodation Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "PG", title: "PG (Paying Guest)", desc: "Traditional room/bed listing" },
            { id: "Co-Living", title: "Co-Living Space", desc: "Shared luxury living space" },
            { id: "House Co-Living", title: "House Co-Living", desc: "Private house with shared rooms" },
          ].map((item) => {
            const isSelected = (pgDetails.accommodationType || "PG") === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updatePgField("accommodationType", item.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#C89B1C] bg-[#FFF9EC] ring-2 ring-[#C89B1C]/20"
                    : "border-[#E6DCC2] bg-white hover:border-[#C89B1C]"
                }`}
              >
                <div className="font-bold text-sm text-gray-900">{item.title}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suitable For */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Suitable For (Gender) <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "Men", label: "Men Only" },
            { id: "Women", label: "Women Only" },
            { id: "Unisex", label: "Unisex / All" },
          ].map((item) => {
            const isSelected = pgDetails.suitableFor === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updatePgField("suitableFor", item.id)}
                className={`h-12 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C] shadow-2xs"
                    : "border-[#E6DCC2] bg-white hover:border-[#C89B1C] text-gray-700"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        {errors?.suitableFor && <p className="text-xs text-red-500 mt-1.5">{errors.suitableFor}</p>}
      </div>

      {/* Occupant Type */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Target Occupants <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            "Students",
            "Working Professionals",
            "Students & Working Professionals",
            "Anyone",
          ].map((item) => {
            const isSelected = (pgDetails.occupantType || "Anyone") === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => updatePgField("occupantType", item)}
                className={`h-12 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  isSelected
                    ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C]"
                    : "border-[#E6DCC2] bg-white hover:border-[#C89B1C] text-gray-700"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Move-in Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Move-in Availability
          </label>
          <div className="flex gap-3">
            {["Available Now", "Available From Date"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updatePgField("moveInAvailability", item)}
                className={`flex-1 h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  (pgDetails.moveInAvailability || "Available Now") === item
                    ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C]"
                    : "border-[#E6DCC2] bg-white text-gray-700 hover:border-[#C89B1C]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {pgDetails.moveInAvailability === "Available From Date" && (
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Available From Date
            </label>
            <input
              type="date"
              value={pgDetails.moveInDate || ""}
              onChange={(e) => updatePgField("moveInDate", e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
            />
          </div>
        )}
      </div>

      {/* Food Availability & Meals Included */}
      <div className="p-5 bg-[#FAF9F5] border border-[#E6DCC2] rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Utensils size={18} className="text-[#C89B1C]" />
          <h3 className="font-bold text-sm text-gray-900">Food & Meals Facility</h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            Food Availability
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Available", "Not Available", "Optional"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updatePgField("foodAvailability", item)}
                className={`h-10 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
                  (pgDetails.foodAvailability || "Available") === item
                    ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C]"
                    : "border-[#E6DCC2] bg-white text-gray-700 hover:border-[#C89B1C]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {pgDetails.foodAvailability !== "Not Available" && (
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Meals Included
            </label>
            <div className="flex flex-wrap gap-2">
              {["Breakfast", "Lunch", "Dinner"].map((meal) => {
                const isSelected = (pgDetails.mealsIncluded || []).includes(meal);
                return (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => toggleMeal(meal)}
                    className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C]"
                        : "border-[#E6DCC2] bg-white text-gray-600 hover:border-[#C89B1C]"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}{meal}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Overall Property Furnishing
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["Fully Furnished", "Semi Furnished", "Unfurnished"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => updatePgField("furnishing", item)}
              className={`h-11 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                (pgDetails.furnishing || "Fully Furnished") === item
                  ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C]"
                  : "border-[#E6DCC2] bg-white text-gray-700 hover:border-[#C89B1C]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
