"use client";

import {
  Wifi,
  Zap,
  Droplets,
  ShieldCheck,
  Trees,
  Volume2,
  Share2,
  Info,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function LocalityRatings({ property }: Props) {
  const n = property.neighbourhood || {};
  const r = n.ratings || {};

  const hasRatings =
    (r.connectivity && r.connectivity > 0) ||
    (r.safety && r.safety > 0) ||
    (r.powerSupply && r.powerSupply > 0) ||
    (r.waterSupply && r.waterSupply > 0) ||
    (r.noiseLevel && r.noiseLevel > 0) ||
    (r.internet && r.internet > 0) ||
    (r.greenery && r.greenery > 0);

  const hasNotes = !!n.notes && n.notes.trim() !== "";

  if (!hasRatings && !hasNotes) {
    return null;
  }

  const getScore = (val?: number) => (val && val > 0 ? val : 0);
  const getPct = (val?: number) => (val && val > 0 ? `${(val / 5) * 100}%` : "0%");

  const ratings = [
    { label: "Connectivity", icon: <Share2 size={14} />, score: getScore(r.connectivity), pct: getPct(r.connectivity) },
    { label: "Safety", icon: <ShieldCheck size={14} />, score: getScore(r.safety), pct: getPct(r.safety) },
    { label: "Power Supply", icon: <Zap size={14} />, score: getScore(r.powerSupply), pct: getPct(r.powerSupply) },
    { label: "Water Supply", icon: <Droplets size={14} />, score: getScore(r.waterSupply), pct: getPct(r.waterSupply) },
    { label: "Noise Level", icon: <Volume2 size={14} />, score: getScore(r.noiseLevel), pct: getPct(r.noiseLevel) },
    { label: "Internet", icon: <Wifi size={14} />, score: getScore(r.internet), pct: getPct(r.internet) },
    { label: "Greenery", icon: <Trees size={14} />, score: getScore(r.greenery), pct: getPct(r.greenery) },
  ];

  return (
    <div className="py-3 space-y-3 border-b border-[#ECE7DB]">
      {/* Ratings Container */}
      {hasRatings && (
        <div className="bg-[#FFFDF6] border border-[#F4E3B5] rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A720C] flex items-center gap-1.5">
            <span>★</span> Locality Ratings & Reviews
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {ratings.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="text-[#9A720C] shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xs ${
                        star <= item.score ? "text-amber-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-[11px] font-bold text-gray-800 ml-1.5">
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar Metrics */}
          <div className="pt-2 border-t border-[#F4E3B5] grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-[9px] font-semibold text-gray-500">
            {ratings.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <span className="block truncate">{item.label}</span>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9A720C] rounded-full"
                    style={{ width: item.pct }}
                  />
                </div>
                <span className="block text-[8px] text-[#9A720C] font-bold">
                  {item.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Locality Banner */}
      {hasNotes && (
        <div className="bg-[#FFFDF6] border border-[#F4E3B5] rounded-xl p-3 flex items-start gap-3">
          <div className="h-7 w-7 rounded-lg bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] flex items-center justify-center shrink-0 mt-0.5">
            <Info size={16} />
          </div>

          <div className="space-y-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900">
              About This Locality ({property.locality || "Locality"}, {property.city || "City"})
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
              {n.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
