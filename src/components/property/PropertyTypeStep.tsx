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
  "Plot / Land",
  "Commercial Space",
  "Builder Floor",
];

export default function PropertyTypeStep({
  value,
  purpose,
  onPurposeChange,
  onTypeChange,
}: Props) {
  return (
    <div>

      {/* Heading */}

      <h2 className="text-[42px] font-bold font-playfair text-[#161616]">
        What are you listing?
      </h2>

      <p className="text-gray-500 text-lg mt-2">
        Select the property type and purpose
      </p>

      {/* Purpose */}

      <div className="mt-10">
        <h3 className="font-semibold text-xl mb-4">
          Purpose
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {[
            "Sale",
            "Rent",
            "PG / Coliving",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                onPurposeChange(item)
              }
              className={`
                h-16
                rounded-2xl
                border-2
                font-normal
                text-lg
                    text-[16px]
                transition-all
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

      <div className="mt-10">
        <h3 className="font-semibold text-xl mb-4">
          Property Type
        </h3>

        <div className="grid md:grid-cols-3 gap-5">
          {propertyTypes.map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  onTypeChange(item)
                }
                className={`
                  h-[120px]
                  rounded-3xl
                  border
                  p-5
                  text-left
                  transition-all
                  flex
                  flex-col
                  justify-between
                  ${
                    value === item
                      ? `
                      border-[#C89B1C]
                      bg-[#FFF9EC]
                      shadow-sm
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
                    h-12
                    w-12
                    rounded-xl
                    bg-[#FAF4E8]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Building2
                    size={20}
                    className="text-[#C89B1C]"
                  />
                </div>

               <span
  className="
    text-[16px]
    font-normal
    leading-6
    text-[#161616]
  "
>
  {item}
</span>
              </button>
            )
          )}
        </div>
      </div>

    </div>
  );
}