"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  User,
} from "lucide-react";

import api from "@/src/lib/api";

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  status: "pending" | "contacted" | "resolved";
  createdAt: string;
}

interface PropertySummary {
  _id: string;
  propertyType: string;
  locality: string;
  city: string;
  price: number;
}

interface Props {
  open: boolean;
  propertyId: string | null;
  onClose: () => void;
}

export default function PropertyEnquiriesModal({
  open,
  propertyId,
  onClose,
}: Props) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [property, setProperty] = useState<PropertySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const isAll = propertyId === "all";
      const url = isAll ? "/enquiries/mine" : `/enquiries/property/${propertyId}`;
      const response = await api.get(url);
      if (response.data.success) {
        setEnquiries(response.data.data);
        if (isAll) {
          setProperty({
            _id: "all",
            propertyType: "All Properties",
            locality: "All Localities",
            city: "All Cities",
            price: 0,
          });
        } else {
          setProperty(response.data.property);
        }
      }
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && propertyId) {
      fetchEnquiries();
    } else {
      setEnquiries([]);
      setProperty(null);
    }
  }, [open, propertyId]);

  const handleStatusChange = async (enquiryId: string, newStatus: Enquiry["status"]) => {
    try {
      setUpdatingId(enquiryId);
      // Optimistic update
      setEnquiries((prev) =>
        prev.map((enq) => (enq._id === enquiryId ? { ...enq, status: newStatus } : enq))
      );

      await api.patch(`/enquiries/${enquiryId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      // Revert status
      fetchEnquiries();
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: Enquiry["status"]) => {
    switch (status) {
      case "resolved":
        return "bg-green-50 border-green-200 text-green-700";
      case "contacted":
        return "bg-blue-50 border-blue-200 text-blue-700";
      default:
        return "bg-amber-50 border-amber-200 text-amber-700";
    }
  };

  const formatPrice = (price?: number): string => {
    if (!price || isNaN(price)) return "₹0";
    if (price >= 10000000) {
      const cr = (price / 10000000).toFixed(2);
      return `₹${cr.replace(/\.00$/, "")} Cr`;
    } else if (price >= 100000) {
      const l = (price / 100000).toFixed(1);
      return `₹${l.replace(/\.0$/, "")} L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#FFF9EC] border border-[#E8DCC1] text-[#9A720C] flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Property Enquiries
                  </h2>
                  <p className="text-gray-400 text-xs font-semibold">
                    Manage buyer callback requests
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sub-header property details */}
            {property && property._id !== "all" && (
              <div className="bg-[#FFFDF8] px-6 py-3.5 border-b border-[#ECE7DB] flex items-center justify-between shrink-0 gap-3">
                <div className="truncate">
                  <h3 className="text-xs font-black text-gray-900 truncate">
                    {property.propertyType} in {property.locality}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    {property.locality}, {property.city}
                  </p>
                </div>
                <span className="text-sm font-black text-[#9A720C] shrink-0">
                  {formatPrice(property.price)}
                </span>
              </div>
            )}

            {/* Modal Body / List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 min-h-0">
              {loading && enquiries.length === 0 ? (
                <div className="py-24 flex items-center justify-center">
                  <div className="h-9 w-9 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
                </div>
              ) : enquiries.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-[#E8DCC1] rounded-2xl bg-gray-50/50">
                  <div className="h-12 w-12 rounded-full bg-[#FFF9EC] border border-[#E8DCC1] text-[#9A720C] flex items-center justify-center mx-auto mb-3">
                    <AlertCircle size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">No Enquiries Found</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    Clients requesting a callback for this property will be listed here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {enquiries.map((enq) => (
                    <div
                      key={enq._id}
                      className="border border-[#ECE7DB] rounded-2xl overflow-hidden shadow-3xs flex flex-col"
                    >
                      {/* Property info bar shown in "all enquiries" mode */}
                      {propertyId === "all" && (enq as any).propertyId && (
                        <div className="px-5 py-2.5 bg-[#FFFDF8] border-b border-[#ECE7DB] text-[10px] font-black text-gray-800 flex justify-between gap-3 items-center">
                          <span className="truncate">
                            Property: {(enq as any).propertyId.bedrooms ? `${(enq as any).propertyId.bedrooms} BHK ` : ""}{(enq as any).propertyId.propertyType} in {(enq as any).propertyId.locality}
                          </span>
                          <span className="text-[#9A720C] shrink-0 font-bold">
                            {formatPrice((enq as any).propertyId.price)}
                          </span>
                        </div>
                      )}

                      {/* Enquirer Top Row */}
                      <div className="px-5 py-4 bg-[#FAF9F6] border-b border-[#FAF5EA] flex justify-between items-center gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-full bg-white border border-[#E8DCC1] text-[#9A720C] flex items-center justify-center shrink-0">
                            <User size={14} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-gray-900 truncate">
                              {enq.name}
                            </h4>
                            <span className="text-[9px] text-gray-400 font-bold block mt-0.5">
                              {new Date(enq.createdAt).toLocaleDateString()} at {new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Dropdown status update */}
                        <div className="relative shrink-0">
                          <select
                            disabled={updatingId === enq._id}
                            value={enq.status}
                            onChange={(e) => handleStatusChange(enq._id, e.target.value as any)}
                            className={`appearance-none outline-none text-[9px] font-bold px-2.5 py-1 pr-5 rounded-full border cursor-pointer select-none transition-colors ${getStatusBadge(
                              enq.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-current font-bold text-[7px]">
                            ▼
                          </span>
                        </div>
                      </div>

                      {/* Content Row */}
                      <div className="p-4 space-y-3.5">
                        {/* Call Client Banner */}
                        <div className="flex items-center justify-between bg-white border border-[#ECE7DB] rounded-xl p-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                            <Phone size={13} className="text-[#9A720C]" />
                            <span>{enq.phone}</span>
                          </div>
                          <a
                            href={`tel:${enq.phone}`}
                            className="text-[9px] font-black text-white bg-[#9A720C] hover:bg-[#856108] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                          >
                            <Phone size={9} /> Call Client
                          </a>
                        </div>

                        {/* Callback Details */}
                        {(enq.preferredDate || enq.preferredTime) && (
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-500 bg-[#FAF9F6]/50 rounded-xl p-2.5 border border-gray-100">
                            {enq.preferredDate && (
                              <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-gray-400" />
                                <span>{enq.preferredDate}</span>
                              </div>
                            )}
                            {enq.preferredTime && (
                              <div className="flex items-center gap-1">
                                <Clock size={12} className="text-gray-400" />
                                <span>{enq.preferredTime}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Client message box */}
                        {enq.message && (
                          <div className="flex gap-2 items-start p-2.5 bg-amber-50/10 border border-dashed border-[#E8DCC1] rounded-xl">
                            <MessageSquare size={13} className="text-gray-400 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-gray-600 leading-relaxed italic">
                              "{enq.message}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Progress indicator */}
                      {updatingId === enq._id && (
                        <div className="px-4 py-1.5 bg-gray-50 border-t border-[#FAF5EA] flex items-center justify-center gap-1.5 text-[9px] text-gray-500 font-bold shrink-0">
                          <RefreshCw size={9} className="animate-spin" /> Saving status...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="h-9 px-5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
