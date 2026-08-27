import {
  ShieldCheck,
  Building2,
  Sparkles,
  Users,
} from "lucide-react";

export default function Stats() {
  const badges = [
    {
      icon: ShieldCheck,
      title: "Trusted Listings",
      description: "Confidence starts with better information",
    },
    {
      icon: Building2,
      title: "Properties for Every Need",
      description: "Buy • Sell • Rent • Commercial",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Assistance",
      description: "Smarter property discovery with Eyva",
    },
    {
      icon: Users,
      title: "Easy Connections",
      description: "Connect with the right property people",
    },
  ];

  return (
    <section className="bg-[#F8F3E8] py-6 sm:py-8 border-t border-[#E8DCC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3.5 p-2 transition-transform hover:-translate-y-0.5"
            >
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-2xs border border-[#EADBBD]">
                <item.icon className="text-[#C89B1C] h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5 leading-tight font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}