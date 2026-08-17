import {
  Building2,
} from "lucide-react";

interface Props {
  value: string;
  purpose: string;

  onPurposeChange: (
    value: string
  ) => void;

  onTypeChange: (
    value: string
  ) => void;
}

const propertyTypes = [
  "Apartment / Flat",
  "Independent House",
  "Villa",
  "Builder Floor",
  "Plot / Land",
  "Residential Plot",
  "Agricultural Land",
  "Commercial Space",
  "Office Space",
  "Shop / Retail",
  "Warehouse",
  "Industrial Property",
  "Hotel / Resort",
  "PG / Hostel",
  "Builder / New Project",
];

export default function PropertyTypeStep({
  value,
  purpose,
  onPurposeChange,
  onTypeChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold font-serif text-gray-900">
          What are you listing?
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          Select the property type and purpose
        </p>
      </div>

      {/* Purpose */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Purpose
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {[
            "Sale",
            "Rent",
            "PG / Coliving",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onPurposeChange(item)}
              className={`
                h-12
                rounded-xl
                border
                font-bold
                text-sm
                transition-all
                cursor-pointer
                ${
                  purpose === item
                    ? `
                    border-[#C89B1C]
                    bg-[#FFF9EC]
                    text-[#C89B1C]
                  `
                    : `
                    border-[#E6DCC2]
                    bg-white
                    hover:border-[#C89B1C]
                    text-gray-700
                  `
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Property Type
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {propertyTypes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onTypeChange(item)}
              className={`
                h-24
                rounded-xl
                border
                p-3.5
                text-left
                transition-all
                flex
                flex-col
                justify-between
                cursor-pointer
                ${
                  value === item
                    ? `
                    border-[#C89B1C]
                    bg-[#FFF9EC]
                    shadow-2xs
                  `
                    : `
                    border-[#E6DCC2]
                    bg-white
                    hover:border-[#C89B1C]
                  `
                }
              `}
            >
              <div
                className="
                  h-8
                  w-8
                  rounded-lg
                  bg-[#FAF4E8]
                  flex
                  items-center
                  justify-center
                "
              >
                <Building2
                  size={16}
                  className="text-[#C89B1C]"
                />
              </div>

              <span className="text-xs font-bold text-gray-800">
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}