"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  X,
} from "lucide-react";

interface Props {
  status: string;

  onApprove?: () => void;

  onReject?: () => void;

  onDelete?: () => void;

  onClose?: () => void;
}

export default function PropertyReviewHeader({
  status,
  onApprove,
  onReject,
  onDelete,
  onClose,
}: Props) {
  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        sticky
        top-0
        z-40
        bg-[#FAF8F3]
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
       
          border-b
          border-[#E8E1D4]
        "
      >
        {/* Left */}

        <div>

          <h1
            className="
              text-[24px]
              font-playfair
              font-bold
              text-[#161616]
              leading-none
              pt-3
            "
          >
            Property Detail
          </h1>

          <p
            className="
              mt-2
              text-[17px]
              text-[#737373]
            "
          >
            Admin review
          </p>

        </div>

        {/* Right */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {status === "pending" && (
            <>
<motion.button
  whileHover={{ y: -1 }}
  whileTap={{ scale: 0.97 }}
  onClick={onApprove}
  className="
    h-9
    px-4
    rounded-lg
    bg-[#ECFDF3]
    border
    border-[#BBF7D0]
    text-[#15803D]
    text-sm
    font-medium
    flex
    items-center
    gap-2
    transition-all
    hover:bg-[#DCFCE7]
  "
>
  <CheckCircle2 size={16} />
  Approve
</motion.button>
           <motion.button
  whileHover={{ y: -1 }}
  whileTap={{ scale: 0.97 }}
  onClick={onReject}
  className="
    h-9
    px-4
    rounded-lg
    bg-[#FEF2F2]
    border
    border-[#FECACA]
    text-[#DC2626]
    text-sm
    font-medium
    flex
    items-center
    gap-2
    transition-all
    hover:bg-[#FEE2E2]
  "
>
  <XCircle size={16} />
  Reject
</motion.button>
            </>
          )}

        <motion.button
  whileHover={{ y: -1 }}
  whileTap={{ scale: 0.97 }}
  onClick={onDelete}
  className="
    h-9
    px-4
    rounded-lg
    bg-white
    border
    border-[#FECACA]
    text-[#DC2626]
    text-sm
    font-medium
    flex
    items-center
    gap-2
    transition-all
    hover:bg-[#FFF5F5]
  "
>
  <Trash2 size={16} />
  Delete
</motion.button>

       <motion.button
  whileHover={{
    rotate: 90,
    backgroundColor: "#F3F4F6",
  }}
  whileTap={{ scale: 0.9 }}
  onClick={onClose}
  className="
    h-8
    w-8
    rounded-full
    flex
    items-center
    justify-center
    text-gray-500
    transition-all
  "
>
  <X size={16} />
</motion.button>

        </div>

      </div>

    </motion.header>
  );
}