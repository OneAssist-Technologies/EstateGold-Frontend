"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { Lock, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

import api from "@/src/services/api";

import { Property } from "@/src/types/property";

import Link from "next/link";
import PropertyGallery from "../../../components/property-detail/PropertyGallery";
import PropertyInfo from "../../../components/property-detail/PropertyInfo";
import PropertyFeatures from "../../../components/property-detail/PropertyFeatures";
import PropertyDescription from "../../../components/property-detail/PropertyDescription";
import PriceTransparency from "../../../components/property-detail/PriceTransparency";
import Amenities from "../../../components/property-detail/Amenities";
import Neighbourhood from "../../../components/property-detail/Neighbourhood";
import LocalityRatings from "../../../components/property-detail/LocalityRatings";
import OwnerCard from "../../../components/property-detail/OwnerCard";
import SimilarProperties from "../../../components/property-detail/SimilarProperties";

import StickyContactCard from "../../../components/property-detail/StickyContactCard";

import LoginRequiredModal from "../../../components/property-detail/LoginRequiredModal";
import RequestCallbackModal from "../../../components/property-detail/RequestCallbackModal";

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data.data);
    } catch (err) {
      console.error("Failed to fetch property:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilar = async () => {
    try {
      const response = await api.get(`/properties/similar/${id}`);
      setSimilarProperties(response.data.data);
    } catch (err) {
      console.error("Failed to fetch similar properties:", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProperty();
    fetchSimilar();
  }, [id]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold font-serif text-gray-900">
            Property Not Found
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            The property listing you are looking for may have been removed or is unavailable.
          </p>
          <button
            type="button"
            onClick={() => router.push("/property-listing")}
            className="mt-4 px-5 py-2 rounded-xl bg-[#9A720C] text-white text-xs font-bold hover:bg-[#856108] transition-all cursor-pointer"
          >
            Back to Listings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isGuest = !isAuthenticated;
  const currentUserId = user?._id || user?._id;
  const propertyOwnerId = property.ownerId || property.createdBy;
  const isPropertyOwner = Boolean(
    currentUserId && propertyOwnerId && String(currentUserId) === String(propertyOwnerId)
  );

  const handleLoginRequired = () => {
    setLoginOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.propertyType,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Property link copied to clipboard!");
    }
  };

  const handleFavourite = () => {
    if (isGuest) {
      handleLoginRequired();
      return;
    }
    alert("Saved to your wishlist!");
  };

  const handleCall = () => {
    if (property.ownerPhone) {
      window.location.href = `tel:${property.ownerPhone}`;
    } else {
      alert("Contact number requested! Our team will get back to you.");
    }
  };

  const handleWhatsapp = () => {
    if (property.ownerPhone) {
      window.open(`https://wa.me/${property.ownerPhone}`, "_blank");
    } else {
      alert("Connecting via email...");
    }
  };

  const handleEdit = () => {
    router.push(`/my-properties/edit/${property._id}`);
  };

  const handleEnquiries = () => {
    router.push(`/my-properties/${property._id}/enquiries`);
  };

  const handleToggleStatus = async () => {
    try {
      await api.patch(`/properties/${property._id}/status`, {
        status: property.status === "approved" ? "inactive" : "approved",
      });
      fetchProperty();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1450px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Breadcrumb */}
        <nav className="text-xs text-gray-400 font-medium mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/property-listing" className="hover:text-gray-700 transition-colors">
            Properties
          </Link>
          <span>›</span>
          <span className="hover:text-gray-700">{property.city}</span>
          <span>›</span>
          <span className="text-gray-700 font-semibold truncate max-w-[250px]">
            {property.bedrooms ? `${property.bedrooms} BHK ` : ""}
            {property.propertyType}
          </span>
        </nav>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Main Content */}
          <div className={isPropertyOwner ? "lg:col-span-12 space-y-2" : "lg:col-span-8 space-y-2"}>
            <PropertyGallery
              photos={property.photos}
              purpose={property.purpose}
              onShare={handleShare}
              onFavourite={handleFavourite}
            />

            <PropertyInfo property={property} />

            <PropertyFeatures property={property} />

            {isGuest ? (
              <div className="relative">
                {/* Blurred Content */}
                <div className="blur-[6px] pointer-events-none select-none space-y-2 opacity-50">
                  <PropertyDescription property={property} />
                  <PriceTransparency property={property} />
                  <Amenities amenities={property.amenities} />
                  <Neighbourhood property={property} />
                  <LocalityRatings property={property} />
                  <OwnerCard property={property} />
                  <SimilarProperties properties={similarProperties} />
                </div>

                {/* Overlay Card Container */}
                <div className="absolute inset-x-0 top-0 flex justify-center pt-8 sm:pt-14 px-4 z-10">
                  <div className="w-full max-w-md h-fit bg-white border border-[#ECE7DB] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-5 sm:space-y-6">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#FFF9EC] border border-[#E8DCC1] flex items-center justify-center text-[#9A720C] shadow-2xs">
                      <Lock size={22} className="sm:size-24" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
                        Sign In to View Full Details
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-[280px] sm:max-w-sm">
                        Create a free account or sign in to view the complete property details, contact the owner, and save to your wishlist.
                      </p>
                    </div>

                    <div className="w-full space-y-3 pt-1">
                      <Link
                        href="/register"
                        className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                      >
                        <UserPlus size={16} /> Register Free — It's Instant
                      </Link>

                      <Link
                        href="/login"
                        className="w-full h-11 sm:h-12 rounded-xl border-2 border-[#9A720C] hover:bg-[#FFF9EC] text-[#9A720C] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <LogIn size={16} /> Sign In
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <PropertyDescription property={property} />
                <PriceTransparency property={property} />
                <Amenities amenities={property.amenities} />
                <Neighbourhood property={property} />
                <LocalityRatings property={property} />
                <OwnerCard property={property} />
                <SimilarProperties properties={similarProperties} />
              </>
            )}
          </div>

          {/* Right Sidebar - Hidden ONLY when logged-in user is the actual property owner */}
          {!isPropertyOwner && (
            <aside className="lg:col-span-4 sticky top-24">
              <StickyContactCard
                property={property}
                user={user}
                onLogin={handleLoginRequired}
                onRequestCallback={() => setCallbackOpen(true)}
                onCall={handleCall}
                onWhatsapp={handleWhatsapp}
                onEdit={handleEdit}
                onViewEnquiries={handleEnquiries}
                onToggleStatus={handleToggleStatus}
              />
            </aside>
          )}
        </div>
      </main>

      <Footer />

      <LoginRequiredModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      <RequestCallbackModal
        open={callbackOpen}
        propertyId={property._id}
        ownerId={property.createdBy}
        onClose={() => setCallbackOpen(false)}
      />
    </div>
  );
}