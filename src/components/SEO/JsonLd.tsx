export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Estate Luxe",
    url: "https://yourdomain.com",
    description:
      "Luxury real estate platform for premium properties.",
    areaServed: "India",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}