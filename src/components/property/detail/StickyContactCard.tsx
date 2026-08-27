"use client";

import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Pencil,
  Eye,
  Lock,
} from "lucide-react";
import { User } from "@/src/providers/AuthContext";
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

export default function StickyContactCard({
  property,
  user,
  onLogin,
  onRequestCallback,
  onCall,
  onWhatsapp,
  onEdit,
  onViewEnquiries,
}: Props) {
  const isGuest = !user;
  const isOwner = user?._id === property.createdBy;
  const canManage =
    isOwner && (user?.role === "seller" || user?.role === "agent");

  const [name, setName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState("I am interested in this property. Please contact me.");

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
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none text-gray-800"
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="w-full h-9 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none text-gray-800"
            />

            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none resize-none font-sans text-gray-800"
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
                <MessageCircle size={13} /> Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Quick Controls (if property owner) */}
      {canManage && (
        <div className="p-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 to-orange-50/40 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Owner Management
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Listing Owner
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onEdit}
              className="h-9 rounded-xl bg-white border border-amber-200 text-amber-900 hover:bg-amber-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-3xs"
            >
              <Pencil size={14} /> Edit Listing
            </button>

            <button
              type="button"
              onClick={onViewEnquiries}
              className="h-9 rounded-xl bg-white border border-amber-200 text-amber-900 hover:bg-amber-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-3xs"
            >
              <Eye size={14} /> View Enquiries
            </button>
          </div>
        </div>
      )}
    </div>
  );
}