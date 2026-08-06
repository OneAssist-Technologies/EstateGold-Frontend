"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface ServiceAreaMapProps {
  latitude: number;
  longitude: number;
  radiusKm: number;
  flyToTrigger?: number;
  onMarkerDragEnd: (lat: number, lng: number) => void;
}

const ServiceAreaMapInner = dynamic(
  () => import("./ServiceAreaMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[260px] rounded-2xl bg-[#FAFAF8] border border-[#ECE7DB] flex flex-col items-center justify-center text-gray-400 gap-2">
        <Loader2 size={24} className="animate-spin text-[#C89B1C]" />
        <span className="text-xs font-medium">Loading Interactive Map...</span>
      </div>
    ),
  }
);

export default function ServiceAreaMap(props: ServiceAreaMapProps) {
  return (
    <div className="w-full h-[260px] lg:h-[280px] rounded-2xl overflow-hidden border border-[#ECE7DB] shadow-xs relative">
      <ServiceAreaMapInner {...props} />
    </div>
  );
}
