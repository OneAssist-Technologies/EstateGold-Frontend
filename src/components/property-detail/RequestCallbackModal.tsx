"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  PhoneCall,
  Calendar,
  Clock,
  MessageSquare,
  User,
} from "lucide-react";

import api from "@/src/services/api";

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

  const handleSubmit =
    async () => {

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

        alert(
          "Callback request sent successfully."
        );

        onClose();

      } catch (err) {

        console.log(err);

        alert(
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

          className="
            fixed
            inset-0
            bg-black/60
            backdrop-blur-md
            flex
            items-center
            justify-center
            z-[999]
            p-6
          "
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

            className="
              w-full
              max-w-2xl
              bg-white
              rounded-[30px]
              overflow-hidden
              shadow-2xl
            "
          >

            {/* Header */}

            <div
              className="
                bg-gradient-to-r
                from-[#B8860B]
                to-[#D4AF37]
                text-white
                p-8
                relative
              "
            >

              <button

                onClick={onClose}

                className="
                  absolute
                  right-6
                  top-6
                "
              >

                <X size={22} />

              </button>

              <div className="flex items-center gap-4">

                <PhoneCall size={36} />

                <div>

                  <h2 className="text-3xl font-bold">

                    Request Callback

                  </h2>

                  <p className="opacity-90 mt-2">

                    Submit your enquiry and the owner
                    will contact you shortly.

                  </p>

                </div>

              </div>

            </div>

            {/* Body */}

            <div className="p-8 space-y-6">

              <div className="grid grid-cols-2 gap-6">

                <div>

                  <label className="font-medium">

                    Full Name

                  </label>

                  <div
                    className="
                      mt-2
                      h-14
                      border
                      rounded-xl
                      px-4
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <User size={18} />

                    <input

                      name="name"

                      value={form.name}

                      onChange={handleChange}

                      className="flex-1 outline-none"

                      placeholder="Enter name"

                    />

                  </div>

                </div>

                <div>

                  <label className="font-medium">

                    Phone Number

                  </label>

                  <div
                    className="
                      mt-2
                      h-14
                      border
                      rounded-xl
                      px-4
                      flex
                      items-center
                    "
                  >

                    <PhoneCall size={18} />

                    <input

                      name="phone"

                      value={form.phone}

                      onChange={handleChange}

                      className="flex-1 ml-3 outline-none"

                      placeholder="Mobile Number"

                    />

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-6">

                <div>

                  <label className="font-medium">

                    Preferred Date

                  </label>

                  <div
                    className="
                      mt-2
                      h-14
                      border
                      rounded-xl
                      px-4
                      flex
                      items-center
                    "
                  >

                    <Calendar size={18} />

                    <input

                      type="date"

                      name="preferredDate"

                      value={form.preferredDate}

                      onChange={handleChange}

                      className="
                        flex-1
                        ml-3
                        outline-none
                      "

                    />

                  </div>

                </div>

                <div>

                  <label className="font-medium">

                    Preferred Time

                  </label>

                  <div
                    className="
                      mt-2
                      h-14
                      border
                      rounded-xl
                      px-4
                      flex
                      items-center
                    "
                  >

                    <Clock size={18} />

                    <input

                      type="time"

                      name="preferredTime"

                      value={form.preferredTime}

                      onChange={handleChange}

                      className="
                        flex-1
                        ml-3
                        outline-none
                      "

                    />

                  </div>

                </div>

              </div>

              <div>

                <label className="font-medium">

                  Message

                </label>

                <div
                  className="
                    mt-2
                    border
                    rounded-xl
                    p-4
                    flex
                    gap-3
                  "
                >

                  <MessageSquare
                    size={18}
                    className="mt-1"
                  />

                  <textarea

                    rows={5}

                    name="message"

                    value={form.message}

                    onChange={handleChange}

                    className="
                      flex-1
                      resize-none
                      outline-none
                    "

                    placeholder="Tell the owner about your requirement..."

                  />

                </div>

              </div>

              <div className="flex justify-end gap-4 pt-4">

                <button

                  onClick={onClose}

                  className="
                    h-14
                    px-8
                    rounded-xl
                    border
                  "
                >

                  Cancel

                </button>

                <button

                  disabled={loading}

                  onClick={handleSubmit}

                  className="
                    h-14
                    px-10
                    rounded-xl
                    bg-[#C89B1C]
                    hover:bg-[#B8860B]
                    text-white
                    font-semibold
                    transition
                  "
                >

                  {loading
                    ? "Submitting..."
                    : "Submit Request"}

                </button>

              </div>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}