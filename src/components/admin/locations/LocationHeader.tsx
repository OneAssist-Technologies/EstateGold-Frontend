"use client";

import { Search, Plus } from "lucide-react";

interface LocationHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  stateFilter: string;
  onStateChange: (value: string) => void;

  onAddClick?: () => void;
}

export default function LocationHeader({
  search,
  onSearchChange,
  status,
  onStatusChange,
  stateFilter,
  onStateChange,
  onAddClick,
}: LocationHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Serviceable Locations
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage cities where property listings are allowed.
          </p>
        </div>

        {/* Right */}
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add Service Area
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search city or state..."
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* State */}
        <select
          value={stateFilter}
          onChange={(e) => onStateChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
        >
          <option value="all">All States</option>

          <option value="Tamil Nadu">Tamil Nadu</option>

          <option value="Karnataka">Karnataka</option>

          <option value="Kerala">Kerala</option>

          <option value="Andhra Pradesh">Andhra Pradesh</option>

          <option value="Telangana">Telangana</option>
        </select>
      </div>
    </div>
  );
}