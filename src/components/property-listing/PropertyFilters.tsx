"use client";

import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;

  propertyType: string;
  setPropertyType: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export default function PropertyFilters({
  search,
  setSearch,
  propertyType,
  setPropertyType,
}: Props) {
  return (
 <div
  className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-[#EAE3D6] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-8"
>
      <div className="grid md:grid-cols-2 gap-4">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search properties..."
          className="w-full h-14 pl-11 pr-4 rounded-xl border border-[#EAE3D6] focus:outline-none focus:border-[#C6A664]"
        />
      </div>

      <select
        value={propertyType}
        onChange={(e) =>
          setPropertyType(
            e.target.value
          )
        }
        className="h-14 px-4 rounded-xl border border-[#EAE3D6] bg-white min-w-[220px]"
      >
        <option value="">
          All Types
        </option>

        <option value="Villa">
          Villa
        </option>

        <option value="Apartment">
          Apartment
        </option>

        <option value="Commercial">
          Commercial
        </option>

        <option value="Plot">
          Plot
        </option>
      </select>
    </div>
  );
}