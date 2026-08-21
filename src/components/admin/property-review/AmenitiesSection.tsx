"use client";

import {
  CheckCircle2,
  Shield,
  Car,
  Trees,
  Dumbbell,
  Waves,
  Building2,
  Wifi,
  Zap,
  CircleDot,
  Bike,
  Warehouse,
  CookingPot,
  Flame,
  ShieldCheck,
  ParkingCircle,
} from "lucide-react";


interface Props {
  amenities: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  "Swimming Pool": <Waves size={14} />,
  Gym: <Dumbbell size={14} />,
  Clubhouse: <Building2 size={14} />,
  Parking: <Car size={14} />,
  Security: <Shield size={14} />,
  CCTV: <ShieldCheck size={14} />,
  Lift: <Building2 size={14} />,
  Garden: <Trees size={14} />,
  "Power Backup": <Zap size={14} />,
  WiFi: <Wifi size={14} />,
  "Sports Facility": <Bike size={14} />,
  "Visitor Parking": <ParkingCircle size={14} />,
  "Fire Safety": <Flame size={14} />,
  "Community Hall": <Warehouse size={14} />,
  Cafeteria: <CookingPot size={14} />,
};

export default function AmenitiesSection({
  amenities,
}: Props) {
  return (
    <section className="mt-8">

      <h2
        className="text-2xl font-bold text-[#161616]"
      >
        Amenities
      </h2>

      {amenities.length === 0 ? (

        <div
          className="mt-4 text-sm text-gray-500"
        >
          No amenities available.
        </div>

      ) : (

        <div
          className="mt-5 flex flex-wrap gap-3"
        >

          {amenities.map((item) => (

            <div
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-[#E7D8B6] bg-[#FFFDF8] px-4 py-2 transition hover:bg-[#FFF8EA]"
            >

           <span className="text-[#C89B1C]">
  {amenityIcons[item] ?? <CircleDot size={14} />}
</span>
              <span
                className="text-[14px] font-medium text-[#161616]"
              >
                {item}
              </span>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}