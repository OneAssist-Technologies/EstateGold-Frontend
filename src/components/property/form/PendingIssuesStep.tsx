"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, Plus, Trash2, Calendar, DollarSign, FileText, Upload, CheckCircle, Loader2 } from "lucide-react";
import api from "../../../lib/api";
import { PropertyFormData, PendingIssue } from "../../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

export default function PendingIssuesStep({ formData, setFormData, errors }: Props) {
  const propertyType = formData.propertyType || "Apartment / Flat";
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict file type validation (Only allow documents or images, no plain text)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/webp"
    ];
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];

    if (!allowedTypes.includes(fileType) && !allowedExtensions.includes(fileExtension || "")) {
      setUploadError("Strict validation: Only document files (PDF, DOC, DOCX) or images (JPG, JPEG, PNG, WEBP) are allowed.");
      e.target.value = "";
      return;
    }

    setUploadingIdx(index);
    setUploadError(null);

    const uploadData = new FormData();
    uploadData.append("document", file);

    try {
      const res = await api.post("/upload-document", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        handleIssueChange(index, "supportingDocument", res.data.fileUrl);
      } else {
        setUploadError("Failed to upload document.");
      }
    } catch (err: any) {
      console.error("Document upload error:", err);
      setUploadError(err.response?.data?.message || "Error uploading document.");
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleRemoveDocument = (index: number) => {
    handleIssueChange(index, "supportingDocument", "");
  };

  const getFileName = (url: string) => {
    if (!url) return "";
    return url.split("/").pop() || "supporting_document";
  };

  // Determine dynamic issue types based on category
  const issueTypes = useMemo(() => {
    const isLand = ["Plot / Land", "Residential Plot", "Agricultural Land"].includes(propertyType);
    const isCommercial = [
      "Commercial Space", "Office Space", "Shop / Retail", "Warehouse",
      "Industrial Property", "Hotel / Resort", "PG / Hostel", "Builder / New Project"
    ].includes(propertyType);

    if (isLand) {
      return [
        "Land / Property Tax Dues",
        "Land Loan",
        "Mortgage / Encumbrance",
        "Legal / Court Case",
        "Title Dispute",
        "Boundary Dispute",
        "Encroachment",
        "Layout Approval Issue",
        "Land-use / Conversion Issue",
        "Government / Revenue Issue",
        "Road / Access Dispute",
        "Other Liability"
      ];
    }

    if (isCommercial) {
      return [
        "Loan",
        "Tax Dues",
        "Maintenance Dues",
        "Utility Dues",
        "Legal / Court Case",
        "Title Dispute",
        "Mortgage / Lien",
        "Builder / Developer Dues",
        "Approval Issue",
        "Commercial-use Approval",
        "Fire / Safety Issue",
        "Environmental / Pollution Compliance",
        "Industrial Zoning",
        "Business / Local Licence issue",
        "Tenant / Lease Dispute",
        "Other Liability"
      ];
    }

    // Default Residential (Apartment/House/Villa/Builder Floor)
    return [
      "Home / Property Loan",
      "Property Tax Dues",
      "Maintenance / Society Dues",
      "Electricity / Water Dues",
      "Builder Dues",
      "Legal / Court Case",
      "Title Dispute",
      "Mortgage / Lien",
      "Occupancy / Completion Issue",
      "Tenant Dispute",
      "Other Liability"
    ];
  }, [propertyType]);

  const hasIssuesValue = formData.pendingIssues?.hasPendingIssues || "no";

  const handleSelection = (selection: "yes" | "no" | "not_sure") => {
    setFormData((prev) => ({
      ...prev,
      pendingIssues: {
        hasPendingIssues: selection,
        issues: selection === "yes" ? (prev.pendingIssues?.issues?.length ? prev.pendingIssues.issues : [createEmptyIssue()]) : [],
      },
    }));
  };

  const createEmptyIssue = (): PendingIssue => ({
    type: "",
    amount: 0,
    description: "",
    expectedResolutionDate: "",
    supportingDocument: "",
  });

  const handleAddIssue = () => {
    setFormData((prev) => {
      const currentIssues = prev.pendingIssues?.issues || [];
      return {
        ...prev,
        pendingIssues: {
          hasPendingIssues: "yes",
          issues: [...currentIssues, createEmptyIssue()],
        },
      };
    });
  };

  const handleRemoveIssue = (index: number) => {
    setFormData((prev) => {
      const currentIssues = [...(prev.pendingIssues?.issues || [])];
      currentIssues.splice(index, 1);
      return {
        ...prev,
        pendingIssues: {
          hasPendingIssues: "yes",
          issues: currentIssues,
        },
      };
    });
  };

  const handleIssueChange = (index: number, key: keyof PendingIssue, value: any) => {
    setFormData((prev) => {
      const currentIssues = [...(prev.pendingIssues?.issues || [])];
      currentIssues[index] = {
        ...currentIssues[index],
        [key]: value,
      };
      return {
        ...prev,
        pendingIssues: {
          hasPendingIssues: "yes",
          issues: currentIssues,
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          Pending Issues & Liabilities
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          Declare any outstanding dues, encumbrances, or disputes linked to this property
        </p>
      </div>

      <div className="bg-[#FFFDF9]/40 border border-[#E5D8B3] rounded-2xl p-5 shadow-2xs">
        <label className="text-sm font-bold text-gray-800 block mb-4">
          Does this property have any pending dues, loans, legal disputes, approval issues, or other liabilities?
        </label>

        <div className="grid grid-cols-3 gap-3">
          {(["no", "yes", "not_sure"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelection(opt)}
              className={`h-12 rounded-xl border font-bold text-sm transition-all cursor-pointer capitalize ${
                hasIssuesValue === opt
                  ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C] shadow-2xs"
                  : "border-[#E6DCC2] bg-white hover:border-[#C89B1C] text-gray-700"
              }`}
            >
              {opt === "not_sure" ? "Not Sure" : opt}
            </button>
          ))}
        </div>
      </div>

      {errors?.issuesCount && (
        <p className="text-red-500 text-sm font-semibold mb-4 bg-red-50 p-3 rounded-xl border border-red-200">
          ⚠️ {errors.issuesCount}
        </p>
      )}
      {hasIssuesValue === "yes" && (
        <div className="space-y-6">
          {(formData.pendingIssues?.issues || []).map((issue, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-[#E5D8B3] rounded-2xl p-5 shadow-2xs space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#C89B1C]">
                  Issue #{idx + 1}
                </span>
                {(formData.pendingIssues?.issues || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIssue(idx)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Issue Type */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <AlertCircle size={14} className="text-gray-400" /> Issue Type *
                  </label>
                  <select
                    value={issue.type || ""}
                    onChange={(e) => handleIssueChange(idx, "type", e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border outline-none text-sm font-bold text-gray-700 bg-white focus:border-[#C89B1C] cursor-pointer ${
                      errors?.[`issues.${idx}.type`] ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-[#E5D8B3]"
                    }`}
                  >
                    <option value="">Select Issue Type</option>
                    {issueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors?.[`issues.${idx}.type`] && (
                    <p className="text-red-500 text-[10px] font-semibold mt-1 pl-1">{errors[`issues.${idx}.type`]}</p>
                  )}
                </div>

                {/* Pending Amount */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <DollarSign size={14} className="text-gray-400" /> Pending Amount (INR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={issue.amount || ""}
                    onChange={(e) => handleIssueChange(idx, "amount", Number(e.target.value))}
                    className={`w-full h-12 px-4 rounded-xl border outline-none text-sm font-semibold text-gray-800 focus:border-[#C89B1C] bg-[#FFFDF9]/30 ${
                      errors?.[`issues.${idx}.amount`] ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-[#E5D8B3]"
                    }`}
                  />
                  {errors?.[`issues.${idx}.amount`] && (
                    <p className="text-red-500 text-[10px] font-semibold mt-1 pl-1">{errors[`issues.${idx}.amount`]}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-1.5 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <FileText size={14} className="text-gray-400" /> Description *
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail the pending issue, lender name, status, or any other description..."
                  value={issue.description || ""}
                  onChange={(e) => handleIssueChange(idx, "description", e.target.value)}
                  className={`w-full p-4 rounded-xl border outline-none text-sm font-semibold text-gray-800 focus:border-[#C89B1C] bg-[#FFFDF9]/30 resize-none ${
                    errors?.[`issues.${idx}.description`] ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-[#E5D8B3]"
                  }`}
                />
                {errors?.[`issues.${idx}.description`] && (
                  <p className="text-red-500 text-[10px] font-semibold mt-1 pl-1">{errors[`issues.${idx}.description`]}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expected Resolution Date */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <Calendar size={14} className="text-gray-400" /> Expected Resolution Date
                  </label>
                  <input
                    type="date"
                    value={issue.expectedResolutionDate ? issue.expectedResolutionDate.split("T")[0] : ""}
                    onChange={(e) => handleIssueChange(idx, "expectedResolutionDate", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[#E5D8B3] outline-none text-sm font-semibold text-gray-800 focus:border-[#C89B1C] bg-[#FFFDF9]/30"
                  />
                </div>

                {/* Supporting Document */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <FileText size={14} className="text-gray-400" /> Supporting Document / Image
                  </label>
                  {uploadingIdx === idx ? (
                    <div className="flex items-center gap-2 h-12 px-4 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-500">
                      <Loader2 size={16} className="animate-spin text-[#C89B1C]" />
                      Uploading file...
                    </div>
                  ) : issue.supportingDocument ? (
                    <div className="flex items-center justify-between h-12 px-4 border border-[#E5D8B3] bg-[#FFFDF6] rounded-xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle size={16} className="text-green-600 shrink-0" />
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {getFileName(issue.supportingDocument)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="flex items-center justify-center gap-2 h-12 border border-[#C89B1C] hover:bg-[#FFFBF0] rounded-xl text-[#C89B1C] text-xs font-bold transition-all duration-300 cursor-pointer">
                        <Upload size={14} />
                        Upload Document / Image
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                          className="hidden"
                          onChange={(e) => handleDocumentUpload(e, idx)}
                        />
                      </label>
                    </div>
                  )}
                  {uploadError && uploadingIdx === null && (
                    <p className="text-red-500 text-[10px] font-semibold mt-1 pl-1">
                      ⚠️ {uploadError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddIssue}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-[#C89B1C] text-[#C89B1C] hover:bg-[#FFFBF0] transition-colors font-bold text-xs cursor-pointer"
          >
            <Plus size={16} /> Add Another Pending Issue
          </button>
        </div>
      )}
    </div>
  );
}
