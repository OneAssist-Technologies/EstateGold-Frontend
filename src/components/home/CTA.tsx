"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";;

export default function CTA() {
  const { isAuthenticated } = useAuth();

  const postPropertyHref = isAuthenticated ? "/post-property" : "/login";
  const searchPropertiesHref = isAuthenticated ? "/property-listing" : "/login";

  return (
    <section className="bg-[#C89B1C] py-12 md:py-24">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl xs:text-4xl md:text-6xl font-bold text-white leading-tight">
          List Your Property
          <br className="hidden xs:block" /> for FREE
        </h2>

        <p className="text-white/95 text-sm xs:text-base md:text-xl mt-4 md:mt-8 max-w-md md:max-w-none mx-auto leading-relaxed">
         Bringing property owners, buyers, and agents together on one trusted platform.
        </p>

        <div className="flex flex-row justify-center items-center gap-3 sm:gap-5 mt-8 md:mt-12 w-full mx-auto">
          <Link
            href={postPropertyHref}
            className="bg-white text-[#C89B1C] px-4 xs:px-6 sm:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs xs:text-sm md:text-base hover:bg-gray-50 transition-colors shadow-2xs text-center whitespace-nowrap"
          >
            Post Property Free
          </Link>

          <Link
            href={searchPropertiesHref}
            className="border-2 border-white text-white px-4 xs:px-6 sm:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs xs:text-sm md:text-base hover:bg-white/10 transition-colors shadow-2xs text-center whitespace-nowrap"
          >
            Search Properties
          </Link>
        </div>
      </div>
    </section>
  );
}