"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Building2,
  ShieldCheck,
  X,
  HelpCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import { useAuth } from "@/src/hooks/useAuth";
import api from "@/src/lib/api";

interface PublisherDetails {
  ownerName: string;
  companyName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAddress: string;
  city: string;
  licenseNumber: string;
}

export default function BulkUploadPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Role Protection Guard
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error("Please sign in as an Agent to access Bulk Upload.");
        router.push("/login");
      } else if (user?.role !== "agent") {
        toast.error("Bulk Property Upload is available exclusively for Agent accounts.");
        router.push("/my-properties");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Step 1: Publisher Details State
  const [publisher, setPublisher] = useState<PublisherDetails>({
    ownerName: "",
    companyName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerAddress: "",
    city: "",
    licenseNumber: "",
  });

  const [publisherErrors, setPublisherErrors] = useState<Record<string, string>>({});

  // Auto pre-fill publisher details from logged-in agent profile
  useEffect(() => {
    if (user) {
      setPublisher((prev) => ({
        ...prev,
        ownerName: prev.ownerName || user.fullName || (user as any).name || "",
        companyName: prev.companyName || (user as any).agencyName || (user as any).companyName || "",
        ownerPhone: prev.ownerPhone || user.phone || "",
        ownerEmail: prev.ownerEmail || user.email || "",
        ownerAddress: prev.ownerAddress || (user as any).officeAddress || (user as any).address || "",
        city: prev.city || (user as any).city || "",
        licenseNumber: prev.licenseNumber || (user as any).licenseNumber || (user as any).reraId || "",
      }));
    }
  }, [user]);

  // Step 2: File & Validation States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectingCount, setDetectingCount] = useState<number | null>(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [validationResult, setValidationResult] = useState<{
    totalProperties: number;
    eligibleCount: number;
    invalidCount: number;
    eligibleProperties: any[];
    invalidProperties: any[];
  } | null>(null);

  const [publishSummary, setPublishSummary] = useState<{
    publishedCount: number;
    failedCount: number;
  } | null>(null);

  const handlePublisherChange = (field: keyof PublisherDetails, value: string) => {
    setPublisher((prev) => ({ ...prev, [field]: value }));
    if (publisherErrors[field]) {
      setPublisherErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validatePublisherDetails = () => {
    const errs: Record<string, string> = {};
    if (!publisher.ownerName.trim()) errs.ownerName = "Publisher / Agent Name is required.";
    if (!publisher.ownerPhone.trim()) {
      errs.ownerPhone = "Contact Phone Number is required.";
    } else if (!/^\d{10}$/.test(publisher.ownerPhone.trim())) {
      errs.ownerPhone = "Phone Number must be exactly 10 digits.";
    }
    if (!publisher.ownerEmail.trim()) {
      errs.ownerEmail = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(publisher.ownerEmail.trim())) {
      errs.ownerEmail = "Please enter a valid email address.";
    }
    if (!publisher.ownerAddress.trim()) errs.ownerAddress = "Office / Residential Address is required.";
    if (!publisher.city.trim()) errs.city = "City is required.";

    setPublisherErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1Next = () => {
    if (validatePublisherDetails()) {
      setStep(2);
    } else {
      toast.error("Please fill in all required Publisher Details.");
    }
  };

  // Download Standard Template
  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get("/properties/bulk-upload/template", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "EstateGold_Bulk_Property_Template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Bulk Upload Template downloaded!");
    } catch (err) {
      console.error("Failed to download template:", err);
      toast.error("Failed to download template file.");
    }
  };

  // File Select Handler
  const handleFileSelect = (file: File) => {
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".csv")) {
      toast.error("Unsupported file format! Please upload an Excel (.xlsx) or CSV (.csv) file.");
      return;
    }

    setSelectedFile(file);
    setValidationResult(null);

    // Quick estimation of property rows
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === "string") {
          const lines = text.split("\n").filter((l) => l.trim().length > 0);
          const count = Math.max(0, lines.length - 1);
          setDetectingCount(count);
        } else {
          setDetectingCount(null);
        }
      } catch {
        setDetectingCount(null);
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setDetectingCount(null);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate File Endpoint
  const handleValidateProperties = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to validate.");
      return;
    }

    try {
      setValidating(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("publisherDetails", JSON.stringify(publisher));

      const response = await api.post("/properties/bulk-upload/validate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setValidationResult({
          totalProperties: response.data.totalProperties,
          eligibleCount: response.data.eligibleCount,
          invalidCount: response.data.invalidCount,
          eligibleProperties: response.data.eligibleProperties || [],
          invalidProperties: response.data.invalidProperties || [],
        });
        toast.success(`Validation complete: ${response.data.eligibleCount} eligible, ${response.data.invalidCount} need attention.`);
      }
    } catch (error: any) {
      console.error("Bulk validation error:", error);
      const data = error.response?.data;
      if (data?.isMinPropertyViolation) {
        toast.error(data.message || "Bulk upload requires at least 2 properties.");
      } else {
        toast.error(data?.message || "Failed to validate property upload file.");
      }
    } finally {
      setValidating(false);
    }
  };

  // Download Error Report
  const handleDownloadErrorReport = async () => {
    if (!validationResult || validationResult.invalidProperties.length === 0) return;
    try {
      const response = await api.post(
        "/properties/bulk-upload/error-report",
        { invalidProperties: validationResult.invalidProperties },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "EstateGold_Bulk_Upload_Error_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Error report downloaded!");
    } catch (err) {
      console.error("Failed to download error report:", err);
      toast.error("Failed to download error report.");
    }
  };

  // Publish Eligible Properties Endpoint
  const handleConfirmPublish = async () => {
    if (!validationResult || validationResult.eligibleProperties.length === 0) return;

    try {
      setSubmitting(true);
      const response = await api.post("/properties/bulk-upload/publish", {
        eligibleProperties: validationResult.eligibleProperties,
        publisherDetails: publisher,
      });

      if (response.data.success) {
        setPublishSummary({
          publishedCount: response.data.publishedCount,
          failedCount: response.data.failedCount,
        });
        setShowConfirmModal(false);
        setStep(3);
        toast.success(`Successfully published ${response.data.publishedCount} properties!`);
      }
    } catch (error: any) {
      console.error("Bulk publish error:", error);
      toast.error(error.response?.data?.message || "Failed to publish bulk properties.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated || user?.role !== "agent") {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FAFAFA] font-sans">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
          
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Bulk Property Upload
                </h1>
                <span className="px-3 py-1 rounded-full bg-[#9A720C]/10 text-[#9A720C] border border-[#9A720C]/20 text-xs font-bold uppercase tracking-wider">
                  Agent Portal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Upload multiple property listings simultaneously via Excel or CSV file
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/my-properties")}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all w-fit cursor-pointer"
            >
              Back to My Properties
            </button>
          </div>

          {/* Wizard Progress Stepper */}
          <div className="bg-white border border-[#ECE7DB] rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-8 shadow-xs">
            <div className="flex items-center justify-between max-w-xl mx-auto relative">
              {/* Stepper Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-[#9A720C] -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
              />

              {/* Step 1 Circle */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= 1
                      ? "bg-[#9A720C] text-white shadow-xs"
                      : "bg-gray-100 border border-gray-300 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className={`text-xs font-bold ${step >= 1 ? "text-gray-900" : "text-gray-400"}`}>
                  Publisher Details
                </span>
              </div>

              {/* Step 2 Circle */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= 2
                      ? "bg-[#9A720C] text-white shadow-xs"
                      : "bg-gray-100 border border-gray-300 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className={`text-xs font-bold ${step >= 2 ? "text-gray-900" : "text-gray-400"}`}>
                  Upload Properties
                </span>
              </div>

              {/* Step 3 Circle */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === 3
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-100 border border-gray-300 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className={`text-xs font-bold ${step === 3 ? "text-emerald-700" : "text-gray-400"}`}>
                  Published Result
                </span>
              </div>
            </div>
          </div>

          {/* STEP 1: PUBLISHER DETAILS */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#ECE7DB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl mx-auto"
            >
              <div className="border-b border-[#ECE7DB] pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 size={20} className="text-[#C89B1C]" /> Publisher / Agency Details
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Specify publisher contact details associated with this bulk property upload. Pre-filled from your Agent profile.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {/* Agent Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Publisher / Agent Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={publisher.ownerName}
                    onChange={(e) => handlePublisherChange("ownerName", e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 focus:border-[#9A720C] text-xs sm:text-sm outline-none bg-white text-gray-900"
                  />
                  {publisherErrors.ownerName && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">{publisherErrors.ownerName}</p>
                  )}
                </div>

                {/* Company / Agency Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Agency / Company Name
                  </label>
                  <input
                    type="text"
                    value={publisher.companyName}
                    onChange={(e) => handlePublisherChange("companyName", e.target.value)}
                    placeholder="e.g. ABC Realty Pvt Ltd"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 focus:border-[#9A720C] text-xs sm:text-sm outline-none bg-white text-gray-900"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Contact Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={publisher.ownerPhone}
                    onChange={(e) => handlePublisherChange("ownerPhone", e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit Mobile Number"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 focus:border-[#9A720C] text-xs sm:text-sm outline-none bg-white text-gray-900"
                  />
                  {publisherErrors.ownerPhone && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">{publisherErrors.ownerPhone}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Publisher Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={publisher.ownerEmail}
                    onChange={(e) => handlePublisherChange("ownerEmail", e.target.value)}
                    placeholder="agent@example.com"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 focus:border-[#9A720C] text-xs sm:text-sm outline-none bg-white text-gray-900"
                  />
                  {publisherErrors.ownerEmail && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">{publisherErrors.ownerEmail}</p>
                  )}
                </div>

                {/* Office / Residential Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Office / Business Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={publisher.ownerAddress}
                    onChange={(e) => handlePublisherChange("ownerAddress", e.target.value)}
                    placeholder="Full street address of agency or agent office"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 focus:border-[#9A720C] text-xs sm:text-sm outline-none bg-white text-gray-900"
                  />
                  {publisherErrors.ownerAddress && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">{publisherErrors.ownerAddress}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={publisher.city}
                    onChange={(e) => handlePublisherChange("city", e.target.value)}
                    placeholder="e.g. Coimbatore"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 focus:border-[#9A720C] text-xs sm:text-sm outline-none bg-white text-gray-900"
                  />
                  {publisherErrors.city && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">{publisherErrors.city}</p>
                  )}
                </div>

                {/* License / RERA ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    RERA / Agent License No. (Optional)
                  </label>
                  <input
                    type="text"
                    value={publisher.licenseNumber}
                    onChange={(e) => handlePublisherChange("licenseNumber", e.target.value)}
                    placeholder="e.g. TN/Agent/2026/001"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 focus:border-[#9A720C] text-xs sm:text-sm outline-none bg-white text-gray-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 border-t border-[#ECE7DB]">
                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
                >
                  <span>Next: Upload Properties</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: RULES + FILE UPLOAD + VALIDATION */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Guidelines Section */}
              <div className="bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EC] to-[#FAF5E6] border border-[#E5D8B3] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE2C4] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-[#FFF5D6] border border-[#E8DCC1] flex items-center justify-center text-[#9A720C] shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                        Bulk Property Upload Guidelines
                      </h2>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">
                        Please review these business rules before uploading your file
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-5 py-2.5 bg-white border border-[#D8B56A] hover:bg-[#FFF9EC] text-[#9A720C] text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Download size={15} /> Download Excel Template
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
                  <div className="bg-white/80 border border-[#ECE2C8] p-4 rounded-xl space-y-1">
                    <strong className="font-bold text-gray-900 block">1. Supported File Formats</strong>
                    <p className="text-gray-600">Excel (<strong>.xlsx</strong>) and CSV (<strong>.csv</strong>) files are supported.</p>
                  </div>

                  <div className="bg-white/80 border border-[#ECE2C8] p-4 rounded-xl space-y-1">
                    <strong className="font-bold text-gray-900 block">2. Minimum 2 Properties Required</strong>
                    <p className="text-gray-600">Bulk upload is strictly for multiple properties. Files with only 1 property will be rejected.</p>
                  </div>

                  <div className="bg-white/80 border border-[#ECE2C8] p-4 rounded-xl space-y-1">
                    <strong className="font-bold text-gray-900 block">3. Mandatory Fields</strong>
                    <p className="text-gray-600">All properties require <em>Purpose, Property Type, State, City, Locality, Address, and Price</em>.</p>
                  </div>

                  <div className="bg-white/80 border border-[#ECE2C8] p-4 rounded-xl space-y-1">
                    <strong className="font-bold text-gray-900 block">4. Property-Type Specific Rules</strong>
                    <p className="text-gray-600">Residential listings require <em>Bedrooms, Bathrooms, Carpet/Built-up Area, Furnishing & Facing</em>. Plots require <em>Plot Area</em>.</p>
                  </div>

                  <div className="bg-white/80 border border-[#ECE2C8] p-4 rounded-xl space-y-1">
                    <strong className="font-bold text-gray-900 block">5. Rent / Lease Agreement Terms</strong>
                    <p className="text-gray-600">Rent & Lease listings require <em>Agreement Type, Security Deposit, and Agreement Duration</em>.</p>
                  </div>

                  <div className="bg-white/80 border border-[#ECE2C8] p-4 rounded-xl space-y-1">
                    <strong className="font-bold text-gray-900 block">6. Partial Publishing Supported</strong>
                    <p className="text-gray-600">Valid properties can be published immediately. Invalid properties are separated with detailed error reports.</p>
                  </div>

                  <div className="bg-white/80 border border-[#ECE2C8] p-4 rounded-xl space-y-1 col-span-1 md:col-span-2">
                    <strong className="font-bold text-gray-900 block">7. Mandatory Property Owner Details</strong>
                    <p className="text-gray-600">Every property row must include <em>Owner Name, 10-digit Owner Phone, Owner Email, and Owner Address</em>. (Note: Buyers will contact you as the publishing Agent directly, but legal owner details are required for property publishing verification).</p>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="bg-white border border-[#ECE7DB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-5">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E5D8B3] hover:border-[#C89B1C] bg-[#FFFDF8] hover:bg-[#FFF9EC] rounded-2xl p-8 sm:p-12 transition-all cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="h-14 w-14 rounded-2xl bg-[#FFF5D6] border border-[#E8DCC1] flex items-center justify-center text-[#9A720C] shadow-2xs">
                    <Upload size={28} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                      Drag & Drop your Excel / CSV file here
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports .xlsx and .csv files containing 2 or more property rows
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-5 py-2 bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white text-xs font-bold rounded-xl shadow-2xs hover:opacity-95 transition-all cursor-pointer"
                  >
                    Browse File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {/* Selected File Details Bar */}
                {selectedFile && (
                  <div className="bg-[#FFFDF6] border border-[#E8DCC1] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet size={24} className="text-[#9A720C] shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 break-all">{selectedFile.name}</h4>
                        <p className="text-xs text-gray-500 font-medium">
                          {(selectedFile.size / 1024).toFixed(1)} KB{" "}
                          {detectingCount !== null ? `• Estimated ${detectingCount} property rows detected` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>

                      <button
                        type="button"
                        onClick={handleValidateProperties}
                        disabled={validating}
                        className="px-6 py-2 bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        {validating ? (
                          <>
                            <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Validating...
                          </>
                        ) : (
                          <>
                            <FileCheck size={16} /> Validate Properties
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* VALIDATION RESULTS SECTION */}
              {validationResult && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-[#ECE7DB] rounded-2xl p-5 shadow-xs text-center space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Uploaded</span>
                      <p className="text-3xl font-extrabold text-gray-900">{validationResult.totalProperties}</p>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-xs text-center space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Eligible (Ready)</span>
                      <p className="text-3xl font-extrabold text-emerald-700">{validationResult.eligibleCount}</p>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 shadow-xs text-center space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Need Attention</span>
                      <p className="text-3xl font-extrabold text-amber-800">{validationResult.invalidCount}</p>
                    </div>
                  </div>

                  {/* ELIGIBLE PROPERTIES TABLE */}
                  {validationResult.eligibleCount > 0 && (
                    <div className="bg-white border border-[#ECE7DB] rounded-2xl sm:rounded-3xl p-6 shadow-xs space-y-4 text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE7DB] pb-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-emerald-600" /> Ready to Publish ({validationResult.eligibleCount})
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            These properties have passed all validation checks and can be published immediately.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowConfirmModal(true)}
                          className="px-6 py-2.5 bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-2 shrink-0"
                        >
                          <FileCheck size={16} /> Publish {validationResult.eligibleCount} Properties
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                              <th className="py-3 px-4">Row #</th>
                              <th className="py-3 px-4">Property Title</th>
                              <th className="py-3 px-4">Type</th>
                              <th className="py-3 px-4">Purpose</th>
                              <th className="py-3 px-4">Location</th>
                              <th className="py-3 px-4">Price</th>
                              <th className="py-3 px-4 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                            {validationResult.eligibleProperties.map((prop, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/70">
                                <td className="py-3 px-4 font-bold text-gray-500">{prop.rowNumber}</td>
                                <td className="py-3 px-4 font-bold text-gray-900">{prop.title}</td>
                                <td className="py-3 px-4">{prop.propertyType}</td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[#9A720C] border border-amber-200 text-[10px] font-bold uppercase">
                                    {prop.purpose}
                                  </span>
                                </td>
                                <td className="py-3 px-4">{prop.locality}, {prop.city}</td>
                                <td className="py-3 px-4 font-extrabold text-[#9A720C]">₹{prop.price.toLocaleString("en-IN")}</td>
                                <td className="py-3 px-4 text-right">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                    ✓ Ready
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* INVALID PROPERTIES TABLE */}
                  {validationResult.invalidCount > 0 && (
                    <div className="bg-white border border-[#ECE7DB] rounded-2xl sm:rounded-3xl p-6 shadow-xs space-y-4 text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE7DB] pb-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-amber-600" /> Properties Requiring Attention ({validationResult.invalidCount})
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            Please fix these errors in your file and re-upload to publish them.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleDownloadErrorReport}
                          className="px-5 py-2.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                        >
                          <Download size={15} /> Download Error Report
                        </button>
                      </div>

                      <div className="space-y-3">
                        {validationResult.invalidProperties.map((inv, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-200/60 text-amber-900 text-[10px] font-bold">
                                  Row #{inv.rowNumber}
                                </span>
                                <h4 className="font-extrabold text-sm text-gray-900">{inv.title}</h4>
                                <span className="text-xs font-semibold text-gray-500">({inv.propertyType})</span>
                              </div>
                              <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 w-fit">
                                ✕ Cannot Publish
                              </span>
                            </div>

                            <div className="text-xs text-gray-700 space-y-1">
                              <p className="font-bold text-red-700">Missing / Invalid Fields:</p>
                              <ul className="list-disc list-inside text-gray-800 font-medium pl-1">
                                {inv.errorDetails.map((errStr: string, eIdx: number) => (
                                  <li key={eIdx}>{errStr}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation Back Button */}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <ArrowLeft size={16} /> Back to Publisher Details
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: PUBLISH RESULT */}
          {step === 3 && publishSummary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-[#ECE7DB] rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-xs text-center space-y-6 max-w-2xl mx-auto"
            >
              <div className="h-20 w-20 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 size={40} />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  🎉 Bulk Upload Completed
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                  Your properties have been processed and submitted for listing verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Successfully Published</span>
                  <p className="text-2xl font-extrabold text-emerald-700">{publishSummary.publishedCount}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-500">Failed</span>
                  <p className="text-2xl font-extrabold text-gray-800">{publishSummary.failedCount}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Needs Attention</span>
                  <p className="text-2xl font-extrabold text-amber-800">
                    {validationResult ? validationResult.invalidCount : 0}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/my-properties")}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white font-bold text-xs sm:text-sm shadow-2xs hover:opacity-95 transition-all cursor-pointer"
                >
                  View My Properties
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setValidationResult(null);
                    setPublishSummary(null);
                    setStep(2);
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#D8B56A] text-[#9A720C] hover:bg-[#FFF9EC] font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Upload Another File
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* CONFIRMATION PUBLISH MODAL */}
      {showConfirmModal && validationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E5D7B3] p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <FileCheck size={20} className="text-[#C89B1C]" /> Confirm Bulk Publishing
              </h3>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
              Are you sure you want to publish these <strong>{validationResult.eligibleCount} eligible properties</strong>?
              They will be submitted into EstateGold under your Agent account.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmPublish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white text-xs font-bold shadow-2xs hover:opacity-95 cursor-pointer flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Confirm & Publish"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
