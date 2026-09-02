"use client";

import React from "react";
import { PropertyFormData, PgRules } from "@/src/types/property";
import { ShieldCheck, Clock, Users, Ban, FileText } from "lucide-react";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

export default function PgRulesStep({ formData, setFormData }: Props) {
  const rules: PgRules = formData.pgDetails?.rules || {};

  const updateRuleField = (field: keyof PgRules, value: any) => {
    setFormData((prev) => ({
      ...prev,
      pgDetails: {
        ...(prev.pgDetails || {}),
        rules: {
          ...(prev.pgDetails?.rules || {}),
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          House Rules & Restrictions
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Set clear guidelines regarding curfew, visitors, notice period, and restrictions.
        </p>
      </div>

      {/* Visitor Policy & Curfew Timing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Visitor Policy
          </label>
          <select
            value={rules.visitorPolicy || "Visitors Allowed in Common Area"}
            onChange={(e) => updateRuleField("visitorPolicy", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          >
            <option value="Visitors Allowed in Common Area">Visitors Allowed in Common Area</option>
            <option value="Visitors Allowed Till Room">Visitors Allowed Till Room</option>
            <option value="No Visitors Allowed">No Visitors Allowed</option>
            <option value="Day Visitors Allowed Only">Day Visitors Allowed Only</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Curfew Timing
          </label>
          <select
            value={rules.curfew || "No Curfew"}
            onChange={(e) => updateRuleField("curfew", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          >
            <option value="No Curfew">No Curfew (24/7 Access)</option>
            <option value="10:00 PM">10:00 PM Gate Lock</option>
            <option value="10:30 PM">10:30 PM Gate Lock</option>
            <option value="11:00 PM">11:00 PM Gate Lock</option>
            <option value="11:30 PM">11:30 PM Gate Lock</option>
          </select>
        </div>
      </div>

      {/* Booleans: Smoking, Alcohol, Pets, Cooking */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { key: "smokingAllowed", label: "Smoking Allowed" },
          { key: "alcoholAllowed", label: "Alcohol Allowed" },
          { key: "petsAllowed", label: "Pets Allowed" },
          { key: "cookingAllowed", label: "Self Cooking Allowed" },
        ].map((item) => {
          const val = Boolean((rules as any)[item.key]);
          return (
            <div key={item.key} className="p-4 bg-[#FAF9F5] border border-[#E6DCC2] rounded-2xl">
              <span className="block text-xs font-bold text-gray-800 mb-2">{item.label}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateRuleField(item.key as keyof PgRules, true)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    val
                      ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#C89B1C]"
                  }`}
                >
                  Yes
                </button>

                <button
                  type="button"
                  onClick={() => updateRuleField(item.key as keyof PgRules, false)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    !val
                      ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#C89B1C]"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice Period & Lock-in Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Notice Period
          </label>
          <select
            value={rules.noticePeriod || "30 Days"}
            onChange={(e) => updateRuleField("noticePeriod", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          >
            <option value="15 Days">15 Days</option>
            <option value="30 Days">30 Days (1 Month)</option>
            <option value="60 Days">60 Days (2 Months)</option>
            <option value="No Notice Period">No Notice Period</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Lock-in Period
          </label>
          <select
            value={rules.lockInPeriod || "1 Month"}
            onChange={(e) => updateRuleField("lockInPeriod", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          >
            <option value="None">None</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
          </select>
        </div>
      </div>

      {/* Other House Rules */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Other House Rules & Terms
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Keep common area clean, quiet hours after 10 PM, ID card mandatory for gate entry..."
          value={rules.otherRules || ""}
          onChange={(e) => updateRuleField("otherRules", e.target.value)}
          className="w-full p-4 rounded-2xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
        />
      </div>
    </div>
  );
}
