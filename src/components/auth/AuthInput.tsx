"use client";

import { LucideIcon } from "lucide-react";

interface AuthInputProps {
  icon: LucideIcon;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function AuthInput({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: AuthInputProps) {
  return (
    <div className="relative">
      <Icon
        size={20}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-16 rounded-2xl border border-[#E5D7B3] pl-14 pr-4 text-lg outline-none focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20 transition"
      />
    </div>
  );
}