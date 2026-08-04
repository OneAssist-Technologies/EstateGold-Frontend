"use client";

import { motion } from "framer-motion";

interface Props {
  checked: boolean;
  onChange: () => void;
}

export default function StatusToggle({
  checked,
  onChange,
}: Props) {
  return (
    <div className="flex items-center gap-3">

      <span
        className={`
          text-sm
          font-medium
          ${
            checked
              ? "text-green-600"
              : "text-gray-500"
          }
        `}
      >
        {checked
          ? "Active"
          : "Inactive"}
      </span>

      <button
        onClick={onChange}
        className={`
          relative
          w-14
          h-8
          rounded-full
          transition-all
          duration-300
          ${
            checked
              ? "bg-green-500"
              : "bg-gray-300"
          }
        `}
      >
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
          className="
            absolute
            top-1
            left-1
            h-6
            w-6
            rounded-full
            bg-white
            shadow-lg
          "
          animate={{
            x: checked
              ? 24
              : 0,
          }}
        />
      </button>

    </div>
  );
}