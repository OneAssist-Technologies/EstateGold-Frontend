"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
} from "lucide-react";

export default function AdminNavbar() {
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <header
      className="
        h-20
        bg-white
        border-b
        border-[#ECE7DB]
        px-8
        flex
        items-center
        justify-between
        sticky
        top-0
        z-30
      "
    >
      {/* Left */}

      <div>

        <motion.h2
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            text-3xl
            font-bold
            text-[#161616]
          "
        >
          Welcome Back 👋
        </motion.h2>

        <p className="text-gray-500 mt-1">
          {today}
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div
          className="
            w-[360px]
            h-12
            rounded-xl
            border
            border-[#E8E1D4]
            bg-[#FAFAF8]
            px-4
            flex
            items-center
            gap-3
            transition
            focus-within:border-[#C89B1C]
            focus-within:shadow-[0_0_0_3px_rgba(200,155,28,.12)]
          "
        >
          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            placeholder="Search properties..."
            className="
              flex-1
              bg-transparent
              outline-none
              text-sm
            "
          />
        </div>

        {/* Notification */}

        <motion.button
          whileHover={{
            y: -2,
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="
            relative
            h-12
            w-12
            rounded-xl
            border
            border-[#E8E1D4]
            bg-white
            flex
            items-center
            justify-center
            hover:border-[#C89B1C]
            hover:bg-[#FFF9EC]
            transition-all
          "
        >
          <Bell size={19} />

          <span
            className="
              absolute
              top-2
              right-2
              h-2.5
              w-2.5
              rounded-full
              bg-red-500
              border-2
              border-white
            "
          />
        </motion.button>

{/* Profile */}

<motion.div
  whileHover={{
    y: -2,
    scale: 1.03,
  }}
  whileTap={{
    scale: 0.97,
  }}
  transition={{
    duration: 0.2,
  }}
  className="
    flex
    flex-col
    items-center
    justify-center
    cursor-pointer
    select-none
  "
>

  {/* Avatar */}

  <div className="relative">

    <div
      className="
        h-10
        w-10
        rounded-full
        bg-gradient-to-br
        from-[#D4AF37]
        to-[#B8860B]
        text-white
        font-bold
        text-lg
        flex
        items-center
        justify-center
        shadow-md
      "
    >
      A
    </div>

    {/* Online Indicator */}

    <span
      className="
        absolute
        bottom-0
        right-0
        h-3
        w-3
        rounded-full
        bg-green-500
        border-2
        border-white
      "
    />

  </div>

  <span
    className="
      text-sm
      font-semibold
      text-[#161616]
    "
  >
    Admin
  </span>

</motion.div>

      </div>

    </header>
  );
}