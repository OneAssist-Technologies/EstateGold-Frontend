// components/home/CTA.tsx

import Link from "next/link";

export default function CTA() {
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
            href="/post-property"
            className="
            bg-white
            text-[#C89B1C]
            px-8
            py-4
            rounded-2xl
            font-semibold
            "
          >
            Post Property Free
          </Link>

          <Link
            href="/properties"
            className="
            border-2
            border-white
            text-white
            px-8
            py-4
            rounded-2xl
            font-semibold
            "
          >
            Search Properties
          </Link>
        </div>
      </div>
    </section>
  );
}