"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PropertyPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <div className="flex items-center justify-end gap-2">

      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        className="
          h-10
          w-10
          rounded-xl
          border
          bg-white
          disabled:opacity-40
        "
      >
        <ChevronLeft size={18} />
      </motion.button>

      {pages.map((page) => (
        <motion.button
          key={page}
          whileHover={{
            y: -1,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={() =>
            onPageChange(page)
          }
          className={`
            h-10
            w-10
            rounded-xl
            text-sm
            font-medium
            transition-all
            ${
              page === currentPage
                ? "bg-[#C89B1C] text-white"
                : "bg-white border"
            }
          `}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        whileTap={{
          scale: 0.95,
        }}
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        className="
          h-10
          w-10
          rounded-xl
          border
          bg-white
          disabled:opacity-40
        "
      >
        <ChevronRight size={18} />
      </motion.button>

    </div>
  );
}