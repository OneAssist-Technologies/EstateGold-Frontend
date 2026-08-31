"use client";

import { HelpCircle, FileText } from "lucide-react";
import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function PriceTransparency({ property }: Props) {
  const isOwner = property.listingType !== "another_owner";
  
  // Format price helper
  const formatPrice = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  // Get relevant area basis
  const getRelevantArea = () => {
    if (property.propertyType === "Plot / Land") {
      return property.plotArea || 0;
    }
    return property.area || property.carpetArea || 0;
  };

  const area = getRelevantArea();
  const pricePerSqft = area > 0 ? Math.round(property.price / area) : 0;

  // Market intelligence snapshot check
  const marketInsight = property.marketInsight;
  const isInsightAvailable = marketInsight && marketInsight.success;
  
  const estimatedPricePerSqft = isInsightAvailable ? marketInsight?.estimatedPricePerSqft : null;
  const supported = isInsightAvailable ? (marketInsight?.supported ?? true) : false;
  const message = marketInsight?.message || "";

  // The primary baseline for percentage comparison is estimatedPricePerSqft * area
  const marketBaseline = estimatedPricePerSqft && area > 0 ? estimatedPricePerSqft * area : null;

  const percentageDifference = estimatedPricePerSqft && pricePerSqft
    ? ((pricePerSqft - estimatedPricePerSqft) / estimatedPricePerSqft) * 100
    : 0;

  return (
    <div className="border border-[#ECE7DB] rounded-[32px] p-6 sm:p-8 bg-white space-y-6">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          Price Transparency
        </h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Full breakdown of all costs — what you pay the owner, the government, and the platform.
        </p>
      </div>

      {/* 1. Price Summary Row */}
      <div className="border border-[#ECE7DB] rounded-2xl bg-white p-5 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* LISTED PRICE */}
        <div className="pt-2 md:pt-0 md:px-4 first:pl-0">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Listed Price
          </span>
          <span className="block text-lg sm:text-xl font-black text-[#9A720C] mt-1">
            {formatPrice(property.price)}
          </span>
        </div>

        {/* PRICE / SQ. FT */}
        <div className="pt-2 md:pt-0 md:px-4">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Price / Sq. Ft
          </span>
          <span className="block text-lg sm:text-xl font-black text-gray-900 mt-1">
            {pricePerSqft > 0 ? `₹${pricePerSqft.toLocaleString()}` : "—"}
          </span>
          {area > 0 && (
            <span className="block text-[10px] text-gray-400 mt-0.5">
              {area.toLocaleString()} sq ft total
            </span>
          )}
        </div>

        {/* EST. MARKET PRICE */}
        <div className="pt-2 md:pt-0 md:px-4">
          <div className="flex items-center gap-1">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">
              Est. Market Price
            </span>
            <div className="group relative">
              <HelpCircle size={11} className="text-gray-300 cursor-pointer" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 p-2 bg-gray-900 text-[9px] text-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 leading-tight">
                Locality benchmark or comparable-property estimate compiled by AVnester Market Intelligence.
              </div>
            </div>
          </div>
          {marketBaseline ? (
            <>
              <span className="block text-lg sm:text-xl font-black text-gray-900 mt-1">
                {formatPrice(marketBaseline)}
              </span>
              <span className={`block text-[10px] font-bold mt-0.5 ${
                percentageDifference < -10
                  ? "text-green-600"
                  : percentageDifference > 10
                  ? "text-amber-600"
                  : "text-blue-600"
              }`}>
                {percentageDifference < -10
                  ? `↘ ${Math.abs(percentageDifference).toFixed(1)}% below market`
                  : percentageDifference > 10
                  ? `↗ ${percentageDifference.toFixed(1)}% above market`
                  : `Within typical range`}
              </span>
              {estimatedPricePerSqft && (
                <span className="block text-[9px] text-gray-400 mt-0.5">
                  Est. Rate: ₹{estimatedPricePerSqft.toLocaleString()} / sq.ft
                </span>
              )}
            </>
          ) : (
            <div className="mt-2.5">
              <span className="block text-xs font-semibold text-gray-400 leading-tight">
                {message || "AVnester market data unavailable for this locality."}
              </span>
            </div>
          )}
        </div>

        {/* NEGOTIABLE */}
        <div className="pt-2 md:pt-0 md:px-4">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Negotiable
          </span>
          <div className="mt-2.5">
            {property.ownerNegotiable ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                ✓ Negotiable
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-200">
                — Fixed Price
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Secondary Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card A: Property Charges */}
        <div className="border border-[#ECE7DB] bg-[#FAF8F5]/30 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              🔑 Property Charges
            </h4>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">Monthly Maintenance</span>
                  <span className="text-[10px] text-gray-400 leading-none">Society upkeep, common areas</span>
                </div>
                <span className="font-semibold text-gray-400">Not specified</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">Car Parking</span>
                  <span className="text-[10px] text-gray-400 leading-none">One-time or monthly fee</span>
                </div>
                <span className={`font-semibold ${property.parking ? "text-green-600" : "text-gray-400"}`}>
                  {property.parking ? "Included" : "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">Brokerage</span>
                  <span className="text-[10px] text-gray-400 leading-none">Owner-listed or agent assistance</span>
                </div>
                <span className={`font-semibold ${isOwner ? "text-green-600" : "text-gray-400"}`}>
                  {isOwner ? "₹0" : "Not specified"}
                </span>
              </div>
            </div>
          </div>
          {isOwner && (
            <div className="text-[10px] text-gray-400 italic bg-green-50/20 p-2.5 rounded-lg border border-green-100/50">
              Direct owner listing: Save up to 2% on brokerage fees.
            </div>
          )}
        </div>

        {/* Card B: Govt. & Transaction Charges */}
        <div className="border border-[#ECE7DB] bg-[#FAF8F5]/30 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <FileText size={16} className="text-[#C89B1C]" /> Govt. & Transaction Charges
            </h4>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">Stamp Duty</span>
                  <span className="text-[10px] text-gray-400 leading-none">State government agreement value</span>
                </div>
                <span className="font-semibold text-gray-400">Not specified</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">Registration</span>
                  <span className="text-[10px] text-gray-400 leading-none">Government registration charge</span>
                </div>
                <span className="font-semibold text-gray-400">Not specified</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">Legal & Documentation</span>
                  <span className="text-[10px] text-gray-400 leading-none">Advocate fees, notary, stamp papers</span>
                </div>
                <span className="font-semibold text-gray-400">Not specified</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-gray-400 italic bg-gray-50 p-2.5 rounded-lg border border-gray-200/50">
            Note: Stamp duty and registration charges vary based on regional state policies.
          </div>
        </div>

        {/* Card C: Platform Charges */}
        <div className="border border-[#ECE7DB] bg-[#FAF8F5]/30 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              🛡️ Platform Charges
            </h4>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">Platform Usage Fee</span>
                  <span className="text-[10px] text-gray-400 leading-none">For buyers & tenants</span>
                </div>
                <span className="font-semibold text-green-600">₹0</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">Owner Listing Fee</span>
                  <span className="text-[10px] text-gray-400 leading-none">Basic property listing fee</span>
                </div>
                <span className="font-semibold text-green-600">₹0</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-700 block">KYC Verification</span>
                  <span className="text-[10px] text-gray-400 leading-none">Owner identity screening</span>
                </div>
                <span className="font-semibold text-green-600">₹0</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-green-700 font-bold bg-green-50 p-2.5 rounded-lg border border-green-200 text-center">
            ✓ ₹0 brokerage, ₹0 platform fees — always.
          </div>
        </div>
      </div>

      {/* 3. Price History */}
      <div className="border border-[#ECE7DB] rounded-2xl p-5 bg-[#FAF8F5]/20">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
          📈 Price History
        </h4>
        <div className="mt-3 text-xs text-gray-400 italic">
          Price history unavailable for this listing.
        </div>
      </div>
    </div>
  );
}
