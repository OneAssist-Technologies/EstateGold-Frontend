"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ServiceLocation, LocationStatsData } from "@/src/types/location";
import { getLocations, deleteLocation } from "@/src/services/locationService";

import LocationHeader from "./LocationHeader";
import LocationStats from "./LocationStats";
import LocationTable from "./LocationTable";
import LocationPagination from "./LocationPagination";
import ViewLocationModal from "./ViewLocationModal";
import DeleteLocationModal from "./DeleteLocationModal";

export default function LocationManagement() {
  const router = useRouter();
  const [locations, setLocations] = useState<ServiceLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [viewingLocation, setViewingLocation] = useState<ServiceLocation | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<ServiceLocation | null>(null);

  const [stats, setStats] = useState<LocationStatsData>({
    totalCities: 0,
    activeCities: 0,
    inactiveCities: 0,
    totalListings: 0,
    averageRadius: 0,
  });

  const fetchLocationsData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getLocations({
        search,
        status,
        state: stateFilter,
        page,
        limit: 10,
      });

      if (res.success) {
        setLocations(res.locations || []);
        setTotalPages(res.pages || 1);

        if (res.stats) {
          setStats(res.stats);
        } else {
          const all = res.locations || [];
          setStats({
            totalCities: res.total || all.length,
            activeCities: all.filter((l) => l.status === "active").length,
            inactiveCities: all.filter((l) => l.status === "inactive").length,
            totalListings: all.reduce((sum, i) => sum + (i.activeListings || 0), 0),
            averageRadius:
              all.length > 0
                ? Math.round(all.reduce((sum, i) => sum + i.radiusKm, 0) / all.length)
                : 0,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch locations from DB:", err);
    } finally {
      setLoading(false);
    }
  }, [search, status, stateFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [search, status, stateFilter]);

  useEffect(() => {
    fetchLocationsData();
  }, [fetchLocationsData]);

  const handleConfirmDelete = async (location: ServiceLocation, reason: string) => {
    try {
      const res = await deleteLocation(location._id);
      if (res.success) {
        toast.success(`Service area for ${location.city} deleted successfully.`);
        await fetchLocationsData();
      }
    } catch (err: any) {
      console.error("Failed to delete location:", err);
      toast.error(err.response?.data?.message || "Failed to delete service area.");
      throw err;
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
      <LocationHeader
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        stateFilter={stateFilter}
        onStateChange={setStateFilter}
        onAddClick={() => router.push("/admin/locations/add")}
      />

      <LocationStats stats={stats} />

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#ECE7DB] p-12 text-center text-gray-500 font-medium shadow-xs">
          Loading service areas from database...
        </div>
      ) : (
        <LocationTable
          locations={locations}
          onView={(loc) => setViewingLocation(loc)}
          onEdit={(loc) => router.push(`/admin/locations/edit/${loc._id}`)}
          onDelete={(loc) => setDeletingLocation(loc)}
        />
      )}

      <LocationPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* View Location Details Modal (Eye icon) */}
      <ViewLocationModal
        open={Boolean(viewingLocation)}
        location={viewingLocation}
        onClose={() => setViewingLocation(null)}
        onEdit={(loc) => router.push(`/admin/locations/edit/${loc._id}`)}
      />

      {/* Delete Location Modal (Trash icon) */}
      <DeleteLocationModal
        open={Boolean(deletingLocation)}
        location={deletingLocation}
        onClose={() => setDeletingLocation(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}