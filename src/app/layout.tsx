import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import AdminRouteGuard from "../components/auth/AdminRouteGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#F8F6F2] text-[#161616]`}
      >
        <AuthProvider>
          <AdminRouteGuard>
            {children}
          </AdminRouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}