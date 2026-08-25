"use client";

import PropertyListCard from "./PropertyListCard";
import { Property } from "../../../types/property";
import { motion } from "framer-motion";


interface Props {
  properties: Property[];
}

export default function PropertyList({
  properties,
}: Props) {
  return (
    <div className="space-y-6">

      {properties.map((property, index) => (
       <motion.div
  key={property._id}
  initial={{
    opacity: 0,
    x: 30,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: 0.4,
    delay: index * 0.05,
  }}
  whileHover={{
    scale: 1.01,
    y: -5,
  }}
>
  <PropertyListCard
    property={property}
  />
</motion.div>
        )
      )}

    </div>
  );
}