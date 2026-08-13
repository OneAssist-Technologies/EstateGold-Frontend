"use client";

import { ReactNode } from "react";
import {
  GraduationCap,
  Building2,
  Stethoscope,
  ShoppingBag,
  Train,
  UtensilsCrossed,
  Trees,
  Plane,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function Neighbourhood({ property }: Props) {
  const n = property.neighbourhood || {};
  const places = n.nearbyPlaces || {};

  const categoryMeta: Record<string, { label: string; icon: ReactNode; color: string }> = {
    school: { label: "SCHOOL", icon: <GraduationCap size={16} />, color: "bg-amber-100 text-amber-700" },
    college: { label: "COLLEGE", icon: <Building2 size={16} />, color: "bg-purple-100 text-purple-700" },
    hospital: { label: "HOSPITAL", icon: <Stethoscope size={16} />, color: "bg-rose-100 text-rose-700" },
    mall: { label: "MALL", icon: <ShoppingBag size={16} />, color: "bg-orange-100 text-orange-700" },
    metro: { label: "METRO", icon: <Train size={16} />, color: "bg-indigo-100 text-indigo-700" },
    busStand: { label: "BUS STAND", icon: <Train size={16} />, color: "bg-emerald-100 text-emerald-700" },
    park: { label: "PARK", icon: <Trees size={16} />, color: "bg-teal-100 text-teal-700" },
    airport: { label: "AIRPORT", icon: <Plane size={16} />, color: "bg-sky-100 text-sky-700" },
    temple: { label: "TEMPLE", icon: <Building2 size={16} />, color: "bg-yellow-100 text-yellow-700" },
  };

  // Build active items from property.neighbourhood.nearbyPlaces
  const activePlaces: Array<{ category: string; name: string; distance: string; icon: ReactNode; color: string }> = [];

  Object.entries(places).forEach(([key, val]: [string, any]) => {
    if (val && (val.enabled || val.name || val.distance)) {
      const meta = categoryMeta[key] || {
        label: key.toUpperCase(),
        icon: <Building2 size={16} />,
        color: "bg-gray-100 text-gray-700",
      };
      activePlaces.push({
        category: meta.label,
        name: val.name || `${property.city || "Local"} ${meta.label}`,
        distance: val.distance ? (val.distance.toLowerCase().includes("km") || val.distance.toLowerCase().includes("m") ? val.distance : `${val.distance} KM`) : "0.5 KM",
        icon: meta.icon,
        color: meta.color,
      });
    }
  });

  // Also include custom landmarks if saved
  if (Array.isArray(n.landmarks)) {
    n.landmarks.forEach((l: any) => {
      if (l.name) {
        activePlaces.push({
          category: "LANDMARK",
          name: l.name,
          distance: l.distance ? (l.distance.toLowerCase().includes("km") || l.distance.toLowerCase().includes("m") ? l.distance : `${l.distance} KM`) : "Near locality",
          icon: <UtensilsCrossed size={16} />,
          color: "bg-emerald-100 text-emerald-700",
        });
      }
    });
  }

  if (activePlaces.length === 0) {
    return null;
  }

  return (
    <div className="py-3 border-b border-[#ECE7DB] space-y-3">
      <div>
        <h2 className="text-base font-bold font-serif text-[#161616]">
          Neighbourhood & Surroundings
        </h2>
        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
          What's nearby this property
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activePlaces.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#FFFDF6] border border-[#F4E3B5] rounded-xl p-3 space-y-2 hover:border-[#9A720C] transition-all"
          >
            <div className="flex items-center justify-between">
              <div
                className={`h-7 w-7 rounded-lg ${item.color} flex items-center justify-center`}
              >
                {item.icon}
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 truncate">
                {item.name}
              </h4>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5 flex items-center gap-1">
                <span className="text-[#9A720C]">📍</span> {item.distance}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
