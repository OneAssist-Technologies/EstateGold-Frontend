"use client";

import {
  MapPinned,
  Map,
  Home,
  Ruler,
} from "lucide-react";
import { LocationStats as Stats } from "../../../types/location";

interface LocationStatsProps {
  stats: Stats;
}

export default function LocationStats({
  stats,
}: LocationStatsProps) {
  const cards = [
    {
      title: "Total Cities",
      value: stats.totalCities,
      icon: Map,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Cities",
      value: stats.activeCities,
      icon: MapPinned,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Listings",
      value: stats.totalListings.toLocaleString(),
      icon: Home,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Average Radius",
      value: `${stats.averageRadius} km`,
      icon: Ruler,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`${card.bg} rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  {card.value}
                </h3>
              </div>

              <div
                className={`${card.iconBg} rounded-xl p-2 sm:p-3 shrink-0`}
              >
                <Icon
                  className={card.iconColor}
                  size={26}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}