import Image from "next/image";
import {
  BedDouble,
  Bath,
  Square,
  MapPin,
} from "lucide-react";

interface PropertyCardProps {
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
}

export default function PropertyCard({
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  image,
}: PropertyCardProps) {
  return (
    <article className="group bg-white rounded-[36px] overflow-hidden border border-[#EAE3D6] hover:shadow-xl transition-all duration-500">
      <div className="relative h-[340px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition duration-700"
        />

        <div className="absolute top-5 left-5">
          <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm">
            Featured
          </span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-[var(--font-playfair)]">
              {title}
            </h3>

            <div className="flex items-center gap-2 text-[#666666] mt-2">
              <MapPin size={16} />
              {location}
            </div>
          </div>

          <span className="text-[#C6A664] text-xl font-semibold">
            {price}
          </span>
        </div>

        <div className="grid grid-cols-3 mt-8 pt-6 border-t border-[#EAE3D6]">
          <div className="flex flex-col items-center">
            <BedDouble size={18} />
            <span className="mt-2 text-sm">
              {bedrooms} Beds
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Bath size={18} />
            <span className="mt-2 text-sm">
              {bathrooms} Baths
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Square size={18} />
            <span className="mt-2 text-sm">
              {area}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}