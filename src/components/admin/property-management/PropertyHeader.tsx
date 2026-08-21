"use client";

import { motion } from "framer-motion";

export default function PropertyHeader() {

  return (

    <motion.div
      initial={{
        opacity: 0,
        y: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >

      <h1
        className="text-3xl font-bold text-[#161616]"
      >
        Property Management
      </h1>

      <p
        className="mt-2 text-sm text-gray-500"
      >
        Review and manage property listings submitted by users.
      </p>

    </motion.div>

  );

}