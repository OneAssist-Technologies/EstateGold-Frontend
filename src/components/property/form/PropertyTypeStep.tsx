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

const mainPropertyTypes = [
  "Apartment / Flat",
  "Independent House",
  "Villa",
  "Builder Floor",
  "Plot / Land",
  "Commercial Space",
  "Hotel / Resort",
  "PG / Hostel",
  "Builder / New Project",
];

const pgPropertyTypes = [
  "Villa",
  "Independent House",
  "Builder Floor",
  "PG / Hostel",
];

export default function PropertyTypeStep({
  value,
  purpose,
  onPurposeChange,
  onTypeChange,
}: Props) {
  const isPg = purpose === "PG / Co-Living" || purpose === "PG_CO_LIVING" || purpose === "PG";
  const displayedPropertyTypes = isPg ? pgPropertyTypes : mainPropertyTypes;

  const isPlotActive = !isPg && ["Plot / Land", "Residential Plot", "Agricultural Land"].includes(value);
  const isCommercialActive = !isPg && [
    "Commercial Space",
    "Office Space",
    "Shop / Retail",
    "Warehouse",
    "Industrial Property"
  ].includes(value);

  const handlePurposeSelect = (selectedPurpose: string) => {
    onPurposeChange(selectedPurpose);
    const selectedIsPg = selectedPurpose === "PG / Co-Living" || selectedPurpose === "PG_CO_LIVING" || selectedPurpose === "PG";
    if (selectedIsPg && !pgPropertyTypes.includes(value)) {
      onTypeChange("PG / Hostel");
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            "Sale",
            "Rent",
            "Lease",
            "PG / Co-Living",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handlePurposeSelect(item)}
              className={`
                h-12
                rounded-xl
                border
                font-bold
                text-xs sm:text-sm
                transition-all
                cursor-pointer
                ${(purpose === item || (item === "PG / Co-Living" && (purpose === "PG_CO_LIVING" || purpose === "PG / Co-Living")))
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

        <div className={`grid grid-cols-2 ${isPg ? "sm:grid-cols-4" : "sm:grid-cols-3"} gap-4`}>
          {displayedPropertyTypes.map((item) => {
            const isSelected =
              item === "Plot / Land"
                ? isPlotActive
                : item === "Commercial Space"
                  ? isCommercialActive
                  : value === item;

            return (
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
                  ${isSelected
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
                  className="h-8 w-8 rounded-lg bg-[#FAF4E8] flex items-center justify-center"
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
            );
          })}
        </div>
      </div>

      {/* Sub-selector for Plot / Land subtypes */}
      {isPlotActive && (
        <div className="mt-4 p-5 bg-[#FAF9F5] border border-[#E6DCC2] rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Select Plot / Land Sub-Type
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "Plot / Land", label: "General Plot / Land" },
              { id: "Residential Plot", label: "Residential Plot" },
              { id: "Agricultural Land", label: "Agricultural Land" },
            ].map((subType) => (
              <button
                key={subType.id}
                type="button"
                onClick={() => onTypeChange(subType.id)}
                className={`h-11 rounded-lg border font-bold text-xs transition-all flex items-center justify-center cursor-pointer ${value === subType.id
                    ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C] shadow-2xs"
                    : "border-[#E6DCC2] bg-white hover:border-[#C89B1C] text-gray-700"
                  }`}
              >
                {subType.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sub-selector for Commercial Space subtypes */}
      {isCommercialActive && (
        <div className="mt-4 p-5 bg-[#FAF9F5] border border-[#E6DCC2] rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Select Commercial Sub-Type
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: "Commercial Space", label: "General Commercial" },
              { id: "Office Space", label: "Office Space" },
              { id: "Shop / Retail", label: "Shop / Retail" },
              { id: "Warehouse", label: "Warehouse" },
              { id: "Industrial Property", label: "Industrial Property" },
            ].map((subType) => (
              <button
                key={subType.id}
                type="button"
                onClick={() => onTypeChange(subType.id)}
                className={`h-11 rounded-lg border font-bold text-xs transition-all flex items-center justify-center cursor-pointer ${value === subType.id
                    ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C] shadow-2xs"
                    : "border-[#E6DCC2] bg-white hover:border-[#C89B1C] text-gray-700"
                  }`}
              >
                {subType.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}