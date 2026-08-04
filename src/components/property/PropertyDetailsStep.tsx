"use client";
import { motion } from "framer-motion";
import {
  Bed,
  Bath,
  Layers3,
  Scan,
  Building2,
  Car,
} from "lucide-react";

import { PropertyFormData } from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<PropertyFormData>
  >;
}

const furnishingOptions = [
  "Unfurnished",
  "Semi Furnished",
  "Fully Furnished",
];

export default function PropertyDetailsStep({
  formData,
  setFormData,
}: Props) {
 const numberButton = (
  key: string,
  value: string | number,
  selected: boolean,
  onClick: () => void
) => (
  <motion.button
    key={key}
    type="button"
    whileHover={{
      scale: 1.05,
    }}
    whileTap={{
      scale: 0.95,
    }}
    animate={{
      scale: selected ? 1.05 : 1,
    }}
    transition={{
      duration: 0.2,
    }}
    onClick={onClick}
    className={`
      h-12
      min-w-[48px]
      px-4
      rounded-xl
      border
      font-medium
      transition-all
      ${
        selected
          ? "bg-[#C89B1C] border-[#C89B1C] text-white shadow-md"
          : "border-[#E5D8B3] text-[#161616] bg-white"
      }
    `}
  >
    {value}
  </motion.button>
);

  return (
    <div>
      {/* Header */}

      <h2 className="text-4xl font-bold text-[#161616]">
        Property Details
      </h2>

      <p className="mt-3 text-lg text-[#6B7280]">
        Tell buyers about the
        specifications
      </p>

      {/* Bedroom Bathroom Balcony */}

      <div className="grid md:grid-cols-3 gap-10 mt-10">

        {/* Bedrooms */}

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bed size={18} />

            <label className="font-medium text-lg">
              Bedrooms
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map(
  (item) =>
    numberButton(
      `bedroom-${item}`,
      item,
      formData.bedrooms === item,
      () =>
        setFormData((prev) => ({
          ...prev,
          bedrooms: item,
        }))
    )
)}

{numberButton(
  "bedroom-5plus",
  "5+",
  formData.bedrooms > 5,
  () =>
    setFormData((prev) => ({
      ...prev,
      bedrooms: 6,
    }))
)}
          
          </div>
        </div>

        {/* Bathrooms */}

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bath size={18} />

            <label className="font-medium text-lg">
              Bathrooms
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
         {[1, 2, 3, 4].map(
  (item) =>
    numberButton(
      `bathroom-${item}`,
      item,
      formData.bathrooms === item,
      () =>
        setFormData((prev) => ({
          ...prev,
          bathrooms: item,
        }))
    )
)}

{numberButton(
  "bathroom-4plus",
  "4+",
  formData.bathrooms > 4,
  () =>
    setFormData((prev) => ({
      ...prev,
      bathrooms: 5,
    }))
)}
          </div>
        </div>

        {/* Balconies */}

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Layers3 size={18} />

            <label className="font-medium text-lg">
              Balconies
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
         {[0, 1, 2, 3].map(
  (item) =>
    numberButton(
      `balcony-${item}`,
      item,
      formData.balconies === item,
      () =>
        setFormData((prev) => ({
          ...prev,
          balconies: item,
        }))
    )
)}

{numberButton(
  "balcony-3plus",
  "3+",
  formData.balconies > 3,
  () =>
    setFormData((prev) => ({
      ...prev,
      balconies: 4,
    }))
)}
          </div>
        </div>
      </div>

      {/* Area + Floor */}

      <div className="grid md:grid-cols-2 gap-6 mt-12">

        <div>
          <label className="flex items-center gap-2 mb-3 font-medium text-lg">
            <Scan size={18} />
            Built-up Area (sq ft)
          </label>

          <input
            type="number"
            placeholder="e.g. 1200"
            value={
              formData.area || ""
            }
            onChange={(e) =>
              setFormData(
                (prev) => ({
                  ...prev,
                  area: Number(
                    e.target.value
                  ),
                })
              )
            }
            className="
              w-full
              h-14
              px-5
              rounded-2xl
              border
              border-[#E5D8B3]
              outline-none
            "
          />
        </div>

        <div>
          <label className="flex items-center gap-2 mb-3 font-medium text-lg">
            <Building2 size={18} />
            Floor Number
          </label>

          <input
            type="number"
            placeholder="e.g. 5"
            value={
              formData.floor || ""
            }
            onChange={(e) =>
              setFormData(
                (prev) => ({
                  ...prev,
                  floor: Number(
                    e.target.value
                  ),
                })
              )
            }
            className="
              w-full
              h-14
              px-5
              rounded-2xl
              border
              border-[#E5D8B3]
              outline-none
            "
          />
        </div>
      </div>

      {/* Furnishing */}

      <div className="mt-12">
        <label className="text-2xl font-semibold">
          Furnishing Status
        </label>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {furnishingOptions.map(
            (item) => (
             <motion.button
  key={item}
  whileHover={{
    scale: 1.03,
  }}
  whileTap={{
    scale: 0.97,
  }}
  animate={{
    scale:
      formData.furnishing === item
        ? 1.03
        : 1,
  }}
  transition={{
    duration: 0.2,
  }}
  type="button"
  onClick={() =>
    setFormData((prev) => ({
      ...prev,
      furnishing: item,
    }))
  }
  className={`
    h-14
    rounded-2xl
    border
    font-medium
    ${
      formData.furnishing === item
        ? "bg-[#FFF8E8] border-[#C89B1C] text-[#C89B1C]"
        : "border-[#E5D8B3]"
    }
  `}
>
  {item}
</motion.button>
            )
          )}
        </div>
      </div>

      {/* Parking */}

      <div className="mt-10 flex items-center gap-4">

        <button
          type="button"
          onClick={() =>
            setFormData(
              (prev) => ({
                ...prev,
                parking:
                  !prev.parking,
              })
            )
          }
          className={`
            relative
            h-8
            w-16
            rounded-full
            transition-all
            ${
              formData.parking
                ? "bg-[#C89B1C]"
                : "bg-[#E8E0CC]"
            }
          `}
        >
          <span
            className={`
              absolute
              top-1
              h-6
              w-6
              rounded-full
              bg-white
              transition-all
              ${
                formData.parking
                  ? "left-9"
                  : "left-1"
              }
            `}
            
          />
        </button>

        <div className="flex items-center gap-2">
          <Car
            size={18}
            className="text-[#6B7280]"
          />

          <span className="text-2xl text-[#161616]">
            Car Parking Available
          </span>
        </div>
      </div>
    </div>
  );
}