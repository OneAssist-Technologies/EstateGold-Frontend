"use client";

import React, { useMemo } from "react";
import { AlertCircle, Plus, Trash2, Calendar, DollarSign, FileText } from "lucide-react";
import { PropertyFormData, PendingIssue } from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

export default function PendingIssuesStep({ formData, setFormData }: Props) {
  const propertyType = formData.propertyType || "Apartment / Flat";

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
        <h2 className="text-2xl font-bold font-serif text-gray-900 leading-tight">
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
                    className="w-full h-12 px-4 rounded-xl border border-[#E5D8B3] outline-none text-sm font-bold text-gray-700 bg-white focus:border-[#C89B1C] cursor-pointer"
                  >
                    <option value="">Select Issue Type</option>
                    {issueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
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
                    className="w-full h-12 px-4 rounded-xl border border-[#E5D8B3] outline-none text-sm font-semibold text-gray-800 focus:border-[#C89B1C] bg-[#FFFDF9]/30"
                  />
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
                  className="w-full p-4 rounded-xl border border-[#E5D8B3] outline-none text-sm font-semibold text-gray-800 focus:border-[#C89B1C] bg-[#FFFDF9]/30 resize-none"
                />
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
                    <FileText size={14} className="text-gray-400" /> Supporting Doc File Name / Info
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. loan_statement.pdf (uploaded manually)"
                    value={issue.supportingDocument || ""}
                    onChange={(e) => handleIssueChange(idx, "supportingDocument", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[#E5D8B3] outline-none text-sm font-semibold text-gray-800 focus:border-[#C89B1C] bg-[#FFFDF9]/30"
                  />
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
