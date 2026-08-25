// components/home/WhyTrust.tsx

import Image from "next/image";
import {
  ShieldCheck,
  Users,
  BadgeCheck,
  Clock3,
} from "lucide-react";
import trustProperty from "../../assets/images/trust-property.jpg";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Verified Listings",
    description:
      "Every property is physically verified before listing.",
  },
  {
    icon: Users,
    title: "Direct Owner Contact",
    description:
      "Connect directly with owners. Zero brokerage.",
  },
  {
    icon: BadgeCheck,
    title: "Legal Assistance",
    description:
      "Documentation, registration and loan guidance.",
  },
  {
    icon: Clock3,
    title: "24/7 Support",
    description:
      "Dedicated support throughout your property journey.",
  },
];

export default function WhyTrust() {
  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">

          <div>
            <p className="uppercase tracking-wider text-xs md:text-sm text-[#C89B1C]">
              Our Promise
            </p>

            <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold mt-2 md:mt-4 leading-tight">
              Why 50,000+ Families Trust EstateGold
            </h2>

            <div className="mt-6 md:mt-10 space-y-5 md:space-y-8">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3.5 xs:gap-5"
                >
                  <div
                    className="h-11 w-11 xs:h-14 xs:w-14 rounded-xl xs:rounded-2xl bg-[#F8F3E8] flex items-center justify-center shrink-0"
                  >
                    <item.icon
                      className="text-[#C89B1C] h-5 w-5 xs:h-6 xs:w-6"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-base xs:text-xl">
                      {item.title}
                    </h4>

                    <p className="text-xs xs:text-sm md:text-base text-gray-600 mt-1 md:mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Image
              src={trustProperty}
              alt="Luxury Interior"
              width={700}
              height={700}
              className="rounded-2xl xs:rounded-3xl"
            />

            <div
              className="absolute bottom-4 left-4 xs:bottom-6 xs:left-6 bg-white p-3.5 xs:p-6 rounded-xl xs:rounded-2xl shadow-xl"
            >
              <p className="text-xl xs:text-3xl font-bold">
                ₹2.3 Lakhs
              </p>

              <p className="text-[10px] xs:text-sm text-gray-500">
                Average brokerage saved
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}