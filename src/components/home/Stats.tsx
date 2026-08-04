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
    <section className="bg-[#F8F3E8] py-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 text-center">
        {stats.map((item) => (
          <div key={item.label}>
            <h3 className="text-4xl font-bold text-[#C89B1C]">
              {item.value}
            </h3>

            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}