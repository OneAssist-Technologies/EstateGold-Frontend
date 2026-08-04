"use client";

interface Props {
  tab: "all" | "my";
  setTab: React.Dispatch<
    React.SetStateAction<"all" | "my">
  >;
}

export default function PropertyTabs({
  tab,
  setTab,
}: Props) {
  return (
    <div className="flex gap-4 mb-8">
      <button
        onClick={() => setTab("all")}
        className={`px-6 py-3 rounded-xl font-medium transition-all ${
          tab === "all"
            ? "bg-[#C6A664] text-white shadow-lg"
            : "bg-white border border-[#EAE3D6] text-[#161616]"
        }`}
      >
        All Properties
      </button>

      <button
        onClick={() => setTab("my")}
        className={`px-6 py-3 rounded-xl font-medium transition-all ${
          tab === "my"
            ? "bg-[#C6A664] text-white shadow-lg"
            : "bg-white border border-[#EAE3D6] text-[#161616]"
        }`}
      >
        My Properties
      </button>
    </div>
  );
}