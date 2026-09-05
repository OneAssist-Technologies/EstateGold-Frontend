"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Building2, User, MapPin, FileText, Loader2, Sparkles } from "lucide-react";
import api from "@/src/lib/api";
import { Property } from "@/src/types/property";
import { formatIndianCurrency } from "@/src/utils/emiCalculator";

interface Props {
  open: boolean;
  onClose: () => void;
  property?: Property | null;
  loanAmount?: number;
  interestRate?: number;
  tenureYears?: number;
  calculatedEmi?: number;
  initialUserName?: string;
  initialUserPhone?: string;
}

export default function LoanEnquiryModal({
  open,
  onClose,
  property,
  loanAmount,
  interestRate,
  tenureYears,
  calculatedEmi,
  initialUserName = "",
  initialUserPhone = "",
}: Props) {
  // Pre-fill names if provided
  const nameParts = initialUserName.trim().split(" ");
  const defaultFirstName = nameParts[0] || "";
  const defaultLastName = nameParts.slice(1).join(" ") || "";

  // 1. Personal Details Form State
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [mobileNumber, setMobileNumber] = useState(initialUserPhone.replace(/\D/g, "").slice(0, 10));
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Male");
  const [dependents, setDependents] = useState("0");
  const [educationalQualification, setEducationalQualification] = useState("Graduate");

  // 2. Present Address Form State
  const [presentAddressLine1, setPresentAddressLine1] = useState("");
  const [presentAddressLine2, setPresentAddressLine2] = useState("");
  const [presentCity, setPresentCity] = useState(property?.city || "");
  const [presentState, setPresentState] = useState(property?.state || "");
  const [presentPincode, setPresentPincode] = useState((property as any)?.pincode || "");
  const [presentCountry, setPresentCountry] = useState("India");

  // 3. Permanent Address Form State
  const [sameAsPresentAddress, setSameAsPresentAddress] = useState(true);
  const [permanentAddressLine1, setPermanentAddressLine1] = useState("");
  const [permanentAddressLine2, setPermanentAddressLine2] = useState("");
  const [permanentCity, setPermanentCity] = useState("");
  const [permanentState, setPermanentState] = useState("");
  const [permanentPincode, setPermanentPincode] = useState("");
  const [permanentCountry, setPermanentCountry] = useState("India");

  // 4. Remarks & UX States
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");

  // Sync initial user details when modal opens
  useEffect(() => {
    if (open) {
      if (initialUserName) {
        const parts = initialUserName.trim().split(" ");
        if (!firstName) setFirstName(parts[0] || "");
        if (!lastName) setLastName(parts.slice(1).join(" ") || "");
      }
      if (initialUserPhone && !mobileNumber) {
        setMobileNumber(initialUserPhone.replace(/\D/g, "").slice(0, 10));
      }
    }
  }, [open, initialUserName, initialUserPhone]);

  if (!open) return null;

  // Real-time Field Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!firstName.trim()) errs.firstName = "First Name is required.";
    if (!lastName.trim()) errs.lastName = "Last Name is required.";

    const cleanMobile = mobileNumber.replace(/\D/g, "");
    if (!cleanMobile) {
      errs.mobileNumber = "Mobile Number is required.";
    } else if (cleanMobile.length !== 10) {
      errs.mobileNumber = "Mobile Number must be exactly 10 digits.";
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    if (!dateOfBirth) errs.dateOfBirth = "Date of Birth is required.";
    if (!gender) errs.gender = "Gender selection is required.";
    if (!educationalQualification) errs.educationalQualification = "Educational Qualification is required.";

    if (!presentAddressLine1.trim()) errs.presentAddressLine1 = "Present Address Line 1 is required.";
    if (!presentCity.trim()) errs.presentCity = "Present City is required.";
    if (!presentState.trim()) errs.presentState = "Present State is required.";

    const cleanPresentPin = presentPincode.replace(/\D/g, "");
    if (!cleanPresentPin) {
      errs.presentPincode = "Present Pincode is required.";
    } else if (cleanPresentPin.length !== 6) {
      errs.presentPincode = "Pincode must be exactly 6 digits.";
    }

    if (!presentCountry.trim()) errs.presentCountry = "Present Country is required.";

    // Validate Permanent Address if Same as Present is NO
    if (!sameAsPresentAddress) {
      if (!permanentAddressLine1.trim()) errs.permanentAddressLine1 = "Permanent Address Line 1 is required.";
      if (!permanentCity.trim()) errs.permanentCity = "Permanent City is required.";
      if (!permanentState.trim()) errs.permanentState = "Permanent State is required.";

      const cleanPermPin = permanentPincode.replace(/\D/g, "");
      if (!cleanPermPin) {
        errs.permanentPincode = "Permanent Pincode is required.";
      } else if (cleanPermPin.length !== 6) {
        errs.permanentPincode = "Pincode must be exactly 6 digits.";
      }

      if (!permanentCountry.trim()) errs.permanentCountry = "Permanent Country is required.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const propertyTitle = property
        ? `${property.bedrooms ? `${property.bedrooms} BHK ` : ""}${property.propertyType} in ${property.locality || property.city || "Listing"}`
        : "";

      const payload = {
        // Personal Details
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNumber: mobileNumber.replace(/\D/g, ""),
        email: email.trim(),
        dateOfBirth,
        gender,
        dependents: parseInt(dependents, 10) || 0,
        educationalQualification,

        // Present Address
        presentAddressLine1: presentAddressLine1.trim(),
        presentAddressLine2: presentAddressLine2.trim(),
        presentCity: presentCity.trim(),
        presentState: presentState.trim(),
        presentPincode: presentPincode.replace(/\D/g, ""),
        presentCountry: presentCountry.trim(),

        // Permanent Address
        sameAsPresentAddress,
        permanentAddressLine1: sameAsPresentAddress ? presentAddressLine1.trim() : permanentAddressLine1.trim(),
        permanentAddressLine2: sameAsPresentAddress ? presentAddressLine2.trim() : permanentAddressLine2.trim(),
        permanentCity: sameAsPresentAddress ? presentCity.trim() : permanentCity.trim(),
        permanentState: sameAsPresentAddress ? presentState.trim() : permanentState.trim(),
        permanentPincode: sameAsPresentAddress ? presentPincode.replace(/\D/g, "") : permanentPincode.replace(/\D/g, ""),
        permanentCountry: sameAsPresentAddress ? presentCountry.trim() : permanentCountry.trim(),

        // Additional Information & Context
        remarks: remarks.trim(),

        // Property & Loan Context
        propertyId: property?._id || "",
        propertyTitle,
        propertyPrice: property?.price || "",
        loanAmount: loanAmount || "",
        interestRate: interestRate || "",
        tenureYears: tenureYears || "",
        emi: calculatedEmi || "",
      };

      const response = await api.post("/loan-enquiries", payload);

      if (response.data.success) {
        setSubmitted(true);
      } else {
        setApiError(response.data.message || "Unable to submit your enquiry right now. Please try again.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Unable to submit your enquiry right now. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setApiError("");
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-[#ECE7DB] rounded-[28px] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1C1A14] via-[#2D281E] to-[#12110D] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#9A720C]/20 border border-[#9A720C]/40 flex items-center justify-center text-[#D4B04C]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                EstateGold Home Loan Enquiry
              </h2>
              <p className="text-xs text-amber-200/80">
                Submit applicant details for instant bank partner eligibility assessment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success View */}
        {submitted ? (
          <div className="p-8 sm:p-12 flex flex-col items-center text-center space-y-5">
            <div className="h-16 w-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shadow-sm">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-extrabold text-gray-900">
                Loan Enquiry Submitted Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Your loan application details have been submitted securely as an unassigned lead. Our banking specialist team will review your application and contact you shortly.
              </p>
            </div>

            {loanAmount && (
              <div className="p-4 bg-[#FFFDF6] border border-[#E8DCC1] rounded-2xl w-full max-w-sm text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Requested Loan Amount</span>
                <span className="text-lg font-extrabold text-[#9A720C] font-serif block mt-0.5">
                  {formatIndianCurrency(loanAmount)}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white text-xs font-bold hover:opacity-95 transition-all shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Property Context Banner (if available) */}
            {(property || loanAmount) && (
              <div className="p-4 bg-[#FFFDF6] border border-[#E8DCC1] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-gray-900 block">
                    {property?.bedrooms ? `${property.bedrooms} BHK ` : ""}
                    {property?.propertyType || "Property Listing"}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {property?.locality ? `${property.locality}, ` : ""}{property?.city || "Property"}
                  </span>
                </div>
                {loanAmount && (
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Loan Amount</span>
                    <span className="font-extrabold text-[#9A720C] text-sm font-serif">
                      {formatIndianCurrency(loanAmount)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {apiError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* SECTION 1: PERSONAL DETAILS */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                <User size={15} className="text-[#9A720C]" /> 1. Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="Rahul"
                  />
                  {errors.firstName && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.firstName}</span>}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="Gupta"
                  />
                  {errors.lastName && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.lastName}</span>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile Number (10 Digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="9876543210"
                  />
                  {errors.mobileNumber && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.mobileNumber}</span>}
                </div>

                {/* Email ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email ID <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="rahul.gupta@example.com"
                  />
                  {errors.email && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.email}</span>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                  />
                  {errors.dateOfBirth && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.dateOfBirth}</span>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.gender}</span>}
                </div>

                {/* Dependents */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    No. of Dependents <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="0"
                  />
                </div>

                {/* Educational Qualification */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Educational Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={educationalQualification}
                    onChange={(e) => setEducationalQualification(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800 bg-white"
                  >
                    <option value="High School">High School</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Professional Degree">Professional Degree</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.educationalQualification && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.educationalQualification}</span>}
                </div>
              </div>
            </div>

            {/* SECTION 2: PRESENT ADDRESS */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                <MapPin size={15} className="text-[#9A720C]" /> 2. Present Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={presentAddressLine1}
                    onChange={(e) => setPresentAddressLine1(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="Flat / House No., Building Name, Street"
                  />
                  {errors.presentAddressLine1 && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.presentAddressLine1}</span>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={presentAddressLine2}
                    onChange={(e) => setPresentAddressLine2(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="Landmark, Area"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={presentCity}
                    onChange={(e) => setPresentCity(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="Mumbai"
                  />
                  {errors.presentCity && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.presentCity}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={presentState}
                    onChange={(e) => setPresentState(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="Maharashtra"
                  />
                  {errors.presentState && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.presentState}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pincode (6 Digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={presentPincode}
                    onChange={(e) => setPresentPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="400001"
                  />
                  {errors.presentPincode && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.presentPincode}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={presentCountry}
                    onChange={(e) => setPresentCountry(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    placeholder="India"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: PERMANENT ADDRESS */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={15} className="text-[#9A720C]" /> 3. Permanent Address
                </h3>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#9A720C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsPresentAddress}
                    onChange={(e) => setSameAsPresentAddress(e.target.checked)}
                    className="rounded text-[#9A720C] focus:ring-[#9A720C] h-4 w-4"
                  />
                  Same as Present Address?
                </label>
              </div>

              {!sameAsPresentAddress && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Permanent Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={permanentAddressLine1}
                      onChange={(e) => setPermanentAddressLine1(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                      placeholder="Permanent House No. / Street"
                    />
                    {errors.permanentAddressLine1 && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.permanentAddressLine1}</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Permanent Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={permanentAddressLine2}
                      onChange={(e) => setPermanentAddressLine2(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Permanent City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={permanentCity}
                      onChange={(e) => setPermanentCity(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    />
                    {errors.permanentCity && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.permanentCity}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Permanent State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={permanentState}
                      onChange={(e) => setPermanentState(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    />
                    {errors.permanentState && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.permanentState}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Permanent Pincode (6 Digits) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={permanentPincode}
                      onChange={(e) => setPermanentPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    />
                    {errors.permanentPincode && <span className="text-[10px] text-red-500 font-medium mt-0.5 block">{errors.permanentPincode}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Permanent Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={permanentCountry}
                      onChange={(e) => setPermanentCountry(e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none text-gray-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: ADDITIONAL REMARKS */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <FileText size={15} className="text-[#9A720C]" /> 4. Additional Remarks
              </h3>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:border-[#9A720C] outline-none resize-none font-sans text-gray-800"
                placeholder="Mention any specific preferred bank or loan requirement notes..."
              />
            </div>

            {/* Form Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Loan Enquiry</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
