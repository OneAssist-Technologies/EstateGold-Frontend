"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function CTA() {
  const { isAuthenticated } = useAuth();

  const postPropertyHref = isAuthenticated ? "/post-property" : "/login";
  const searchPropertiesHref = isAuthenticated ? "/property-listing" : "/login";

  return (
    <section className="bg-[#C89B1C] py-24">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-6xl font-bold text-white">
          List Your Property
          <br />
          for FREE
        </h2>

        <p className="text-white/90 text-xl mt-8">
          Join 200,000+ property owners and
          agents who trust EstateGold.
        </p>

        <div className="flex justify-center gap-5 mt-12">
          <Link
            href={postPropertyHref}
            className="bg-white text-[#C89B1C] px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Post Property Free
          </Link>

          <Link
            href={searchPropertiesHref}
            className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-colors shadow-2xs"
          >
            Search Properties
          </Link>
        </div>
      </div>
    </section>
  );
}