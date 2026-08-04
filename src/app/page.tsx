// import Navbar from "../components/layout/Navbar";
"use client";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import FeaturedProperties from "../components/home/FeaturedProperties";
import PropertyTypes from "../components/home/PropertyTypes";
import Cities from "../components/home/Cities";
import HowItWorks from "../components/home/HowItWorks";
import WhyTrust from "../components/home/WhyTrust";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";
import dynamic from "next/dynamic";

// const Navbar = dynamic(
//   () =>
//     import(
//       "../components/layout/Navbar"
//     ),
//   {
//     ssr: false,
//   }
// );

export default function HomePage() {
  return (
    <>
      <Navbar/>

      <main>
        <Hero />
        <Stats />
        <FeaturedProperties />
        <PropertyTypes />
        <Cities />
        <HowItWorks />
        <WhyTrust />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </>
  );
}