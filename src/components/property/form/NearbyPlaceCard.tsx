"use client";

import { MapPin } from "lucide-react";

interface Place {
  enabled: boolean;
  name: string;
  distance: string;
}

interface Props {
  title: string;
  icon: React.ReactNode;
  value: Place;
  onChange: (value: Place) => void;
}

const distances = [
  "< 100 m",
  "< 250 m",
  "< 500 m",
  "< 1 km",
  "1 - 2 km",
  "2 - 5 km",
  "5+ km",
];

export default function NearbyPlaceCard({
  title,
  icon,
  value,
  onChange,
}: Props) {
  return (
    <div
      className={`
        rounded-2xl
        border
        transition-all
        duration-300
        ${
          value.enabled
            ? "border-[#C89B1C] bg-[#FFFDF8]"
            : "border-[#ECE7DB] bg-white"
        }
      `}
    >
      {/* Header */}

      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-xl bg-[#F6F2E8] flex items-center justify-center text-[#B8860B]"
          >
            {icon}
          </div>

          <span className="text-lg font-medium">
            {title}
          </span>
        </div>

        {/* Toggle */}

       <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();

    onChange({
      ...value,
      enabled: !value.enabled,
    });
  }}
  className={`
    relative
    inline-flex
    h-8
    w-16
    rounded-full
    transition-colors
    duration-300
    ${
      value.enabled
        ? "bg-[#C89B1C]"
        : "bg-[#E4DDCF]"
    }
  `}
>
  <span
    className={`
      absolute
      top-1
      left-1
      h-6
      w-6
      rounded-full
      bg-white
      shadow-md
      transition-transform
      duration-300
      ${
        value.enabled
          ? "translate-x-8"
          : "translate-x-0"
      }
    `}
  />
</button>
      </div>

      {/* Fields */}

      {value.enabled && (
        <div className="px-5 pb-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <label className="text-xs text-gray-500 uppercase tracking-wide">
                Name / Details
              </label>

              <div
                className="mt-2 h-12 rounded-xl border border-[#E5DDC9] px-4 flex items-center gap-3"
              >
                <MapPin
                  size={18}
                  className="text-gray-400"
                />

                <input
                  value={value.name}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      name: e.target.value,
                    })
                  }
                  placeholder={`e.g. ${title}`}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="col-span-4">
              <label className="text-xs text-gray-500 uppercase tracking-wide">
                Distance
              </label>

              <select
                value={value.distance}
                onChange={(e) =>
                  onChange({
                    ...value,
                    distance: e.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-[#E5DDC9] px-4 outline-none"
              >
                <option value="">
                  Select
                </option>

                {distances.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}