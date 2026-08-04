"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

export interface Ratings {
  connectivity: number;
  safety: number;
  powerSupply: number;
  waterSupply: number;
  noiseLevel: number;
  internet: number;
  greenery: number;
}

interface Props {
  ratings: Ratings;

  onChange: (
    ratings: Ratings
  ) => void;
}

const ratingItems = [
  {
    key: "connectivity",
    title: "Connectivity",
    description:
      "Roads, public transport & accessibility",
    emoji: "🚇",
  },
  {
    key: "safety",
    title: "Safety",
    description:
      "Crime rate & neighbourhood safety",
    emoji: "🛡️",
  },
  {
    key: "powerSupply",
    title: "Power Supply",
    description:
      "Electricity availability",
    emoji: "⚡",
  },
  {
    key: "waterSupply",
    title: "Water Supply",
    description:
      "Water availability",
    emoji: "💧",
  },
  {
    key: "noiseLevel",
    title: "Noise Level",
    description:
      "Traffic & surrounding noise",
    emoji: "🔊",
  },
  {
    key: "internet",
    title: "Internet",
    description:
      "Broadband & mobile network",
    emoji: "📶",
  },
  {
    key: "greenery",
    title: "Greenery",
    description:
      "Parks & natural surroundings",
    emoji: "🌳",
  },
];

export default function RatingSection({
  ratings,
  onChange,
}: Props) {
  return (
    <motion.div
      layout
      className="
        bg-white
        rounded-[30px]
        border
        border-[#ECE6D8]
        p-8
      "
    >
      <div className="mb-6">

        <h2 className="text-xl font-semibold">

          Neighbourhood Ratings

        </h2>

        <p className="text-gray-500 mt-2">

          Rate the locality to help buyers.

        </p>

      </div>

      <div className="space-y-5">

        {ratingItems.map((item) => (

          <div
            key={item.key}
            className="
              border
              border-[#ECE6D8]
              rounded-2xl
              p-5
              flex
              items-center
              justify-between
              hover:border-[#C89B1C]
              hover:shadow-md
              transition
            "
          >

            <div className="flex items-center gap-5">

              <div
                className="
                  h-14
                  w-14
                  rounded-2xl
                  bg-[#FFF8EA]
                  flex
                  items-center
                  justify-center
                  text-2xl
                "
              >
                {item.emoji}
              </div>

              <div>

                <h3 className="font-semibold text-lg">

                  {item.title}

                </h3>

                <p className="text-sm text-gray-500 mt-1">

                  {item.description}

                </p>

              </div>

            </div>

            <div className="flex gap-2">

              {[1,2,3,4,5].map((star)=>(

                <button
                  key={star}
                  type="button"
                  onClick={()=>

                    onChange({

                      ...ratings,

                      [item.key]:star,

                    })

                  }
                  className="
                    transition
                    hover:scale-110
                  "
                >

                  <Star
                    size={28}
                    fill={
                      star <=
                      ratings[
                        item.key as keyof Ratings
                      ]
                        ? "#C89B1C"
                        : "transparent"
                    }
                    color={
                      star <=
                      ratings[
                        item.key as keyof Ratings
                      ]
                        ? "#C89B1C"
                        : "#D1D5DB"
                    }
                  />

                </button>

              ))}

            </div>

          </div>

        ))}

      </div>

    </motion.div>
  );
}