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
} from "lucide-react";

import api from "@/src/lib/api";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  propertyId: string;
  ownerId: string;
  onClose: () => void;
}

export default function RequestCallbackModal({
  open,
  propertyId,
  ownerId,
  onClose,
}: Props) {

  const [loading, setLoading] =
    useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] =
    useState({

      name: "",

      phone: "",

      preferredDate: "",

      preferredTime: "",

      message: "",

    });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
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

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
    }
  }, [open]);

  const handleSubmit =
    async () => {
      // Validate all fields are mandatory
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
        toast.error("Message is required.");
        return;
      }

      try {

        setLoading(true);

        await api.post(
          "/callback-request",
          {

            propertyId,

            ownerId,

            ...form,

          }
        );

        toast.success(
          "Request submitted successfully"
        );

        setSubmitted(true);

      } catch (err) {

        console.log(err);

        toast.error(
          "Unable to submit callback request."
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <AnimatePresence>

      {open && (

        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          exit={{
            opacity: 0,
          }}

          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-6"
        >

          <motion.div

            initial={{
              scale: .9,
              opacity: 0,
              y: 40,
            }}

            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}

            exit={{
              scale: .9,
              opacity: 0,
            }}

            className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-[30px] overflow-hidden shadow-2xl mx-4 my-8"
          >

            {/* Header */}

            <div
              className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white p-6 sm:p-8 relative"
            >

              <button

                onClick={handleClose}

                className="absolute right-4 top-4 sm:right-6 sm:top-6"
              >

                <X size={20} />

              </button>

              <div className="flex items-center gap-3 sm:gap-4">

                <PhoneCall size={30} className="sm:size-9" />

                <div>

                  <h2 className="text-2xl sm:text-3xl font-bold">

                    Request Callback

                  </h2>

                  <p className="opacity-90 mt-1 sm:mt-2 text-xs sm:text-sm">

                    Submit your enquiry and the owner
                    will contact you shortly.

                  </p>

                </div>

              </div>

            </div>

            {/* Body */}

            {submitted ? (
              <div className="p-8 sm:p-12 flex flex-col items-center text-center space-y-5">
                <div className="h-16 w-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                    Request Submitted Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    Thank you. Your callback request has been registered and the property publisher has been notified. They will contact you shortly.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="mt-2 h-12 px-10 rounded-xl bg-[#C89B1C] hover:bg-[#B8860B] text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                  <div>

                    <label className="font-medium text-xs sm:text-sm">

                      Full Name <span className="text-red-500">*</span>

                    </label>

                    <div
                      className="mt-1.5 h-12 sm:h-14 border rounded-xl px-4 flex items-center gap-3"
                    >

                      <User size={16} />

                      <input

                        name="name"

                        value={form.name}

                        onChange={handleChange}

                        className="flex-1 outline-none text-xs sm:text-sm"

                        placeholder="Enter name"

                      />

                    </div>

                  </div>

                  <div>

                    <label className="font-medium text-xs sm:text-sm">

                      Phone Number <span className="text-red-500">*</span>

                    </label>

                    <div
                      className="mt-1.5 h-12 sm:h-14 border rounded-xl px-4 flex items-center"
                    >

                      <PhoneCall size={16} />

                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setForm((prev) => ({ ...prev, phone: val }));
                        }}
                        className="flex-1 ml-3 outline-none text-xs sm:text-sm"
                        placeholder="Mobile Number (10 digits)"
                      />

                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                  <div>

                    <label className="font-medium text-xs sm:text-sm">

                      Preferred Date <span className="text-red-500">*</span>

                    </label>

                    <div
                      className="mt-1.5 h-12 sm:h-14 border rounded-xl px-4 flex items-center"
                    >

                      <Calendar size={16} />

                      <input

                        type="date"

                        name="preferredDate"

                        value={form.preferredDate}

                        onChange={handleChange}

                        className="flex-1 ml-3 outline-none text-xs sm:text-sm"

                      />

                    </div>

                  </div>

                  <div>

                    <label className="font-medium text-xs sm:text-sm">

                      Preferred Time <span className="text-red-500">*</span>

                    </label>

                    <div
                      className="mt-1.5 h-12 sm:h-14 border rounded-xl px-4 flex items-center"
                    >

                      <Clock size={16} />

                      <input

                        type="time"

                        name="preferredTime"

                        value={form.preferredTime}

                        onChange={handleChange}

                        className="flex-1 ml-3 outline-none text-xs sm:text-sm"

                      />

                    </div>

                  </div>

                </div>

                <div>

                  <label className="font-medium text-xs sm:text-sm">

                    Message <span className="text-red-500">*</span>

                  </label>

                  <div
                    className="mt-1.5 border rounded-xl p-3 sm:p-4 flex gap-3"
                  >

                    <MessageSquare
                      size={16}
                      className="mt-1"
                    />

                    <textarea

                      rows={4}

                      name="message"

                      value={form.message}

                      onChange={handleChange}

                      className="flex-1 resize-none outline-none text-xs sm:text-sm"

                      placeholder="Tell the owner about your requirement..."

                    />

                  </div>

                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-2 sm:pt-4">

                  <button

                    onClick={handleClose}

                    className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl border text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1"
                  >

                    Cancel

                  </button>

                  <button

                    disabled={loading}

                    onClick={handleSubmit}

                    className="h-12 sm:h-14 px-8 sm:px-10 rounded-xl bg-[#C89B1C] hover:bg-[#B8860B] text-white font-semibold text-xs sm:text-sm transition order-1 sm:order-2"
                  >

                    {loading
                      ? "Submitting..."
                      : "Submit Request"}

                  </button>

                </div>

              </div>
            )}

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}