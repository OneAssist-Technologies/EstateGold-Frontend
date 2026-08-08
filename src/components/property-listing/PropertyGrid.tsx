"use client";

import { Property } from "../../types/property";
import PropertyCard from "./PropertyCard";
import { motion } from "framer-motion";

interface Props {
  properties?: Property[];
}

export default function PropertyGrid({ properties = [] }: Props) {
  if (!Array.isArray(properties)) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}