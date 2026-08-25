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
      className="bg-white rounded-[24px] sm:rounded-[30px] border border-[#ECE6D8] p-4 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Neighbourhood Ratings
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Rate the locality to help buyers.
        </p>
      </div>

      <div className="space-y-5">
        {ratingItems.map((item) => (
          <div
            key={item.key}
            className="border border-[#ECE6D8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C89B1C] hover:shadow-md transition"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-[#FFF8EA] flex items-center justify-center text-xl sm:text-2xl shrink-0"
              >
                {item.emoji}
              </div>

              <div>
                <h3 className="font-semibold text-base sm:text-lg">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex gap-1.5 sm:gap-2 justify-start sm:justify-end mt-1 sm:mt-0">
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
                  className="transition hover:scale-110"
                >
                  <Star
                    className="h-5.5 w-5.5 sm:h-7 sm:w-7 transition-colors"
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