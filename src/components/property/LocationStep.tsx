"use client";

import {
  MapPin,
  Building,
  Home,
} from "lucide-react";

import { PropertyFormData } from "../../types/property";

interface Props {
  formData: PropertyFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<PropertyFormData>
  >;
}

export default function LocationStep({
  formData,
  setFormData,
}: Props) {
  return (
    <div>
      <h2 className="text-4xl font-bold">
        Where is the property?
      </h2>

      <p className="text-gray-500 mt-2">
        Accurate location helps buyers
        find it faster
      </p>

      <div className="space-y-6 mt-8">

        <div>
          <label className="font-medium">
            City
          </label>

          <div className="relative mt-2">
            <MapPin
              size={18}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              value={formData.city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
              placeholder="e.g. Mumbai, Bangalore"
              className="w-full border rounded-xl h-14 pl-12 pr-4"
            />
          </div>
        </div>

        <div>
          <label className="font-medium">
            Locality / Area
          </label>

          <div className="relative mt-2">
            <MapPin
              size={18}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              value={formData.locality}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  locality:
                    e.target.value,
                }))
              }
              placeholder="e.g. Koramangala"
              className="w-full border rounded-xl h-14 pl-12 pr-4"
            />
          </div>
        </div>

        <div>
          <label className="font-medium">
            Society / Building Name
          </label>

          <div className="relative mt-2">
            <Building
              size={18}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              value={formData.society}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  society:
                    e.target.value,
                }))
              }
              placeholder="Building Name"
              className="w-full border rounded-xl h-14 pl-12 pr-4"
            />
          </div>
        </div>

        <div>
          <label className="font-medium">
            Full Address
          </label>

          <div className="relative mt-2">
            <Home
              size={18}
              className="absolute left-4 top-4 text-gray-400"
            />

            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address:
                    e.target.value,
                }))
              }
              placeholder="Street Address"
              className="w-full border rounded-xl min-h-[120px] pl-12 p-4"
            />
          </div>
        </div>

      </div>
    </div>
  );
}