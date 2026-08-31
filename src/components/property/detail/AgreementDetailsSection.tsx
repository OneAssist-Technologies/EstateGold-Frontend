"use client";

import React from "react";
import {
  FileText,
  Calendar,
  DollarSign,
  ShieldCheck,
  Clock,
  Home,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Car,
  Sofa,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function AgreementDetailsSection({ property }: Props) {
  const isRentOrLease =
    (property.purpose || "").toLowerCase() === "rent" ||
    (property.purpose || "").toLowerCase() === "lease";

  if (!isRentOrLease || !property.agreementDetails) return null;

  const details = property.agreementDetails;
  const isLease = (property.purpose || "").toLowerCase() === "lease";
  const purposeTitle = isLease ? "Lease" : "Rent";

  // Helper to format currency
  const formatAmount = (val?: number) => {
    if (!val || isNaN(val)) return null;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  // Helper to format date string
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const termsList = [
    {
      icon: <FileCheck size={16} className="text-[#C89B1C]" />,
      label: "Agreement Type",
      value: details.agreementType,
    },
    {
      icon: <DollarSign size={16} className="text-[#C89B1C]" />,
      label: isLease ? "Lease Amount" : "Monthly Rent",
      value: formatAmount(details.amount),
      highlight: true,
    },
    {
      icon: <ShieldCheck size={16} className="text-[#C89B1C]" />,
      label: "Security Deposit",
      value: formatAmount(details.securityDeposit),
    },
    {
      icon: <DollarSign size={16} className="text-[#C89B1C]" />,
      label: "Advance / Token Amount",
      value: formatAmount(details.advanceAmount),
    },
    {
      icon: <Clock size={16} className="text-[#C89B1C]" />,
      label: "Agreement Duration",
      value: details.duration,
    },
    {
      icon: <Calendar size={16} className="text-[#C89B1C]" />,
      label: "Available / Start Date",
      value: formatDate(details.startDate),
    },
    {
      icon: <Clock size={16} className="text-[#C89B1C]" />,
      label: "Notice Period",
      value: details.noticePeriod,
    },
    {
      icon: <Clock size={16} className="text-[#C89B1C]" />,
      label: "Lock-in Period",
      value: details.lockInPeriod,
    },
    {
      icon: <TrendingUp size={16} className="text-[#C89B1C]" />,
      label: "Rent Escalation",
      value: details.rentEscalation,
    },
    {
      icon: <Home size={16} className="text-[#C89B1C]" />,
      label: "Maintenance Charges",
      value: details.maintenanceResponsibility,
    },
    {
      icon: <Zap size={16} className="text-[#C89B1C]" />,
      label: "Electricity & Utilities",
      value: details.utilitiesResponsibility,
    },
    {
      icon: <Car size={16} className="text-[#C89B1C]" />,
      label: "Parking Details",
      value: details.parkingDetails,
    },
    {
      icon: <Sofa size={16} className="text-[#C89B1C]" />,
      label: "Furnishing Condition",
      value: details.furnishingCondition,
    },
  ].filter((item) => Boolean(item.value));

  return (
    <section className="bg-white border border-[#ECE7DB] rounded-3xl p-6 sm:p-7 shadow-xs mt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE7DB] pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#FFF9EC] border border-[#E5D8B3] flex items-center justify-center text-[#9A720C] shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Agreement & Tenancy Terms
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#9A720C]/10 text-[#9A720C] border border-[#9A720C]/20 text-[10px] font-extrabold uppercase tracking-wider">
                {purposeTitle}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Owner's preferred terms for this {purposeTitle.toLowerCase()} listing
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Terms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {termsList.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
              item.highlight
                ? "bg-[#FFFDF6] border-[#E8DCC1]"
                : "bg-gray-50/70 border-gray-100"
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-1">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <p
              className={`text-sm sm:text-base font-extrabold ${
                item.highlight ? "text-[#C89B1C]" : "text-gray-900"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Terms Notes */}
      {details.additionalTerms && (
        <div className="bg-[#FFFDF9] border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-1.5">
          <h4 className="text-xs font-bold text-[#9A720C] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Additional Conditions & Rules
          </h4>
          <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-line">
            {details.additionalTerms}
          </p>
        </div>
      )}

      {/* Legal UX Disclaimer */}
      <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 sm:p-4 flex items-start gap-2.5">
        <AlertCircle size={16} className="text-gray-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
          <strong>Note:</strong> These are property listing terms provided by the owner and are not a legal agreement.
        </p>
      </div>
    </section>
  );
}
