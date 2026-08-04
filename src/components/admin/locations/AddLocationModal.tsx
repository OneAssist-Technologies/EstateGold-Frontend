"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Save } from "lucide-react";
import { ServiceLocation } from "../../../types/location";

type LocationForm = Omit<
  ServiceLocation,
  "_id" | "activeListings" | "createdAt" | "updatedAt"
>;
interface AddLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LocationForm ) => void;
}

const initialForm:LocationForm  = {
  city: "",
  state: "",
  latitude: 0,
  longitude: 0,
  radiusKm: 20,
  status: "active",
  notes: "",
};

export default function AddLocationModal({
  open,
  onClose,
  onSubmit,
}: AddLocationModalProps) {
  const [form, setForm] = useState<LocationForm>(initialForm);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.city.trim()) {
      alert("City is required.");
      return;
    }

    if (!form.state.trim()) {
      alert("State is required.");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Add Service Area
            </h2>

            <p className="text-sm text-gray-500">
              Configure a new city where properties can be listed.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                City *
              </label>

              <input
                value={form.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    city: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5"
                placeholder="Enter city"
              />
            </div>

            {/* State */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                State *
              </label>

              <input
                value={form.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    state: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5"
                placeholder="Enter state"
              />
            </div>

            {/* Latitude */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Latitude
              </label>

              <input
                type="number"
                value={form.latitude}
                onChange={(e) =>
                  setForm({
                    ...form,
                    latitude: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Longitude
              </label>

              <input
                type="number"
                value={form.longitude}
                onChange={(e) =>
                  setForm({
                    ...form,
                    longitude: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5"
              />
            </div>

            {/* Radius */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Allowed Radius ({form.radiusKm} km)
              </label>

              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={form.radiusKm}
                onChange={(e) =>
                  setForm({
                    ...form,
                    radiusKm: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Notes
              </label>

              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Additional information..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2.5 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
            >
              <Save size={18} />
              Save Service Area
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}