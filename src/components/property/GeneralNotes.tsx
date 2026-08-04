"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const MAX_LENGTH = 500;

export default function GeneralNotes({
  value,
  onChange,
}: Props) {
  const remaining = MAX_LENGTH - value.length;

  return (
    <motion.div
      layout
      className="
        bg-white
        rounded-[30px]
        border
        border-[#ECE6D8]
        p-8
      "
    >
      {/* Header */}

      <div className="flex items-center gap-5 mb-8">

        <div
          className="
            h-16
            w-16
            rounded-2xl
            bg-[#FFF8EA]
            text-[#C89B1C]
            flex
            items-center
            justify-center
          "
        >
          <FileText size={30} />
        </div>

        <div>

          <h2 className="text-xl font-semibold">

            Locality Overview

          </h2>

          <p className="text-gray-500 mt-2">

            Describe the neighbourhood, connectivity,
            safety, nearby facilities and other important
            information that buyers should know.

          </p>

        </div>

      </div>

      {/* Textarea */}

      <div className="relative">

        <textarea
          rows={8}
          maxLength={MAX_LENGTH}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="Example:

• Peaceful residential locality
• Walking distance to schools
• Metro station within 500 meters
• Nearby hospitals and shopping malls
• Excellent road connectivity
• Suitable for families"
          className="
            w-full
            rounded-3xl
            border
            border-[#E6DDCC]
            bg-[#FCFBF8]
            p-6
            text-[15px]
            leading-7
            resize-none
            outline-none
            transition-all
            duration-300
            focus:border-[#C89B1C]
            focus:ring-4
            focus:ring-[#C89B1C]/10
          "
        />

        <div
          className="
            absolute
            bottom-5
            right-6
            text-sm
            text-gray-500
          "
        >
          {value.length} / {MAX_LENGTH}
        </div>

      </div>

      {/* Tips */}

      <div
        className="
          mt-8
          rounded-2xl
          border
          border-[#F4E5B2]
          bg-[#FFFBEF]
          p-5
        "
      >
        <h4 className="font-semibold text-[#B8860B]">

          Tips for a better listing

        </h4>

        <ul className="mt-4 space-y-2 text-sm text-gray-600">

          <li>
            • Mention schools, hospitals and public
            transport nearby.
          </li>

          <li>
            • Describe traffic conditions and safety.
          </li>

          <li>
            • Mention parks, malls or entertainment
            nearby.
          </li>

          <li>
            • Mention any unique advantage of the
            neighbourhood.
          </li>

        </ul>

      </div>

    </motion.div>
  );
}