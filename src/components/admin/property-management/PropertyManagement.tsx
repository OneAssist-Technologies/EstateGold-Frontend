"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
  requestDelete,
} from "@/src/services/adminPropertyService";
import { AdminProperty } from "@/src/types/adminProperty";
import toast from "react-hot-toast";

export default function PropertyManagement() {
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    delete_requests: 0,
  });

  const [reasonModal, setReasonModal] = useState<{
    open: boolean;
    type: "reject" | "delete" | "approve_delete";
    propertyId: string;
    title: string;
    description: string;
  }>({
    open: false,
    type: "delete",
    propertyId: "",
    title: "",
    description: "",
  });
  const [modalReasonInput, setModalReasonInput] = useState("");
  const [reasonSubmitting, setReasonSubmitting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [page, limit, search, status]);

  async function loadProperties() {
    try {
      setLoading(true);

      const response = await getProperties({
        page,
        limit,
        search,
        status: status === "all" ? "" : status,
      });

      setProperties(response.properties);
      setPages(response.pages || 1);
      setTotalRecords(response.total || response.properties?.length || 0);

      if (response.stats) {
        setCounts({
          all: response.stats.total ?? response.total ?? 0,
          pending: response.stats.pending ?? 0,
          approved: response.stats.approved ?? 0,
          rejected: response.stats.rejected ?? 0,
          delete_requests: response.stats.delete_requests ?? 0,
        });
      } else {
        setCounts({
          all: response.total ?? 0,
          pending: response.properties.filter((item: AdminProperty) => item.status === "pending").length,
          approved: response.properties.filter((item: AdminProperty) => item.status === "approved").length,
          rejected: response.properties.filter((item: AdminProperty) => item.status === "rejected").length,
          delete_requests: response.properties.filter((item: AdminProperty) => item.deleteRequested).length,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleView = async (id: string) => {
    try {
      const response = await getPropertyById(id);
      setSelectedProperty(response.property);
      setViewOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async () => {
    if (!selectedProperty) return;
    try {
      setLoading(true);
      await approveProperty(selectedProperty._id);
      setViewOpen(false);
      loadProperties();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedProperty) return;
    try {
      setLoading(true);
      await rejectProperty(selectedProperty._id, reason);
      setViewOpen(false);
      loadProperties();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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

  const handleQuickReject = (id: string) => {
    setReasonModal({
      open: true,
      type: "reject",
      propertyId: id,
      title: "Reject Property Submission",
      description: "Specify the reason for rejecting this property submission:",
    });
    setModalReasonInput("Property details require verification.");
  };

  const handleAvailabilityStatusChange = async (id: string, newStatus: "on_sale" | "hold" | "sold" | "rented") => {
    try {
      setLoading(true);
      await updatePropertyAvailabilityStatus(id, newStatus);
      await loadProperties();
    } catch (error) {
      console.error("Failed to update availability status:", error);
      setLoading(false);
    }
  };

  const handleApproveDelete = (id: string, reason: string) => {
    setReasonModal({
      open: true,
      type: "approve_delete",
      propertyId: id,
      title: "Approve Property Deletion",
      description: "Confirm permanent deletion of this property listing:",
    });
    setModalReasonInput(reason || "Approved deletion request.");
  };

  const handleRejectDeleteRequest = async (id: string) => {
    try {
      setLoading(true);
      await rejectDeleteRequest(id);
      toast.success("Deletion request rejected. Property kept active.");
      await loadProperties();
    } catch (error) {
      console.error("Failed to reject delete request:", error);
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setReasonModal({
      open: true,
      type: "delete",
      propertyId: id,
      title: "Reason for Property Deletion",
      description: "Enter reason for requesting deletion of this property:",
    });
    setModalReasonInput("");
  };

  const handleConfirmReasonAction = async () => {
    if (!modalReasonInput.trim()) {
      toast.error("Please provide a reason to proceed.");
      return;
    }

    try {
      setReasonSubmitting(true);
      if (reasonModal.type === "reject") {
        await rejectProperty(reasonModal.propertyId, modalReasonInput.trim());
        toast.success("Property submission rejected.");
      } else if (reasonModal.type === "delete") {
        await requestDelete(reasonModal.propertyId, modalReasonInput.trim());
        toast.success("Property marked for deletion.");
      } else if (reasonModal.type === "approve_delete") {
        await deleteProperty(reasonModal.propertyId, modalReasonInput.trim());
        toast.success("Property permanently deleted.");
      }
      setReasonModal((prev) => ({ ...prev, open: false }));
      await loadProperties();
    } catch (error: any) {
      console.error("Reason action failed:", error);
      toast.error(error.response?.data?.message || "Action failed.");
    } finally {
      setReasonSubmitting(false);
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
          onDeleteRequest={handleDeleteRequest}
        />
      </motion.div>

      <PropertyPagination
        currentPage={page}
        totalPages={pages}
        totalRecords={totalRecords}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

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

      {/* In-UI Reason Action Modal */}
      <AnimatePresence>
        {reasonModal.open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-base sm:text-lg text-gray-900">{reasonModal.title}</h3>
                <button
                  type="button"
                  onClick={() => setReasonModal((prev) => ({ ...prev, open: false }))}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                {reasonModal.description}
              </p>

              <textarea
                rows={3}
                value={modalReasonInput}
                onChange={(e) => setModalReasonInput(e.target.value)}
                placeholder="Enter reason details here..."
                className="w-full p-3 text-xs rounded-2xl border border-gray-200 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none resize-none font-sans text-gray-800"
              />

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReasonModal((prev) => ({ ...prev, open: false }))}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={reasonSubmitting}
                  onClick={handleConfirmReasonAction}
                  className="px-5 py-2.5 rounded-xl bg-[#C89B1C] hover:bg-[#B58A16] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  {reasonSubmitting ? "Processing..." : "Confirm Action"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}