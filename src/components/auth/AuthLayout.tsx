"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, CheckCircle } from "lucide-react";
import AuthImage from "../../assests/auth.jpg"

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
   <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side */}

       <div
    className="
      hidden
      lg:block
      sticky
      top-0
      h-screen
      overflow-hidden
    "
  >
        <Image
          src={AuthImage}
          alt="EstateGold"
          fill
          priority
          sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover zoom-image"
        />

        <div className="absolute inset-0 bg-[#8f6c08]/60" />

        <div className="absolute inset-0 flex flex-col justify-end p-14 text-white">
          <Link
            href="/"
            className="flex items-center gap-4 mb-10"
          >
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Building2 size={26} />
            </div>

            <h2 className="text-5xl font-bold">
              EstateGold
            </h2>
          </Link>

          <h1 className="text-6xl font-bold leading-tight">
            {title}
          </h1>

          <p className="mt-6 text-2xl text-white/90 max-w-xl">
            {description}
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>No brokerage fees — ever</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>Direct owner contact</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>Verified properties only</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>Free legal guidance</span>
            </div>
          </div>

          {/* <div className="flex gap-14 mt-14">
            <div>
              <h3 className="text-4xl font-bold">
                1.2M+
              </h3>

              <p className="text-white/80">
                Properties
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold">
                ₹0
              </h3>

              <p className="text-white/80">
                Brokerage
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold">
                150+
              </h3>

              <p className="text-white/80">
                Cities
              </p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Right Side */}

      <div
  className="
    min-h-screen
    overflow-y-auto
    px-10
    py-8
    lg:px-16
  "
>
 <div className="w-full max-w-2xl fade-in-up">
  {children}
</div>
</div>
    </div>
  );
}