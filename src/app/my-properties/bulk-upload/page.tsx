"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Trash2,
  ArrowRight,
  FolderArchive,
  Image as ImageIcon,
  Building2,
  ShieldCheck,
  X,
  HelpCircle,
  Loader2,
  Info,
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

interface ValidatedProperty {
  propertyNumber: string;
  excelRowIndex: number;
  purpose: string;
  propertyType: string;
  listingType: string;
  title: string;
  description: string;
  ownerName: string;
  ownerPhone: string;
  city: string;
  locality: string;
  address: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  imageFolderFound: boolean;
  imagesCount: number;
  zipImages?: string[];
  errors?: string[];
  pgDetails?: any;
}

interface ValidationSummary {
  totalRows: number;
  readyToPublishCount: number;
  needsFixingCount: number;
  unmappedFoldersCount: number;
  totalZipImagesFound: number;
}

export default function BulkUploadPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Wizard active step (1: Template/Upload, 2: Validate/Review, 3: Publish/Report)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // File Inputs
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [isExcelDragging, setIsExcelDragging] = useState(false);
  const [isZipDragging, setIsZipDragging] = useState(false);

  const excelInputRef = useRef<HTMLInputElement | null>(null);
  const zipInputRef = useRef<HTMLInputElement | null>(null);

  // Drag & drop event handlers for Excel
  const handleExcelDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExcelDragging(true);
  };

  const handleExcelDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExcelDragging(false);
  };

  const handleExcelDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExcelDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleExcelSelect(e.dataTransfer.files[0]);
    }
  };

  // Drag & drop event handlers for ZIP
  const handleZipDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsZipDragging(true);
  };

  const handleZipDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsZipDragging(false);
  };

  const handleZipDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsZipDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleZipSelect(e.dataTransfer.files[0]);
    }
  };

  // Publisher details (Agent info)
  const [publisher, setPublisher] = useState<PublisherDetails>({
    ownerName: "",
    companyName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerAddress: "",
    city: "",
    licenseNumber: "",
  });

  // Pre-fill agent profile details
  useEffect(() => {
    if (user) {
      setPublisher({
        ownerName: user.fullName || (user as any).name || "",
        companyName: (user as any).agencyName || (user as any).companyName || "",
        ownerPhone: user.phone || "",
        ownerEmail: user.email || "",
        ownerAddress: (user as any).officeAddress || (user as any).address || "",
        city: (user as any).city || "",
        licenseNumber: (user as any).licenseNumber || (user as any).reraId || "",
      });
    }
  }, [user]);

  // Auth Guard
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

  // Action States
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [validating, setValidating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Results State
  const [summary, setSummary] = useState<ValidationSummary | null>(null);
  const [readyToPublish, setReadyToPublish] = useState<ValidatedProperty[]>([]);
  const [needsFixing, setNeedsFixing] = useState<ValidatedProperty[]>([]);
  const [unmappedFolders, setUnmappedFolders] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"ready" | "fixing" | "unmapped">("ready");

  // Final Publish Summary
  const [publishReport, setPublishReport] = useState<{
    totalSubmitted: number;
    successfullyPublished: number;
    failedCount: number;
    totalImagesUploaded: number;
    publishedResults: any[];
    failedResults: any[];
  } | null>(null);

  // Handler: Download Official Excel Template
  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
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
      toast.success("EstateGold Official Bulk Upload Template downloaded!");
    } catch (err) {
      console.error("Failed to download template:", err);
      toast.error("Failed to download template file. Please try again.");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  // Handler: Excel File Select
  const handleExcelSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Please upload a valid Excel (.xlsx) file.");
      return;
    }
    setExcelFile(file);
    setSummary(null);
  };

  // Handler: ZIP File Select
  const handleZipSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast.error("Please upload a valid Images ZIP (.zip) file.");
      return;
    }
    setZipFile(file);
    setSummary(null);
  };

  // Handler: Validate Uploaded Files
  const handleValidate = async () => {
    if (!excelFile) {
      toast.error("Please upload your filled Property Excel template (.xlsx) first.");
      return;
    }

    try {
      setValidating(true);
      const formData = new FormData();
      formData.append("excelFile", excelFile);
      if (zipFile) {
        formData.append("zipFile", zipFile);
      }
      formData.append("publisherDetails", JSON.stringify(publisher));

      const res = await api.post("/properties/bulk-upload/validate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        setSummary(res.data.summary);
        setReadyToPublish(res.data.readyToPublish || []);
        setNeedsFixing(res.data.needsFixing || []);
        setUnmappedFolders(res.data.unmappedFolders || []);

        if ((res.data.readyToPublish || []).length > 0) {
          setActiveTab("ready");
        } else if ((res.data.needsFixing || []).length > 0) {
          setActiveTab("fixing");
        } else {
          setActiveTab("unmapped");
        }

        setActiveStep(2);
        toast.success(`Validation Complete! ${res.data.summary.readyToPublishCount} properties ready to publish.`);
      }
    } catch (err: any) {
      console.error("Validation failed:", err);
      const msg = err.response?.data?.message || "Failed to validate upload files.";
      toast.error(msg);
    } finally {
      setValidating(false);
    }
  };

  // Handler: Publish Valid Properties
  const handlePublish = async () => {
    if (readyToPublish.length === 0) {
      toast.error("No valid properties available to publish.");
      return;
    }

    try {
      setPublishing(true);
      const formData = new FormData();
      formData.append("eligibleProperties", JSON.stringify(readyToPublish));
      formData.append("publisherDetails", JSON.stringify(publisher));
      if (zipFile) {
        formData.append("zipFile", zipFile);
      }

      const res = await api.post("/properties/bulk-upload/publish", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        setPublishReport({
          totalSubmitted: res.data.summary.totalSubmitted,
          successfullyPublished: res.data.summary.successfullyPublished,
          failedCount: res.data.summary.failedCount,
          totalImagesUploaded: res.data.summary.totalImagesUploaded,
          publishedResults: res.data.publishedResults || [],
          failedResults: res.data.failedResults || [],
        });
        setActiveStep(3);
        toast.success(`Bulk Publishing Completed! ${res.data.summary.successfullyPublished} properties published.`);
      }
    } catch (err: any) {
      console.error("Publishing failed:", err);
      toast.error(err.response?.data?.message || "Failed to publish bulk properties.");
    } finally {
      setPublishing(false);
    }
  };

  if (authLoading || !isAuthenticated || user?.role !== "agent") {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#9A720C] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FAF9F5] font-sans py-8 sm:py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

          {/* PAGE HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Bulk Property Upload
                </h1>
                <span className="px-3 py-1 rounded-full bg-[#9A720C]/10 text-[#9A720C] border border-[#9A720C]/20 text-xs font-bold uppercase tracking-wider">
                  Excel + ZIP Automation
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Upload multiple property listings simultaneously with automated Property Number image mapping
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/my-properties")}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-white px-4 py-2.5 rounded-xl transition-all w-fit cursor-pointer shadow-2xs"
            >
              Back to My Properties
            </button>
          </div>

          {/* STEPPER PROGRESS HEADER */}
          <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-6 mb-8 shadow-2xs">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center relative">
              {/* Step 1 */}
              <div className={`flex flex-col items-center gap-2 ${activeStep >= 1 ? "text-[#9A720C]" : "text-gray-400"}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${activeStep === 1 ? "bg-[#9A720C] text-white shadow-md" : activeStep > 1 ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {activeStep > 1 ? <CheckCircle2 size={18} /> : "1"}
                </div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">1. Prepare & Upload</span>
              </div>

              {/* Step 2 */}
              <div className={`flex flex-col items-center gap-2 ${activeStep >= 2 ? "text-[#9A720C]" : "text-gray-400"}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${activeStep === 2 ? "bg-[#9A720C] text-white shadow-md" : activeStep > 2 ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {activeStep > 2 ? <CheckCircle2 size={18} /> : "2"}
                </div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">2. Validate & Review</span>
              </div>

              {/* Step 3 */}
              <div className={`flex flex-col items-center gap-2 ${activeStep >= 3 ? "text-[#9A720C]" : "text-gray-400"}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${activeStep === 3 ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-400"}`}>
                  {activeStep === 3 ? <CheckCircle2 size={18} /> : "3"}
                </div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">3. Publish Report</span>
              </div>
            </div>
          </div>

          {/* STEP 1 CONTENT: TEMPLATE & FILE UPLOADS */}
          {activeStep === 1 && (
            <div className="space-y-8">
              {/* CARD 1: DOWNLOAD EXCEL TEMPLATE */}
              <div className="bg-white border border-[#E5D8B3] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF9EC] border border-[#E5D8B3] flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="text-[#C89B1C]" size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">STEP 1: Download Official Excel Template</h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">Pre-populated with Property Numbers and formatted columns</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    disabled={downloadingTemplate}
                    className="bg-[#9A720C] hover:bg-[#856108] text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50 shrink-0"
                  >
                    {downloadingTemplate ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    Download Excel Template
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="bg-[#FAF8F5] border border-[#E5D8B3] p-4 rounded-xl space-y-1">
                    <span className="font-bold text-gray-800 block">✓ Property Number Key</span>
                    <span className="text-gray-500">Each row has a system Property Number (1, 2, 3...) that maps automatically to images.</span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E5D8B3] p-4 rounded-xl space-y-1">
                    <span className="font-bold text-gray-800 block">✓ All Property Purposes</span>
                    <span className="text-gray-500">Supports Sale, Rent, Lease, and PG / Co-Living with full field validation.</span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E5D8B3] p-4 rounded-xl space-y-1">
                    <span className="font-bold text-gray-800 block">✓ Sample Data & Instructions</span>
                    <span className="text-gray-500">Includes clear instructions sheet and sample property rows for guidance.</span>
                  </div>
                </div>
              </div>

              {/* CARD 2 & CARD 3: DUAL FILE UPLOADS (EXCEL + ZIP) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* EXCEL FILE UPLOAD CARD */}
                <div className="bg-white border border-[#E5D8B3] rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF9EC] border border-[#E5D8B3] flex items-center justify-center">
                        <FileSpreadsheet className="text-[#C89B1C]" size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">STEP 2: Upload Property Excel</h3>
                        <p className="text-xs text-gray-500">Upload your completed template (.xlsx)</p>
                      </div>
                    </div>

                    <input
                      ref={excelInputRef}
                      type="file"
                      accept=".xlsx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleExcelSelect(e.target.files[0]);
                        }
                      }}
                    />

                    {excelFile ? (
                      <div className="bg-[#FFF9EC] border border-[#E5D8B3] p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileCheck className="text-green-600 shrink-0" size={24} />
                          <div className="truncate">
                            <p className="text-xs font-bold text-gray-800 truncate">{excelFile.name}</p>
                            <p className="text-[10px] text-gray-500">{(excelFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExcelFile(null)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => excelInputRef.current?.click()}
                        onDragOver={handleExcelDragOver}
                        onDragLeave={handleExcelDragLeave}
                        onDrop={handleExcelDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group ${
                          isExcelDragging
                            ? "border-[#9A720C] bg-[#FFF9EC] scale-[1.02] shadow-md"
                            : "border-[#E5D8B3] hover:border-[#C89B1C] bg-[#FAF8F5] hover:bg-[#FFFDF8]"
                        }`}
                      >
                        <Upload className={`mx-auto text-[#C89B1C] transition-transform ${isExcelDragging ? "scale-125" : "group-hover:scale-110"}`} size={28} />
                        <p className="text-xs sm:text-sm font-bold text-gray-800">
                          {isExcelDragging ? "Drop Excel File Here" : "Drag & drop or Click to upload Excel File (.xlsx)"}
                        </p>
                        <p className="text-[10px] text-gray-400">Supported format: .xlsx</p>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-400 italic pt-2 border-t border-gray-100">
                    * Required for bulk property listing processing.
                  </div>
                </div>

                {/* IMAGES ZIP UPLOAD CARD */}
                <div className="bg-white border border-[#E5D8B3] rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF9EC] border border-[#E5D8B3] flex items-center justify-center">
                        <FolderArchive className="text-[#C89B1C]" size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">STEP 3: Upload Images ZIP</h3>
                        <p className="text-xs text-gray-500">Upload property-wise image folders (.zip)</p>
                      </div>
                    </div>

                    <input
                      ref={zipInputRef}
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleZipSelect(e.target.files[0]);
                        }
                      }}
                    />

                    {zipFile ? (
                      <div className="bg-[#FFF9EC] border border-[#E5D8B3] p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileCheck className="text-green-600 shrink-0" size={24} />
                          <div className="truncate">
                            <p className="text-xs font-bold text-gray-800 truncate">{zipFile.name}</p>
                            <p className="text-[10px] text-gray-500">{(zipFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setZipFile(null)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => zipInputRef.current?.click()}
                        onDragOver={handleZipDragOver}
                        onDragLeave={handleZipDragLeave}
                        onDrop={handleZipDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group ${
                          isZipDragging
                            ? "border-[#9A720C] bg-[#FFF9EC] scale-[1.02] shadow-md"
                            : "border-[#E5D8B3] hover:border-[#C89B1C] bg-[#FAF8F5] hover:bg-[#FFFDF8]"
                        }`}
                      >
                        <FolderArchive className={`mx-auto text-[#C89B1C] transition-transform ${isZipDragging ? "scale-125" : "group-hover:scale-110"}`} size={28} />
                        <p className="text-xs sm:text-sm font-bold text-gray-800">
                          {isZipDragging ? "Drop Images ZIP Here" : "Drag & drop or Click to upload Images ZIP (.zip)"}
                        </p>
                        <p className="text-[10px] text-gray-400">Contains Property 1, Property 2 folders</p>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-400 italic pt-2 border-t border-gray-100">
                    * Automated folder matching via Property Number.
                  </div>
                </div>

              </div>

              {/* VISUAL ZIP STRUCTURE GUIDE */}
              <div className="bg-white border border-[#E5D8B3] rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-[#C89B1C]" />
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">How to Structure Your Images ZIP File</h4>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E5D8B3] p-4 rounded-xl font-mono text-xs text-gray-700 overflow-x-auto leading-relaxed">
                  <p className="font-bold text-[#9A720C] font-sans mb-1">images_archive.zip</p>
                  <p className="pl-4">├── Property 1/ <span className="font-sans text-gray-400">(Contains photos for Property Number 1 in Excel)</span></p>
                  <p className="pl-8">├── photo1.jpg</p>
                  <p className="pl-8">└── photo2.jpg</p>
                  <p className="pl-4">├── Property 2/ <span className="font-sans text-gray-400">(Contains photos for Property Number 2 in Excel)</span></p>
                  <p className="pl-8">├── photo1.jpg</p>
                  <p className="pl-8">└── photo2.jpg</p>
                  <p className="pl-4">└── Property 3/</p>
                </div>
                <p className="text-[11px] text-gray-500">Each property must have its own folder inside the ZIP matching the Property Number in your Excel template.</p>
              </div>

              {/* STEP 4: VALIDATE ACTION BUTTON */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleValidate}
                  disabled={!excelFile || validating}
                  className="w-full sm:w-auto bg-[#9A720C] hover:bg-[#856108] text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {validating ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  Validate Upload Files
                </button>
              </div>

            </div>
          )}

          {/* STEP 2 CONTENT: VALIDATION RESULTS & REVIEW */}
          {activeStep === 2 && summary && (
            <div className="space-y-6">

              {/* SUMMARY STATS HEADER */}
              <div className="bg-white border border-[#E5D8B3] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Validation Results Summary</h2>
                    <p className="text-xs text-gray-500">Total Rows Evaluated: {summary.totalRows} | ZIP Images Found: {summary.totalZipImagesFound}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Re-upload Files
                    </button>

                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={publishing || readyToPublish.length === 0}
                      className="bg-[#9A720C] hover:bg-[#856108] text-white px-6 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {publishing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                      Publish Valid ({readyToPublish.length})
                    </button>
                  </div>
                </div>

                {/* STATS PILLS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("ready")}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${activeTab === "ready" ? "bg-green-50 border-green-500 shadow-2xs" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-green-600" />
                      <span className="text-xs font-bold text-gray-800">Ready to Publish</span>
                    </div>
                    <span className="font-extrabold text-green-700 text-sm bg-green-100 px-2.5 py-0.5 rounded-full">{summary.readyToPublishCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("fixing")}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${activeTab === "fixing" ? "bg-red-50 border-red-500 shadow-2xs" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={18} className="text-red-600" />
                      <span className="text-xs font-bold text-gray-800">Needs Fixing</span>
                    </div>
                    <span className="font-extrabold text-red-700 text-sm bg-red-100 px-2.5 py-0.5 rounded-full">{summary.needsFixingCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("unmapped")}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${activeTab === "unmapped" ? "bg-amber-50 border-amber-500 shadow-2xs" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-center gap-2">
                      <FolderArchive size={18} className="text-amber-600" />
                      <span className="text-xs font-bold text-gray-800">Unmapped ZIP Folders</span>
                    </div>
                    <span className="font-extrabold text-amber-700 text-sm bg-amber-100 px-2.5 py-0.5 rounded-full">{summary.unmappedFoldersCount}</span>
                  </button>
                </div>
              </div>

              {/* TAB CONTENT: READY TO PUBLISH */}
              {activeTab === "ready" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Eligible Properties ({readyToPublish.length})</h3>
                  {readyToPublish.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {readyToPublish.map((prop) => (
                        <div key={prop.propertyNumber} className="bg-white border border-green-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                              Property #{prop.propertyNumber}
                            </span>
                            <span className="text-xs font-bold text-gray-600">{prop.purpose} • {prop.propertyType}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 truncate">{prop.title}</h4>
                            <p className="text-xs text-gray-500">{prop.locality}, {prop.city} — ₹{prop.price.toLocaleString("en-IN")}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                            <span className="text-green-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={14} /> Property Data Valid
                            </span>
                            <span className="font-bold text-[#C89B1C] bg-[#FFF9EC] border border-[#E5D8B3] px-2 py-0.5 rounded-full">
                              {prop.imagesCount} Images Found
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">
                      No properties ready to publish. Please fix errors in the Needs Fixing tab.
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: NEEDS FIXING */}
              {activeTab === "fixing" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider text-red-600">Properties Requiring Attention ({needsFixing.length})</h3>
                  {needsFixing.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {needsFixing.map((prop) => (
                        <div key={prop.propertyNumber} className="bg-white border border-red-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                              Property #{prop.propertyNumber} (Row {prop.excelRowIndex})
                            </span>
                            <span className="text-xs font-bold text-gray-600">{prop.purpose || "N/A"} • {prop.propertyType || "N/A"}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 truncate">{prop.title || "Untitled Property"}</h4>
                            <p className="text-xs text-gray-500">{prop.locality || "Unknown Locality"}, {prop.city || "Unknown City"}</p>
                          </div>
                          <div className="space-y-1 bg-red-50/50 p-2.5 rounded-xl border border-red-100 text-xs text-red-700 font-semibold">
                            {(prop.errors || []).map((err, idx) => (
                              <p key={idx} className="flex items-start gap-1">
                                <span>•</span> <span>{err}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">
                      No errors detected! All properties are ready to publish.
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: UNMAPPED FOLDERS */}
              {activeTab === "unmapped" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider text-amber-600">Unmapped ZIP Folders ({unmappedFolders.length})</h3>
                  {unmappedFolders.length > 0 ? (
                    <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-2xs space-y-3">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold">
                        Warning: The following folders were found inside your Images ZIP archive, but do not match any Property Number in your uploaded Excel template. They will be safely ignored during publishing.
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {unmappedFolders.map((folder, idx) => (
                          <span key={idx} className="text-xs bg-amber-100 border border-amber-300 text-amber-900 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                            <FolderArchive size={14} /> {folder}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">
                      No unmapped ZIP folders found. All image folders matched property rows perfectly!
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* STEP 3 CONTENT: PUBLISH REPORT */}
          {activeStep === 3 && publishReport && (
            <div className="space-y-6">
              <div className="bg-white border border-green-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-green-100 border border-green-300 flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 size={36} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Bulk Property Publishing Completed!</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Your bulk property listings have been created and photos attached</p>
                </div>

                {/* REPORT STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-[#FAF8F5] border border-[#E5D8B3] p-4 rounded-2xl">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Successfully Published</span>
                    <span className="text-2xl font-extrabold text-green-600">{publishReport.successfullyPublished}</span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#E5D8B3] p-4 rounded-2xl">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Images Uploaded & Attached</span>
                    <span className="text-2xl font-extrabold text-[#C89B1C]">{publishReport.totalImagesUploaded}</span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#E5D8B3] p-4 rounded-2xl">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Failed Properties</span>
                    <span className="text-2xl font-extrabold text-red-600">{publishReport.failedCount}</span>
                  </div>
                </div>

                {/* PUBLISHED LIST */}
                {publishReport.publishedResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Published Property Listings</h3>
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden text-xs sm:text-sm">
                      {publishReport.publishedResults.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-white flex items-center justify-between">
                          <div>
                            <span className="font-bold text-gray-900">Property #{item.propertyNumber}: </span>
                            <span className="text-gray-700">{item.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#C89B1C] bg-[#FFF9EC] border border-[#E5D8B3] px-2.5 py-0.5 rounded-full text-xs">
                              {item.imagesCount} Photos
                            </span>
                            <button
                              type="button"
                              onClick={() => router.push(`/property-detail/${item.propertyId}`)}
                              className="text-xs font-bold text-[#9A720C] hover:underline"
                            >
                              View Listing →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => router.push("/my-properties")}
                    className="w-full sm:w-auto bg-[#9A720C] hover:bg-[#856108] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-md"
                  >
                    Go to My Properties
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExcelFile(null);
                      setZipFile(null);
                      setSummary(null);
                      setPublishReport(null);
                      setActiveStep(1);
                    }}
                    className="w-full sm:w-auto border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
                  >
                    Upload Another Batch
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}
