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
    <motion.div
  initial={{
    opacity: 0,
    y: -20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    delay: 0.2,
  }}
>
    <div className="flex items-center justify-between mb-8">

      <div>
        <h2 className="text-3xl font-semibold text-[#161616]">
          {total} Properties Found
        </h2>

        <p className="text-gray-500 mt-1">
          Explore verified premium properties
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="relative">

          <ArrowDownAZ
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />

          <select
            value={sort}
            onChange={(e) =>
              setSort(
                e.target.value
              )
            }
            className="
              h-12
              pl-11
              pr-5
              rounded-xl
              border
              border-[#E8DCC1]
              bg-white
              outline-none
              cursor-pointer
            "
          >
            <option value="latest">
              Latest
            </option>

            <option value="priceLowToHigh">
              Price: Low to High
            </option>

            <option value="priceHighToLow">
              Price: High to Low
            </option>
          </select>

        </div>

        <div className="flex rounded-xl overflow-hidden border border-[#E8DCC1]">

          <button
            onClick={() =>
              setView("grid")
            }
            className={`
              h-12
              w-12
              flex
              items-center
              justify-center
              transition-all
              ${
                view === "grid"
                  ? "bg-[#C89B1C] text-white"
                  : "bg-white hover:bg-[#F8F5ED]"
              }
            `}
          >
            <Grid2X2 size={18} />
          </button>

          <button
            onClick={() =>
              setView("list")
            }
            className={`
              h-12
              w-12
              flex
              items-center
              justify-center
              transition-all
              border-l
              border-[#E8DCC1]
              ${
                view === "list"
                  ? "bg-[#C89B1C] text-white"
                  : "bg-white hover:bg-[#F8F5ED]"
              }
            `}
          >
            <List size={18} />
          </button>

        </div>

      </div>

    </div>
    </motion.div>
  );
}