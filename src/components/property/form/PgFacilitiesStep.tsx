"use client";

import React from "react";
import { PropertyFormData } from "@/src/types/property";
import {
  Wifi,
  Utensils,
  Wind,
  WashingMachine,
  Shirt,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Car,
  ChevronUp,
  Flame,
  Tv,
  BookOpen,
  Users,
  Dumbbell,
  Briefcase,
  Refrigerator,
  Check,
} from "lucide-react";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

const pgFacilitiesList = [
  { id: "Wi-Fi", label: "Wi-Fi", icon: Wifi },
  { id: "Food", label: "Meals / Food", icon: Utensils },
  { id: "AC", label: "Air Conditioning", icon: Wind },
  { id: "Washing Machine", label: "Washing Machine", icon: WashingMachine },
  { id: "Laundry", label: "Laundry Service", icon: Shirt },
  { id: "Housekeeping", label: "Daily Housekeeping", icon: Sparkles },
  { id: "CCTV", label: "CCTV Surveillance", icon: ShieldAlert },
  { id: "Security", label: "24/7 Security Guard", icon: ShieldCheck },
  { id: "Power Backup", label: "Power Backup", icon: Zap },
  { id: "Parking", label: "Vehicle Parking", icon: Car },
  { id: "Lift", label: "Elevator / Lift", icon: ChevronUp },
  { id: "Hot Water", label: "Geyser / Hot Water", icon: Flame },
  { id: "Refrigerator", label: "Refrigerator", icon: Refrigerator },
  { id: "TV", label: "Common TV", icon: Tv },
  { id: "Common Kitchen", label: "Self Cooking Kitchen", icon: Utensils },
  { id: "Study Area", label: "Study Room", icon: BookOpen },
  { id: "Common Area", label: "Lounge / Common Area", icon: Users },
  { id: "Gym", label: "Fitness Gym", icon: Dumbbell },
  { id: "Workspace", label: "Co-Working Desk", icon: Briefcase },
];

export default function PgFacilitiesStep({ formData, setFormData }: Props) {
  const facilities: string[] = formData.pgDetails?.facilities || formData.amenities || [];

  const toggleFacility = (facilityId: string) => {
    const updated = facilities.includes(facilityId)
      ? facilities.filter((f) => f !== facilityId)
      : [...facilities, facilityId];

    setFormData((prev) => ({
      ...prev,
      amenities: updated,
      pgDetails: {
        ...(prev.pgDetails || {}),
        facilities: updated,
      },
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          PG Facilities & Amenities
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Select all facilities available for occupants in your PG / Co-Living property.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {pgFacilitiesList.map((item) => {
          const Icon = item.icon;
          const isSelected = facilities.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleFacility(item.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 cursor-pointer relative ${
                isSelected
                  ? "border-[#C89B1C] bg-[#FFF9EC] ring-2 ring-[#C89B1C]/20 shadow-2xs"
                  : "border-[#E6DCC2] bg-white hover:border-[#C89B1C]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-[#C89B1C] text-white" : "bg-[#FAF4E8] text-[#C89B1C]"
                  }`}
                >
                  <Icon size={18} />
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#C89B1C] text-white flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
              </div>

              <span className={`text-xs font-bold ${isSelected ? "text-[#C89B1C]" : "text-gray-800"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
