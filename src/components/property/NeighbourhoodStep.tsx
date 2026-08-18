"use client";

import { Dispatch, SetStateAction, useState } from "react";

import {
  School,
  GraduationCap,
  Hospital,
  Train,
  Bus,
  Plane,
  Trees,
  ShoppingBag,
  Church,
} from "lucide-react";

import NearbyAccordion from "./NearbyPlaceCard";
import LandmarkSection from "./LandmarkRow";
import RatingSection from "./RatingRow";
import GeneralNotes from "./GeneralNotes";

import {
  PropertyFormData,
  Place,
  NeighbourhoodRatings,
} from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: Dispatch<SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

type NearbyPlaceKey =
  | "school"
  | "college"
  | "hospital"
  | "metro"
  | "busStand"
  | "airport"
  | "park"
  | "mall"
  | "temple";

interface NearbyPlaceItem {
  key: NearbyPlaceKey;
  title: string;
  icon: React.ReactNode;
}

export default function NeighbourhoodStep({
  formData,
  setFormData,
  errors,
}: Props) {

  const nearbyPlaces: NearbyPlaceItem[] = [
    {
      key: "school",
      title: "School",
      icon: <School size={24} />,
    },
    {
      key: "college",
      title: "College",
      icon: (
        <GraduationCap size={24} />
      ),
    },
    {
      key: "hospital",
      title: "Hospital",
      icon: <Hospital size={24} />,
    },
    {
      key: "metro",
      title: "Metro Station",
      icon: <Train size={24} />,
    },
    {
      key: "busStand",
      title: "Bus Stand",
      icon: <Bus size={24} />,
    },
    {
      key: "airport",
      title: "Airport",
      icon: <Plane size={24} />,
    },
    {
      key: "park",
      title: "Park",
      icon: <Trees size={24} />,
    },
    {
      key: "mall",
      title: "Shopping Mall",
      icon: (
        <ShoppingBag size={24} />
      ),
    },
    {
      key: "temple",
      title: "Place of Worship",
      icon: <Church size={24} />,
    },
  ];

  const updateNearbyPlace = (
    key: NearbyPlaceKey,
    value: Place
  ) => {

    setFormData((prev) => ({
      ...prev,

      neighbourhood: {

        ...prev.neighbourhood,

        nearbyPlaces: {

          ...prev.neighbourhood
            .nearbyPlaces,

          [key]: value,

        },

      },

    }));

  };

  const updateRatings = (
    ratings: NeighbourhoodRatings
  ) => {

    setFormData((prev) => ({

      ...prev,

      neighbourhood: {

        ...prev.neighbourhood,

        ratings,

      },

    }));

  };

  return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h2
          className="
            text-3xl
            font-playfair
            font-bold
            text-[#161616]
          "
        >
          Neighbourhood &
          Surroundings
        </h2>

        <p className="mt-2 text-gray-500">
          Help buyers understand
          the locality around your
          property.
        </p>

      </div>
            {/* Nearby Places */}

      <section>

        <div className="mb-3">

          <h3
            className="
              text-xl
              font-semibold
              text-[#161616]
            "
          >
            Nearby Places
          </h3>

          <p className="text-gray-500 mt-2">
            Enable only the facilities that are
            available near this property.
          </p>

        </div>

        <div className="space-y-5">

          {nearbyPlaces.map((place) => (

            <NearbyAccordion

              key={place.key}

              title={place.title}

              icon={place.icon}

              value={
                formData.neighbourhood
                  .nearbyPlaces[place.key]
              }

              // expanded={
              //   expandedCard === place.key
              // }

              // onExpand={() =>

              //   setExpandedCard(

              //     expandedCard === place.key
              //       ? null
              //       : place.key

              //   )

              // }

              onChange={(value) =>

                updateNearbyPlace(
                  place.key,
                  value
                )

              }

            />

          ))}

        </div>

      </section>

      {/* Additional Landmarks */}

      <LandmarkSection

        landmarks={
          formData.neighbourhood
            .landmarks
        }

        onChange={(landmarks) =>

          setFormData((prev) => ({

            ...prev,

            neighbourhood: {

              ...prev.neighbourhood,

              landmarks,

            },

          }))

        }

      />
            {/* Ratings */}

      <RatingSection

        ratings={
          formData.neighbourhood
            .ratings
        }

        onChange={updateRatings}

      />

      {/* General Notes */}

      <GeneralNotes

        value={
          formData.neighbourhood
            .notes
        }

        onChange={(notes) =>

          setFormData((prev) => ({

            ...prev,

            neighbourhood: {

              ...prev.neighbourhood,

              notes,

            },

          }))

        }

      />

    </div>

  );

}