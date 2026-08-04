"use client";

import {
  Calendar,
  IndianRupee,
  Upload,
} from "lucide-react";

import { PropertyFormData } from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<PropertyFormData>
  >;
}

export default function PricePhotosStep({
  formData,
  setFormData,
}: Props) {
  return (
    <div>
      {/* Header */}

      <h2 className="text-4xl font-bold text-[#161616]">
        Price & Description
      </h2>

      <p className="mt-2 text-lg text-[#6B7280]">
        Set the price and add property details
      </p>

      <div className="space-y-8 mt-10">

        {/* Price */}

        <div>
          <label className="block mb-3 text-lg font-medium">
            Expected Price (Total Price)
          </label>

          <div className="relative">
            <IndianRupee
              size={18}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-500
              "
            />

            <input
              type="number"
              placeholder="5000000"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    price: Number(
                      e.target.value
                    ),
                  })
                )
              }
              className="
                w-full
                h-16
                rounded-2xl
                border
                border-[#E5D8B3]
                pl-12
                pr-4
                text-lg
                outline-none
                focus:border-[#C89B1C]
              "
            />
          </div>
        </div>

        {/* Description */}

        <div>
          <label className="block mb-3 text-lg font-medium">
            Property Description
          </label>

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData(
                (prev) => ({
                  ...prev,
                  description:
                    e.target.value,
                })
              )
            }
            placeholder="Describe the property — highlight key features, nearby landmarks, society benefits..."
            className="
              w-full
              min-h-[140px]
              rounded-2xl
              border
              border-[#E5D8B3]
              p-5
              outline-none
              resize-none
              focus:border-[#C89B1C]
            "
          />
        </div>

        {/* Available From */}

        <div>
          <label className="block mb-3 text-lg font-medium">
            Available From
          </label>

          <div className="relative">
            <input
              type="date"
              value={
                formData.availableFrom
              }
              onChange={(e) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    availableFrom:
                      e.target.value,
                  })
                )
              }
              className="
                w-full
                h-16
                rounded-2xl
                border
                border-[#E5D8B3]
                px-5
                outline-none
                focus:border-[#C89B1C]
              "
            />

            <Calendar
              size={18}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                text-gray-500
                pointer-events-none
              "
            />
          </div>
        </div>

        {/* Upload */}

        <div>
          <label className="block mb-3 text-lg font-medium">
            Upload Photos
          </label>

          <label
            className="
              h-48
              border-2
              border-dashed
              border-[#E5D8B3]
              rounded-3xl
              flex
              flex-col
              items-center
              justify-center
              cursor-pointer
              hover:bg-[#FFFDF8]
              transition
            "
          >
            <Upload
              size={40}
              className="text-gray-500"
            />

            <p className="mt-4 text-2xl font-medium">
              Click to upload photos
            </p>

            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG, WEBP up to 10MB
              each. Min. 3 photos
              recommended.
            </p>

            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    photos: Array.from(
                      e.target.files ||
                        []
                    ),
                  })
                )
              }
            />
          </label>

          {formData.photos
            ?.length > 0 && (
            <p className="mt-3 text-sm text-[#C89B1C] font-medium">
              {
                formData.photos
                  .length
              }{" "}
              photo(s) selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
}