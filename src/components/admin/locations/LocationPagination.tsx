"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface LocationPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function LocationPagination({
  page,
  totalPages,
  onPageChange,
}: LocationPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
      {/* Previous */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
          page === 1
            ? "cursor-not-allowed border-gray-200 text-gray-400"
            : "border-gray-300 hover:bg-gray-50"
        }`}
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${
              page === pageNumber
                ? "bg-indigo-600 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
          page === totalPages
            ? "cursor-not-allowed border-gray-200 text-gray-400"
            : "border-gray-300 hover:bg-gray-50"
        }`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}