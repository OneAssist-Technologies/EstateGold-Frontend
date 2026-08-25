"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BedDouble,
  Bath,
  Scan,
  MapPin,
  Heart,
  Share2,
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

export default function PropertyListCard({
  property,
}: Props) {
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
        const res = await api.get(`/api/ai/property-highlights/${property._id}`);
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

  const image = getPhotoUrl(property.photos?.[0]);

  return (
    <motion.div
  whileHover={{
    y: -10,
    scale: 1.02,
  }}
  transition={{
    type: "spring",
    stiffness: 250,
    damping: 18,
  }}
   onClick={() =>
    router.push(`/property-detail/${property._id}`)
  }
>
    <div
      className="bg-white rounded-3xl border border-[#E8DCC1] overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="grid grid-cols-12">

        {/* Image */}

        <div className="col-span-12 sm:col-span-4 relative h-48 xs:h-56 sm:h-[260px]">

          <img
  src={image}
  alt={property.propertyType}
  className="w-full h-full object-cover"
/>

          <div
            className="absolute top-5 left-5 bg-[#C89B1C] text-white text-xs px-4 py-2 rounded-full"
          >
            {property.purpose}
          </div>

        </div>

        {/* Content */}

        <div className="col-span-12 sm:col-span-8 p-4 xs:p-5 sm:p-7 flex flex-col justify-between">

          <div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">

              <div>

                <h2 className="text-xl sm:text-2xl font-semibold text-[#161616]">
                  {property.propertyType}
                </h2>

                <div className="flex items-center gap-2 text-gray-500 mt-2">

                  <MapPin size={16} />

                  <span>
                    {property.locality}, {property.city}
                  </span>

                </div>

                {highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {highlights.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 uppercase tracking-wide shadow-3xs"
                      >
                        ✨ {tag}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 items-center">

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Favorite logic placeholder
                  }}
                  className="h-11 w-11 rounded-full border border-[#E8DCC1] flex items-center justify-center"
                >
                  <Heart size={18} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Share logic placeholder
                  }}
                  className="h-11 w-11 rounded-full border border-[#E8DCC1] flex items-center justify-center"
                >
                  <Share2 size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleToggleCompare}
                  className={`h-11 px-4 rounded-full border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isCompared
                      ? "border-[#C89B1C] text-[#C89B1C] bg-[#FFF9EC]"
                      : "border-[#E8DCC1] text-gray-700 hover:text-[#C89B1C] hover:border-[#C89B1C]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isCompared}
                    readOnly
                    className="h-3.5 w-3.5 rounded border-gray-300 text-[#C89B1C] focus:ring-[#C89B1C] pointer-events-none"
                  />
                  Compare
                </button>

              </div>

            </div>

            <div className="flex flex-wrap gap-4 sm:gap-8 mt-5 sm:mt-7 text-xs sm:text-sm">

              <div className="flex items-center gap-2">

                <BedDouble size={18} />

                <span>
                  {property.bedrooms} Beds
                </span>

              </div>

              <div className="flex items-center gap-2">

                <Bath size={18} />

                <span>
                  {property.bathrooms} Baths
                </span>

              </div>

              <div className="flex items-center gap-2">

                <Scan size={18} />

                <span>
                  {property.area} sq.ft
                </span>

              </div>

            </div>

            <p className="text-gray-600 mt-6 line-clamp-2">
              {property.description}
            </p>

            {/* Compatibility Match Score */}
            {matchData && (
              <div className="border-t border-[#F2EFE9] pt-3 mt-4 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Match Compatibility</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    matchData.score >= 90 ? "bg-green-50 text-green-700 border border-green-200" :
                    matchData.score >= 75 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    matchData.score >= 60 ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                    matchData.score >= 40 ? "bg-amber-50 text-amber-700 border border-[#FFF9EC]" :
                    "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {matchData.score}% Match ({matchData.label})
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

          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-end gap-4 mt-6 sm:mt-8">

            <div>

              <p className="text-sm text-gray-500">
                Starting From
              </p>

              <h2 className="text-4xl font-bold text-[#C89B1C]">
                ₹
                {property.price?.toLocaleString(
                  "en-IN"
                )}
              </h2>

            </div>

            <button
              className="bg-[#C89B1C] hover:bg-[#B68A16] text-white rounded-2xl px-8 h-14 font-medium transition"
            >
              View Details
            </button>

          </div>

        </div>

      </div>
    </div>
    </motion.div>
  );
}