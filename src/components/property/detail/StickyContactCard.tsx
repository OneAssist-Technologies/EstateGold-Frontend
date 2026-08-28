"use client";

import { useState } from "react";
import {
  Phone,
  Pencil,
  Eye,
  Lock,
} from "lucide-react";
import { User } from "@/src/providers/AuthContext";
import { Property } from "@/src/types/property";

function WhatsappIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

interface Props {
  property: Property;
  user?: User | null;

  onLogin: () => void;
  onRequestCallback: () => void;
  onCall: () => void;
  onWhatsapp: (message?: string) => void;
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
                className="h-8 rounded-xl border border-[#9A720C] text-[#9A720C] hover:bg-[#FFF9EC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone size={13} /> Call Now
              </button>

              <button
                type="button"
                onClick={() => onWhatsapp(message)}
                className="h-8 rounded-xl border border-[#9A720C] text-[#9A720C] hover:bg-[#FFF9EC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <WhatsappIcon className="w-3.5 h-3.5 fill-[#9A720C]" /> Contact
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