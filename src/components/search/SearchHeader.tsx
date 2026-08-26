"use client";

import { useState, useEffect } from "react";
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
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleTriggerSearch = () => {
    setSearch(localSearch);
  };

  return (
    <div className="bg-white border-b border-[#ECE7DB] py-4">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Search Input Box */}
        <div className="h-12 w-full border border-[#E5E0D4] rounded-xl flex items-center pr-2 pl-4 bg-white shadow-2xs focus-within:border-[#9A720C] focus-within:ring-1 focus-within:ring-[#9A720C] transition-all">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTriggerSearch()}
            placeholder="Search naturally (e.g. 2 BHK apartment under 60 lakhs in Coimbatore)..."
            className="w-full ml-3 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none font-medium"
          />
          <button
            type="button"
            onClick={handleTriggerSearch}
            className="px-4 py-1.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer shrink-0 ml-2"
          >
            Search
          </button>
        </div>

        {/* Purpose Filter Pills */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPurpose("")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              purpose === ""
                ? "bg-[#9A720C] text-white shadow-xs"
                : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
            }`}
          >
            All Properties
          </button>

          <button
            type="button"
            onClick={() => setPurpose("Sale")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              purpose === "Sale" || purpose === "Buy"
                ? "bg-[#9A720C] text-white shadow-xs"
                : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
            }`}
          >
            For Sale
          </button>

          <button
            type="button"
            onClick={() => setPurpose("Rent")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              purpose === "Rent"
                ? "bg-[#9A720C] text-white shadow-xs"
                : "bg-white border border-[#E5E0D4] text-gray-700 hover:bg-[#FAFAF8]"
            }`}
          >
            For Rent
          </button>
        </div>
      </div>
    </div>
  );
}