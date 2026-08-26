"use client";

import {
  Phone,
  MessageCircle,
  Pencil,
  Eye,
  Lock,
  UserPlus,
  LogIn,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import { User } from "@/src/providers/AuthContext";;

import { Property } from "@/src/types/property";

interface Props {
  property: Property;
  user?: User | null;

  onLogin: () => void;
  onRequestCallback: () => void;
  onCall: () => void;
  onWhatsapp: () => void;
  onEdit: () => void;
  onViewEnquiries: () => void;
  onToggleStatus: () => void;
}

function formatPrice(price?: number): string {
  if (!price || isNaN(price)) return "₹0";
  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2);
    return `₹${cr.replace(/\.00$/, "")} Cr`;
  } else if (price >= 100000) {
    const l = (price / 100000).toFixed(1);
    return `₹${l.replace(/\.0$/, "")} L`;
  } else {
    return `₹${price.toLocaleString("en-IN")}`;
  }
}

function calculateEMI(price?: number): string {
  if (!price || isNaN(price) || price === 0) return "₹63,623";
  const loanAmount = price * 0.8;
  const annualRate = 0.085;
  const monthlyRate = annualRate / 12;
  const tenureMonths = 240;
  const emi =
    (loanAmount *
      monthlyRate *
      Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return `₹${Math.round(emi).toLocaleString("en-IN")}`;
}

export default function StickyContactCard({
  property,
  user,
  onLogin,
  onRequestCallback,
  onCall,
  onWhatsapp,
  onEdit,
  onViewEnquiries,
  onToggleStatus,
}: Props) {
  const isGuest = !user;
  const isOwner = user?._id === property.createdBy;
  const canManage =
    isOwner && (user?.role === "seller" || user?.role === "agent");

  const isRent =
    (property.purpose || "").toLowerCase().includes("rent") ||
    (property.purpose || "").toLowerCase().includes("lease");

  const displayTitle =
    property.bedrooms && property.propertyType
      ? `Luxury ${property.bedrooms} BHK ${property.propertyType}`
      : property.propertyType || "Luxury Property";

  if (isGuest) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-xs border border-[#ECE7DB] bg-white">
        {/* Blurred Price Banner Header */}
        <div className="relative h-24 bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] overflow-hidden select-none pointer-events-none">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xs" />
          <div className="absolute inset-0 flex flex-col justify-center px-4 space-y-1 opacity-20">
            <div className="text-2xl font-bold text-white">
              {formatPrice(property.price)}
            </div>
            <p className="text-xs text-amber-100 font-medium truncate">
              {displayTitle}
            </p>
          </div>
        </div>

        {/* Locked Content Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-5">
          <div className="h-12 w-12 rounded-full bg-[#FFF9EC] border border-[#E8DCC1] flex items-center justify-center text-[#9A720C] shadow-2xs">
            <Lock size={20} />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Sign in to contact</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
              View owner details and send a request
            </p>
          </div>

          <button
            type="button"
            onClick={onLogin}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary Callback Card */}
      <div className="rounded-2xl overflow-hidden shadow-xs border border-[#ECE7DB] bg-white">
        {/* Header Gold Banner */}
        <div className="bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white p-4 space-y-1">
          <div className="text-2xl font-bold">
            {formatPrice(property.price)}
            {isRent ? <span className="text-sm font-sans font-normal opacity-90"> / month</span> : null}
          </div>
          <p className="text-xs text-amber-100 font-medium truncate">
            {displayTitle}
          </p>
        </div>

        {/* Callback Form Body */}
        <div className="p-4 space-y-3">
          <h3 className="text-xs font-bold text-gray-900">Request a Callback</h3>

          <div className="space-y-2.5">
            <input
              type="text"
              placeholder="Rahul Gupta"
              defaultValue={user?.fullName || ""}
              className="w-full h-9 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              defaultValue={user?.phone || ""}
              className="w-full h-9 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
            />

            <textarea
              rows={2}
              defaultValue="I am interested in this property. Please contact me."
              className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none resize-none"
            />

            <button
              type="button"
              onClick={isGuest ? onLogin : onRequestCallback}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Phone size={14} /> Request Callback
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onCall}
                className="h-8 rounded-xl border border-[#9A720C] text-[#9A720C] hover:bg-[#FFF9EC] text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Phone size={13} /> Call Now
              </button>

              <button
                type="button"
                onClick={onWhatsapp}
                className="h-8 rounded-xl border border-[#9A720C] text-[#9A720C] hover:bg-[#FFF9EC] text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <MessageCircle size={13} /> Email
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center pt-1 font-medium">
              Zero brokerage. Direct owner contact.
            </p>
          </div>
        </div>
      </div>

      {/* EMI Calculator Card - ONLY for Buy / Sale properties */}
      {/* {!isRent && (
        <div className="bg-[#FFFDF6] border border-[#F4E3B5] rounded-2xl p-4 space-y-3 shadow-2xs">
          <div>
            <h4 className="text-xs font-bold text-gray-900">EMI Calculator</h4>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
              At 8.5% for 20 years
            </p>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium text-gray-600">Monthly EMI</span>
            <span className="text-lg font-bold text-[#9A720C]">
              {calculateEMI(property.price)}
            </span>
          </div>

          <button
            type="button"
            className="w-full h-8 rounded-xl border border-[#9A720C] text-[#9A720C] hover:bg-[#FFF9EC] text-xs font-bold transition-colors cursor-pointer"
          >
            Check Loan Eligibility
          </button>
        </div>
      )} */}
    </div>
  );
}