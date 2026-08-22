"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

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
          Join 200,000+ property owners and
          <br className="hidden xs:block" /> agents who trust EstateGold.
        </p>

        <div className="flex flex-col xs:flex-row justify-center items-center gap-3 xs:gap-5 mt-8 md:mt-12 w-full max-w-xs xs:max-w-none mx-auto">
          <Link
            href={postPropertyHref}
            className="w-full xs:w-auto bg-white text-[#C89B1C] px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base hover:bg-gray-50 transition-colors shadow-2xs text-center"
          >
            Post Property Free
          </Link>

          <Link
            href={searchPropertiesHref}
            className="w-full xs:w-auto border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base hover:bg-white/10 transition-colors shadow-2xs text-center"
          >
            Search Properties
          </Link>
        </div>
      </div>
    </section>
  );
}