"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import AuthImage from "../../assests/auth.jpg";
import Logo from "../common/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const highlights = [
    "1.2M+ verified listings",
    "₹0 brokerage — ever",
    "Direct owner contact",
    "150+ cities covered",
  ];

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col md:flex-row bg-white font-sans">
      {/* Left Side: Fixed Luxury Banner */}
      <div className="w-full md:w-5/12 lg:w-1/2 h-64 md:h-screen relative overflow-hidden shrink-0 sticky top-0">
        <Image
          src={AuthImage}
          alt="EstateGold Luxury Real Estate"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover zoom-image"
        />

        {/* Dark Luxury Overlay (Black & Gold Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

        {/* Content Aligned Bottom Left */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 text-white z-10">
          {/* Logo */}
          <div className="mb-6 sm:mb-8">
            <Logo lightText size="lg" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight text-white mb-3 sm:mb-4">
            India's No-Brokerage<br className="hidden sm:inline" /> Property Platform
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-lg mb-6 sm:mb-8 font-normal">
            Connect directly with owners and tenants. Buy, sell, or rent — one free account does it all.
          </p>

          {/* Bullet Points */}
          <div className="hidden sm:space-y-3.5 text-sm sm:text-base font-medium text-white">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full border-2 border-[#F4D56A] flex items-center justify-center shrink-0 bg-[#F4D56A]/10">
                  <Check size={14} className="text-[#F4D56A] stroke-[3]" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Scrollable Form Container */}
      <div className="w-full md:w-7/12 lg:w-1/2 h-screen overflow-y-auto flex flex-col items-center px-6 py-8 sm:px-12 lg:px-16 bg-white">
        <div className="w-full max-w-[520px] py-4 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}