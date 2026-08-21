"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

export interface Landmark {
  name: string;
  distance: string;
}

interface Props {
  landmarks: Landmark[];

  onChange: (landmarks: Landmark[]) => void;
}

const distances = [
  "< 100 m",
  "< 250 m",
  "< 500 m",
  "< 1 km",
  "1 - 2 km",
  "2 - 5 km",
  "5+ km",
];

export default function LandmarkSection({
  landmarks,
  onChange,
}: Props) {

  const addLandmark = () => {

    onChange([
      ...landmarks,
      {
        name: "",
        distance: "",
      },
    ]);

  };

  const updateLandmark = (
    index: number,
    key: keyof Landmark,
    value: string
  ) => {

    const updated = [...landmarks];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    onChange(updated);

  };

  const removeLandmark = (
    index: number
  ) => {

    onChange(
      landmarks.filter(
        (_, i) => i !== index
      )
    );

  };

  return (

    <motion.div
      layout
      className="bg-white rounded-[30px] border border-[#ECE6D8] p-8"
    >

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">

            Additional Landmarks

          </h2>

          <p className="text-gray-500 mt-2">

            Add famous nearby places to help buyers.

          </p>

        </div>

        <button
          type="button"
          onClick={addLandmark}
          className="h-12 px-5 rounded-xl bg-[#C89B1C] hover:bg-[#B8860B] text-white flex items-center gap-2 transition"
        >

          <Plus size={18} />

          Add Landmark

        </button>

      </div>

      <AnimatePresence>

        {landmarks.map(
          (item, index) => (

            <motion.div

              key={index}

              layout

              initial={{
                opacity: 0,
                y: 20,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                y: -20,
              }}

              transition={{
                duration: .25,
              }}

              className="mt-6 grid grid-cols-12 gap-5 items-end"
            >

              {/* Landmark */}

              <div className="col-span-7">

                <label
                  className="text-sm font-medium text-gray-600"
                >

                  Landmark

                </label>

                <div
                  className="mt-2 h-14 rounded-2xl border border-[#E6DDCC] px-4 flex items-center gap-3"
                >

                  <MapPin
                    size={20}
                    className="text-gray-400"
                  />

                  <input
                    value={item.name}
                    onChange={(e)=>

                      updateLandmark(
                        index,
                        "name",
                        e.target.value
                      )

                    }
                    placeholder="Landmark name"
                    className="flex-1 outline-none bg-transparent"
                  />

                </div>

              </div>

              {/* Distance */}

              <div className="col-span-4">

                <label
                  className="text-sm font-medium text-gray-600"
                >

                  Distance

                </label>

                <select

                  value={item.distance}

                  onChange={(e)=>

                    updateLandmark(
                      index,
                      "distance",
                      e.target.value
                    )

                  }

                  className="mt-2 h-14 w-full rounded-2xl border border-[#E6DDCC] px-4 outline-none"
                >

                  <option value="">
                    Select
                  </option>

                  {distances.map(
                    (distance)=>(
                      <option
                        key={distance}
                        value={distance}
                      >
                        {distance}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* Delete */}

              <div className="col-span-1">

                <button

                  type="button"

                  onClick={()=>

                    removeLandmark(
                      index
                    )

                  }

                  className="h-14 w-14 rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                >

                  <Trash2 size={20} />

                </button>

              </div>

            </motion.div>

          )
        )}

      </AnimatePresence>

      {landmarks.length===0 && (

        <div
          className="mt-8 rounded-2xl border-2 border-dashed border-[#E6DDCC] py-10 text-center text-gray-500"
        >

          No landmarks added yet.

        </div>

      )}

    </motion.div>

  );

}