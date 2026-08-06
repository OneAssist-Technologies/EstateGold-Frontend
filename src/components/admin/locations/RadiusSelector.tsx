"use client";

interface RadiusSelectorProps {
  value: number | string;
  onChange: (val: string) => void;
}

export default function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Radius (KM) <span className="text-red-500">*</span>
      </label>

      <div className="relative flex items-center">
        <input
          type="number"
          min={1}
          max={500}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 rounded-xl border border-[#E8E1D4] bg-[#FAFAF8] pl-4 pr-12 text-sm text-[#161616] outline-none focus:border-[#C89B1C] focus:bg-white focus:ring-2 focus:ring-[#C89B1C]/15 transition-all font-bold"
        />
        <span className="absolute right-3.5 text-xs font-semibold text-gray-400 pointer-events-none">
          km
        </span>
      </div>
    </div>
  );
}
