"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Lightbulb, CheckCircle2, ChevronRight, Camera, Edit3, MapPin, Building, Shield, CircleDollarSign, FileText } from "lucide-react";
import { PropertyFormData } from "../../../types/property";
import { aiApi } from "../../../services/ai.service";

interface RecommendationItem {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
  actionLabel: string;
  stepId: string;
}

interface EyvaTipsResponse {
  summary: string;
  recommendations: RecommendationItem[];
  finalRecommendation: string;
}

interface EyvaPropertyTipsProps {
  formData: PropertyFormData;
  onEditStep?: (stepId: string) => void;
}

// Client-side fallback rule engine in case backend API is offline or slow
const runClientSideRules = (p: PropertyFormData): EyvaTipsResponse => {
  const recommendations: RecommendationItem[] = [];

  const isResidential = ["Apartment / Flat", "Independent House", "Villa", "Builder Floor"].includes(p.propertyType);
  const isPlot = ["Plot / Land", "Residential Plot", "Agricultural Land"].includes(p.propertyType);
  const isPg = p.purpose === "PG / Co-Living" || p.purpose === "PG_CO_LIVING";

  // 1. Documents Evaluation (Essential & Optional Documents) - Omitted for PG / Co-Living
  if (!isPg) {
    const uploadedDocs = p.documents || [];
    const uploadedDocTypes = (Array.isArray(uploadedDocs) ? uploadedDocs : [])
      .map((d: any) => (typeof d === "string" ? d : d?.documentType))
      .filter(Boolean);

    const missingReqDocs: string[] = [];
    const missingOptDocs: string[] = [];

    if (!uploadedDocTypes.includes("sale_deed") && !uploadedDocTypes.includes("parent_deeds")) {
      missingReqDocs.push("Sale / Title Deed");
    }
    if (!uploadedDocTypes.includes("encumbrance_certificate")) {
      missingReqDocs.push("Encumbrance Certificate (EC)");
    }
    if (!uploadedDocTypes.includes("owner_kyc")) {
      missingReqDocs.push("Owner KYC Proof");
    }
    if (isPlot && !uploadedDocTypes.includes("patta_records")) {
      missingReqDocs.push("Patta / Revenue Records");
    }

    if (!uploadedDocTypes.includes("tax_receipt")) {
      missingOptDocs.push("Property Tax Receipt");
    }
    if (isResidential && !uploadedDocTypes.includes("building_plan") && !uploadedDocTypes.includes("approved_layout")) {
      missingOptDocs.push("Approved Building Plan");
    }
    if (isResidential && !uploadedDocTypes.includes("completion_occupancy")) {
      missingOptDocs.push("Completion / Occupancy Certificate");
    }
    if (isPlot && !uploadedDocTypes.includes("zoning_documents") && !uploadedDocTypes.includes("layout_approval")) {
      missingOptDocs.push("Land-use / Zoning Approval");
    }

    if (missingReqDocs.length > 0) {
      recommendations.push({
        id: "documents_required",
        category: "documents",
        icon: "documents",
        title: "Upload Verification Documents",
        description: `Essential ownership documents (${missingReqDocs.join(", ")}) are missing. Uploading these accelerates listing verification and buyer confidence.`,
        priority: "high",
        actionLabel: "Upload Documents",
        stepId: "documents",
      });
    } else if (missingOptDocs.length > 0) {
      recommendations.push({
        id: "documents_optional",
        category: "documents",
        icon: "documents",
        title: "Add Optional Property Documents",
        description: `Adding optional documents like ${missingOptDocs.slice(0, 2).join(" or ")} enhances listing transparency and search authority.`,
        priority: "medium",
        actionLabel: "Add Documents",
        stepId: "documents",
      });
    }
  }

  // 2. Missing Property Details Evaluation
  const missingDetails: string[] = [];
  if (isResidential) {
    if (!p.facing) missingDetails.push("Facing Direction");
    if (!p.furnishing) missingDetails.push("Furnishing Status");
    if (!p.propertyAge) missingDetails.push("Property Age");
    if (!p.carpetArea) missingDetails.push("Carpet Area");
    if (!p.totalFloors) missingDetails.push("Total Floors");
  } else if (isPlot) {
    if (!p.facing && !p.plotFacing) missingDetails.push("Plot Facing");
    if (!p.roadWidth) missingDetails.push("Road Width");
    if (p.cornerPlot === undefined || p.cornerPlot === null) missingDetails.push("Corner Plot info");
    if (p.boundaryWall === undefined || p.boundaryWall === null) missingDetails.push("Boundary Wall info");
  } else {
    if (!p.carpetArea) missingDetails.push("Carpet Area");
    if (!p.furnishing) missingDetails.push("Furnishing Status");
    if (!p.facing) missingDetails.push("Facing Direction");
  }

  if (missingDetails.length > 0) {
    recommendations.push({
      id: "details",
      category: "details",
      icon: "details",
      title: "Complete Property Details",
      description: `Your listing is missing details like ${missingDetails.slice(0, 3).join(", ")}. Filling these in gives buyers full clarity and improves search filters.`,
      priority: missingDetails.length >= 3 ? "high" : "medium",
      actionLabel: "Add Details",
      stepId: "details",
    });
  }

  // 3. Photos
  const photoCount = (p.photos || []).length;
  if (photoCount < 4) {
    recommendations.push({
      id: "photos",
      category: "photos",
      icon: "photos",
      title: photoCount === 0 ? "Upload Property Photos" : "Add More Property Photos",
      description:
        photoCount === 0
          ? "Listings with clear photos receive 5x more buyer inquiries. Consider uploading photos of key living areas."
          : `You have uploaded ${photoCount} ${photoCount === 1 ? "photo" : "photos"}. Adding photos of bedrooms, kitchen, and exterior helps buyers visualize the property better.`,
      priority: photoCount === 0 ? "high" : "medium",
      actionLabel: photoCount === 0 ? "Upload Photos" : "Add Photos",
      stepId: "price",
    });
  }

  // 4. Description
  const desc = (p.description || "").trim();
  if (!desc || desc.length < 80) {
    recommendations.push({
      id: "description",
      category: "description",
      icon: "description",
      title: "Enhance Property Description",
      description:
        desc.length === 0
          ? "Adding a short description highlighting lighting, ventilation, and unique features helps your property stand out."
          : "Your description is brief. Elaborating on key highlights and neighborhood appeal makes your listing more informative.",
      priority: desc.length === 0 ? "high" : "medium",
      actionLabel: "Edit Description",
      stepId: "price",
    });
  }

  // 5. Location / Nearby Places
  const nearbyPlaces = p.neighbourhood?.nearbyPlaces || {};
  const enabledCount = Object.values(nearbyPlaces).filter((place: any) => place?.enabled).length;
  if (enabledCount < 2) {
    recommendations.push({
      id: "neighbourhood",
      category: "location",
      icon: "location",
      title: "Highlight Nearby Places",
      description:
        "Adding nearby schools, hospitals, metro stations, or malls makes the location much easier for potential buyers to evaluate.",
      priority: "medium",
      actionLabel: "Add Landmarks",
      stepId: "neighbourhood",
    });
  }

  // 6. Amenities
  const amenityCount = (p.amenities || []).length;
  if (amenityCount < 3) {
    recommendations.push({
      id: "amenities",
      category: "amenities",
      icon: "amenities",
      title: "Highlight Key Amenities",
      description:
        "Selecting facilities like Security, Power Backup, Lift, or Parking helps buyers searching with specific filters find your property.",
      priority: amenityCount === 0 ? "high" : "low",
      actionLabel: "Add Amenities",
      stepId: "amenities",
    });
  }

  // 7. Pricing
  if (!p.ownerNegotiable && (!p.maintenance || (p as any).maintenance === 0)) {
    recommendations.push({
      id: "pricing",
      category: "pricing",
      icon: "pricing",
      title: "Specify Pricing Terms",
      description: "Indicating whether the price is negotiable or specifying maintenance details helps set clear buyer expectations.",
      priority: "low",
      actionLabel: "Edit Pricing",
      stepId: "price",
    });
  }

  // Sort by priority weight
  const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
  recommendations.sort((a, b) => (priorityWeight[b.priority || "low"] || 1) - (priorityWeight[a.priority || "low"] || 1));

  const topRecs = recommendations.slice(0, 6);

  let finalRec = "";
  if (topRecs.length === 0) {
    finalRec =
      "Excellent job! Your property listing is rich with details, photos, documents, and location highlights. It is well-optimized to attract potential buyers.";
  } else {
    const categories = topRecs.map((r) => r.category);
    if (categories.includes("documents") && categories.includes("details")) {
      finalRec =
        "Uploading essential ownership documents and filling in missing property details like facing and carpet area will maximize buyer trust and listing engagement.";
    } else if (categories.includes("documents")) {
      finalRec =
        "Uploading verification documents like Sale Deed or EC is the best way to get your listing verified fast and build buyer confidence.";
    } else if (categories.includes("details")) {
      finalRec =
        "Completing optional property specifications like facing direction, property age, and carpet area helps serious buyers evaluate your listing.";
    } else {
      finalRec =
        "Your property has essential details covered. Adding more photos, documents, and nearby landmark information will make your listing more informative and attractive to potential buyers.";
    }
  }

  return {
    summary: "Your listing is almost ready. Eyva found a few key areas to make it more complete and trustworthy.",
    recommendations: topRecs,
    finalRecommendation: finalRec,
  };
};

export default function EyvaPropertyTips({ formData, onEditStep }: EyvaPropertyTipsProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EyvaTipsResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEyvaTips = async () => {
      setLoading(true);
      try {
        const res = await aiApi.getPropertyTips(formData as any);
        if (isMounted && res?.data?.success) {
          setData({
            summary: res.data.summary || "Your listing is almost ready. Eyva found a few key areas to make it more complete and trustworthy.",
            recommendations: res.data.recommendations || [],
            finalRecommendation: res.data.finalRecommendation || "",
          });
        } else if (isMounted) {
          setData(runClientSideRules(formData));
        }
      } catch (err) {
        if (isMounted) {
          // Graceful fallback to client rules
          setData(runClientSideRules(formData));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEyvaTips();

    return () => {
      isMounted = false;
    };
  }, [formData]);

  const getLucideIcon = (category?: string, iconStr?: string) => {
    const key = (iconStr || category || "").toLowerCase();
    if (key.includes("doc")) return <FileText size={18} className="text-[#C89B1C]" />;
    if (key.includes("photo") || key.includes("camera")) return <Camera size={18} className="text-[#C89B1C]" />;
    if (key.includes("desc")) return <Edit3 size={18} className="text-[#C89B1C]" />;
    if (key.includes("locat") || key.includes("place") || key.includes("neighbour")) return <MapPin size={18} className="text-[#C89B1C]" />;
    if (key.includes("price") || key.includes("cost")) return <CircleDollarSign size={18} className="text-[#C89B1C]" />;
    if (key.includes("detail") || key.includes("spec")) return <Building size={18} className="text-[#C89B1C]" />;
    if (key.includes("amenit")) return <Shield size={18} className="text-[#C89B1C]" />;
    return <Sparkles size={18} className="text-[#C89B1C]" />;
  };

  if (loading) {
    return (
      <div className="bg-[#FFFDF7] border border-[#E5D8B3] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#F5EBCF]" />
          <div className="space-y-2">
            <div className="h-4 w-44 bg-[#F5EBCF] rounded" />
            <div className="h-3 w-64 bg-[#F8F1DC] rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-[#F8F1DC] rounded-2xl" />
          <div className="h-32 bg-[#F8F1DC] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const recommendations = data.recommendations || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EC] to-[#FAF5E6] border border-[#E5D8B3] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 relative overflow-hidden font-sans"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F5E5BA]/30 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE2C4]/80 pb-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#FFF5D6] to-[#F3E2B0] border border-[#D8C28A] flex items-center justify-center text-[#9A720C] shadow-2xs shrink-0 mt-0.5 sm:mt-0">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#161616] tracking-tight">
                Eyva’s Property Tips
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3E2B0] text-[#785705] px-2 py-0.5 rounded-full border border-[#D8C28A]">
                AI Assistant
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
              “Make your property listing more attractive to potential buyers”
            </p>
          </div>
        </div>
      </div>

      {/* Intro Subtitle / Summary */}
      <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed bg-white/70 backdrop-blur-xs border border-[#ECE2C8] rounded-xl px-3.5 py-2.5 shadow-2xs">
        {data.summary || "Your listing is almost ready. Eyva found a few ways you can make it more informative."}
      </p>

      {/* Recommendation Cards Grid */}
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((item) => (
            <div
              key={item.id || item.title}
              className="bg-white rounded-2xl border border-[#ECE2C8] p-4.5 sm:p-5 shadow-2xs hover:shadow-md hover:border-[#D8C594] transition-all duration-200 flex flex-col justify-between space-y-3.5 group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-[#FFF8E7] border border-[#F0E1B9] flex items-center justify-center shrink-0">
                    {getLucideIcon(item.category, item.icon)}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-snug group-hover:text-[#9A720C] transition-colors">
                    {item.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              {onEditStep && item.stepId && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => onEditStep(item.stepId)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FFF9EC] hover:bg-[#FFF1CE] text-[#8C6605] border border-[#E5D5A8] hover:border-[#C89B1C] px-3.5 py-1.5 rounded-xl transition-all shadow-2xs active:scale-97 cursor-pointer"
                  >
                    <span>{item.actionLabel || "Add Details"}</span>
                    <ChevronRight size={14} className="text-[#A57C12]" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 border border-[#E2D6B5] rounded-2xl p-4 sm:p-5 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold text-gray-800">
            Your listing includes comprehensive details across all major categories!
          </p>
        </div>
      )}

      {/* Final Eyva Recommendation Footer Box */}
      {data.finalRecommendation && (
        <div className="bg-gradient-to-r from-[#FFF8E7] via-[#FFF3D6] to-[#FFF8E7] border border-[#E5D5A8] rounded-2xl p-4 sm:p-5 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#8C6605]">
            <Sparkles size={14} className="text-[#C89B1C]" />
            <span>Eyva’s Recommendation</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-800 font-semibold leading-relaxed">
            “{data.finalRecommendation}”
          </p>
        </div>
      )}
    </motion.div>
  );
}
