"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  PhoneCall,
  Calendar,
  Clock,
  MessageSquare,
  User,
  CheckCircle2,
} from "lucide-react";

import api from "@/src/lib/api";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  propertyId: string;
  ownerId: string;
  userName?: string;
  userPhone?: string;
  onClose: () => void;
}

export default function RequestCallbackModal({
  open,
  propertyId,
  ownerId,
  userName = "",
  userPhone = "",
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: userName,
    phone: userPhone,
    preferredDate: "",
    preferredTime: "10:00",
    message: "I am interested in this property. Please contact me.",
  });

  useEffect(() => {
    if (open) {
      const todayStr = new Date().toISOString().split("T")[0];
      setForm({
        name: userName || "",
        phone: userPhone || "",
        preferredDate: todayStr,
        preferredTime: "10:00",
        message: "I am interested in this property. Please contact me.",
      });
      setSubmitted(false);
    }
  }, [open, userName, userPhone]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Phone Number is required.");
      return;
    }
    if (form.phone.trim().length < 10) {
      toast.error("Please enter a valid 10-digit Phone Number.");
      return;
    }
    if (!form.preferredDate) {
      toast.error("Preferred Date is required.");
      return;
    }
    if (!form.preferredTime) {
      toast.error("Preferred Time is required.");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Description / Message is required.");
      return;
    }

    try {
      setLoading(true);

      const cleanOwnerId =
        typeof ownerId === "object"
          ? (ownerId as any)._id || (ownerId as any).id
          : ownerId || propertyId;

      await api.post("/enquiries", {
        propertyId,
        ownerId: cleanOwnerId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        message: form.message.trim(),
      });

      toast.success("Callback request submitted successfully!");
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to submit callback request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl my-auto border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white p-6 sm:p-7 relative">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <PhoneCall size={26} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Request a Callback</h2>
                  <p className="opacity-90 mt-0.5 text-xs">
                    Fill in your details below and the owner/agent will contact you.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            {submitted ? (
              <div className="p-8 sm:p-10 flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Request Submitted Successfully!
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Thank you. Your callback request has been registered and sent to the property publisher. They will contact you at your preferred time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 px-8 py-2.5 rounded-xl bg-[#C89B1C] hover:bg-[#B8860B] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-2xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="p-6 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-xs text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1.5 h-11 border border-gray-200 focus-within:border-[#9A720C] rounded-xl px-3.5 flex items-center gap-2.5 bg-gray-50/50">
                      <User size={16} className="text-gray-400 shrink-0" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="flex-1 outline-none text-xs text-gray-900 bg-transparent"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-xs text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1.5 h-11 border border-gray-200 focus-within:border-[#9A720C] rounded-xl px-3.5 flex items-center gap-2.5 bg-gray-50/50">
                      <PhoneCall size={16} className="text-gray-400 shrink-0" />
                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setForm((prev) => ({ ...prev, phone: val }));
                        }}
                        className="flex-1 outline-none text-xs text-gray-900 bg-transparent"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-xs text-gray-700">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1.5 h-11 border border-gray-200 focus-within:border-[#9A720C] rounded-xl px-3.5 flex items-center gap-2.5 bg-gray-50/50">
                      <Calendar size={16} className="text-gray-400 shrink-0" />
                      <input
                        type="date"
                        name="preferredDate"
                        value={form.preferredDate}
                        onChange={handleChange}
                        className="flex-1 outline-none text-xs text-gray-900 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-xs text-gray-700">
                      Preferred Time <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1.5 h-11 border border-gray-200 focus-within:border-[#9A720C] rounded-xl px-3.5 flex items-center gap-2.5 bg-gray-50/50">
                      <Clock size={16} className="text-gray-400 shrink-0" />
                      <input
                        type="time"
                        name="preferredTime"
                        value={form.preferredTime}
                        onChange={handleChange}
                        className="flex-1 outline-none text-xs text-gray-900 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Description / Message */}
                <div>
                  <label className="font-semibold text-xs text-gray-700">
                    Description / Requirement <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1.5 border border-gray-200 focus-within:border-[#9A720C] rounded-xl p-3 flex gap-2.5 bg-gray-50/50">
                    <MessageSquare size={16} className="mt-0.5 text-gray-400 shrink-0" />
                    <textarea
                      rows={3}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className="flex-1 resize-none outline-none text-xs text-gray-900 bg-transparent font-sans"
                      placeholder="Tell the owner about your property requirement..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white font-bold text-xs transition cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}