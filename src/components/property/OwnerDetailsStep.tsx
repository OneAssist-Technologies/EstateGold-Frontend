"use client";

import {
  Building2,
  Mail,
  Phone,
  Shield,
  User,
  FileText,
} from "lucide-react";

import { PropertyFormData } from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<PropertyFormData>
  >;
}

const ownerTypes = [
  {
    value: "Individual Owner",
    description: "Single person who owns the property",
    icon: User,
  },
  {
    value: "Company / Firm",
    description: "Property owned by a legal entity",
    icon: Building2,
  },
  {
    value: "NRI Owner",
    description: "Non-resident Indian property owner",
    icon: Shield,
  },
];

export default function OwnerDetailsStep({
  formData,
  setFormData,
}: Props) {
  const isAnotherOwner = formData.listingType === "another_owner";

  return (
    <div>
      {/* Header */}
      <h2 className="text-4xl font-bold text-[#161616]">
        Property Owner Details
      </h2>

      <p className="mt-3 text-lg text-[#6B7280]">
        {isAnotherOwner
          ? "As an agent listing on behalf of another owner, please provide verified owner information."
          : "Verify your personal owner contact details for this property listing."}
      </p>

      {/* Owner Type */}
      <div className="mt-10">
        <label className="block text-xl font-semibold mb-4">
          Owner Type
        </label>

        <div className="grid md:grid-cols-3 gap-5">
          {ownerTypes.map((item) => {
            const Icon = item.icon;
            const selected = formData.ownerType === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    ownerType: item.value,
                  }))
                }
                className={`
                  p-5
                  rounded-2xl
                  border
                  text-left
                  transition-all
                  ${
                    selected
                      ? "border-[#C89B1C] bg-[#FFF8E8]"
                      : "border-[#E5D8B3]"
                  }
                `}
              >
                <div className="h-12 w-12 rounded-xl bg-[#F8F3E7] flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#C89B1C]" />
                </div>

                <h3 className="text-lg font-semibold">{item.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {/* Owner Name */}
        <div className={isAnotherOwner ? "" : "md:col-span-2"}>
          <label className="block mb-2 font-medium">
            Owner Full Name <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={formData.ownerName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ownerName: e.target.value,
                }))
              }
              placeholder="As per government ID"
              className="w-full h-14 border rounded-xl pl-12 pr-4 outline-none"
            />
          </div>
        </div>

        {/* Relation (Only displayed if it's another person's property) */}
        {isAnotherOwner && (
          <div>
            <label className="block mb-2 font-medium">
              Agent's Relation to Owner <span className="text-red-500">*</span>
            </label>

            <select
              value={formData.agentRelation || "Authorized Agent"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  agentRelation: e.target.value,
                }))
              }
              className="w-full h-14 border rounded-xl px-4 outline-none"
            >
              <option>Authorized Agent</option>
              <option>Property Manager</option>
              <option>Broker</option>
              <option>Family Representative</option>
            </select>
          </div>
        )}

        {/* Mobile */}
        <div>
          <label className="block mb-2 font-medium">
            Owner Mobile <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              maxLength={10}
              value={formData.ownerPhone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData((prev) => ({
                  ...prev,
                  ownerPhone: val,
                }));
              }}
              placeholder="10-digit Primary number"
              className="w-full h-14 border rounded-xl pl-12 pr-4 outline-none"
            />
          </div>
        </div>

        {/* Alternate Mobile */}
        <div>
          <label className="block mb-2 font-medium">Alternate Mobile</label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="+91 Optional"
              className="w-full h-14 border rounded-xl pl-12 pr-4 outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Owner Email Address</label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={formData.ownerEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ownerEmail: e.target.value,
                }))
              }
              placeholder="owner@email.com"
              className="w-full h-14 border rounded-xl pl-12 pr-4 outline-none"
            />
          </div>
        </div>

        {/* Owner Address */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Owner Residential / Office Address <span className="text-red-500">*</span>
          </label>
          <input
            value={formData.ownerAddress || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                ownerAddress: e.target.value,
              }))
            }
            placeholder="Complete street address, city, state and pincode"
            className="w-full h-14 border rounded-xl px-4 outline-none"
          />
        </div>

        {/* Negotiable & Ready to Meet Toggles */}
        <div className="md:col-span-2 grid md:grid-cols-2 gap-5 mt-2">
          <label className="flex items-center gap-3.5 p-4 rounded-xl border border-[#E5D8B3] bg-[#FCFBF8] cursor-pointer hover:bg-[#FFFDF9] transition-all">
            <input
              type="checkbox"
              checked={formData.ownerNegotiable || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ownerNegotiable: e.target.checked,
                }))
              }
              className="h-5 w-5 rounded text-[#C89B1C] border-[#C89B1C] focus:ring-[#C89B1C] cursor-pointer"
            />
            <div>
              <p className="text-sm font-bold text-gray-800">Ready to Negotiate</p>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Owner is open to price negotiations</p>
            </div>
          </label>

          <label className="flex items-center gap-3.5 p-4 rounded-xl border border-[#E5D8B3] bg-[#FCFBF8] cursor-pointer hover:bg-[#FFFDF9] transition-all">
            <input
              type="checkbox"
              checked={formData.ownerReadyToMeet || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ownerReadyToMeet: e.target.checked,
                }))
              }
              className="h-5 w-5 rounded text-[#C89B1C] border-[#C89B1C] focus:ring-[#C89B1C] cursor-pointer"
            />
            <div>
              <p className="text-sm font-bold text-gray-800">Ready to Meet Buyer</p>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Owner is available to meet the buyer</p>
            </div>
          </label>
        </div>
      </div>

      {/* Verification */}
      <div className="mt-10 border-t pt-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={20} className="text-[#C89B1C]" />
          <h3 className="text-2xl font-semibold">
            Owner Identity Verification
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">ID Type</label>
            <select
              value={formData.ownerIdType || "Aadhaar Card"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ownerIdType: e.target.value,
                }))
              }
              className="w-full h-14 border rounded-xl px-4 outline-none"
            >
              <option>Aadhaar Card</option>
              <option>PAN Card</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">ID Number</label>
            <input
              value={formData.ownerIdNumber || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ownerIdNumber: e.target.value,
                }))
              }
              placeholder="Enter ID number"
              className="w-full h-14 border rounded-xl px-4 outline-none"
            />
          </div>
        </div>

        {/* Warning Box */}
        <div className="mt-8 rounded-2xl border border-[#F4D56A] bg-[#FFF8E8] p-6">
          <div className="flex gap-4">
            <Shield size={22} className="text-[#D97706] mt-1 shrink-0" />
            <div>
              <h4 className="font-semibold text-[#B45309]">
                Agent Authorization Required
              </h4>
              <p className="mt-2 text-[#B45309] leading-7">
                By proceeding, you confirm that you have written authorization from the property owner to list this property on their behalf. False declarations may result in account suspension.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}