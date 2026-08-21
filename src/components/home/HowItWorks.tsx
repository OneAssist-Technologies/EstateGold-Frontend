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
    <section className="bg-[#14110F] py-24 text-white">
      <div className="max-w-7xl mx-auto px-6">

        <p className="text-center text-[#C89B1C] uppercase">
          Simple Process
        </p>

        <h2 className="text-center text-5xl font-bold mt-4">
          How EstateGold Works
        </h2>

        <div className="grid md:grid-cols-3 gap-12 mt-20">
          {steps.map((step) => (
            <div
              key={step.title}
              className="text-center"
            >
              <div
                className="relative h-24 w-24 mx-auto rounded-full border border-[#C89B1C] flex items-center justify-center"
              >
                <step.icon
                  size={36}
                  className="text-[#C89B1C]"
                />

                <span
                  className="absolute -top-2 right-0 bg-[#C89B1C] h-8 w-8 rounded-full text-sm flex items-center justify-center"
                >
                  {step.no}
                </span>
              </div>

              <h3 className="text-3xl font-bold mt-8">
                {step.title}
              </h3>

              <p className="text-gray-300 mt-5">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}