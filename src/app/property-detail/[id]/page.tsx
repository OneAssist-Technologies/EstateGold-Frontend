"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { motion } from "framer-motion";
import { Lock, UserPlus, LogIn, ShieldCheck, FileText } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";;

import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";

import api from "@/src/lib/api";

import { Property } from "@/src/types/property";

import Link from "next/link";
import PropertyGallery from "../../../components/property/detail/PropertyGallery";
import PropertyInfo from "../../../components/property/detail/PropertyInfo";
import PropertyFeatures from "../../../components/property/detail/PropertyFeatures";
import PropertyDescription from "../../../components/property/detail/PropertyDescription";
// import PriceTransparency from "../../../components/property/detail/PriceTransparency";
import Amenities from "../../../components/property/detail/Amenities";
import Neighbourhood from "../../../components/property/detail/Neighbourhood";
import LocalityRatings from "../../../components/property/detail/LocalityRatings";
import OwnerCard from "../../../components/property/detail/OwnerCard";
import SimilarProperties from "../../../components/property/detail/SimilarProperties";
import PgDetailsSection from "../../../components/property/detail/PgDetailsSection";

import StickyContactCard from "../../../components/property/detail/StickyContactCard";

import LoginRequiredModal from "../../../components/property/detail/LoginRequiredModal";
import RequestCallbackModal from "../../../components/property/detail/RequestCallbackModal";
import AgreementDetailsModal from "../../../components/property/detail/AgreementDetailsModal";
import { calculatePropertyMatchScore } from "../../../utils/matchScore";

const getChecklistDocuments = (propertyType: string) => {
  switch (propertyType) {
    case "Apartment / Flat":
    case "Builder Floor":
      return [
        { type: "sale_deed", label: "Sale Deed" },
        { type: "parent_deeds", label: "Parent / Previous Title Documents" },
        { type: "encumbrance_certificate", label: "Encumbrance Certificate" },
        { type: "tax_receipt", label: "Property Tax Receipt" },
        { type: "building_plan", label: "Approved Building Plan" },
        { type: "completion_occupancy", label: "Completion / Occupancy Certificate" },
        { type: "society_documents", label: "Apartment / Society Documents" },
        { type: "possession_allotment", label: "Possession / Allotment Document" },
        { type: "owner_kyc", label: "Owner KYC / ID" },
      ];
    case "Independent House":
    case "Villa":
      return [
        { type: "sale_deed", label: "Sale Deed" },
        { type: "parent_deeds", label: "Parent / Title Documents" },
        { type: "encumbrance_certificate", label: "Encumbrance Certificate" },
        { type: "tax_receipt", label: "Property Tax Receipt" },
        { type: "building_plan", label: "Approved Building Plan" },
        { type: "building_approval", label: "Building Approval" },
        { type: "completion_occupancy", label: "Completion / Occupancy Documents" },
        { type: "survey_sketch", label: "Survey / Sketch" },
        { type: "owner_kyc", label: "Owner KYC" },
      ];
    default: // Plots, Commercial, etc.
      return [
        { type: "sale_deed", label: "Sale Deed / Title Deed" },
        { type: "parent_deeds", label: "Parent Deeds / Title Documents" },
        { type: "encumbrance_certificate", label: "Encumbrance Certificate" },
        { type: "tax_receipt", label: "Property Tax Receipt" },
        { type: "owner_kyc", label: "Owner KYC" },
      ];
  }
};

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  const [pendingContactAction, setPendingContactAction] = useState<(() => void) | null>(null);

  const [matchScoreData, setMatchScoreData] = useState<any>(null);

  useEffect(() => {
    if (property) {
      const saved = localStorage.getItem("estategold_user_preferences");
      if (saved) {
        try {
          const prefs = JSON.parse(saved);
          const result = calculatePropertyMatchScore(property, prefs);
          setMatchScoreData(result);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [property]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data.data);
    } catch (err) {
      console.error("Failed to fetch property:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilar = async () => {
    try {
      const response = await api.get(`/properties/${id}/similar`);
      setSimilarProperties(response.data.data);
    } catch (err) {
      console.error("Failed to fetch similar properties:", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProperty();
    fetchSimilar();
  }, [id]);

  if (loading || authLoading) {
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

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Property Not Found
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            The property listing you are looking for may have been removed or is unavailable.
          </p>
          <button
            type="button"
            onClick={() => router.push("/property-listing")}
            className="mt-4 px-5 py-2 rounded-xl bg-[#9A720C] text-white text-xs font-bold hover:bg-[#856108] transition-all cursor-pointer"
          >
            Back to Listings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isGuest = !isAuthenticated;
  const currentUserId = user?._id || user?._id;
  const propertyOwnerId = property.ownerId || property.createdBy;
  const isPropertyOwner = Boolean(
    currentUserId && propertyOwnerId && String(currentUserId) === String(propertyOwnerId)
  );

  const getVerifiedDocumentLabels = () => {
    const docs = property.documents || [];
    
    if (docs.length > 0) {
      const labels = docs.map((doc: any) => {
        if (doc.documentType) {
          return doc.documentType
            .split(/[_-]/)
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
        if (doc.fileName) {
          return doc.fileName
            .replace(/\.[^/.]+$/, "")
            .split(/[_-]/)
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        }
        return "Ownership Document";
      });
      return Array.from(new Set(labels));
    }

    const uploadedTypes = property.uploadedDocumentTypes || [];
    if (uploadedTypes.length > 0) {
      const labels = uploadedTypes.map((type: string) => {
        return type
          .split(/[_-]/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      });
      return Array.from(new Set(labels));
    }

    return [];
  };

  const handleLoginRequired = () => {
    setLoginOpen(true);
  };

  const executeWithAgreementCheck = (action: () => void) => {
    if (isGuest) {
      handleLoginRequired();
      return;
    }

    const isRentOrLease =
      (property?.purpose || "").toLowerCase() === "rent" ||
      (property?.purpose || "").toLowerCase() === "lease";
    const hasAgreement = Boolean(property?.agreementDetails);

    if (isRentOrLease && hasAgreement && !isAgreementAccepted) {
      setPendingContactAction(() => action);
      setShowAgreementModal(true);
    } else {
      action();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.propertyType,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Property link copied to clipboard!");
    }
  };

  const handleFavourite = () => {
    if (isGuest) {
      handleLoginRequired();
      return;
    }
    alert("Saved to your wishlist!");
  };

  const isAgentPublished =
    property.createdBy &&
    typeof property.createdBy === "object" &&
    (property.createdBy as any).role === "agent";

  const handleCall = () => {
    const rawPhone = isAgentPublished
      ? (property.createdBy as any)?.phone || property.ownerPhone
      : property.ownerPhone || (property.createdBy as any)?.phone;

    if (rawPhone) {
      const cleanPhone = String(rawPhone).replace(/[^\d+]/g, "");
      window.location.href = `tel:${cleanPhone}`;
    } else {
      window.location.href = `tel:+919876543210`;
    }
  };

  const handleWhatsapp = (customMsg?: string) => {
    const rawPhone = isAgentPublished
      ? (property.createdBy as any)?.phone || property.ownerPhone
      : property.ownerPhone || (property.createdBy as any)?.phone || "";

    let cleanPhone = String(rawPhone).replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    const title =
      property.bedrooms && property.propertyType
        ? `${property.bedrooms} BHK ${property.propertyType}`
        : property.propertyType || "Property";

    const defaultMsg = `Hi, I am interested in your property "${title}" located in ${
      property.locality || property.city || "your listing"
    } listed on Property Listing app. Please share more details.`;

    const textToSend =
      typeof customMsg === "string" && customMsg.trim().length > 0
        ? customMsg
        : defaultMsg;

    if (cleanPhone) {
      window.open(
        `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToSend)}`,
        "_blank"
      );
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(textToSend)}`,
        "_blank"
      );
    }
  };

  const handleEdit = () => {
    router.push(`/my-properties/edit/${property._id}`);
  };

  const handleEnquiries = () => {
    router.push(`/my-properties/${property._id}/enquiries`);
  };

  const handleToggleStatus = async () => {
    try {
      await api.patch(`/properties/${property._id}/status`, {
        status: property.status === "approved" ? "inactive" : "approved",
      });
      fetchProperty();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1450px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Breadcrumb */}
        <nav className="text-xs text-gray-400 font-medium mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/property-listing" className="hover:text-gray-700 transition-colors">
            Properties
          </Link>
          <span>›</span>
          <span className="hover:text-gray-700">{property.city}</span>
          <span>›</span>
          <span className="text-gray-700 font-semibold truncate max-w-[250px]">
            {property.bedrooms ? `${property.bedrooms} BHK ` : ""}
            {property.propertyType}
          </span>
        </nav>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Main Content */}
          <div className={isPropertyOwner ? "lg:col-span-12 space-y-2" : "lg:col-span-8 space-y-2"}>
            <PropertyGallery
              photos={property.photos}
              purpose={property.purpose}
              onShare={handleShare}
              onFavourite={handleFavourite}
            />

            <PropertyInfo property={property} />

            {/* View Agreement & Tenancy Terms Button for Rent & Lease Properties */}
            {((property.purpose || "").toLowerCase() === "rent" || (property.purpose || "").toLowerCase() === "lease") && property.agreementDetails && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowAgreementModal(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-[#D8B56A] hover:bg-[#FFFDF6] text-[#9A720C] hover:border-[#C89B1C] text-xs sm:text-sm font-bold rounded-2xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText size={18} className="text-[#C89B1C]" />
                  <span>View Agreement & Tenancy Terms</span>
                </button>
              </div>
            )}

            {/* Match Compatibility Section */}
            {matchScoreData && (
              <div className="bg-[#FFFDF6] border border-[#E8DCC1] rounded-2xl p-6 mt-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Match Compatibility</h2>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full w-fit ${
                    matchScoreData.score >= 90 ? "bg-green-50 text-green-700 border border-green-200" :
                    matchScoreData.score >= 75 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    matchScoreData.score >= 60 ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                    matchScoreData.score >= 40 ? "bg-amber-50 text-amber-700 border border-[#FFF9EC]" :
                    "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {matchScoreData.score}% Match ({matchScoreData.label})
                  </span>
                </div>
                
                {/* Progress Match Bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      matchScoreData.score >= 90 ? "bg-green-500" :
                      matchScoreData.score >= 75 ? "bg-emerald-500" :
                      matchScoreData.score >= 60 ? "bg-yellow-500" :
                      matchScoreData.score >= 40 ? "bg-amber-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${matchScoreData.score}%` }}
                  />
                </div>

                {/* Explanations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {matchScoreData.matchedReasons.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Matches Your Search</h4>
                      {matchScoreData.matchedReasons.map((reason: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs font-bold text-green-700">
                          <span>✓</span> <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {matchScoreData.mismatchedReasons.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mismatches</h4>
                      {matchScoreData.mismatchedReasons.map((reason: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                          <span>✕</span> <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {matchScoreData.unverifiedReasons.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#ECE7DB]">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Unverified Criteria</h4>
                    <div className="flex flex-wrap gap-2">
                      {matchScoreData.unverifiedReasons.map((reason: string, i: number) => (
                        <span key={i} className="text-[10px] font-semibold text-amber-700 bg-amber-50/70 border border-amber-100 rounded-md px-2 py-0.5 animate-pulse">
                          ⚠ {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <PropertyFeatures property={property} />

            {isGuest ? (
              <div className="relative">
                {/* Blurred Content */}
                <div className="blur-[6px] pointer-events-none select-none space-y-2 opacity-50">
                  <PgDetailsSection property={property} onEnquireRoom={() => setCallbackOpen(true)} />
                  <PropertyDescription property={property} />
                  {/* <PriceTransparency property={property} /> */}
                  <Amenities amenities={property.amenities} />
                  <Neighbourhood property={property} />
                  <LocalityRatings property={property} />
                  <OwnerCard property={property} />
                  <SimilarProperties properties={similarProperties} />
                </div>

                {/* Overlay Card Container */}
                <div className="absolute inset-x-0 top-0 flex justify-center pt-8 sm:pt-14 px-4 z-10">
                  <div className="w-full max-w-md h-fit bg-white border border-[#ECE7DB] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-5 sm:space-y-6">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#FFF9EC] border border-[#E8DCC1] flex items-center justify-center text-[#9A720C] shadow-2xs">
                      <Lock size={22} className="sm:size-24" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Sign In to View Full Details
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-[280px] sm:max-w-sm">
                        Create a free account or sign in to view the complete property details, contact the owner, and save to your wishlist.
                      </p>
                    </div>

                    <div className="w-full space-y-3 pt-1">
                      <Link
                        href="/register"
                        className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                      >
                        <UserPlus size={16} /> Register Free — It's Instant
                      </Link>

                      <Link
                        href="/login"
                        className="w-full h-11 sm:h-12 rounded-xl border-2 border-[#9A720C] hover:bg-[#FFF9EC] text-[#9A720C] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <LogIn size={16} /> Sign In
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <PgDetailsSection property={property} onEnquireRoom={() => setCallbackOpen(true)} />
                <PropertyDescription property={property} />
                {/* <PriceTransparency property={property} /> */}
                <Amenities amenities={property.amenities} />
                <Neighbourhood property={property} />
                <LocalityRatings property={property} />

                {/* Documents Section */}
                {isPropertyOwner ? (
                  <section className="bg-white border border-[#ECE7DB] rounded-2xl p-6 mt-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">
                        Documents
                      </h2>
                    </div>
                    <div className="mt-4">
                      {property.documents && property.documents.length > 0 ? (
                        <div className="space-y-4">
                          {property.documents.map((doc: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#ECE7DB] rounded-xl hover:bg-gray-50 transition-colors gap-3">
                              <div className="space-y-1">
                                <span className="inline-block px-2.5 py-0.5 bg-[#FFF9EC] text-[#9A720C] text-[10px] font-bold rounded-full border border-[#E8DCC1] uppercase">
                                  {doc.documentType || "Document"}
                                </span>
                                <p className="text-sm font-bold text-gray-900 break-all">
                                  {doc.fileName || "File"}
                                </p>
                                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                                  <span>Status: <strong className={`capitalize ${doc.verificationStatus === "Verified" ? "text-green-600" : doc.verificationStatus === "Rejected" ? "text-red-500" : "text-amber-600"}`}>{doc.verificationStatus || "Uploaded"}</strong></span>
                                  {doc.uploadedAt && (
                                    <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {doc.fileUrl && (
                                  <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-2 rounded-lg bg-[#9A720C] text-white text-xs font-bold hover:bg-[#856108] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                  >
                                    View Document
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No documents uploaded.</p>
                      )}
                    </div>
                  </section>
                ) : (
                  property.documentsAvailable && (
                    <div className="bg-[#FFFDF6] border border-[#E8DCC1] rounded-2xl p-6 mt-6 text-left">
                      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#ECE7DB]">
                        <div className="h-9 w-9 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shadow-2xs">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900 leading-tight">Verified Property Documents</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Government & Ownership Audited</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 font-bold mb-4 leading-relaxed">
                        This property has been successfully audited and verified by EstateGold specialists using the following legal documents to confirm authenticity and clear titles:
                      </p>

                      {getVerifiedDocumentLabels().length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {getVerifiedDocumentLabels().map((doc, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2.5 px-3 bg-white border border-[#ECE7DB] rounded-xl shadow-3xs">
                              <span className="h-5 w-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-black shrink-0">
                                ✓
                              </span>
                              <span className="text-xs font-bold text-gray-800">{doc}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2.5 px-3 bg-white border border-[#ECE7DB] rounded-xl shadow-3xs">
                          <span className="h-5 w-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-black shrink-0">
                            ✓
                          </span>
                          <span className="text-xs font-bold text-gray-800">Ownership Documents Audited</span>
                        </div>
                      )}
                    </div>
                  )
                )}

                <OwnerCard property={property} />
              </>
            )}
          </div>

          {/* Right Sidebar - Hidden ONLY when logged-in user is the actual property owner */}
          {!isPropertyOwner && (
            <aside className="lg:col-span-4 lg:sticky lg:top-24">
              <StickyContactCard
                property={property}
                user={user}
                onLogin={handleLoginRequired}
                onRequestCallback={() => executeWithAgreementCheck(() => setCallbackOpen(true))}
                onCall={() => executeWithAgreementCheck(handleCall)}
                onWhatsapp={(msg) => executeWithAgreementCheck(() => handleWhatsapp(msg))}
                onEdit={handleEdit}
                onViewEnquiries={handleEnquiries}
                onToggleStatus={handleToggleStatus}
              />
            </aside>
          )}

          {/* Similar Properties Section - Rendered below Left and Right columns on mobile/desktop when logged in */}
          {!isGuest && (
            <div className={isPropertyOwner ? "lg:col-span-12 mt-6" : "lg:col-span-8 mt-6"}>
              <SimilarProperties properties={similarProperties} />
            </div>
          )}
        </div>
      </main>

      <Footer />

      <LoginRequiredModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      <RequestCallbackModal
        open={callbackOpen}
        propertyId={property._id}
        ownerId={property.ownerId || (property.createdBy && typeof property.createdBy === "object" ? property.createdBy._id : property.createdBy)}
        userName={user?.fullName}
        userPhone={user?.phone}
        onClose={() => setCallbackOpen(false)}
      />

      <AgreementDetailsModal
        open={showAgreementModal}
        onClose={() => {
          setShowAgreementModal(false);
          setPendingContactAction(null);
        }}
        onAgree={() => {
          setIsAgreementAccepted(true);
          toast.success("Agreement terms accepted.");
          if (pendingContactAction) {
            pendingContactAction();
            setPendingContactAction(null);
          }
        }}
        agreementDetails={property.agreementDetails}
        purpose={property.purpose}
        propertyTitle={property.bedrooms ? `${property.bedrooms} BHK ${property.propertyType}` : property.propertyType}
      />
    </div>
  );
}