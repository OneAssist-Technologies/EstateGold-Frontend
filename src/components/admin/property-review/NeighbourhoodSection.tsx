"use client";

import {
  School,
  GraduationCap,
  Hospital,
  Train,
  Bus,
  Plane,
  Trees,
  ShoppingBag,
  Landmark,
  Star,
  MapPin,
  FileText,
} from "lucide-react";

import { Neighbourhood } from "@/src/types/adminProperty";

interface Props {
  neighbourhood?: Neighbourhood;
}

const placeIcons = {
  school: <School size={18} />,
  college: <GraduationCap size={18} />,
  hospital: <Hospital size={18} />,
  metro: <Train size={18} />,
  busStand: <Bus size={18} />,
  airport: <Plane size={18} />,
  park: <Trees size={18} />,
  mall: <ShoppingBag size={18} />,
  temple: <Landmark size={18} />,
};

export default function NeighbourhoodSection({
  neighbourhood,
}: Props) {

 if (
  !neighbourhood ||
  !neighbourhood.nearbyPlaces ||
  !neighbourhood.ratings
) {
  return (
    <section
      className="rounded-3xl border border-[#ECE7DB] bg-white p-8"
    >
      <h2 className="text-2xl font-semibold">
        Neighbourhood
      </h2>

      <p className="mt-4 text-gray-500">
        No neighbourhood information available.
      </p>
    </section>
  );
}

 const places = Object.entries(
  neighbourhood?.nearbyPlaces ?? {}
);

const ratings = Object.entries(
  neighbourhood?.ratings ?? {}
);
  return (
    <section
      className="rounded-3xl border border-[#ECE7DB] bg-white p-8"
    >
      <div className="mb-8">

        <h2
          className="text-2xl font-semibold text-[#161616]"
        >
          Neighbourhood
        </h2>

        <p className="text-gray-500 mt-1">
          Nearby places and locality information
        </p>

      </div>

      {/* Nearby Places */}
<div>

  <h3
    className="text-lg font-semibold mb-4"
  >
    Nearby Places
  </h3>

  <div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
  >

    {places
      .filter(([, place]) => place?.enabled)
      .map(([key, place]) => (

        <div
          key={key}
          className="flex items-center gap-3 rounded-xl border border-[#ECE7DB] bg-[#FCFBF8] px-4 py-3 hover:bg-[#FFFDF8] transition"
        >

          <div
            className="h-10 w-10 rounded-full bg-[#FFF3D8] text-[#C89B1C] flex items-center justify-center shrink-0"
          >
            {
              placeIcons[
                key as keyof typeof placeIcons
              ]
            }
          </div>

          <div className="flex-1 min-w-0">

            <p
              className="text-sm font-semibold text-[#161616] truncate"
            >
              {place.name}
            </p>

            <div
              className="mt-1 flex items-center justify-between"
            >

              <span
                className="text-xs text-gray-500 capitalize"
              >
                {key}
              </span>

              <span
                className="text-xs font-medium text-[#C89B1C]"
              >
                {place.distance}
              </span>

            </div>

          </div>

        </div>

      ))}

  </div>

</div>

      {/* Ratings */}

      <div className="mt-12">

        <h3
          className="text-lg font-semibold mb-5"
        >
          Locality Ratings
        </h3>

        <div
          className="grid md:grid-cols-2 gap-5"
        >

          {ratings.map(([key, value]) => (

            <LocalityRatingRow
              key={key}
              title={key}
              rating={value}
            />

          ))}

        </div>

      </div>

   {/* Landmarks */}

{neighbourhood.landmarks.length > 0 && (

  <div className="mt-10">

    <h3
      className="text-lg font-semibold mb-4"
    >
      Landmarks
    </h3>

    <div
      className="flex flex-wrap gap-3"
    >

      {neighbourhood.landmarks.map(
        (landmark, index) => (

          <div
            key={index}
            className="inline-flex items-center gap-3 rounded-full border border-[#E7D8B6] bg-[#FFFDF8] px-4 py-2 hover:bg-[#FFF8EA] transition"
          >

            <div
              className="h-8 w-8 rounded-full bg-[#FFF3D8] text-[#C89B1C] flex items-center justify-center"
            >
              <MapPin size={15} />
            </div>

            <div className="leading-tight">

              <p
                className="text-sm font-medium text-[#161616]"
              >
                {landmark.name}
              </p>

              <p
                className="text-xs text-gray-500"
              >
                {landmark.distance}
              </p>

            </div>

          </div>

        )
      )}

    </div>

  </div>

)}

      {/* Notes */}

      {neighbourhood.notes && (

        <div className="mt-12">

          <h3
            className="text-lg font-semibold mb-5"
          >
            Additional Notes
          </h3>

          <div
            className="rounded-2xl bg-[#FAF8F4] border border-[#ECE7DB] p-6"
          >

            <div className="flex gap-3">

              <FileText
                className="text-[#C89B1C]"
              />

              <p
                className="leading-8 text-gray-600"
              >
                {neighbourhood.notes}
              </p>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

interface LocalityRatingRowProps {
  title: string;
  rating: number;
}

function LocalityRatingRow({
  title,
  rating,
}: LocalityRatingRowProps) {
  const percentage = (rating / 5) * 100;

  const getColor = () => {
    if (rating >= 4) return "bg-green-500";
    if (rating === 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStarColor = () => {
    if (rating >= 4) return "text-green-500";
    if (rating === 3) return "text-yellow-500";
    return "text-red-500";
  };

  const formatTitle = (value: string) => {
    const labels: Record<string, string> = {
      connectivity: "Connectivity & Transport",
      safety: "Safety & Security",
      powerSupply: "Power Supply",
      waterSupply: "Water Supply",
      noiseLevel: "Noise Level",
      internet: "Internet Connectivity",
      greenery: "Greenery & Environment",
    };

    return labels[value] ?? value;
  };

  return (
    <div
      className="grid grid-cols-[220px_1fr_30px_90px] items-center gap-4 py-2"
    >
      <p
        className="text-[15px] text-[#161616] font-medium"
      >
        {formatTitle(title)}
      </p>

      <div
        className="h-2 rounded-full bg-[#E9DFC9] overflow-hidden"
      >
        <div
          className={`h-full rounded-full ${getColor()}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <span
        className={`font-semibold ${getStarColor()}`}
      >
        {rating}
      </span>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={14}
            fill={
              index < rating
                ? "currentColor"
                : "none"
            }
            className={
              index < rating
                ? getStarColor()
                : "text-gray-300"
            }
          />
        ))}
      </div>
    </div>
  );
}