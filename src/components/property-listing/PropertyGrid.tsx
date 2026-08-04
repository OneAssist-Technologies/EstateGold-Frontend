"use client";

import { Property } from "../../types/property";
import PropertyCard from "./PropertyCard";
import { motion } from "framer-motion";

interface Props {
  properties?: Property[];
}

export default function PropertyGrid({
  properties = [],
}: Props) {
  if (!Array.isArray(properties)) {
    return null;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
     {properties.map((property, index) => (
       <motion.div
  key={property._id}
  initial={{
    opacity: 0,
    y: 40,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.45,
    delay: index * 0.05,
  }}
  whileHover={{
    y: -8,
    scale: 1.02,
  }}
>
  <PropertyCard
    property={property}
  />
</motion.div>
      ))}
    </div>
  );
}