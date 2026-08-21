

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
    <section className="bg-[#F8F3E8] py-24">

      <div className="max-w-7xl mx-auto px-6">

        <p className="text-center uppercase tracking-widest text-[#C89B1C]">
          Real Stories
        </p>

        <h2 className="text-center text-5xl font-bold mt-4">
          What Our Customers Say
        </h2>

        <div className="grid lg:grid-cols-3 gap-8 mt-16">

          {testimonials.map((item) => (
            <div
              key={item.name}
              className="bg-white p-8 rounded-3xl shadow-sm"
            >
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill="#C89B1C"
                    className="text-[#C89B1C]"
                  />
                ))}
              </div>

              
              <p className="mt-6 text-lg text-gray-700">
  {`${item.review}`}
</p>
            

              <div className="flex items-center gap-4 mt-8">
                <div
                  className="h-12 w-12 rounded-full bg-[#C89B1C] text-white flex items-center justify-center font-semibold"
                >
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-semibold">
                    {item.name}
                  </h4>

                  <p className="text-gray-500 text-sm">
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