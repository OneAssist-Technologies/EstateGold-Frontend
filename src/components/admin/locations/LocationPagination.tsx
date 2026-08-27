"use client";

import PropertyPagination from "../property-management/PropertyPagination";

interface LocationPaginationProps {
  page: number;
  totalPages: number;
  totalRecords?: number;
  limit?: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export default function LocationPagination({
  page,
  totalPages,
  totalRecords = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}: LocationPaginationProps) {
  return (
    <PropertyPagination
      currentPage={page}
      totalPages={totalPages}
      totalRecords={totalRecords}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
    />
  );
}