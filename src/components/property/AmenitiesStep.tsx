"use client";

import { Check } from "lucide-react";
import { PropertyFormData } from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<PropertyFormData>
  >;
}

const amenities = [
  "Lift",
  "Power Backup",
  "Swimming Pool",
  "Gymnasium",
  "Security / CCTV",
  "Parking",
  "Clubhouse",
  "Children Play Area",
  "Garden",
  "Intercom",
  "Rainwater Harvesting",
  "Servant Quarter",
  "Gas Pipeline",
  "RO Water",
  "Sports Facility",
  "Shopping Complex",
];

export default function AmenitiesStep({
  formData,
  setFormData,
}: Props) {
  const toggleAmenity = (
    amenity: string
  ) => {
    const exists =
      formData.amenities.includes(
        amenity
      );

    if (exists) {
      setFormData((prev) => ({
        ...prev,
        amenities:
          prev.amenities.filter(
            (item) =>
              item !== amenity
          ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        amenities: [
          ...prev.amenities,
          amenity,
        ],
      }));
    }
  };

  return (
    <div>
      {/* Header */}

      <h2 className="text-4xl font-bold text-[#161616]">
        Amenities & Features
      </h2>

      <p className="mt-3 text-lg text-[#6B7280]">
        Select all that apply to this
        property
      </p>

      {/* Amenities Grid */}

      <div className="grid md:grid-cols-3 gap-4 mt-10">
        {amenities.map(
          (amenity) => {
            const selected =
              formData.amenities.includes(
                amenity
              );

            return (
              <button
                key={amenity}
                type="button"
                onClick={() =>
                  toggleAmenity(
                    amenity
                  )
                }
                className={`
                  h-14
                  rounded-2xl
                  border
                  px-4
                  flex
                  items-center
                  gap-4
                  transition-all
                  text-left
                  ${
                    selected
                      ? "border-[#C89B1C] bg-[#FFF8E8]"
                      : "border-[#E5D8B3] bg-white"
                  }
                `}
              >
                <div
                  className={`
                    h-6
                    w-6
                    rounded-full
                    border
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    ${
                      selected
                        ? "bg-[#C89B1C] border-[#C89B1C]"
                        : "border-[#D8C8A0]"
                    }
                  `}
                >
                  {selected && (
                    <Check
                      size={14}
                      className="text-white"
                    />
                  )}
                </div>

                <span className="text-base font-normal text-[#161616]">
                  {amenity}
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* Selected Count */}

      <div className="mt-8">
        <p className="text-lg text-[#6B7280]">
          {
            formData.amenities.length
          }{" "}
          amenities selected
        </p>
      </div>
    </div>
  );
}