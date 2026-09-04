"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EyvaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/property-listing?eyva=open");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2]">
      <div className="text-center">
        <img src="/eyva 1.png" alt="Eyva AI" className="w-16 h-16 mx-auto mb-4 animate-bounce" />
        <p className="text-gray-600 font-medium">Opening Eyva AI Property Assistant...</p>
      </div>
    </div>
  );
}
