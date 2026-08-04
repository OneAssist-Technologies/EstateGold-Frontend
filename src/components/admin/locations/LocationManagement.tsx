"use client";

import { useMemo, useState } from "react";
import { ServiceLocation } from "../../../types/location";

import LocationHeader from "./LocationHeader";
import LocationStats from "./LocationStats";
import LocationTable from "./LocationTable";
import LocationPagination from "./LocationPagination";

const dummyLocations: ServiceLocation[] = [
  {
    _id: "1",
    city: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
    radiusKm: 25,
    activeListings: 1250,
    status: "active",
    notes: "Primary service area",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    city: "Coimbatore",
    state: "Tamil Nadu",
    latitude: 11.0168,
    longitude: 76.9558,
    radiusKm: 20,
    activeListings: 540,
    status: "active",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    city: "Bangalore",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    radiusKm: 35,
    activeListings: 1830,
    status: "inactive",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ITEMS_PER_PAGE = 10;

export default function LocationManagement() {
  const [locations] = useState<ServiceLocation[]>(dummyLocations);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  const [page, setPage] = useState(1);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch =
        location.city.toLowerCase().includes(search.toLowerCase()) ||
        location.state.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "all" || location.status === status;

      const matchesState =
        stateFilter === "all" || location.state === stateFilter;

      return matchesSearch && matchesStatus && matchesState;
    });
  }, [locations, search, status, stateFilter]);

  const totalPages = Math.ceil(
    filteredLocations.length / ITEMS_PER_PAGE
  );

  const paginatedLocations = filteredLocations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = {
    totalCities: locations.length,
    activeCities: locations.filter(
      (l) => l.status === "active"
    ).length,
    inactiveCities: locations.filter(
      (l) => l.status === "inactive"
    ).length,
    totalListings: locations.reduce(
      (sum, item) => sum + item.activeListings,
      0
    ),
    averageRadius:
      Math.round(
        locations.reduce(
          (sum, item) => sum + item.radiusKm,
          0
        ) / locations.length
      ) || 0,
  };

  return (
    <div className="space-y-6">
      <LocationHeader
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        stateFilter={stateFilter}
        onStateChange={setStateFilter}
      />

      <LocationStats stats={stats} />

      <LocationTable locations={paginatedLocations} />

      <LocationPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}