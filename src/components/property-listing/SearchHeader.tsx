"use client";

import { Search } from "lucide-react";

interface Props {
  purpose: string;

  setPurpose: (
    value: string
  ) => void;

  search: string;

  setSearch: (
    value: string
  ) => void;
}
export default function SearchHeader({
  purpose,
  setPurpose,
  search,
  setSearch,
}: Props) { 
  return (
    <div className="border-b border-[#E8DCC1]">

      <div className="max-w-[1450px] mx-auto px-8 py-6">

        <div
          className="
            h-14
            border
            border-[#E8DCC1]
            rounded-2xl
            flex
            items-center
            px-5
          "
        >
          <Search size={20} />

          <input
  value={search}
  onChange={(e) =>
    setSearch(
      e.target.value
    )
  }
  placeholder="City, locality, project or society..."
  className="
    flex-1
    ml-3
    outline-none
  "
/>
        </div>

        <div className="flex gap-4 mt-5">

          <button
            onClick={() =>
              setPurpose("")
            }
            className={`
              h-12
              px-6
              rounded-full
              ${
                purpose === ""
                  ? "bg-[#C89B1C] text-white"
                  : "border border-[#E8DCC1]"
              }
            `}
          >
            All Properties
          </button>

          <button
            onClick={() =>
              setPurpose("Sale")
            }
            className={`
              h-12
              px-6
              rounded-full
              ${
                purpose ===
                "Sale"
                  ? "bg-[#C89B1C] text-white"
                  : "border border-[#E8DCC1]"
              }
            `}
          >
            For Buy
          </button>

          <button
            onClick={() =>
              setPurpose("Rent")
            }
            className={`
              h-12
              px-6
              rounded-full
              ${
                purpose ===
                "Rent"
                  ? "bg-[#C89B1C] text-white"
                  : "border border-[#E8DCC1]"
              }
            `}
          >
            For Rent
          </button>

        </div>

      </div>

    </div>
  );
}