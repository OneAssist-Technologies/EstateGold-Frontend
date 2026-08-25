"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

import Logo from "../common/Logo";
import api from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";;

export default function Footer() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [supportEmail, setSupportEmail] = useState("support@estategold.com");
  const [supportPhone, setSupportPhone] = useState("+91 1800-123-4567");
  const [supportAddress, setSupportAddress] = useState("12th Floor, Trade Centre, Mumbai");

  const [topCities, setTopCities] = useState<string[]>(["Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune"]);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        // 1. Fetch public settings
        const settingsRes = await api.get("/settings");
        if (settingsRes.data.success && settingsRes.data.settings) {
          const s = settingsRes.data.settings;
          setSupportEmail(s.supportEmail || "support@estategold.com");
          setSupportPhone(s.supportPhone || "+91 1800-123-4567");
          setSupportAddress(s.supportAddress || "12th Floor, Trade Centre, Mumbai");
        }
      } catch (err) {
        console.error("Failed to fetch public settings for footer:", err);
      }

      try {
        // 2. Fetch active cities
        const locationsRes = await api.get("/admin/locations?status=active");
        if (locationsRes.data && locationsRes.data.locations && locationsRes.data.locations.length > 0) {
          const activeCities = Array.from(
            new Set(
              locationsRes.data.locations
                .map((loc: { city: string }) => loc.city)
                .filter((c: string) => Boolean(c && c.trim()))
            )
          ) as string[];
          if (activeCities.length > 0) {
            setTopCities(activeCities.slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Failed to fetch active cities for footer:", err);
      }
    }

    fetchFooterData();
  }, []);

  const postPropertyHref = isAuthenticated ? "/post-property" : "/login";

  return (
    <footer className="bg-[#14110F] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Logo lightText />
            <p className="mt-4 text-xs md:text-sm text-gray-400 leading-normal md:leading-8">
              Indias trusted real estate platform.
              Buy, sell and rent properties without
              brokerage.
            </p>
            <div className="flex gap-4 mt-4 md:mt-6">
              <FaFacebookF className="hover:text-[#C89B1C] transition-colors cursor-pointer h-4 w-4 md:h-5 md:w-5" />
              <FaInstagram className="hover:text-[#C89B1C] transition-colors cursor-pointer h-4 w-4 md:h-5 md:w-5" />
              <FaYoutube className="hover:text-[#C89B1C] transition-colors cursor-pointer h-4 w-4 md:h-5 md:w-5" />
              <FaXTwitter className="hover:text-[#C89B1C] transition-colors cursor-pointer h-4 w-4 md:h-5 md:w-5" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base md:text-xl mb-4 md:mb-6">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5 md:gap-4 text-xs md:text-sm text-gray-400">
              <Link href="/property-listing" className="hover:text-[#C89B1C] transition-colors">Browse Properties</Link>
              <Link href="/property-listing?purpose=Rent" className="hover:text-[#C89B1C] transition-colors">Rent Property</Link>
              <Link href="/property-listing?type=NewProjects" className="hover:text-[#C89B1C] transition-colors">New Projects</Link>
              <Link href="/property-listing?type=Commercial" className="hover:text-[#C89B1C] transition-colors">Commercial</Link>
              <Link href={postPropertyHref} className="hover:text-[#C89B1C] transition-colors">
                Post Property Free
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base md:text-xl mb-4 md:mb-6">
              Top Cities
            </h4>
            <div className="flex flex-col gap-2.5 md:gap-4 text-xs md:text-sm text-gray-400">
              {topCities.map((city) => (
                <Link
                  key={city}
                  href={`/property-listing?city=${encodeURIComponent(city)}`}
                  className="hover:text-[#C89B1C] transition-colors capitalize"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-base md:text-xl mb-4 md:mb-6">
              Contact Us
            </h4>
            <div className="flex flex-col gap-2.5 md:gap-4 text-xs md:text-sm text-gray-400">
              <p className="leading-normal md:leading-relaxed">
                {supportAddress}
              </p>
              <p className="hover:text-[#C89B1C] transition-colors">
                <a href={`tel:${supportPhone}`}>{supportPhone}</a>
              </p>
              <p className="hover:text-[#C89B1C] transition-colors">
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 md:mt-16 pt-6 md:pt-8 text-center text-xs text-gray-500">
          © 2026 EstateGold. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}