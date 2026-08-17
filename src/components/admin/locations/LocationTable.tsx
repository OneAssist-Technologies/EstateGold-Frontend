"use client";

import { Eye, Pencil, Trash2, MapPin } from "lucide-react";
import { ServiceLocation } from "../../../types/location";

function formatPrice(val?: number): string {
  if (!val || isNaN(val)) return "—";
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`;
  }
  return `₹${val.toLocaleString()}`;
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit?.(location)}
                      className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete?.(location)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
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
  );
}