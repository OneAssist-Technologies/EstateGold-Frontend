"use client";

import Link from "next/link";
import { Home } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  lightText?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  showText = true,
  lightText = false,
}: LogoProps) {
  const iconSizeClass =
    size === "sm"
      ? "h-8 w-8 rounded-lg text-sm"
      : size === "lg"
      ? "h-12 w-12 rounded-2xl text-xl"
      : "h-10 w-10 sm:h-11 sm:w-11 rounded-2xl text-lg";

  const textSizeClass =
    size === "sm"
      ? "text-xl"
      : size === "lg"
      ? "text-3xl sm:text-4xl"
      : "text-2xl sm:text-3xl";

  const svgSize = size === "sm" ? 18 : size === "lg" ? 26 : 22;

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Icon container with rich metallic gold gradient */}
      <div
        className={`${iconSizeClass} bg-gradient-to-br from-[#B88A1A] via-[#E5C365] to-[#8C6605] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105 shrink-0`}
      >
        <Home size={svgSize} className="text-white stroke-[2.5]" />
      </div>

      {/* Text with metallic gold gradient */}
      {showText && (
        <span
          className={`${textSizeClass} font-bold font-serif tracking-tight leading-none ${
            lightText
              ? "bg-gradient-to-r from-[#F4E3B5] via-[#E5C365] to-[#C89B1C] bg-clip-text text-transparent"
              : "bg-gradient-to-r from-[#A87B15] via-[#D4B04C] to-[#8C6605] bg-clip-text text-transparent"
          }`}
        >
          EstateGold
        </span>
      )}
    </Link>
  );
}
