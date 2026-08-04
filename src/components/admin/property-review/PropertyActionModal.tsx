"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  type: "reject" | "delete";
  loading?: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function PropertyActionModal({
  open,
  type,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!reason.trim()) return;

    onSubmit(reason);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed
            inset-0
            z-50
            bg-black/40
            flex
            items-center
            justify-center
            p-4
          "
        >
          <motion.div
            initial={{
              scale: 0.95,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
            }}
            className="
              w-full
              max-w-lg
              rounded-2xl
              bg-white
              shadow-2xl
              overflow-hidden
            "
          >
            <div className="p-6 border-b">

              <div className="flex items-center gap-3">

                <div
                  className="
                    h-11
                    w-11
                    rounded-xl
                    bg-red-100
                    text-red-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <AlertTriangle size={22} />
                </div>

                <div>

                  <h2 className="text-xl font-semibold">

                    {type === "reject"
                      ? "Reject Property"
                      : "Delete Property"}

                  </h2>

                  <p className="text-sm text-gray-500">

                    Please provide a reason.

                  </p>

                </div>

              </div>

            </div>

            <div className="p-6">

              <label className="text-sm font-medium">

                Reason

              </label>

              <textarea
                rows={5}
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                placeholder={
                  type === "reject"
                    ? "Enter rejection reason..."
                    : "Enter deletion reason..."
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  p-4
                  resize-none
                  outline-none
                  focus:border-[#C89B1C]
                "
              />

            </div>

            <div
              className="
                border-t
                p-5
                flex
                justify-end
                gap-3
              "
            >

              <button
                onClick={onClose}
                className="
                  h-10
                  px-5
                  rounded-lg
                  border
                "
              >
                Cancel
              </button>

              <button
                disabled={
                  loading ||
                  !reason.trim()
                }
                onClick={handleSubmit}
                className="
                  h-10
                  px-5
                  rounded-lg
                  bg-red-600
                  text-white
                  flex
                  items-center
                  gap-2
                  disabled:opacity-50
                "
              >
                {loading && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {type === "reject"
                  ? "Reject Property"
                  : "Delete Property"}

              </button>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}