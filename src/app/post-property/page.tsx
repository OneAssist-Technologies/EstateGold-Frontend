"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import PropertyForm from "../../components/property/form/PropertyForm";
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";

export default function PostPropertyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col font-sans">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
          </div>
          <Footer />
        </div>
      }
    >
      <PropertyForm mode="create" />
    </Suspense>
  );
}