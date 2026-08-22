// components/home/HowItWorks.tsx

import {
  Search,
  PhoneCall,
  BadgeCheck,
} from "lucide-react";

const steps = [
  {
    no: "01",
    icon: Search,
    title: "Search Property",
    description:
      "Use smart filters to find your dream property.",
  },
  {
    no: "02",
    icon: PhoneCall,
    title: "Connect Directly",
    description:
      "Talk directly with owners and agents.",
  },
  {
    no: "03",
    icon: BadgeCheck,
    title: "Move In Happy",
    description:
      "Complete the deal with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#14110F] py-12 md:py-24 text-white">
      <div className="max-w-7xl mx-auto px-6">

        <p className="text-center text-[#C89B1C] uppercase tracking-wider text-xs md:text-sm">
          Simple Process
        </p>

        <h2 className="text-center text-2xl xs:text-3xl md:text-5xl font-bold mt-2 md:mt-4">
          How EstateGold Works
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-12 mt-12 md:mt-20">
          {steps.map((step) => (
            <div
              key={step.title}
              className="text-center last:col-span-2 md:last:col-span-1 max-w-[240px] md:max-w-none mx-auto"
            >
              <div
                className="relative h-16 w-16 md:h-24 md:w-24 mx-auto rounded-full border border-[#C89B1C] flex items-center justify-center"
              >
                <step.icon
                  className="text-[#C89B1C] h-7 w-7 md:h-9 md:w-9"
                />

                <span
                  className="absolute -top-1.5 -right-1.5 bg-[#C89B1C] h-6 w-6 md:h-8 md:w-8 rounded-full text-xs md:text-sm flex items-center justify-center font-bold"
                >
                  {step.no}
                </span>
              </div>

              <h3 className="text-base xs:text-lg md:text-3xl font-bold mt-4 md:mt-8">
                {step.title}
              </h3>

              <p className="text-xs xs:text-sm md:text-base text-gray-300 mt-2 md:mt-5 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}