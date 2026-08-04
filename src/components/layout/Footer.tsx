// components/layout/Footer.tsx

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#14110F] text-white">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-4 gap-12">

          <div>
            <h2 className="text-4xl font-bold text-[#C89B1C]">
              EstateGold
            </h2>

            <p className="mt-6 text-gray-400 leading-8">
              Indias trusted real estate platform.
              Buy, sell and rent properties without
              brokerage.
            </p>

          <div className="flex gap-4">
  <FaFacebookF size={20} />
  <FaInstagram size={20} />
  <FaYoutube size={20} />
  <FaXTwitter size={20} />
</div>
          </div>

          <div>
            <h4 className="font-semibold text-xl mb-6">
              Quick Links
            </h4>

            <div className="space-y-4 text-gray-400">
              <Link href="/buy">Buy Property</Link><br />
              <Link href="/rent">Rent Property</Link><br />
              <Link href="/new-projects">New Projects</Link><br />
              <Link href="/commercial">Commercial</Link><br />
              <Link href="/post-property">
                Post Property Free
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xl mb-6">
              Top Cities
            </h4>

            <div className="space-y-4 text-gray-400">
              <p>Mumbai</p>
              <p>Bangalore</p>
              <p>Chennai</p>
              <p>Hyderabad</p>
              <p>Pune</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xl mb-6">
              Contact Us
            </h4>

            <div className="space-y-4 text-gray-400">
              <p>
                12th Floor, Trade Centre,
                Mumbai
              </p>

              <p>1800-123-4567</p>

              <p>
                support@estategold.com
              </p>
            </div>
          </div>

        </div>

        <div
          className="
          border-t
          border-white/10
          mt-16
          pt-8
          text-center
          text-gray-500
          "
        >
          © 2026 EstateGold. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}