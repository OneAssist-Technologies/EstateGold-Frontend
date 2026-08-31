"use client";

import React from "react";
import { FileText, Calendar, DollarSign, Clock, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { PropertyFormData, AgreementDetails } from "@/src/types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

export default function AgreementDetailsStep({ formData, setFormData, errors }: Props) {
  const isLease = (formData.purpose || "").toLowerCase() === "lease";
  const purposeTitle = isLease ? "Lease" : "Rental";

  const details: AgreementDetails = formData.agreementDetails || {};

  const handleChange = (field: keyof AgreementDetails, value: any) => {
    setFormData((prev) => ({
      ...prev,
      agreementDetails: {
        ...prev.agreementDetails,
        [field]: value,
      },
    }));
  };

  const agreementTypeOptions = isLease
    ? [
        "Lease Agreement",
        "Commercial Lease",
        "Long-Term Residential Lease",
        "Sublease Agreement",
        "Other",
      ]
    : [
        "Rental Agreement",
        "Leave & License Agreement",
        "Commercial Rental Agreement",
        "PG / Hostel Agreement",
        "Other",
      ];

  const durationOptions = isLease
    ? ["1 Year", "2 Years", "3 Years", "5 Years", "9 Years", "Custom"]
    : ["11 Months", "1 Year", "2 Years", "3 Years", "Custom"];

  const noticePeriodOptions = [
    "1 Month",
    "2 Months",
    "3 Months",
    "6 Months",
    "Immediate / None",
  ];

  const lockInOptions = ["None", "3 Months", "6 Months", "1 Year", "2 Years"];

  const parkingOptions = [
    "1 Covered Car Slot",
    "2 Covered Car Slots",
    "1 Open Car Slot",
    "2 Open Car Slots",
    "Covered & Open Parking Available",
    "Two-Wheeler Parking Only",
    "Covered Car & Two-Wheeler Parking",
    "No Dedicated Parking",
    "Street / Common Parking",
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EC] to-[#FAF5E6] border border-[#E5D8B3] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#FFF5D6] to-[#F3E2B0] border border-[#D8C28A] flex items-center justify-center text-[#9A720C] shadow-2xs shrink-0 mt-0.5">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#161616] tracking-tight">
                 Agreement Details
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3E2B0] text-[#785705] px-2 py-0.5 rounded-full border border-[#D8C28A]">
                {purposeTitle} Terms
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
              Provide the basic terms you want to include with this {purposeTitle.toLowerCase()} listing.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Fields Grid */}
      <div className="bg-white rounded-3xl border border-[#ECE7DB] p-5 sm:p-7 shadow-xs space-y-6">
        
        {/* Core Required Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#9A720C] border-b border-[#F0ECE1] pb-2">
            Core Agreement Terms (Required)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Agreement Type */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Agreement Type <span className="text-red-500">*</span>
              </label>
              <select
                value={details.agreementType || ""}
                onChange={(e) => handleChange("agreementType", e.target.value)}
                className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all ${
                  errors?.agreementType ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#E2D9C5] focus:border-[#C89B1C]"
                }`}
              >
                <option value="">Select Agreement Type</option>
                {agreementTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors?.agreementType && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.agreementType}</p>
              )}
            </div>

            {/* Rent / Lease Amount */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                {isLease ? "Lease Amount / Consideration (₹)" : "Monthly Rent Amount (₹)"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder={isLease ? "e.g. 500000" : "e.g. 25000"}
                  value={details.amount || ""}
                  onChange={(e) => handleChange("amount", e.target.value ? Number(e.target.value) : 0)}
                  className={`w-full h-11 pl-8 pr-3.5 rounded-xl border text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all ${
                    errors?.amount ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#E2D9C5] focus:border-[#C89B1C]"
                  }`}
                />
              </div>
              {errors?.amount && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Security Deposit */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Security Deposit (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 100000"
                  value={details.securityDeposit || ""}
                  onChange={(e) => handleChange("securityDeposit", e.target.value ? Number(e.target.value) : 0)}
                  className={`w-full h-11 pl-8 pr-3.5 rounded-xl border text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all ${
                    errors?.securityDeposit ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#E2D9C5] focus:border-[#C89B1C]"
                  }`}
                />
              </div>
              {errors?.securityDeposit && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.securityDeposit}</p>
              )}
            </div>

            {/* Advance Amount */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                {isLease ? "Advance / Token Amount (₹)" : "Advance Amount (₹)"}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 50000"
                  value={details.advanceAmount || ""}
                  onChange={(e) => handleChange("advanceAmount", e.target.value ? Number(e.target.value) : 0)}
                  className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-[#E2D9C5] focus:border-[#C89B1C] text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all"
                />
              </div>
            </div>

            {/* Agreement Duration */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Agreement Duration <span className="text-red-500">*</span>
              </label>
              <select
                value={details.duration || ""}
                onChange={(e) => handleChange("duration", e.target.value)}
                className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all ${
                  errors?.duration ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#E2D9C5] focus:border-[#C89B1C]"
                }`}
              >
                <option value="">Select Duration</option>
                {durationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors?.duration && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.duration}</p>
              )}
            </div>

            {/* Agreement Start Date */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Agreement Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={details.startDate ? details.startDate.split("T")[0] : ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all ${
                  errors?.startDate ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#E2D9C5] focus:border-[#C89B1C]"
                }`}
              />
              {errors?.startDate && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* Notice Period */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Notice Period <span className="text-red-500">*</span>
              </label>
              <select
                value={details.noticePeriod || ""}
                onChange={(e) => handleChange("noticePeriod", e.target.value)}
                className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all ${
                  errors?.noticePeriod ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#E2D9C5] focus:border-[#C89B1C]"
                }`}
              >
                <option value="">Select Notice Period</option>
                {noticePeriodOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors?.noticePeriod && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.noticePeriod}</p>
              )}
            </div>

            {/* Lock-in Period */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Lock-in Period (Optional)
              </label>
              <select
                value={details.lockInPeriod || ""}
                onChange={(e) => handleChange("lockInPeriod", e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2D9C5] focus:border-[#C89B1C] text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all"
              >
                <option value="">Select Lock-in Period</option>
                {lockInOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-500 font-medium mt-1">
                Minimum mandatory stay duration before agreement can be terminated.
              </p>
            </div>

          </div>
        </div>

        {/* Additional Optional Terms Section */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#9A720C] border-b border-[#F0ECE1] pb-2">
            Responsibilities & Additional Conditions (Optional)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Rent Escalation */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Rent / Lease Escalation Clause
              </label>
              <input
                type="text"
                placeholder="e.g. 5% annually or 10% per 11 months"
                value={details.rentEscalation || ""}
                onChange={(e) => handleChange("rentEscalation", e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2D9C5] focus:border-[#C89B1C] text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all"
              />
            </div>

            {/* Maintenance Responsibility */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Maintenance Responsibility
              </label>
              <select
                value={details.maintenanceResponsibility || ""}
                onChange={(e) => handleChange("maintenanceResponsibility", e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2D9C5] focus:border-[#C89B1C] text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all"
              >
                <option value="">Select Responsibility</option>
                <option value="Owner / Lessor">Owner / Lessor</option>
                <option value="Tenant / Lessee">Tenant / Lessee</option>
                <option value="Shared 50/50">Shared 50/50</option>
                <option value="Included in Rent/Lease">Included in Rent/Lease</option>
              </select>
            </div>

            {/* Utilities Responsibility */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Electricity / Utilities Responsibility
              </label>
              <select
                value={details.utilitiesResponsibility || ""}
                onChange={(e) => handleChange("utilitiesResponsibility", e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2D9C5] focus:border-[#C89B1C] text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all"
              >
                <option value="">Select Responsibility</option>
                <option value="Tenant / Lessee (As per Meter)">Tenant / Lessee (As per Meter)</option>
                <option value="Owner / Lessor">Owner / Lessor</option>
                <option value="Fixed Monthly Flat Rate">Fixed Monthly Flat Rate</option>
              </select>
            </div>

            {/* Furnishing Condition */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Furnishing Condition
              </label>
              <select
                value={details.furnishingCondition || ""}
                onChange={(e) => handleChange("furnishingCondition", e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2D9C5] focus:border-[#C89B1C] text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all"
              >
                <option value="">Select Condition</option>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully Furnished">Fully Furnished</option>
              </select>
            </div>

            {/* Parking Details */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Parking Details
              </label>
              <select
                value={details.parkingDetails || ""}
                onChange={(e) => handleChange("parkingDetails", e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2D9C5] focus:border-[#C89B1C] text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all"
              >
                <option value="">Select Parking Details</option>
                {parkingOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Terms */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Additional Terms / Conditions
              </label>
              <textarea
                rows={3}
                placeholder="e.g. No structural modifications allowed, Family preferred, Commercial office usage rules..."
                value={details.additionalTerms || ""}
                onChange={(e) => handleChange("additionalTerms", e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#E2D9C5] focus:border-[#C89B1C] text-xs sm:text-sm bg-white text-gray-900 outline-none transition-all resize-y"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
