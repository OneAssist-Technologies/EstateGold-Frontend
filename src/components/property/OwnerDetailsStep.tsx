"use client";

import {
  Building2,
  Mail,
  Phone,
  Shield,
  User,
  FileText,
  Lock,
  CheckCircle,
} from "lucide-react";

import { PropertyFormData } from "../../types/property";
import { useAuth } from "@/src/context/AuthContext";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<PropertyFormData>
  >;
  errors?: Record<string, string>;
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
  errors,
}: Props) {
  const { user } = useAuth();
  const isAnotherOwner = formData.listingType === "another_owner";
  const ownerType = formData.ownerType || "Individual Owner";

  const getVerificationLabels = () => {
    switch (ownerType) {
      case "Company / Firm":
        return {
          title: "Company / Firm Verification",
          idTypeLabel: "Registration Document Type",
          idNumberLabel: "Registration / CIN / GSTIN Number",
          idNumberPlaceholder: "Enter registration/CIN/GSTIN number",
          options: ["GSTIN", "CIN / Registration Number", "Partnership Deed"],
          defaultOption: "GSTIN",
        };
      case "NRI Owner":
        return {
          title: "NRI Identity Verification",
          idTypeLabel: "NRI Identification Document Type",
          idNumberLabel: "Passport / Visa Number",
          idNumberPlaceholder: "Enter Passport or Visa number",
          options: ["Passport", "Visa"],
          defaultOption: "Passport",
        };
      case "Individual Owner":
      default:
        return {
          title: "Owner Identity Verification",
          idTypeLabel: "Government ID Type",
          idNumberLabel: "Government ID Number",
          idNumberPlaceholder: "Enter 12-digit Aadhaar or PAN number",
          options: ["Aadhaar Card", "PAN Card"],
          defaultOption: "Aadhaar Card",
        };
    }
  };

  const vLabels = getVerificationLabels();

  const renderDynamicFields = () => {
    switch (ownerType) {
      case "Company / Firm":
        return (
          <>
            {/* Company Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Company / Firm Name <span className="text-red-500">*</span>
              </label>
              <div className="relative font-sans">
                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerName: e.target.value,
                    }))
                  }
                  placeholder="Legal Name of the Company / Firm"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerName ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerName && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerName}</p>
              )}
            </div>

            {/* Representative Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Authorized Representative Name <span className="text-red-500">*</span>
              </label>
              <div className="relative font-sans">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.ownerGovtIdDoc || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerGovtIdDoc: e.target.value,
                    }))
                  }
                  placeholder="Full Name of Signatory / Representative"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerGovtIdDoc ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerGovtIdDoc && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerGovtIdDoc}</p>
              )}
            </div>

            {/* Representative Phone */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Representative Mobile <span className="text-red-500">*</span>
              </label>
              <div className="relative font-sans">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                  placeholder="10-digit primary contact number"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerPhone ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerPhone && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerPhone}</p>
              )}
            </div>

            {/* Company Email */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Company / Rep Email Address</label>
              <div className="relative font-sans">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerEmail: e.target.value,
                    }))
                  }
                  placeholder="company@email.com"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerEmail ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerEmail && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerEmail}</p>
              )}
            </div>

            {/* Company Registered Office Address */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Company Registered Office Address <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.ownerAddress || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ownerAddress: e.target.value,
                  }))
                }
                placeholder="Complete office street address, building/suite, city, state and pincode"
                className={`w-full h-14 border rounded-xl px-4 outline-none focus:border-[#C89B1C] transition-colors ${
                  errors?.ownerAddress ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                }`}
              />
              {errors?.ownerAddress && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerAddress}</p>
              )}
            </div>
          </>
        );

      case "NRI Owner":
        return (
          <>
            {/* NRI Owner Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                NRI Owner Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative font-sans">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerName: e.target.value,
                    }))
                  }
                  placeholder="Full Name (as per Passport)"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerName ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerName && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerName}</p>
              )}
            </div>

            {/* Country of Residence */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Current Country of Residence <span className="text-red-500">*</span>
              </label>
              <div className="relative font-sans">
                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.pan || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pan: e.target.value,
                    }))
                  }
                  placeholder="e.g. United States, United Kingdom"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.pan ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.pan && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.pan}</p>
              )}
            </div>

            {/* Local Indian Contact Representative Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Local Contact Person in India <span className="text-red-500">*</span>
              </label>
              <div className="relative font-sans">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.ownerGovtIdDoc || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerGovtIdDoc: e.target.value,
                    }))
                  }
                  placeholder="Indian Contact Representative Name"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerGovtIdDoc ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerGovtIdDoc && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerGovtIdDoc}</p>
              )}
            </div>

            {/* Local Contact Phone */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Local Contact Mobile <span className="text-red-500">*</span>
              </label>
              <div className="relative font-sans">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                  placeholder="10-digit Indian mobile number"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerPhone ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerPhone && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerPhone}</p>
              )}
            </div>

            {/* Owner Email Address */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">Owner Email Address</label>
              <div className="relative font-sans">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerEmail: e.target.value,
                    }))
                  }
                  placeholder="nri.owner@email.com"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerEmail ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerEmail && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerEmail}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Owner Residential / Indian Address <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.ownerAddress || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ownerAddress: e.target.value,
                  }))
                }
                placeholder="Complete overseas address or permanent local address in India"
                className={`w-full h-14 border rounded-xl px-4 outline-none focus:border-[#C89B1C] transition-colors ${
                  errors?.ownerAddress ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                }`}
              />
              {errors?.ownerAddress && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerAddress}</p>
              )}
            </div>
          </>
        );

      case "Individual Owner":
      default:
        return (
          <>
            {/* Owner Name */}
            <div className={isAnotherOwner ? "" : "md:col-span-2"}>
              <label className="block mb-2 font-medium text-gray-700">
                Owner Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative font-sans">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerName: e.target.value,
                    }))
                  }
                  placeholder="As per government ID"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerName ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerName && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerName}</p>
              )}
            </div>

            {/* Relation */}
            {isAnotherOwner && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">
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
                  className={`w-full h-14 border rounded-xl px-4 outline-none focus:border-[#C89B1C] transition-colors bg-white ${
                    errors?.agentRelation ? "border-red-500 focus:border-red-500" : "border-gray-300"
                  }`}
                >
                  <option>Authorized Agent</option>
                  <option>Property Manager</option>
                  <option>Broker</option>
                  <option>Family Representative</option>
                </select>
                {errors?.agentRelation && (
                  <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.agentRelation}</p>
                )}
              </div>
            )}

            {/* Mobile */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Owner Mobile <span className="text-red-500">*</span>
              </label>
              <div className="relative font-sans">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerPhone ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerPhone && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerPhone}</p>
              )}
            </div>

            {/* Alternate Mobile */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Alternate Mobile</label>
              <div className="relative font-sans">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.alternatePhone || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData((prev) => ({
                      ...prev,
                      alternatePhone: val,
                    }));
                  }}
                  placeholder="Optional alternate number"
                  className="w-full h-14 border border-gray-300 rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">Owner Email Address</label>
              <div className="relative font-sans">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ownerEmail: e.target.value,
                    }))
                  }
                  placeholder="owner@email.com"
                  className={`w-full h-14 border rounded-xl pl-12 pr-4 outline-none focus:border-[#C89B1C] transition-colors ${
                    errors?.ownerEmail ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors?.ownerEmail && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerEmail}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
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
                className={`w-full h-14 border rounded-xl px-4 outline-none focus:border-[#C89B1C] transition-colors ${
                  errors?.ownerAddress ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
                }`}
              />
              {errors?.ownerAddress && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerAddress}</p>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-4xl font-bold text-[#161616] font-serif leading-tight">
        Property Owner Details
      </h2>

      <p className="mt-3 text-lg text-[#6B7280]">
        {isAnotherOwner
          ? "As an agent listing on behalf of another owner, please provide verified owner information."
          : "Verify your personal owner contact details for this property listing."}
      </p>

      {/* Owner Type */}
      <div className="mt-10">
        <label className="block text-xl font-semibold mb-4 text-gray-800">
          Owner Type
        </label>

        <div className="grid md:grid-cols-3 gap-5">
          {ownerTypes.map((item) => {
            const Icon = item.icon;
            const selected = ownerType === item.value;

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
                  cursor-pointer
                  hover:shadow-xs
                  ${
                    selected
                      ? "border-[#C89B1C] bg-[#FFF8E8] shadow-2xs"
                      : "border-[#E5D8B3] bg-white hover:border-[#C89B1C]"
                  }
                `}
              >
                <div className="h-12 w-12 rounded-xl bg-[#F8F3E7] flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#C89B1C]" />
                </div>

                <h3 className="text-lg font-bold text-gray-800">{item.value}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-5 font-semibold">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {renderDynamicFields()}

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
      <div className="mt-12 border-t pt-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={20} className="text-[#C89B1C]" />
          <h3 className="text-2xl font-bold text-gray-900">
            {vLabels.title}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">{vLabels.idTypeLabel}</label>
            <select
              value={formData.ownerIdType || vLabels.defaultOption}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ownerIdType: e.target.value,
                }))
              }
              className={`w-full h-14 border rounded-xl px-4 outline-none focus:border-[#C89B1C] transition-colors bg-white ${
                errors?.ownerIdType ? "border-red-500 focus:border-red-500" : "border-gray-300"
              }`}
            >
              {vLabels.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors?.ownerIdType && (
              <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerIdType}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">{vLabels.idNumberLabel}</label>
            <input
              value={formData.ownerIdNumber || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ownerIdNumber: e.target.value,
                }))
              }
              placeholder={vLabels.idNumberPlaceholder}
              className={`w-full h-14 border rounded-xl px-4 outline-none focus:border-[#C89B1C] transition-colors ${
                errors?.ownerIdNumber ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors?.ownerIdNumber && (
              <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.ownerIdNumber}</p>
            )}
          </div>
        </div>

        {/* Warning Box */}
        <div className="mt-8 rounded-2xl border border-[#F4D56A] bg-[#FFF8E8] p-6">
          <div className="flex gap-4">
            <Shield size={22} className="text-[#D97706] mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-[#B45309]">
                Verification Declaration
              </h4>
              <p className="mt-2 text-[#B45309] leading-7 font-medium text-sm">
                By proceeding, you confirm that you have valid, legally verifiable documents belonging to the owner type selected above to authorize this listing. False declarations may result in account suspension.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent / Lister Details Card (Shown if listing on behalf of another owner) */}
      {isAnotherOwner && (
        <div className="mt-12 border-t pt-8 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-[#C89B1C]" />
            <h3 className="text-2xl font-bold text-gray-900">
              Agent / Lister Details
            </h3>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Your verified agent profile details that will be linked to this listing.
          </p>

          <div className="grid md:grid-cols-2 gap-6 bg-[#FCFBF8] border border-[#E5D8B3] rounded-2xl p-6">
            {/* Agent Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                Agent Full Name <Lock size={14} className="text-gray-400" />
              </label>
              <input
                disabled
                value={user?.fullName || "Verified Agent"}
                className="w-full h-14 border border-gray-200 rounded-xl px-4 outline-none bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
              />
            </div>

            {/* Agent Phone */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                Agent Phone <Lock size={14} className="text-gray-400" />
              </label>
              <input
                disabled
                value={user?.phone || ""}
                className="w-full h-14 border border-gray-200 rounded-xl px-4 outline-none bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
              />
            </div>

            {/* Agency Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                Agency Name <Lock size={14} className="text-gray-400" />
              </label>
              <input
                disabled
                value={user?.agencyName || "Independent Broker"}
                className="w-full h-14 border border-gray-200 rounded-xl px-4 outline-none bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
              />
            </div>

            {/* RERA Number */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                RERA Registration Number <Lock size={14} className="text-gray-400" />
              </label>
              <input
                disabled
                value={user?.reraNumber || "Not Provided"}
                className="w-full h-14 border border-gray-200 rounded-xl px-4 outline-none bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>
          {(!user?.reraNumber || !user?.agencyName) && (
            <p className="text-xs text-amber-600 font-semibold italic">
              * Note: To update your Agency Name or RERA number, please visit your Profile Settings.
            </p>
          )}
        </div>
      )}
    </div>
  );
}