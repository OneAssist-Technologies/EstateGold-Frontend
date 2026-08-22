"use client";

import { Eye, Pencil, Trash2, MapPin } from "lucide-react";
import { ServiceLocation } from "../../../types/location";

function formatPrice(val?: number): string {
  if (!val || isNaN(val)) return "—";
  return `₹${val.toLocaleString()} / sqft`;
}

interface LocationTableProps {
  locations: ServiceLocation[];

  onView?: (location: ServiceLocation) => void;
  onEdit?: (location: ServiceLocation) => void;
  onDelete?: (location: ServiceLocation) => void;
}

export default function LocationTable({
  locations,
  onView,
  onEdit,
  onDelete,
}: LocationTableProps) {
  if (locations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
        <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />

        <h3 className="text-lg font-semibold text-gray-900">
          No Service Areas Found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Click Add Service Area to create your first location.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  City
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  State
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Current Local Price
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Radius
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Coordinates
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Listings
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {locations.map((location) => (
                <tr
                  key={location._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* City */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {location.city}
                    </div>
                  </td>

                  {/* State */}
                  <td className="px-6 py-4 text-gray-600">
                    {location.state}
                  </td>

                  {/* Current Local Price */}
                  <td className="px-6 py-4 font-semibold text-[#9A720C]">
                    {formatPrice((location as any).averagePrice)}
                  </td>

                  {/* Radius */}
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                      {location.radiusKm} km
                    </span>
                  </td>

                  {/* Coordinates */}
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    <div>{(location.latitude || 0).toFixed(4)}</div>
                    <div>{(location.longitude || 0).toFixed(4)}</div>
                  </td>

                  {/* Listings */}
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold">
                      {(location.activeListings || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${location.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {location.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onView?.(location)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 cursor-pointer"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => onEdit?.(location)}
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete?.(location)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {locations.map((location) => (
          <div
            key={location._id}
            className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm relative animate-fadeIn"
          >
            {/* Top row: City Name, State and Status badge */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  {location.city}
                </h4>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {location.state}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${location.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {location.status}
              </span>
            </div>

            {/* Middle row: Stats & Prices */}
            <div className="grid grid-cols-2 gap-3 text-xs border-t border-dashed border-gray-150 pt-3">
              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Avg Price</span>
                <span className="font-bold text-[#9A720C] text-sm">
                  {formatPrice((location as any).averagePrice)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Radius</span>
                <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 mt-0.5">
                  {location.radiusKm} km
                </span>
              </div>
            </div>

            {/* Bottom details: Coordinates & Listings count */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div>
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Coordinates</span>
                <div className="font-mono text-[11px] text-gray-500 font-semibold">
                  <div>Lat: {(location.latitude || 0).toFixed(4)}</div>
                  <div>Lng: {(location.longitude || 0).toFixed(4)}</div>
                </div>
              </div>
              <div>
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Listings</span>
                <span className="text-sm font-bold text-gray-900">
                  {(location.activeListings || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-150">
              <button
                onClick={() => onView?.(location)}
                className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all flex items-center justify-center cursor-pointer"
                title="View"
              >
                <Eye size={16} />
              </button>

              <button
                onClick={() => onEdit?.(location)}
                className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all flex items-center justify-center cursor-pointer"
                title="Edit"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => onDelete?.(location)}
                className="h-9 w-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center cursor-pointer"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}