"use client";

import React, { useMemo, useState } from "react";
import { Upload, CheckCircle, FileText, Trash2, Loader2, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { PropertyFormData, DocumentItem } from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

interface DocRequirement {
  documentType: string;
  displayName: string;
  required: boolean;
  applicable: boolean;
}

export default function DocumentsStep({ formData, setFormData, errors }: Props) {
  const propertyType = formData.propertyType || "Apartment / Flat";
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Return dynamic document requirements based on property type
  const docRequirements = useMemo((): DocRequirement[] => {
    switch (propertyType) {
      case "Apartment / Flat":
        return [
          { documentType: "sale_deed", displayName: "Sale Deed", required: true, applicable: true },
          { documentType: "parent_deeds", displayName: "Parent / Previous Title Documents", required: true, applicable: true },
          { documentType: "encumbrance_certificate", displayName: "Encumbrance Certificate", required: true, applicable: true },
          { documentType: "tax_receipt", displayName: "Property Tax Receipt", required: false, applicable: true },
          { documentType: "building_plan", displayName: "Approved Building Plan", required: false, applicable: true },
          { documentType: "completion_occupancy", displayName: "Completion / Occupancy Certificate", required: false, applicable: true },
          { documentType: "society_documents", displayName: "Apartment / Society Documents", required: false, applicable: true },
          { documentType: "possession_allotment", displayName: "Possession / Allotment Document", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner KYC / ID", required: true, applicable: true },
        ];

      case "Independent House":
        return [
          { documentType: "sale_deed", displayName: "Sale Deed", required: true, applicable: true },
          { documentType: "parent_deeds", displayName: "Parent / Title Documents", required: true, applicable: true },
          { documentType: "encumbrance_certificate", displayName: "Encumbrance Certificate", required: true, applicable: true },
          { documentType: "tax_receipt", displayName: "Property Tax Receipt", required: false, applicable: true },
          { documentType: "building_plan", displayName: "Approved Building Plan", required: false, applicable: true },
          { documentType: "building_approval", displayName: "Building Approval", required: false, applicable: true },
          { documentType: "completion_occupancy", displayName: "Completion / Occupancy Documents", required: false, applicable: true },
          { documentType: "survey_sketch", displayName: "Survey / Sketch", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner KYC", required: true, applicable: true },
        ];

      case "Villa":
        return [
          { documentType: "sale_deed", displayName: "Sale Deed", required: true, applicable: true },
          { documentType: "parent_deeds", displayName: "Parent / Title Documents", required: true, applicable: true },
          { documentType: "encumbrance_certificate", displayName: "Encumbrance Certificate", required: true, applicable: true },
          { documentType: "tax_receipt", displayName: "Property Tax Receipt", required: false, applicable: true },
          { documentType: "approved_layout", displayName: "Approved Layout", required: false, applicable: true },
          { documentType: "building_plan", displayName: "Building Plan", required: false, applicable: true },
          { documentType: "completion_occupancy", displayName: "Completion / Occupancy Documents", required: false, applicable: true },
          { documentType: "association_docs", displayName: "Association Documents", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner KYC", required: true, applicable: true },
        ];

      case "Builder Floor":
        return [
          { documentType: "sale_deed", displayName: "Sale Deed", required: true, applicable: true },
          { documentType: "parent_deeds", displayName: "Parent Documents", required: true, applicable: true },
          { documentType: "encumbrance_certificate", displayName: "Encumbrance Certificate", required: true, applicable: true },
          { documentType: "building_plan", displayName: "Approved Building Plan", required: false, applicable: true },
          { documentType: "building_approval", displayName: "Building Approval", required: false, applicable: true },
          { documentType: "tax_receipt", displayName: "Property Tax Receipt", required: false, applicable: true },
          { documentType: "completion_occupancy", displayName: "Completion / Occupancy Documents", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner KYC", required: true, applicable: true },
        ];

      case "Plot / Land":
      case "Residential Plot":
        return [
          { documentType: "sale_deed", displayName: "Sale Deed", required: true, applicable: true },
          { documentType: "parent_deeds", displayName: "Parent Documents", required: true, applicable: true },
          { documentType: "encumbrance_certificate", displayName: "Encumbrance Certificate", required: true, applicable: true },
          { documentType: "patta_records", displayName: "Patta / Revenue Records", required: true, applicable: true },
          { documentType: "survey_sketch", displayName: "Survey Sketch", required: false, applicable: true },
          { documentType: "layout_approval", displayName: "Layout Approval", required: false, applicable: true },
          { documentType: "zoning_documents", displayName: "Land-use / Zoning Documents", required: false, applicable: true },
          { documentType: "tax_receipt", displayName: "Land / Property Tax Receipt", required: false, applicable: true },
          { documentType: "conversion_approval", displayName: "Conversion Approval", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner KYC", required: true, applicable: true },
        ];

      case "Agricultural Land":
        return [
          { documentType: "sale_deed", displayName: "Sale Deed", required: true, applicable: true },
          { documentType: "parent_deeds", displayName: "Parent Documents", required: true, applicable: true },
          { documentType: "encumbrance_certificate", displayName: "Encumbrance Certificate", required: true, applicable: true },
          { documentType: "patta_records", displayName: "Patta / Revenue Records", required: true, applicable: true },
          { documentType: "land_records", displayName: "Applicable Land Records", required: false, applicable: true },
          { documentType: "survey_sketch", displayName: "Survey Sketch", required: false, applicable: true },
          { documentType: "tax_receipt", displayName: "Land Tax Receipt", required: false, applicable: true },
          { documentType: "conversion_documents", displayName: "Land-use / Conversion Documents", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner KYC", required: true, applicable: true },
        ];

      case "Commercial Space":
      case "Office Space":
      case "Shop / Retail":
        return [
          { documentType: "sale_deed", displayName: "Sale Deed / Title Document", required: true, applicable: true },
          { documentType: "encumbrance_certificate", displayName: "Encumbrance Certificate", required: true, applicable: true },
          { documentType: "tax_receipt", displayName: "Property Tax Receipt", required: false, applicable: true },
          { documentType: "building_plan", displayName: "Approved Building Plan", required: false, applicable: true },
          { documentType: "completion_occupancy", displayName: "Completion / Occupancy Documents", required: false, applicable: true },
          { documentType: "commercial_approval", displayName: "Commercial-use Approval", required: false, applicable: true },
          { documentType: "fire_safety", displayName: "Fire / Safety Documents", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner KYC", required: true, applicable: true },
        ];

      case "Warehouse":
      case "Industrial Property":
        return [
          { documentType: "sale_deed", displayName: "Title Deed", required: true, applicable: true },
          { documentType: "encumbrance_certificate", displayName: "Encumbrance Certificate", required: true, applicable: true },
          { documentType: "tax_receipt", displayName: "Property Tax Receipt", required: false, applicable: true },
          { documentType: "building_plan", displayName: "Approved Building Plan", required: false, applicable: true },
          { documentType: "zoning_documents", displayName: "Land-use / Zoning Documents", required: false, applicable: true },
          { documentType: "building_approval", displayName: "Building Approval", required: false, applicable: true },
          { documentType: "fire_safety", displayName: "Fire / Safety Approvals", required: false, applicable: true },
          { documentType: "environmental_approval", displayName: "Environmental Approvals", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner / Company KYC", required: true, applicable: true },
        ];

      case "Hotel / Resort":
        return [
          { documentType: "sale_deed", displayName: "Title Deed", required: true, applicable: true },
          { documentType: "encumbrance_certificate", displayName: "Encumbrance Certificate", required: true, applicable: true },
          { documentType: "building_plan", displayName: "Approved Building Plan", required: false, applicable: true },
          { documentType: "completion_occupancy", displayName: "Completion / Occupancy Documents", required: false, applicable: true },
          { documentType: "tax_receipt", displayName: "Property Tax Receipt", required: false, applicable: true },
          { documentType: "fire_safety", displayName: "Fire / Safety Approvals", required: true, applicable: true },
          { documentType: "business_licences", displayName: "Business / Trade Licences", required: true, applicable: true },
          { documentType: "statutory_licences", displayName: "Relevant Statutory Licences", required: false, applicable: true },
          { documentType: "environmental_approval", displayName: "Environmental Approvals", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner / Company KYC", required: true, applicable: true },
        ];

      case "PG / Hostel":
        return [
          { documentType: "lease_document", displayName: "Ownership / Lease Document", required: true, applicable: true },
          { documentType: "tax_receipt", displayName: "Property Tax Records", required: false, applicable: true },
          { documentType: "local_permissions", displayName: "Applicable Local Permissions", required: true, applicable: true },
          { documentType: "pg_permissions", displayName: "Hostel / PG Permissions", required: false, applicable: true },
          { documentType: "fire_safety", displayName: "Fire / Safety Documents", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner / Operator KYC", required: true, applicable: true },
        ];

      case "Builder / New Project":
        return [
          { documentType: "rera_details", displayName: "RERA Registration / Details", required: true, applicable: true },
          { documentType: "sale_deed", displayName: "Land / Title Documents", required: true, applicable: true },
          { documentType: "building_plan", displayName: "Approved Building Plan", required: false, applicable: true },
          { documentType: "layout_approval", displayName: "Layout Approval", required: false, applicable: true },
          { documentType: "commencement_certificate", displayName: "Commencement / Building Approvals", required: true, applicable: true },
          { documentType: "environmental_approval", displayName: "Environmental Approvals", required: false, applicable: true },
          { documentType: "fire_safety", displayName: "Fire / Safety Approvals", required: false, applicable: true },
          { documentType: "statutory_approvals", displayName: "Project Statutory Approvals", required: false, applicable: true },
          { documentType: "owner_kyc", displayName: "Developer / Company KYC", required: true, applicable: true },
        ];

      default:
        return [
          { documentType: "sale_deed", displayName: "Sale Deed", required: true, applicable: true },
          { documentType: "owner_kyc", displayName: "Owner KYC", required: true, applicable: true },
        ];
    }
  }, [propertyType]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict file type validation (Only allow documents or images, no plain text)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "image/jpeg",
      "image/png",
      "image/webp"
    ];
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];

    if (!allowedTypes.includes(fileType) && !allowedExtensions.includes(fileExtension || "")) {
      setErrorMsg("Strict validation: Only document files (PDF, DOC, DOCX) or images (JPG, JPEG, PNG, WEBP) are allowed.");
      e.target.value = "";
      return;
    }

    setUploadingDocType(docType);
    setErrorMsg(null);

    const uploadData = new FormData();
    uploadData.append("document", file);

    try {
      const res = await api.post("/upload-document", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const newDocItem: DocumentItem = {
          documentType: docType,
          fileUrl: res.data.fileUrl,
          fileName: res.data.fileName,
          uploadedAt: new Date().toISOString(),
          verificationStatus: "Uploaded",
        };

        setFormData((prev) => {
          const currentDocs = prev.documents || [];
          const isMultiple = docType === "owner_kyc";
          const filteredDocs = isMultiple
            ? currentDocs
            : currentDocs.filter((d) => d.documentType !== docType);
          return {
            ...prev,
            documents: [...filteredDocs, newDocItem],
          };
        });
      } else {
        setErrorMsg("Failed to upload document.");
      }
    } catch (err: any) {
      console.error("Document upload error:", err);
      setErrorMsg(err.response?.data?.message || "Error uploading document.");
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleRemoveDoc = (docType: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: (prev.documents || []).filter((d) => d.documentType !== docType),
    }));
  };

  const handleRemoveSpecificDoc = (docType: string, fileUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: (prev.documents || []).filter(
        (d) => !(d.documentType === docType && d.fileUrl === fileUrl)
      ),
    }));
  };

  const getUploadedDocs = (docType: string) => {
    return (formData.documents || []).filter((d) => d.documentType === docType);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-serif text-gray-900 leading-tight">
          Document Collection
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          Upload required ownership and legal verification certificates for review
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold">
          <AlertCircle size={18} />
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        {docRequirements.map((req) => {
          const uploadedList = getUploadedDocs(req.documentType);
          const hasUploaded = uploadedList.length > 0;
          const isUploading = uploadingDocType === req.documentType;

          const docError = errors?.[req.documentType];
          return (
            <div
              key={req.documentType}
              className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs transition-all duration-300 hover:shadow-xs ${
                docError ? "border-red-500 bg-red-50/5" : "border-[#E5D8B3]"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    {req.displayName}
                  </h3>
                  {req.required ? (
                    <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  ) : (
                    <span className="bg-gray-50 text-gray-500 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                {docError && (
                  <p className="text-red-500 text-[10px] font-semibold mt-1">
                    ⚠️ {docError}
                  </p>
                )}
                {hasUploaded ? (
                  <div className="space-y-1.5 mt-2">
                    {uploadedList.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <FileText size={14} className="text-[#C89B1C]" />
                        <span className="line-clamp-1 max-w-xs">{doc.fileName}</span>
                        {req.documentType === "owner_kyc" && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecificDoc(req.documentType, doc.fileUrl)}
                            className="text-red-500 hover:text-red-700 ml-2 transition-colors cursor-pointer text-sm font-bold leading-none"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">No file uploaded yet</p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
                {isUploading ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <Loader2 size={16} className="animate-spin text-[#C89B1C]" />
                    Uploading...
                  </div>
                ) : (
                  <>
                    {hasUploaded && (
                      <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <CheckCircle size={14} /> Uploaded ({uploadedList.length})
                      </span>
                    )}

                    {(req.documentType === "owner_kyc" || !hasUploaded) && (
                      <label className="h-10 px-4 bg-white hover:bg-[#FFFBF0] border border-[#C89B1C] rounded-xl flex items-center gap-2 text-[#C89B1C] text-xs font-bold transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-xs">
                        <Upload size={14} />
                        Upload {req.documentType === "owner_kyc" && hasUploaded ? "Another File" : "Document"}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, req.documentType)}
                        />
                      </label>
                    )}

                    {hasUploaded && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(req.documentType)}
                        className="h-10 px-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-center text-red-600 transition-colors cursor-pointer text-xs font-bold gap-1"
                        title="Clear all uploaded documents"
                      >
                        <Trash2 size={14} /> {req.documentType === "owner_kyc" ? "Clear All" : ""}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
