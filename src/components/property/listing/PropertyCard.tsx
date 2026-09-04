"use client";

import { useEffect, useState } from "react";
import {
  BedDouble,
  Bath,
  Heart,
  MapPin,
  Lock,
  User,
  Check,
  Sparkles,
} from "lucide-react";
import { Property } from "../../../types/property";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { useCompareSession } from "../../../hooks/useCompareSession";
import { addPropertyToCompare, removePropertyFromCompare } from "../../../services/compareService";;
import { calculatePropertyMatchScore } from "../../../utils/matchScore";

interface Props {
  property: Property;
}
function formatPrice(price?: number): string {
  if (price === undefined || price === null || isNaN(price)) return "₹0";
  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2);
    return `₹${cr.replace(/\.00$/, "")} Cr`;
  } else if (price >= 100000) {
    const l = (price / 100000).toFixed(1);
    return `₹${l.replace(/\.0$/, "")} L`;
  } else {
    return `₹${price.toLocaleString("en-IN")}`;
  }
}

export default function PropertyCard({ property }: Props) {
  const router = useRouter();
  const session = useCompareSession();
  const isCompared = session.properties.some((p) => p._id === property._id);

  const [matchData, setMatchData] = useState<any>(null);

  useEffect(() => {
    const updateScore = () => {
      const saved = localStorage.getItem("estategold_user_preferences");
      if (saved) {
        try {
          const prefs = JSON.parse(saved);
          const result = calculatePropertyMatchScore(property, prefs);
          setMatchData(result);
          return;
        } catch (e) {
          console.error(e);
        }
      }
      
      if ((property as any).matchScore !== undefined) {
        let label = "Low Match";
        const score = (property as any).matchScore;
        if (score >= 90) label = "Excellent Match";
        else if (score >= 75) label = "Very Good Match";
        else if (score >= 60) label = "Good Match";
        else if (score >= 40) label = "Partial Match";

        setMatchData({
          score,
          label,
          matchedReasons: (property as any).matchedDetails || [],
          mismatchedReasons: (property as any).mismatchedDetails || [],
          unverifiedReasons: []
        });
      } else {
        setMatchData(null);
      }
    };

    updateScore();
    window.addEventListener("estategold_user_preferences_changed", updateScore);
    return () => {
      window.removeEventListener("estategold_user_preferences_changed", updateScore);
    };
  }, [property]);

  const [highlights, setHighlights] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const fetchHighlights = async () => {
      try {
        const res = await api.get(`/ai/property-highlights/${property._id}`);
        if (res.data && res.data.success && active) {
          setHighlights(res.data.tags || []);
        }
      } catch (err) {
        // Quietly fail
      }
    };
    fetchHighlights();
    return () => {
      active = false;
    };
  }, [property._id]);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompared) {
      removePropertyFromCompare(property._id);
    } else {
      const res = addPropertyToCompare(property);
      if (!res.success && res.message) {
        alert(res.message);
      }
    }
  };

  const getPhotoUrl = (raw?: string) => {
    if (!raw) return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    const clean = raw.replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "");
    return `http://localhost:5000/uploads/properties/${clean}`;
  };

  const photoUrl = getPhotoUrl(property.photos?.[0]);

  const purpLower = (property.purpose || "").toLowerCase();
  const isPgPurpose =
    purpLower === "pg / co-living" ||
    purpLower === "pg_co_living" ||
    purpLower === "pg" ||
    purpLower === "pg_coliving" ||
    purpLower === "co-living";

  const hasPgRooms = Array.isArray(property.pgDetails?.rooms) && property.pgDetails.rooms.length > 0;
  const isPg =
    isPgPurpose ||
    (Boolean(property.pgDetails?.pgName || hasPgRooms) &&
      purpLower !== "sale" &&
      purpLower !== "buy" &&
      purpLower !== "sell" &&
      purpLower !== "for sale" &&
      purpLower !== "rent" &&
      purpLower !== "lease");

  const totalAvailableBeds = (property.pgDetails?.rooms || []).reduce(
    (sum, r) => sum + (r.availableBeds || 0),
    (property as any).availableBeds || 0
  );

  const pgMinPrice = (property.pgDetails?.rooms || []).reduce(
    (min, r) => (r.pricePerPerson > 0 && r.pricePerPerson < min ? r.pricePerPerson : min),
    999999
  );
  const pgDisplayPrice = pgMinPrice === 999999 ? property.price || 0 : pgMinPrice;

  const displayTitle = isPg
    ? property.pgDetails?.pgName || `${property.propertyType} PG in ${property.locality || property.city}`
    : property.bedrooms && property.propertyType
      ? `${property.bedrooms} BHK ${property.propertyType}${property.locality ? " in " + property.locality : ""}`
      : property.propertyType || "Luxury Property";

  const isSale =
    (property.purpose || "").toLowerCase() === "sale" ||
    (property.purpose || "").toLowerCase() === "buy" ||
    (property.purpose || "").toLowerCase() === "sell" ||
    (property.purpose || "").toLowerCase() === "for sale";

  const isLease =
    (property.purpose || "").toLowerCase() === "lease" ||
    (property.purpose || "").toLowerCase() === "for lease";

  const isVideo = (url: string) => {
    if (!url) return false;
    const clean = url.toLowerCase().split("?")[0];
    return (
      clean.endsWith(".mp4") ||
      clean.endsWith(".webm") ||
      clean.endsWith(".ogg") ||
      clean.endsWith(".mov") ||
      clean.endsWith(".m4v") ||
      clean.endsWith(".mkv")
    );
  };

  const isCoverVideo = isVideo(photoUrl);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => router.push(`/property-detail/${property._id}`)}
      className="bg-white rounded-2xl border border-[#ECE7DB] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Section */}
      <div className="relative h-[210px] sm:h-[220px] w-full overflow-hidden bg-gray-900">
        {isCoverVideo ? (
          <video
            src={photoUrl}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
        ) : (
          <img
            src={photoUrl}
            alt={displayTitle}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Gradient Overlay for Price Visibility */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          {isPg ? (
            <span className="bg-[#C89B1C] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
              PG / Co-Living
            </span>
          ) : isSale ? (
            <span className="bg-[#9A720C] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
              For Sale
            </span>
          ) : isLease ? (
            <span className="bg-[#9A720C] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
              For Lease
            </span>
          ) : (
            <span className="bg-[#9A720C] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
              For Rent
            </span>
          )}

          {isPg && property.pgDetails?.suitableFor && (
            <span className="bg-[#FFF9EC] text-[#C89B1C] border border-[#F3E5C8] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
              For {property.pgDetails.suitableFor}
            </span>
          )}

          {property.availabilityStatus === "hold" && (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
              <Lock size={11} /> On Hold
            </span>
          )}

          {property.availabilityStatus === "sold" && (
            <span className="bg-red-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
              <Check size={11} /> Sold
            </span>
          )}

          {property.availabilityStatus === "rented" && (
            <span className="bg-blue-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
              <Check size={11} /> Rented
            </span>
          )}

          <span className="bg-[#0DBB58] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
            <Check size={11} /> Verified
          </span>
        </div>

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 shadow-2xs transition-colors cursor-pointer"
        >
          <Heart size={16} />
        </button>

        {/* Price Overlay on Bottom-Left */}
        <div className="absolute bottom-3 left-3.5 text-white text-xl sm:text-2xl font-bold tracking-tight drop-shadow-md flex items-baseline gap-1">
          {isPg ? `₹${pgDisplayPrice.toLocaleString("en-IN")}` : formatPrice(property.price)}
          {isPg && <span className="text-[11px] font-normal text-gray-200">/ person / mo</span>}
        </div>

        {/* Posted By (Owner/Agent) Badge at Bottom Right of Image */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="bg-[#9A720C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1 border border-[#B88A1A]">
            <User size={10} /> {property.listingType === "another_owner" ? "Agent" : "Owner"}
          </span>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-[#9A720C] transition-colors">
            {displayTitle}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span className="line-clamp-1">
              {property.locality ? `${property.locality}, ` : ""}
              {property.city}
            </span>
          </div>

          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {highlights.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wide shadow-3xs"
                >
                  <Sparkles size={9} className="text-[#9A720C]" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Specs Row */}
        <div className="border-t border-[#F2EFE9] pt-3 flex items-center justify-between text-xs text-gray-600 font-medium">
          {(() => {
            const pType = (property.propertyType || "").toLowerCase();
            const isPlotOrLand = /plot|land|agricultural/i.test(pType);
            const isCommercial = /office|commercial|shop|retail|industrial|warehouse|hotel/i.test(pType);
            const isPGHostel = /pg|hostel/i.test(pType);

            if (isPlotOrLand) {
              const plotItems = [];
              if (property.facing || (property as any).plotFacing) {
                plotItems.push(`${property.facing || (property as any).plotFacing} Facing`);
              }
              if ((property as any).cornerPlot) {
                plotItems.push("Corner Plot");
              }
              const areaVal = (property.area || (property as any).plotArea || 0).toLocaleString();
              plotItems.push(`${areaVal} sq ft`);

              return (
                <div className="flex items-center gap-2 flex-wrap">
                  {plotItems.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      {idx > 0 && <span className="text-gray-300">•</span>}
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              );
            }

            if (isCommercial) {
              const commItems = [];
              if ((property as any).workstations && (property as any).workstations > 0) {
                commItems.push(`${(property as any).workstations} Workstations`);
              } else if ((property as any).cabins && (property as any).cabins > 0) {
                commItems.push(`${(property as any).cabins} Cabins`);
              }
              if (property.bathrooms && property.bathrooms > 0) {
                commItems.push(`${property.bathrooms} Washroom${property.bathrooms > 1 ? "s" : ""}`);
              }
              if ((property as any).floor !== undefined && (property as any).floor > 0) {
                commItems.push(`Floor ${(property as any).floor}`);
              }
              commItems.push(`${(property.area || 0).toLocaleString()} sq ft`);

              return (
                <div className="flex items-center gap-2 flex-wrap">
                  {commItems.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      {idx > 0 && <span className="text-gray-300">•</span>}
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              );
            }

            if (isPGHostel) {
              const pgItems = [];
              if ((property as any).roomSharingType) {
                pgItems.push(`${(property as any).roomSharingType}`);
              }
              if ((property as any).availableBeds) {
                pgItems.push(`${(property as any).availableBeds} Beds Avail.`);
              } else if (property.bedrooms) {
                pgItems.push(`${property.bedrooms} Beds`);
              }
              if (property.area && property.area > 0) {
                pgItems.push(`${property.area.toLocaleString()} sq ft`);
              }

              return (
                <div className="flex items-center gap-2 flex-wrap">
                  {pgItems.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      {idx > 0 && <span className="text-gray-300">•</span>}
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              );
            }

            return (
              <div className="flex items-center gap-2 flex-wrap">
                <span>{property.bedrooms || 0} Beds</span>
                <span className="text-gray-300">•</span>
                <span>{property.bathrooms || 0} Baths</span>
                <span className="text-gray-300">•</span>
                <span>{(property.area || 0).toLocaleString()} sq ft</span>
              </div>
            );
          })()}

          {!/plot|land|agricultural/i.test(property.propertyType || "") && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAFAF8] border border-[#E8E1D4] text-[10px] font-semibold text-gray-500 shrink-0">
              {property.furnishing === "Fully Furnished"
                ? "Fully"
                : property.furnishing === "Semi Furnished"
                  ? "Semi"
                  : property.furnishing || "Unfurnished"}
            </span>
          )}
        </div>

        {/* Compare Checkbox Row */}
        <div 
          onClick={handleToggleCompare}
          className="border-t border-[#F2EFE9] pt-3 flex items-center gap-2 cursor-pointer select-none hover:text-[#9A720C] transition-all"
        >
          <input
            type="checkbox"
            checked={isCompared}
            readOnly
            className="h-4 w-4 rounded border-gray-300 text-[#9A720C] focus:ring-[#9A720C] cursor-pointer"
          />
          <span className={`text-xs font-bold ${isCompared ? "text-[#9A720C]" : "text-gray-700"}`}>
            Add to Compare
          </span>
        </div>

        {/* Compatibility Match Score */}
        {matchData && (
          <div className="border-t border-[#F2EFE9] pt-3 mt-3 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Match Compatibility</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                matchData.score >= 90 ? "bg-green-50 text-green-700 border border-green-200" :
                matchData.score >= 75 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                matchData.score >= 60 ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                matchData.score >= 40 ? "bg-amber-50 text-amber-700 border border-[#FFF9EC]" :
                "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {matchData.score}% Match
              </span>
            </div>
            {/* Health Bar Fill */}
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  matchData.score >= 90 ? "bg-green-500" :
                  matchData.score >= 75 ? "bg-emerald-500" :
                  matchData.score >= 60 ? "bg-yellow-500" :
                  matchData.score >= 40 ? "bg-amber-500" :
                  "bg-red-500"
                }`}
                style={{ width: `${matchData.score}%` }}
              />
            </div>
            {/* Matched Details Breakdown */}
            <div className="mt-2 flex flex-wrap gap-1">
              {matchData.matchedReasons.map((det: string, i: number) => (
                <span key={i} className="text-[9px] font-semibold text-green-700 bg-green-50/70 border border-green-100 rounded-md px-1.5 py-0.5">
                  ✓ {det}
                </span>
              ))}
              {matchData.mismatchedReasons.map((det: string, i: number) => (
                <span key={i} className="text-[9px] font-semibold text-red-700 bg-red-50/70 border border-red-100 rounded-md px-1.5 py-0.5">
                  ✕ {det}
                </span>
              ))}
              {matchData.unverifiedReasons.map((det: string, i: number) => (
                <span key={i} className="text-[9px] font-semibold text-amber-700 bg-amber-50/70 border border-amber-100 rounded-md px-1.5 py-0.5">
                  ⚠ {det}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}