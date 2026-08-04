"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  onFilter: () => void;
}

export default function PropertySearch({
  search,
  setSearch,
  onFilter,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-5">

      {/* Search */}

      <motion.div
        whileHover={{
          y: -1,
        }}
        className="
          flex-1
          flex
          items-center
          gap-3
          h-12
          rounded-xl
          border
          border-[#E6E2DA]
          bg-white
          px-4
        "
      >
        <Search
          size={18}
          className="text-gray-400"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search property, owner, city..."
          className="
            flex-1
            outline-none
            text-sm
            placeholder:text-gray-400
          "
        />
      </motion.div>

      {/* Filter */}

      <motion.button
        whileHover={{
          scale: 1.04,
        }}
        whileTap={{
          scale: .96,
        }}
        onClick={onFilter}
        className="
          h-12
          px-5
          rounded-xl
          border
          border-[#E6E2DA]
          bg-white
          flex
          items-center
          gap-2
          hover:border-[#C89B1C]
          hover:text-[#C89B1C]
          transition-all
        "
      >
        <SlidersHorizontal size={18} />

        <span className="text-sm font-medium">
          Filter
        </span>
      </motion.button>

    </div>
  );
}