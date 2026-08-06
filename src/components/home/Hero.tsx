"use client";
import Image from "next/image";
import {
  Search,
  MapPin
} from "lucide-react";
import HeroImage from "../../assests/hero.jpg"

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
  <Image
    src={HeroImage}
    alt="Luxury Property"
    fill
    priority
    quality={100}
    sizes="100vw"
    className="object-cover animate-[kenburns_20s_ease-in-out_infinite]"
  />



  <div
  className="
    absolute
    inset-0
    bg-gradient-to-r
    from-black/80
    via-black/50
    to-black/30
  "
/>

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">

        <div className="inline-flex border border-[#C89B1C] rounded-full px-5 py-2 text-[#C89B1C]">
          #1 Trusted Real Estate Platform
        </div>

        <h1
          className="
          mt-8
          text-6xl
          font-bold
          text-white
          max-w-4xl
          leading-tight
          "
        >
          Find Your
          <span className="text-[#C89B1C]">
            {" "}Perfect Home
          </span>
          <br />
          Without Brokerage
        </h1>

        <p className="text-white/80 text-xl mt-6 max-w-3xl">
          Search from 1.2 million+
          properties and connect
          directly with owners.
        </p>

        <div className="bg-white rounded-3xl mt-12 max-w-4xl overflow-hidden">
          {/* <div className="grid grid-cols-3 border-b">

            <button className="h-16 font-semibold border-b-2 border-[#C89B1C]">
              Buy
            </button>

            <button className="h-16">
              Rent
            </button>

            <button className="h-16">
              Commercial
            </button>

          </div> */}

          <div  className=" p-6 animate-[float_5s_ease-in-out_infinite]">

            <div className="flex gap-4">

              <div className="flex-1 relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-4"
                />

                <input
                  placeholder="Search by city, locality, project..."
                  className="
                    w-full
                    h-14
                    border
                    rounded-xl
                    pl-12
                    pr-4
                  "
                />
              </div>

              <button
                className="
                bg-[#C89B1C]
                text-white
                px-8
                rounded-xl
                flex
                items-center
                gap-2
                "
              >
                <Search size={18} />
                Search
              </button>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}