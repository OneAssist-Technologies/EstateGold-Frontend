"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  MapPin,
  User,
  Phone,
  Mail,
  BedDouble,
  Bath,
  Ruler,
  IndianRupee,
  Calendar,
  CheckCircle2,
  XCircle,
  Building,
  Layers,
  Compass,
  Car,
  Sofa,
  ShieldAlert,
  FileCheck,
  ExternalLink,
  Award,
  Star,
  Info,
  Clock,
} from "lucide-react";

import { AdminProperty } from "@/src/types/adminProperty";
import PropertyAvailabilityBadge from "./PropertyAvailabilityBadge";

interface Props {
  open: boolean;
  property: AdminProperty | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onApproveDelete?: (id: string, reason: string) => void;
  onRejectDeleteRequest?: (id: string) => void;
}

export default function PropertyViewModal({
  open,
  property,
  onClose,
  onApprove,
  onReject,
  onApproveDelete,
  onRejectDeleteRequest,
}: Props) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [property]);

  if (!property) return null;

  const photos = property.photos && property.photos.length > 0 ? property.photos : [];

  const getPhotoUrl = (raw?: string) => {
    if (!raw) return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    const clean = raw.replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "");
    return `http://localhost:5000/uploads/properties/${clean}`;
  };

  const getDocUrl = (raw?: string) => {
    if (!raw) return "#";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    const clean = raw.replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "");
    return `http://localhost:5000/uploads/properties/${clean}`;
  };

  const n = property.neighbourhood;
  const nearbyPlacesList = n?.nearbyPlaces
    ? Object.entries(n.nearbyPlaces).filter(([_, place]: any) => place?.enabled && place?.name)
    : [];

  const ratings = n?.ratings;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Single Uniform Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            className="relative z-10 w-full max-w-5xl max-h-[85vh] my-auto flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-5 sm:p-6 border-b shrink-0 bg-white z-10">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {property.bedrooms ? `${property.bedrooms} BHK ` : ""}{property.propertyType || "Property"}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F7F2E5] text-[#8B6A11] border border-[#E8D9B5]">
                    {property.purpose ? `For ${property.purpose}` : "For Sale"}
                  </span>
                  <PropertyAvailabilityBadge availabilityStatus={property.availabilityStatus} />
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={14} className="text-[#C89B1C] shrink-0" />
                  {property.locality ? `${property.locality}, ` : ""}{property.city || "N/A"}
                  {property.society ? ` (${property.society})` : ""}
                </p>
              </div>

              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors text-gray-600 shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

              {/* Deletion Request Alert Banner */}
              {property.deleteRequested && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-amber-900 font-bold text-sm">
                      Deletion Request Pending Review
                    </h4>
                    <p className="text-xs text-amber-800 font-medium mt-0.5">
                      <strong>Requested Reason:</strong> {property.deleteRequestedReason || "No reason specified"}
                    </p>
                  </div>
                </div>
              )}

              {/* Photos Gallery */}
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 h-[220px] sm:h-[360px]">
                  <img
                    src={getPhotoUrl(photos[selectedPhotoIndex])}
                    alt={property.locality || "Property Image"}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="w-full h-full object-cover"
                  />
                  {photos.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs">
                      Photo {selectedPhotoIndex + 1} of {photos.length}
                    </span>
                  )}
                </div>

                {photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {photos.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${selectedPhotoIndex === idx ? "border-[#C89B1C] ring-2 ring-[#C89B1C]/20 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                      >
                        <img
                          src={getPhotoUrl(p)}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF6ED] via-[#F4EBD7] to-[#FAF6ED] border border-[#E5D7B5] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8C690F]">Total Price</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <IndianRupee className="text-[#C89B1C]" size={26} />
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      {property.price ? property.price.toLocaleString("en-IN") : "Price on Request"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${property.ownerNegotiable ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    Negotiable: {property.ownerNegotiable ? "Yes" : "No"}
                  </span>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${property.ownerReadyToMeet ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    Ready to Meet: {property.ownerReadyToMeet ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80 space-y-4">
                <h3 className="font-bold text-base text-gray-900 border-b border-gray-200 pb-2">
                  Property Overview & Specifications
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  <SpecItem icon={<BedDouble size={16} />} label="Bedrooms" value={property.bedrooms ? String(property.bedrooms) : "N/A"} />
                  <SpecItem icon={<Bath size={16} />} label="Bathrooms" value={property.bathrooms ? String(property.bathrooms) : "N/A"} />
                  <SpecItem icon={<Layers size={16} />} label="Balconies" value={property.balconies !== undefined ? String(property.balconies) : "N/A"} />
                  <SpecItem icon={<Ruler size={16} />} label="Super Area" value={property.area ? `${property.area} Sq.ft` : "N/A"} />

                  {(property as any).carpetArea && (
                    <SpecItem icon={<Ruler size={16} />} label="Carpet Area" value={`${(property as any).carpetArea} Sq.ft`} />
                  )}

                  <SpecItem icon={<Building size={16} />} label="Floor" value={property.floor !== undefined ? `${property.floor}${(property as any).totalFloors ? ` of ${(property as any).totalFloors}` : ""}` : "N/A"} />

                  <SpecItem icon={<Sofa size={16} />} label="Furnishing" value={property.furnishing || "N/A"} />
                  <SpecItem icon={<Car size={16} />} label="Parking" value={property.parking ? "Available" : "Not Available"} />

                  {(property as any).facing && (
                    <SpecItem icon={<Compass size={16} />} label="Facing" value={(property as any).facing} />
                  )}

                  {(property as any).propertyAge && (
                    <SpecItem icon={<Clock size={16} />} label="Property Age" value={(property as any).propertyAge} />
                  )}

                  <SpecItem icon={<Calendar size={16} />} label="Available From" value={property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : "Immediate"} />
                  <SpecItem icon={<Calendar size={16} />} label="Listed Date" value={property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "N/A"} />
                </div>
              </div>

              {/* Owner & Agent Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Owner Information */}
                <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3">
                  <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <User size={18} className="text-[#C89B1C]" />
                    Owner / Contact Details
                  </h3>

                  <div className="space-y-2 text-sm">
                    <DetailRow label="Owner Name" value={property.ownerName || property.createdBy?.fullName || "N/A"} />
                    <DetailRow label="Primary Phone" value={property.ownerPhone || property.createdBy?.phone || "N/A"} />
                    {property.alternatePhone && <DetailRow label="Alternate Phone" value={property.alternatePhone} />}
                    <DetailRow label="Email Address" value={property.ownerEmail || property.createdBy?.email || "N/A"} />
                    {property.ownerType && <DetailRow label="Owner Type" value={property.ownerType} />}
                    {property.agentRelation && <DetailRow label="Relationship" value={property.agentRelation} />}
                    {property.ownerIdType && property.ownerIdNumber && (
                      <DetailRow label={`${property.ownerIdType} No.`} value={property.ownerIdNumber} />
                    )}
                  </div>
                </div>

                {/* Agent / Listed By Details */}
                <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3">
                  <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Award size={18} className="text-[#C89B1C]" />
                    Listed By User Account
                  </h3>

                  {property.createdBy ? (
                    <div className="space-y-2 text-sm">
                      <DetailRow label="User Name" value={property.createdBy.fullName} />
                      <DetailRow label="Account Role" value={property.createdBy.role === "agent" ? "Agent" : property.createdBy.role === "admin" ? "Admin" : "Member"} />
                      <DetailRow label="User Phone" value={property.createdBy.phone || "N/A"} />
                      <DetailRow label="User Email" value={property.createdBy.email || "N/A"} />
                      {property.createdBy.agencyName && <DetailRow label="Agency Name" value={property.createdBy.agencyName} />}
                      <DetailRow label="Verification Status" value={property.createdBy.isVerified ? "Verified User ✅" : "Unverified"} />
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No account info available.</p>
                  )}
                </div>

              </div>

              {/* Uploaded Documents Section */}
              {((property.documents && property.documents.length > 0) || (property.uploadedDocumentTypes && property.uploadedDocumentTypes.length > 0)) && (
                <div className="p-5 rounded-2xl border border-gray-200 bg-emerald-50/40 space-y-3">
                  <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 border-b border-emerald-200/60 pb-2">
                    <FileCheck size={18} className="text-emerald-600" />
                    Uploaded Verification Documents
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.documents && property.documents.length > 0 ? (
                      property.documents.map((doc, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-emerald-200/80 flex items-center justify-between gap-2 shadow-2xs">
                          <div>
                            <p className="font-bold text-xs text-gray-800">{doc.documentType || "Verification Document"}</p>
                            <p className="text-[11px] text-gray-500 truncate max-w-[180px]">{doc.fileName || "File Attachment"}</p>
                          </div>
                          <a
                            href={getDocUrl(doc.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                          >
                            View <ExternalLink size={12} />
                          </a>
                        </div>
                      ))
                    ) : (
                      property.uploadedDocumentTypes?.map((docType, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-200/60 text-xs font-semibold text-gray-700">
                          📄 {docType}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Address & Locality Details */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-2">
                <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-[#C89B1C]" /> Address & Location Information
                </h3>
                <p className="text-sm text-gray-700 font-medium">
                  <strong>Full Address:</strong> {property.address || `${property.locality}, ${property.city}`}
                </p>
                {property.society && (
                  <p className="text-sm text-gray-600">
                    <strong>Society / Complex:</strong> {property.society}
                  </p>
                )}
              </div>

              {/* Pending Issues / Liabilities Section */}
              {(property as any).pendingIssues?.hasPendingIssues === "yes" && (
                <div className="p-5 rounded-2xl border border-red-200 bg-red-50/50 space-y-3">
                  <h3 className="font-bold text-base text-red-900 flex items-center gap-2 border-b border-red-200 pb-2">
                    <ShieldAlert size={18} className="text-red-600" />
                    Property Pending Issues / Liabilities
                  </h3>
                  <div className="space-y-2 text-xs">
                    {(property as any).pendingIssues.issues?.map((iss: any, idx: number) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-red-200 text-red-800 space-y-1">
                        <p className="font-bold text-sm text-red-900">{iss.type} {iss.amount ? `(₹${iss.amount.toLocaleString()})` : ""}</p>
                        <p className="text-xs text-gray-700">{iss.description}</p>
                        {iss.expectedResolutionDate && (
                          <p className="text-[11px] text-gray-500">Expected Resolution: {new Date(iss.expectedResolutionDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-gray-900">Amenities & Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((item) => (
                      <span key={item} className="rounded-xl bg-[#F7F2E5] px-3.5 py-1.5 text-xs font-semibold text-[#8B6A11] border border-[#EAE0C7]">
                        ✨ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Places */}
              {nearbyPlacesList.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-gray-900">Nearby Facilities & Distance</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {nearbyPlacesList.map(([key, place]: any) => (
                      <div key={key} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                        <span className="font-semibold capitalize text-gray-700">{key}</span>
                        <span className="text-gray-500 font-medium">{place.distance || "Nearby"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-bold text-base text-gray-900">Description</h3>
                <p className="text-sm leading-relaxed text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 whitespace-pre-line">
                  {property.description || "No description provided."}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 sm:p-5 flex flex-wrap sm:flex-nowrap justify-end gap-3 shrink-0 bg-white z-10">
              {property.deleteRequested ? (
                <>
                  {onRejectDeleteRequest && (
                    <button
                      onClick={() => {
                        onRejectDeleteRequest(property._id);
                        onClose();
                      }}
                      className="w-full sm:w-auto h-11 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer border border-gray-200 transition-colors"
                    >
                      Reject Delete Request
                    </button>
                  )}

                  {onApproveDelete && (
                    <button
                      onClick={() => {
                        onApproveDelete(property._id, property.deleteRequestedReason || "User delete request");
                        onClose();
                      }}
                      className="w-full sm:w-auto h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                    >
                      Approve Deletion
                    </button>
                  )}
                </>
              ) : property.status === "pending" && (
                <>
                  <button
                    onClick={() => onReject("Rejected by Admin")}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>

                  <button
                    onClick={onApprove}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#C89B1C] hover:bg-[#B58A16] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={18} />
                    Approve Property
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="w-full sm:w-auto h-11 px-6 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm justify-center flex items-center cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200/60 shadow-2xs">
      <div className="text-[#C89B1C] shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] text-gray-400 font-medium leading-none">{label}</p>
        <p className="font-bold text-xs text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 font-medium">{label}:</span>
      <span className="font-bold text-gray-800 text-right">{value}</span>
    </div>
  );
}