

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Home Buyer • Mumbai",
    review:
      "Found my dream home in just two weeks. Transparent process and zero brokerage.",
  },
  {
    name: "Sneha Reddy",
    role: "Property Owner • Bangalore",
    review:
      "Received genuine buyer enquiries and closed quickly.",
  },
  {
    name: "Karthik Iyer",
    role: "Tenant • Chennai",
    review:
      "Verified listings gave confidence. Everything matched the property description.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#F8F3E8] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center uppercase tracking-wider text-xs md:text-sm text-[#C89B1C]">
          Real Stories
        </p>

        <h2 className="text-center text-2xl xs:text-3xl md:text-5xl font-bold mt-2 md:mt-4">
          What Our Customers Say
        </h2>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-8 mt-10 md:mt-16">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    fill="#C89B1C"
                    className="text-[#C89B1C] h-4 w-4 md:h-[18px] md:w-[18px]"
                  />
                ))}
              </div>

              <p className="mt-4 md:mt-6 text-sm md:text-lg text-gray-700 leading-relaxed">
                {`${item.review}`}
              </p>

              <div className="flex items-center gap-3 md:gap-4 mt-5 md:mt-8">
                <div
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#C89B1C] text-white flex items-center justify-center font-semibold text-sm md:text-base shrink-0"
                >
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-semibold text-sm md:text-base text-gray-900">
                    {item.name}
                  </h4>

                  <p className="text-gray-500 text-[11px] md:text-sm mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}