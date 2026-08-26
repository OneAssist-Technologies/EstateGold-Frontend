export default function Stats() {
  const stats = [
    {
      value: "1.2M+",
      label: "Properties Listed",
    },
    {
      value: "50K+",
      label: "Happy Families",
    },
    {
      value: "150+",
      label: "Cities Covered",
    },
    {
      value: "₹0",
      label: "Brokerage Always",
    },
  ];

  return (
    <section className="bg-[#F8F3E8] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-center">
        {stats.map((item) => (
          <div key={item.label} className="p-2">
            <h3 className="text-2xl xs:text-3xl md:text-4xl font-bold text-[#C89B1C]">
              {item.value}
            </h3>

            <p className="text-xs xs:text-sm md:text-base text-gray-700 font-medium mt-1">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}