"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
} from "lucide-react";

interface PendingProperty {
  id: number;
  image: string;
  title: string;
  owner: string;
  city: string;
  price: string;
  submitted: string;
}

export default function PendingApprovalCard() {

  const properties: PendingProperty[] = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600",
      title: "Luxury Villa",
      owner: "Rahul Sharma",
      city: "Coimbatore",
      price: "₹ 1.85 Cr",
      submitted: "2 Hours Ago",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
      title: "Modern Apartment",
      owner: "Sowmiya",
      city: "Chennai",
      price: "₹ 78 Lakhs",
      submitted: "Today",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600",
      title: "Independent House",
      owner: "Praveen",
      city: "Bangalore",
      price: "₹ 92 Lakhs",
      submitted: "Yesterday",
    },
  ];

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 30,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      className="
        bg-white
        rounded-3xl
        border
        border-[#ECE7DB]
        shadow-sm
        overflow-hidden
      "

    >

      {/* Header */}

      <div
        className="
          px-8
          py-6
          border-b
          border-[#ECE7DB]
          flex
          justify-between
          items-center
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
              text-[#161616]
            "
          >
            Pending Property Approval
          </h2>

          <p className="text-gray-500 mt-2">
            Review newly submitted properties
          </p>

        </div>

        <button
          className="
            h-11
            px-5
            rounded-xl
            bg-[#C89B1C]
            text-white
            hover:bg-[#B8860B]
            transition
          "
        >
          View All
        </button>

      </div>

      {/* Table */}

      <div>

        {properties.map((item) => (

          <div

            key={item.id}

            className="
              flex
              items-center
              justify-between
              px-8
              py-6
              border-b
              border-[#F3F0E8]
              hover:bg-[#FCFBF8]
              transition
            "

          >

            {/* Property */}

            <div className="flex items-center gap-5">

              <img
                src={item.image}
                alt=""
                className="
                  h-20
                  w-28
                  rounded-2xl
                  object-cover
                "
              />

              <div>

                <h3
                  className="
                    font-semibold
                    text-lg
                    text-[#161616]
                  "
                >
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  Owner : {item.owner}
                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-gray-400
                    mt-2
                  "
                >

                  <MapPin size={15} />

                  {item.city}

                </div>

              </div>

            </div>

            {/* Price */}

            <div className="text-center">

              <p className="text-gray-400 text-sm">
                Price
              </p>

              <h4
                className="
                  font-bold
                  text-lg
                "
              >
                {item.price}
              </h4>

            </div>

            {/* Date */}

            <div className="text-center">

              <p className="text-gray-400 text-sm">
                Submitted
              </p>

              <h4>{item.submitted}</h4>

            </div>

            {/* Actions */}

            <div className="flex gap-3">

              <button
                className="
                  h-11
                  w-11
                  rounded-xl
                  border
                  border-[#ECE7DB]
                  hover:bg-[#F6F6F6]
                  transition
                  flex
                  items-center
                  justify-center
                "
              >

                <Eye size={18} />

              </button>

              <button
                className="
                  h-11
                  px-5
                  rounded-xl
                  bg-green-600
                  text-white
                  hover:bg-green-700
                  flex
                  items-center
                  gap-2
                "
              >

                <CheckCircle2 size={18} />

                Approve

              </button>

              <button
                className="
                  h-11
                  px-5
                  rounded-xl
                  bg-red-600
                  text-white
                  hover:bg-red-700
                  flex
                  items-center
                  gap-2
                "
              >

                <XCircle size={18} />

                Reject

              </button>

            </div>

          </div>

        ))}

      </div>

    </motion.div>

  );

}