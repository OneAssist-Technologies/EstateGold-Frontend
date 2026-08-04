// components/home/FeaturedProperties.tsx

"use client";

import PropertyCard, { Property } from "./PropertyCard";

const properties: Property[] = [
  {
    _id: "1",
    title: "Luxury Villa",
    price: 12000000,
    location: "Coimbatore",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    beds: 4,
    baths: 3,
  },
  {
    _id: "2",
    title: "Modern Apartment",
    price: 8500000,
    location: "Chennai",
    image:
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200",
    beds: 3,
    baths: 2,
  },
  {
    _id: "3",
    title: "Premium Independent House",
    price: 15000000,
    location: "Bangalore",
    image:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1200",
    beds: 5,
    baths: 4,
  },
];

export default function FeaturedProperties() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">
          <p className="text-[#C89B1C] uppercase tracking-widest">
            Featured Listings
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Featured Properties
          </h2>

          <p className="text-gray-500 mt-4">
            Explore our handpicked premium properties.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
            />
          ))}
        </div>
      </div>
    </section>
  );
}