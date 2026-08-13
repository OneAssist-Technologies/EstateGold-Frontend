"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PropertyHeader from "./PropertyHeader";
import PropertySearch from "./PropertySearch";
import PropertyTabs from "./PropertyTabs";
import PropertyTable from "./PropertyTable";
import PropertyPagination from "./PropertyPagination";
import PropertyFilterDrawer from "./PropertyFilterDrawer";
import PropertyViewModal from "./PropertyViewModal";

import {
  getProperties,
  getPropertyById,
  approveProperty,
  rejectProperty,
  updatePropertyAvailabilityStatus,
  deleteProperty,
  rejectDeleteRequest,
} from "@/src/services/adminPropertyService";
import { AdminProperty } from "@/src/types/adminProperty";

export default function PropertyManagement() {
  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [properties, setProperties] =
    useState<AdminProperty[]>([]);

  const [selectedProperty, setSelectedProperty] =
    useState<AdminProperty | null>(null);
  const [viewOpen, setViewOpen] =
    useState(false);

  const [counts, setCounts] =
    useState({
      all: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    });

  useEffect(() => {
    loadProperties();
  }, [
    page,
    search,
    status,
  ]);

  async function loadProperties() {
    try {
      setLoading(true);

      const response = await getProperties({
        page,
        limit: 10,
        search,
        status: status === "all" ? "" : status,
      });

      setProperties(response.properties);
      setPages(response.pages);

      if (response.stats) {
        setCounts({
          all: response.stats.total ?? response.total ?? 0,
          pending: response.stats.pending ?? 0,
          approved: response.stats.approved ?? 0,
          rejected: response.stats.rejected ?? 0,
        });
      } else {
        setCounts({
          all: response.total ?? 0,
          pending: response.properties.filter((item: AdminProperty) => item.status === "pending").length,
          approved: response.properties.filter((item: AdminProperty) => item.status === "approved").length,
          rejected: response.properties.filter((item: AdminProperty) => item.status === "rejected").length,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleView =
    async (id: string) => {
      try {
        const response =
          await getPropertyById(
            id
          );

        setSelectedProperty(
          response.property
        );

        setViewOpen(true);
      } catch (error) {
        console.log(error);
      }
    };

  const handleApprove =
    async () => {
      if (
        !selectedProperty
      )
        return;

      await approveProperty(
        selectedProperty._id
      );

      setViewOpen(false);

      loadProperties();
    };

  const handleReject =
    async (
      reason: string
    ) => {
      if (
        !selectedProperty
      )
        return;

      await rejectProperty(
        selectedProperty._id,
        reason
      );

      setViewOpen(false);

      loadProperties();
    };

  const handleQuickApprove = async (id: string) => {
    try {
      setLoading(true);
      await approveProperty(id);
      await loadProperties();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleQuickReject = async (id: string) => {
    const reason = window.prompt(
      "Enter reason for rejecting this property:",
      "Property details require verification."
    );
    if (!reason || !reason.trim()) return;

    try {
      setLoading(true);
      await rejectProperty(id, reason.trim());
      await loadProperties();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAvailabilityStatusChange = async (id: string, newStatus: "on_sale" | "hold" | "sold") => {
    try {
      setLoading(true);
      await updatePropertyAvailabilityStatus(id, newStatus);
      await loadProperties();
    } catch (error) {
      console.error("Failed to update availability status:", error);
      setLoading(false);
    }
  };

  const handleApproveDelete = async (id: string, reason: string) => {
    if (!window.confirm("Are you sure you want to approve this deletion? The property listing will be permanently removed.")) return;
    try {
      setLoading(true);
      await deleteProperty(id, reason);
      await loadProperties();
    } catch (error) {
      console.error("Failed to approve deletion:", error);
      setLoading(false);
    }
  };

  const handleRejectDeleteRequest = async (id: string) => {
    if (!window.confirm("Are you sure you want to reject this deletion request? The property listing will remain active.")) return;
    try {
      setLoading(true);
      await rejectDeleteRequest(id);
      await loadProperties();
    } catch (error) {
      console.error("Failed to reject delete request:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PropertyHeader />

      <PropertySearch
        search={search}
        setSearch={setSearch}
        onFilter={() => setFilterOpen(true)}
      />

      <PropertyTabs
        active={status}
        onChange={setStatus}
        counts={counts}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PropertyTable
          loading={loading}
          properties={properties}
          onView={handleView}
          onApprove={handleQuickApprove}
          onReject={handleQuickReject}
          onApproveDelete={handleApproveDelete}
          onRejectDeleteRequest={handleRejectDeleteRequest}
          onAvailabilityStatusChange={handleAvailabilityStatusChange}
        />
      </motion.div>

      {pages > 1 && (
        <PropertyPagination
          currentPage={
            page
          }
          totalPages={
            pages
          }
          onPageChange={
            setPage
          }
        />
      )}

      <PropertyFilterDrawer
        open={
          filterOpen
        }
        onClose={() =>
          setFilterOpen(
            false
          )
        }
      />

      <PropertyViewModal
        open={viewOpen}
        property={
          selectedProperty
        }
        onClose={() =>
          setViewOpen(
            false
          )
        }
        onApprove={
          handleApprove
        }
        onReject={
          handleReject
        }
        onApproveDelete={handleApproveDelete}
        onRejectDeleteRequest={handleRejectDeleteRequest}
      />
    </div>
  );
}