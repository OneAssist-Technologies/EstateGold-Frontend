"use client";

import React from "react";
import { PropertyFormData, PgCharges } from "@/src/types/property";
import { IndianRupee, ShieldCheck, Zap, Wifi, Utensils, Info } from "lucide-react";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

export default function PgPricingChargesStep({ formData, setFormData, errors }: Props) {
  const charges: PgCharges = formData.pgDetails?.charges || {};

  const updateChargesField = (field: keyof PgCharges, value: any) => {
    setFormData((prev) => ({
      ...prev,
      pgDetails: {
        ...(prev.pgDetails || {}),
        charges: {
          ...(prev.pgDetails?.charges || {}),
          [field]: value,
        },
      },
    }));
  };

  const startingPrice = (formData.pgDetails?.rooms || []).reduce(
    (min, r) => (r.pricePerPerson > 0 && r.pricePerPerson < min ? r.pricePerPerson : min),
    formData.price || 999999
  );

  const displayStartingPrice = startingPrice === 999999 ? formData.price || 0 : startingPrice;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Pricing & Additional Charges
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          PG pricing is calculated per person / per month. Clear pricing avoids confusion for potential occupants.
        </p>
      </div>

      {/* Starting Price Overview Card */}
      <div className="p-5 bg-[#FFF9EC] border border-[#F3E5C8] rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] border border-[#E6DCC2] flex items-center justify-center text-[#C89B1C]">
            <IndianRupee size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-[#C89B1C] uppercase tracking-wider">
              Starting Rent / Person / Month
            </span>
            <h3 className="text-xl font-extrabold text-gray-900">
              ₹{displayStartingPrice.toLocaleString("en-IN")} <span className="text-xs font-normal text-gray-500">/ month</span>
            </h3>
          </div>
        </div>

        <div className="text-right hidden sm:block text-xs text-gray-500">
          Based on added room configurations
        </div>
      </div>

      {/* Security Deposit & Maintenance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Security Deposit (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 15000"
            value={charges.securityDeposit || ""}
            onChange={(e) => updateChargesField("securityDeposit", parseFloat(e.target.value) || 0)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Monthly Maintenance Charges (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 500 (Leave 0 if Included)"
            value={charges.maintenanceCharges || ""}
            onChange={(e) => updateChargesField("maintenanceCharges", parseFloat(e.target.value) || 0)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          />
        </div>
      </div>

      {/* Electricity & Wi-Fi Charges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Electricity Charges
          </label>
          <select
            value={charges.electricityCharges || "Included in Rent"}
            onChange={(e) => updateChargesField("electricityCharges", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          >
            <option value="Included in Rent">Included in Rent</option>
            <option value="Extra by Sub-Meter Units">Extra by Sub-Meter Units</option>
            <option value="Fixed Monthly Amount">Fixed Monthly Amount</option>
            <option value="Split Among Roommates">Split Among Roommates</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Wi-Fi Charges
          </label>
          <select
            value={charges.wifiCharges || "Free High-Speed Wi-Fi"}
            onChange={(e) => updateChargesField("wifiCharges", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          >
            <option value="Free High-Speed Wi-Fi">Free High-Speed Wi-Fi Included</option>
            <option value="Extra Nominal Charge">Extra Nominal Charge</option>
            <option value="Not Provided">Not Provided</option>
          </select>
        </div>
      </div>

      {/* Food Charges & Other Charges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Food Charges (₹/mo if optional)
          </label>
          <input
            type="number"
            placeholder="e.g. 3000 (0 if included in rent)"
            value={charges.foodCharges || ""}
            onChange={(e) => updateChargesField("foodCharges", parseFloat(e.target.value) || 0)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Other Utility Charges (Notes)
          </label>
          <input
            type="text"
            placeholder="e.g. ₹200/mo laundry or water charges"
            value={charges.otherCharges || ""}
            onChange={(e) => updateChargesField("otherCharges", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
          />
        </div>
      </div>
    </div>
  );
}
