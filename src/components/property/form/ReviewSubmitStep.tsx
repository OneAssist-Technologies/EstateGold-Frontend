"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, FileText, MapPin, Landmark, DollarSign, User, ShieldCheck, Pencil } from "lucide-react";
import { PropertyFormData } from "../../../types/property";
import EyvaPropertyTips from "./EyvaPropertyTips";
import AgreementDetailsModal from "../detail/AgreementDetailsModal";

interface Props {
  formData: PropertyFormData;
  onSubmit: () => void;
  onSaveDraft?: () => void;
  loading: boolean;
  onEditStep?: (stepId: string) => void;
}

export default function ReviewSubmitStep({ formData, onSubmit, onSaveDraft, loading, onEditStep }: Props) {
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const isPg = formData.purpose === "PG / Co-Living" || formData.purpose === "PG_CO_LIVING";

  // Format price helper
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null || isNaN(price)) return "₹0";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getIssueCount = () => {
    if (formData.pendingIssues?.hasPendingIssues === "yes") {
      return formData.pendingIssues.issues.length;
    }
    return 0;
  };

  const getUploadedCount = () => {
    return (formData.documents || []).length;
  };

  const getNearbyPlaces = () => {
    const places = formData.neighbourhood?.nearbyPlaces || {};
    return Object.entries(places)
      .filter(([_, place]: [string, any]) => place?.enabled)
      .map(([key, place]: [string, any]) => `${key.replace(/([A-Z])/g, ' $1').trim()} (${place.name || ''} - ${place.distance || ''} km)`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
          Review & Submit Listing
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          Verify all information before publishing this property listing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Category & Location Card */}
        <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} className="text-[#C89B1C]" /> Category & Location
            </h3>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep("location")}
                className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Pencil size={10} /> Edit
              </button>
            )}
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Property Type:</span>
              <span className="font-bold text-gray-800">{formData.propertyType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Purpose:</span>
              <span className="font-bold text-gray-800 capitalize">{formData.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">City:</span>
              <span className="font-bold text-gray-800">{formData.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Locality:</span>
              <span className="font-bold text-gray-800">{formData.locality}</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium block">Address:</span>
              <span className="font-semibold text-gray-700 mt-0.5 block line-clamp-2">
                {formData.address}
              </span>
            </div>
          </div>
        </div>

        {/* Property Details Card */}
        <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#C89B1C]" /> {isPg ? "PG & Co-Living Details" : "Property Details"}
            </h3>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(isPg ? "pg_details" : "details")}
                className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Pencil size={10} /> Edit
              </button>
            )}
          </div>
          {isPg ? (
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">PG / Hostel Name:</span>
                <span className="font-bold text-gray-800">{formData.pgDetails?.pgName || "Not Specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Publisher Role:</span>
                <span className="font-bold text-gray-800">{formData.pgDetails?.publisherType || "PG Owner"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Accommodation Type:</span>
                <span className="font-bold text-gray-800">{formData.pgDetails?.accommodationType || "PG / Co-Living"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Suitable For:</span>
                <span className="font-bold text-gray-800">{formData.pgDetails?.suitableFor || "Anyone"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Occupant Type:</span>
                <span className="font-bold text-gray-800">{formData.pgDetails?.occupantType || "Students & Professionals"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Food Availability:</span>
                <span className="font-bold text-gray-800">{formData.pgDetails?.foodAvailability || "Available"}</span>
              </div>
              {(formData.pgDetails?.mealsIncluded || []).length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Meals Included:</span>
                  <span className="font-bold text-gray-800">{(formData.pgDetails?.mealsIncluded || []).join(", ")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Furnishing:</span>
                <span className="font-bold text-gray-800">{formData.pgDetails?.furnishing || "Fully Furnished"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Move-in Status:</span>
                <span className="font-bold text-gray-800">
                  {formData.pgDetails?.moveInAvailability || "Available Now"}
                  {formData.pgDetails?.moveInDate ? ` (${formData.pgDetails.moveInDate})` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Parking:</span>
                <span className="font-bold text-gray-800">{formData.parking ? "Available" : "Not Available"}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs sm:text-sm">
              {formData.bedrooms > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Bedrooms:</span>
                  <span className="font-bold text-gray-800">{formData.bedrooms} BHK</span>
                </div>
              )}
              {formData.bathrooms > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Bathrooms:</span>
                  <span className="font-bold text-gray-800">{formData.bathrooms} Bath</span>
                </div>
              )}
              {formData.area > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Built-up Area:</span>
                  <span className="font-bold text-gray-800">{formData.area.toLocaleString()} sq ft</span>
                </div>
              )}
              {formData.carpetArea !== undefined && formData.carpetArea > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Carpet Area:</span>
                  <span className="font-bold text-gray-800">{formData.carpetArea.toLocaleString()} sq ft</span>
                </div>
              )}
              {formData.plotArea !== undefined && formData.plotArea > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Plot Area:</span>
                  <span className="font-bold text-gray-800">{formData.plotArea.toLocaleString()} sq ft</span>
                </div>
              )}
              {formData.floor !== undefined && formData.floor > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Floor:</span>
                  <span className="font-bold text-gray-800">
                    {formData.floor} of {formData.totalFloors || "N/A"}
                  </span>
                </div>
              )}
              {formData.facing && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Facing Direction:</span>
                  <span className="font-bold text-gray-800">{formData.facing}</span>
                </div>
              )}
              {formData.furnishing && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Furnishing:</span>
                  <span className="font-bold text-gray-800">{formData.furnishing}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Parking:</span>
                <span className="font-bold text-gray-800">{formData.parking ? "Available" : "Not Available"}</span>
              </div>
            </div>
          )}
        </div>

        {/* PG Room Configurations Card (If PG) */}
        {isPg && (
          <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-[#C89B1C]" /> Room Configurations ({(formData.pgDetails?.rooms || []).length})
              </h3>
              {onEditStep && (
                <button
                  type="button"
                  onClick={() => onEditStep("pg_rooms")}
                  className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Pencil size={10} /> Edit
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(formData.pgDetails?.rooms || []).length > 0 ? (
                (formData.pgDetails?.rooms || []).map((room, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] border border-[#E5D8B3] p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800 text-xs sm:text-sm">{room.sharingType || "Room"} ({room.roomCount || 1} Rooms)</p>
                      <p className="text-[11px] text-gray-500">{room.totalBeds || 1} Beds/Room • {room.ac ? "AC" : "Non-AC"} • {room.bathroomType || "Attached Bath"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#C89B1C] text-xs sm:text-sm">{formatPrice(room.pricePerPerson)}<span className="text-[10px] text-gray-400 font-normal">/person</span></p>
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{room.status || "Available"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-gray-400 italic text-xs">No room configurations added</span>
              )}
            </div>
          </div>
        )}

        {/* Amenities / Facilities Card */}
        <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#C89B1C]" /> {isPg ? "PG Facilities" : "Declared Amenities"}
            </h3>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(isPg ? "pg_facilities" : "amenities")}
                className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Pencil size={10} /> Edit
              </button>
            )}
          </div>
          <div className="text-sm">
            {(isPg ? (formData.pgDetails?.facilities || formData.amenities) : formData.amenities)?.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {(isPg ? (formData.pgDetails?.facilities || formData.amenities) : formData.amenities).map((facility: string) => (
                  <span
                    key={facility}
                    className="text-xs bg-[#FFF9EC] border border-[#E5D8B3] text-gray-700 px-3 py-1 rounded-full font-semibold"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 italic">No {isPg ? "facilities" : "amenities"} declared</span>
            )}
          </div>
        </div>

        {/* Neighbourhood Card */}
        <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} className="text-[#C89B1C]" /> Neighbourhood Ratings & Places
            </h3>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep("neighbourhood")}
                className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Pencil size={10} /> Edit
              </button>
            )}
          </div>
          <div className="space-y-3 text-sm">
            {formData.neighbourhood?.ratings && (
              <div>
                <span className="text-gray-400 font-semibold block text-xs uppercase tracking-wider mb-1.5">Locality Ratings</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-gray-700">
                  {Object.entries(formData.neighbourhood.ratings)
                    .filter(([_, val]) => Number(val) > 0)
                    .map(([key, val]) => (
                      <div key={key} className="flex justify-between bg-gray-50/50 p-1.5 rounded-lg border border-gray-100">
                        <span className="capitalize text-gray-500 font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span>{String(val)}/5</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div>
              <span className="text-gray-400 font-semibold block text-xs uppercase tracking-wider mb-1.5">Nearby Access</span>
              {getNearbyPlaces().length > 0 ? (
                <ul className="list-disc pl-4 text-xs space-y-1 text-gray-600 font-semibold">
                  {getNearbyPlaces().map((place, idx) => (
                    <li key={idx} className="capitalize">{place}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 italic text-xs">No nearby access points specified</span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <DollarSign size={16} className="text-[#C89B1C]" /> {isPg ? "Rent & Charges" : "Expected Price & Deposit"}
            </h3>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(isPg ? "pg_pricing" : "price")}
                className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Pencil size={10} /> Edit
              </button>
            )}
          </div>
          {isPg ? (
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Starting Room Rent:</span>
                <span className="font-bold text-[#C89B1C] text-sm sm:text-base">
                  {formatPrice(
                    (formData.pgDetails?.rooms || []).reduce(
                      (min, r) => (r.pricePerPerson > 0 && r.pricePerPerson < min ? r.pricePerPerson : min),
                      999999
                    ) === 999999
                      ? formData.price
                      : (formData.pgDetails?.rooms || []).reduce(
                          (min, r) => (r.pricePerPerson > 0 && r.pricePerPerson < min ? r.pricePerPerson : min),
                          999999
                        )
                  )} / person / mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Security Deposit:</span>
                <span className="font-bold text-gray-800">
                  {formData.pgDetails?.charges?.securityDeposit ? formatPrice(formData.pgDetails.charges.securityDeposit) : "Not Specified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Maintenance Charges:</span>
                <span className="font-bold text-gray-800">
                  {formData.pgDetails?.charges?.maintenanceCharges ? formatPrice(formData.pgDetails.charges.maintenanceCharges) : "Included"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Food Charges:</span>
                <span className="font-bold text-gray-800">
                  {formData.pgDetails?.charges?.foodCharges ? formatPrice(formData.pgDetails.charges.foodCharges) : "Included / N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Notice Period:</span>
                <span className="font-bold text-gray-800">{formData.pgDetails?.charges?.noticePeriod || "30 Days"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Rent Negotiable:</span>
                <span className="font-bold text-gray-800">{formData.ownerNegotiable ? "Yes" : "No"}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Expected Price / Rent:</span>
                <span className="font-bold text-[#C89B1C] text-sm sm:text-base">{formatPrice(formData.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Price Negotiable:</span>
                <span className="font-bold text-gray-800">{formData.ownerNegotiable ? "Yes" : "No"}</span>
              </div>
              {formData.maintenance !== undefined && formData.maintenance > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Maintenance:</span>
                  <span className="font-bold text-gray-800">{formatPrice(formData.maintenance)}</span>
                </div>
              )}
              {formData.deposit !== undefined && formData.deposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Deposit / Advance:</span>
                  <span className="font-bold text-gray-800">{formatPrice(formData.deposit)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Media & Photos Card with Thumbnail Gallery */}
        <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#C89B1C]" /> Photos & Media Gallery
            </h3>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(isPg ? "price" : "price")}
                className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Pencil size={10} /> Edit
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Total Uploaded Photos:</span>
              <span className="font-bold text-gray-800">
                {(formData.photos?.length || 0) +
                  (formData.existingPhotos?.length || 0) +
                  (formData.pgDetails?.rooms || []).reduce((sum, r) => sum + (r.photos?.length || 0), 0)}{" "}
                Files
              </span>
            </div>

            {/* Thumbnail Preview Grid */}
            {((formData.photos && formData.photos.length > 0) ||
              (formData.existingPhotos && formData.existingPhotos.length > 0) ||
              (formData.pgDetails?.rooms || []).some((r) => r.photos && r.photos.length > 0)) ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                {[
                  ...(formData.photos || []),
                  ...(formData.existingPhotos || []),
                  ...(formData.pgDetails?.rooms || []).flatMap((r) => r.photos || []),
                ].map((file: any, index: number) => {
                  let src = "";
                  if (typeof file === "string") {
                    if (file.startsWith("http://") || file.startsWith("https://") || file.startsWith("blob:")) {
                      src = file;
                    } else {
                      const clean = file.replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "");
                      src = `http://localhost:5000/uploads/properties/${clean}`;
                    }
                  } else if (file && typeof window !== "undefined" && file instanceof File) {
                    src = URL.createObjectURL(file);
                  }

                  if (!src) return null;

                  return (
                    <div key={index} className="relative h-20 w-full rounded-xl overflow-hidden border border-[#E5D8B3] bg-gray-100 shadow-2xs">
                      <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl text-amber-800 text-xs italic">
                No photos uploaded yet. Click "Edit" to add property or room photos.
              </div>
            )}
          </div>
        </div>

        {/* Owner Details Card */}
        <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-[#C89B1C]" /> Owner Information
            </h3>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep("owner")}
                className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Pencil size={10} /> Edit
              </button>
            )}
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Name:</span>
              <span className="font-bold text-gray-800">{formData.ownerName || "Owner"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Phone:</span>
              <span className="font-bold text-gray-800">{formData.ownerPhone || "—"}</span>
            </div>
            {formData.ownerType && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Owner Type:</span>
                <span className="font-bold text-gray-800 capitalize">{formData.ownerType}</span>
              </div>
            )}
            {formData.ownershipType && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Ownership:</span>
                <span className="font-bold text-gray-800 capitalize">{formData.ownershipType}</span>
              </div>
            )}
            {formData.numberOfOwners !== undefined && formData.numberOfOwners > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">No. of Owners:</span>
                <span className="font-bold text-gray-800">{formData.numberOfOwners}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pending Issues & Documents Summary Card */}
        <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Landmark size={16} className="text-[#C89B1C]" /> {isPg ? "Compliance & Issues" : "Compliance & Documents"}
            </h3>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(isPg ? "issues" : "documents")}
                className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Pencil size={10} /> Edit
              </button>
            )}
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Has Pending Issues:</span>
              <span className="font-bold text-gray-800 capitalize">
                {formData.pendingIssues?.hasPendingIssues === "yes"
                  ? "Yes"
                  : formData.pendingIssues?.hasPendingIssues === "not_sure"
                  ? "Not Sure"
                  : "No"}
              </span>
            </div>
            {formData.pendingIssues?.hasPendingIssues === "yes" && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Declared Issues:</span>
                <span className="font-bold text-red-600 bg-red-50 border border-red-100 text-xs px-2.5 py-0.5 rounded-full">
                  {getIssueCount()} Issues
                </span>
              </div>
            )}
            {!isPg && (
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Documents Uploaded:</span>
                <span className="font-bold text-[#C89B1C] bg-[#FFF9EC] border border-[#E5D8B3] text-xs px-2.5 py-0.5 rounded-full">
                  {getUploadedCount()} Files
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Agreement Details Card */}
        {(formData.purpose === "Rent" || formData.purpose === "Lease") && formData.agreementDetails && (
          <div className="bg-white border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-[#C89B1C]" /> Agreement Details
              </h3>
              {onEditStep && (
                <button
                  type="button"
                  onClick={() => onEditStep("agreement")}
                  className="text-[10px] sm:text-xs bg-[#FFF9EC] text-[#9A720C] border border-[#E5D8B3] hover:bg-[#FFF2D3] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Pencil size={10} /> Edit
                </button>
              )}
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Agreement Type:</span>
                <span className="font-bold text-gray-800">{formData.agreementDetails.agreementType || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">
                  {formData.purpose === "Lease" ? "Lease Amount:" : "Monthly Rent:"}
                </span>
                <span className="font-bold text-[#C89B1C]">
                  {formData.agreementDetails.amount ? `₹${formData.agreementDetails.amount.toLocaleString("en-IN")}` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Security Deposit:</span>
                <span className="font-bold text-gray-800">
                  {formData.agreementDetails.securityDeposit ? `₹${formData.agreementDetails.securityDeposit.toLocaleString("en-IN")}` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Duration:</span>
                <span className="font-bold text-gray-800">{formData.agreementDetails.duration || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Notice Period:</span>
                <span className="font-bold text-gray-800">{formData.agreementDetails.noticePeriod || "N/A"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAgreementModal(true)}
              className="w-full mt-2 py-2 px-3 bg-[#FFFDF6] border border-[#E8DCC1] hover:bg-[#FFF9EC] text-[#9A720C] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText size={14} /> View Agreement Details
            </button>
          </div>
        )}
      </div>

      {/* ✨ Eyva's Property Tips Section */}
      <EyvaPropertyTips formData={formData} onEditStep={onEditStep} />

      {/* Verification Notice */}
      <div className="bg-[#FFFDF9]/60 border border-[#E5D8B3] rounded-2xl p-4 sm:p-5 flex gap-3.5 items-start">
        <ShieldCheck className="text-[#C89B1C] shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-gray-800 text-sm">Listing Verification Status</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            All submitted listings are marked as <strong>Pending Verification</strong> upon completion. Our team reviews all documents and ownership certificates manually before approving.
          </p>
        </div>
      </div>

      {/* Action Save Draft */}
      {onSaveDraft && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onSaveDraft}
            className="bg-[#C89B1C] hover:bg-[#B58A16] text-white font-bold text-sm px-6 py-2.5 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
          >
            <CheckCircle2 size={16} />
            Save Draft
          </button>
        </div>
      )}

      {/* Agreement Details Modal Preview */}
      <AgreementDetailsModal
        open={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
        agreementDetails={formData.agreementDetails}
        purpose={formData.purpose}
      />
    </div>
  );
}
