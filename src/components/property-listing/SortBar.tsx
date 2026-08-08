"use client";

import {
  ArrowDownAZ,
  Grid2X2,
  List,
} from "lucide-react";
import {motion} from "framer-motion";

interface Props {
  total: number;

  view: "grid" | "list";

  setView: (
    value: "grid" | "list"
  ) => void;

  sort: string;

  setSort: (
    value: string
  ) => void;
}

export default function SortBar({
  total,
  view,
  setView,
  sort,
  setSort,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-5">
      {/* Total Count */}
      <h2 className="text-xs sm:text-sm font-bold text-gray-800">
        {total} properties found
      </h2>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Sort Select */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-9 px-3.5 rounded-xl border border-[#E5E0D4] bg-white text-xs font-medium text-gray-700 outline-none cursor-pointer hover:border-[#9A720C] transition-all shadow-2xs"
        >
          <option value="latest">Sort: Relevance</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
        </select>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-[#E5E0D4]">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              view === "grid"
                ? "bg-[#9A720C] text-white shadow-2xs"
                : "text-gray-500 hover:text-gray-800 hover:bg-[#FAFAF8]"
            }`}
            title="Grid View"
          >
            <Grid2X2 size={16} />
          </button>

          <button
            type="button"
            onClick={() => setView("list")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              view === "list"
                ? "bg-[#9A720C] text-white shadow-2xs"
                : "text-gray-500 hover:text-gray-800 hover:bg-[#FAFAF8]"
            }`}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}