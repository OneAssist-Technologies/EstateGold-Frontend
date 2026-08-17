"use client";

export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import PropertyForm from "../../../../components/property/PropertyForm";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

function EditPropertyContent() {
  const params = useParams();
  const id = params.id as string;
  return <PropertyForm mode="edit" propertyId={id} />;
}

export default function EditPropertyPage() {
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
      <EditPropertyContent />
    </Suspense>
  );
}
