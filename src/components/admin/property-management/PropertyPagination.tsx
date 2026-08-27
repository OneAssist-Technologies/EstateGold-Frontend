"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  totalRecords?: number;
  limit?: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export default function PropertyPagination({
  currentPage,
  totalPages,
  totalRecords = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}: Props) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);

  const startRecord = totalRecords === 0 ? 0 : (safeCurrentPage - 1) * limit + 1;
  const endRecord = totalRecords === 0 ? 0 : Math.min(safeCurrentPage * limit, totalRecords);

  // Generate page numbers range centered around current page
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, safeCurrentPage - 2);
    let end = Math.min(safeTotalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-2xs px-5 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 my-6">
      {/* Left: Range Info */}
      <div className="text-xs text-gray-500 font-medium">
        Showing{" "}
        <span className="font-semibold text-gray-800">
          {startRecord} – {endRecord}
        </span>{" "}
        of <span className="font-semibold text-gray-800">{totalRecords}</span> records
      </div>

      {/* Center: Pagination Controls */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5">
        {/* First Page << */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage === 1}
          title="First Page"
          className="h-8 w-8 rounded-lg border border-gray-200/80 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Previous Page < */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          title="Previous Page"
          className="h-8 w-8 rounded-lg border border-gray-200/80 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page Number Buttons */}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
              p === safeCurrentPage
                ? "bg-[#1E293B] text-white shadow-2xs border border-[#1E293B]"
                : "bg-white border border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next Page > */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          title="Next Page"
          className="h-8 w-8 rounded-lg border border-gray-200/80 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronRight size={14} />
        </button>

        {/* Last Page >> */}
        <button
          type="button"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={safeCurrentPage === safeTotalPages}
          title="Last Page"
          className="h-8 w-8 rounded-lg border border-gray-200/80 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronsRight size={14} />
        </button>
      </div>

      {/* Right: Rows per page Dropdown */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <span>Rows per page</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange && onLimitChange(Number(e.target.value))}
          className="bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-800 outline-none hover:border-gray-300 cursor-pointer shadow-2xs"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
}