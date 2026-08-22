"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PropertyFilterDrawer({
  open,
  onClose,
}: Props) {
  return (
    <AnimatePresence>

      {open && (

        <>

          {/* Overlay */}

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
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Drawer */}

          <motion.div
            initial={{
              x: 420,
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: 420,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
            }}
            className="fixed right-0 top-0 h-screen w-full max-w-[360px] bg-white shadow-2xl z-50 flex flex-col"
          >

            {/* Header */}

            <div
              className="flex justify-between items-center p-6 border-b"
            >

              <h2
                className="text-xl font-semibold"
              >
                Filters
              </h2>

              <button
                onClick={onClose}
              >
                <X size={20} />
              </button>

            </div>

            {/* Content */}

            <div className="flex-1 p-6 space-y-8">

              {/* Status */}

              <div>

                <label className="text-sm font-semibold">
                  Status
                </label>

                <select
                  className="mt-3 w-full h-11 rounded-xl border px-4"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>

              </div>

              {/* Type */}

              <div>

                <label className="text-sm font-semibold">
                  Property Type
                </label>

                <select
                  className="mt-3 w-full h-11 rounded-xl border px-4"
                >
                  <option>All</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>House</option>
                  <option>Commercial</option>
                </select>

              </div>

              {/* City */}

              <div>

                <label className="text-sm font-semibold">
                  City
                </label>

                <select
                  className="mt-3 w-full h-11 rounded-xl border px-4"
                >
                  <option>All Cities</option>
                  <option>Coimbatore</option>
                  <option>Chennai</option>
                  <option>Bangalore</option>
                </select>

              </div>

            </div>

            {/* Footer */}

            <div
              className="p-6 border-t flex gap-3"
            >

              <button
                className="flex-1 h-11 rounded-xl border"
              >
                Reset
              </button>

              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-xl bg-[#C89B1C] text-white"
              >
                Apply
              </button>

            </div>

          </motion.div>

        </>

      )}

    </AnimatePresence>
  );
}