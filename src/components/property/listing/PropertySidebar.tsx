"use client";
import { motion } from "framer-motion";
interface Props {
  city: string;
  setCity: React.Dispatch<
    React.SetStateAction<string>
  >;

  bhk: string;
  setBhk: React.Dispatch<
    React.SetStateAction<string>
  >;

  priceRange: string;
  setPriceRange: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export default function PropertySidebar({
  city,
  setCity,
  bhk,
  setBhk,
  priceRange,
  setPriceRange,
}: Props) {
  return (
 <motion.div
  initial={{
    x: -50,
    opacity: 0,
  }}
  animate={{
    x: 0,
    opacity: 1,
  }}
className="sticky top-24 bg-white rounded-[32px] border border-[#EAE3D6] p-6 h-fit shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
>
      <h3 className="font-semibold text-xl mb-6">
        Filters
      </h3>

      <div className="space-y-6">

        <div>
          <label className="font-medium">
            City
          </label>

          <select
            value={city}
            onChange={(e) =>
              setCity(
                e.target.value
              )
            }
            className="w-full h-12 mt-2 border rounded-xl px-3"
          >
            <option value="">
              All Cities
            </option>

            <option>
              Chennai
            </option>

            <option>
              Bangalore
            </option>

            <option>
              Coimbatore
            </option>

            <option>
              Hyderabad
            </option>
          </select>
        </div>

        <div>
          <label className="font-medium">
            Bedrooms
          </label>

          <select
            value={bhk}
            onChange={(e) =>
              setBhk(
                e.target.value
              )
            }
            className="w-full h-12 mt-2 border rounded-xl px-3"
          >
            <option value="">
              Any
            </option>

            <option value="1">
              1 BHK
            </option>

            <option value="2">
              2 BHK
            </option>

            <option value="3">
              3 BHK
            </option>

            <option value="4">
              4+ BHK
            </option>
          </select>
        </div>

        <div>
          <label className="font-medium">
            Budget
          </label>

          <select
            value={priceRange}
            onChange={(e) =>
              setPriceRange(
                e.target.value
              )
            }
            className="w-full h-12 mt-2 border rounded-xl px-3"
          >
            <option value="">
              Any
            </option>

            <option value="0-5000000">
              Under 50L
            </option>

            <option value="5000000-10000000">
              50L - 1Cr
            </option>

            <option value="10000000-30000000">
              1Cr - 3Cr
            </option>

            <option value="30000000+">
              3Cr+
            </option>
          </select>
        </div>

      </div>
    </motion.div>
  );
}