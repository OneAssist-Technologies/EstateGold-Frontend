import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/AuthContext";
import AdminRouteGuard from "../components/auth/AdminRouteGuard";
import EyvaChatbot from "../components/common/EyvaChatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Estate Luxe | Luxury Real Estate",
  description:
    "Discover luxury villas, premium apartments, commercial properties and investment opportunities.",
  keywords: [
    "Luxury Real Estate",
    "Property Listing",
    "Luxury Villas",
    "Premium Apartments",
    "Real Estate India",
  ],
  // SEO Site Verification
  verification: {
    google: "xHHuz5dH233rvCqQ41U-tOi1MZGchBuwkTM953pOuas",
    other: {
      "msvalidate.01": "E6F26031828E068BAB975DE59937A04C",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.className} ${inter.variable} antialiased bg-[#F8F6F2] text-[#161616]`}
      >
        <AuthProvider>
          <AdminRouteGuard>
            {children}
            <EyvaChatbot />
          </AdminRouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
