"use client";
import type { ReactNode } from "react";

import {
  Dumbbell,
  Waves,
  ShieldCheck,
  Car,
  Trees,
  Building2,
  Wifi,
  Zap,
  Wind,
  Gamepad2,
  School,
  Hospital,
  ShoppingBag,
  CircleParking,
  Home,
  CheckCircle2,
} from "lucide-react";

interface Props {
  amenities: string[];
}

export default function Amenities({ amenities = [] }: Props) {
  const displayAmenities =
    amenities.length > 0
      ? amenities
      : [
          "Swimming Pool",
          "Gymnasium",
          "24/7 Security",
          "Lift",
          "Power Backup",
          "Club House",
          "Children Play Area",
          "Car Parking",
        ];

  return (
    <div className="py-3 border-b border-[#ECE7DB] space-y-2.5">
      <h2 className="text-base font-bold text-[#161616]">
        Amenities
      </h2>

      <div className="flex flex-wrap gap-2">
        {displayAmenities.map((item) => (
          <span
            key={item}
            className="px-3 py-1.5 rounded-full bg-[#FFFDF6] border border-[#F4E3B5] text-[#9A720C] text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <span className="text-[11px]">✦</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}