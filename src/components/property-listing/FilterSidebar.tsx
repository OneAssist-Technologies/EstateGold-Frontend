"use client";
import {motion} from "framer-motion";
interface Props {
  city: string;
  setCity: (value: string) => void;

  propertyType: string;
  setPropertyType: (value: string) => void;

  bedrooms: string;
  setBedrooms: (value: string) => void;

  furnishing: string;
  setFurnishing: (value: string) => void;

  clearFilters: () => void;
}

export default function FilterSidebar({
  city,
  setCity,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  furnishing,
  setFurnishing,
  clearFilters,
}: Props) {
  const cities = [
    "Mumbai",
    "Bangalore",
    "Delhi",
    "Pune",
    "Hyderabad",
  ];

  const propertyTypes = [
    "Apartment",
    "Villa",
    "House",
    "Plot",
    "Commercial",
  ];

  const bedroomOptions = [
    { label: "Any", value: "" },
    { label: "1 BHK", value: "1" },
    { label: "2 BHK", value: "2" },
    { label: "3 BHK", value: "3" },
    { label: "4 BHK", value: "4" },
    { label: "5+ BHK", value: "5" },
  ];

  const furnishingOptions = [
    { label: "Any", value: "" },
    {
      label: "Fully Furnished",
      value: "Fully Furnished",
    },
    {
      label: "Semi Furnished",
      value: "Semi Furnished",
    },
    {
      label: "Unfurnished",
      value: "Unfurnished",
    },
  ];

  return (
    <motion.div
  initial={{
    opacity: 0,
    x: -50,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: 0.5,
  }}
>
    <div
      className="
        border
        border-[#E8DCC1]
        rounded-[28px]
        p-7
        sticky
        top-24
        bg-white
      "
    >
      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <h3 className="text-3xl font-semibold">
          Filters
        </h3>

        <button
          onClick={clearFilters}
          className="
            text-[#C89B1C]
            hover:underline
          "
        >
          Clear All
        </button>

      </div>

      {/* CITY */}

      <div>

        <h4 className="font-semibold tracking-wider">
          CITY
        </h4>

        <div className="grid grid-cols-2 gap-3 mt-5">

          <button
            onClick={() => setCity("")}
            className={`
              h-12
              rounded-xl
              border
              transition
              ${
                city === ""
                  ? "bg-[#C89B1C] text-white border-[#C89B1C]"
                  : "border-[#E8DCC1]"
              }
            `}
          >
            All Cities
          </button>

          {cities.map((item) => (
            <button
              key={item}
              onClick={() => setCity(item)}
              className={`
                h-12
                rounded-xl
                border
                transition
                ${
                  city === item
                    ? "bg-[#C89B1C] text-white border-[#C89B1C]"
                    : "border-[#E8DCC1]"
                }
              `}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      <hr className="my-8 border-[#E8DCC1]" />

      {/* PROPERTY TYPE */}

      <div>

        <h4 className="font-semibold tracking-wider">
          PROPERTY TYPE
        </h4>

        <div className="space-y-3 mt-5">

          <button
            onClick={() =>
              setPropertyType("")
            }
            className={`
              w-full
              h-12
              rounded-xl
              border
              transition
              ${
                propertyType === ""
                  ? "bg-[#C89B1C] text-white border-[#C89B1C]"
                  : "border-[#E8DCC1]"
              }
            `}
          >
            All Types
          </button>

          {propertyTypes.map((item) => (
            <button
              key={item}
              onClick={() =>
                setPropertyType(item)
              }
              className={`
                w-full
                h-12
                rounded-xl
                border
                text-left
                px-5
                transition
                ${
                  propertyType === item
                    ? "bg-[#C89B1C] text-white border-[#C89B1C]"
                    : "border-[#E8DCC1]"
                }
              `}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      <hr className="my-8 border-[#E8DCC1]" />

      {/* BEDROOMS */}

      <div>

        <h4 className="font-semibold tracking-wider">
          BEDROOMS
        </h4>

        <div className="flex flex-wrap gap-3 mt-5">

          {bedroomOptions.map((item) => (
            <button
              key={item.label}
              onClick={() =>
                setBedrooms(item.value)
              }
              className={`
                h-12
                px-5
                rounded-full
                border
                transition
                ${
                  bedrooms === item.value
                    ? "bg-[#C89B1C] text-white border-[#C89B1C]"
                    : "border-[#E8DCC1]"
                }
              `}
            >
              {item.label}
            </button>
          ))}

        </div>

      </div>

      <hr className="my-8 border-[#E8DCC1]" />

      {/* FURNISHING */}

      <div>

        <h4 className="font-semibold tracking-wider">
          FURNISHING
        </h4>

        <div className="space-y-3 mt-5">

          {furnishingOptions.map((item) => (
            <button
              key={item.label}
              onClick={() =>
                setFurnishing(item.value)
              }
              className={`
                w-full
                h-12
                rounded-xl
                border
                transition
                ${
                  furnishing === item.value
                    ? "bg-[#C89B1C] text-white border-[#C89B1C]"
                    : "border-[#E8DCC1]"
                }
              `}
            >
              {item.label}
            </button>
          ))}

        </div>

      </div>

    </div>
    </motion.div>
  );
}