"use client";

import {
  User,
  Phone,
  Mail,
  BadgeCheck,
  Users,
  CreditCard,
  Smartphone,
} from "lucide-react";

import { AdminProperty } from "@/src/types/adminProperty";

interface Props {
  property: AdminProperty;
}

export default function OwnerCard({
  property,
}: Props) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-[#ECE7DB]
        bg-white
        p-8
      "
    >
      <div className="flex items-center gap-4 mb-8">

        <div
          className="
            h-20
            w-20
            rounded-full
            bg-gradient-to-br
            from-[#C89B1C]
            to-[#E8C76B]
            text-white
            flex
            items-center
            justify-center
            text-3xl
            font-bold
          "
        >
          {property.ownerName
            ?.charAt(0)
            ?.toUpperCase()}
        </div>

        <div>

          <h2
            className="
              text-2xl
              font-semibold
              text-[#161616]
            "
          >
            {property.ownerName}
          </h2>

          <p className="text-gray-500 mt-1">
            Property Owner
          </p>

        </div>

      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        <InfoCard
          icon={<Phone size={20} />}
          title="Phone"
          value={property.ownerPhone || "-"}
        />

        <InfoCard
          icon={<Smartphone size={20} />}
          title="Alternate Phone"
          value={property.alternatePhone || "-"}
        />

        <InfoCard
          icon={<Mail size={20} />}
          title="Email"
          value={property.ownerEmail || "-"}
        />

        <InfoCard
          icon={<Users size={20} />}
          title="Owner Type"
          value={property.ownerType || "-"}
        />

        <InfoCard
          icon={<BadgeCheck size={20} />}
          title="Agent Relation"
          value={property.agentRelation || "-"}
        />

        <InfoCard
          icon={<CreditCard size={20} />}
          title="ID Type"
          value={property.ownerIdType || "-"}
        />

        <InfoCard
          icon={<User size={20} />}
          title="ID Number"
          value={property.ownerIdNumber || "-"}
        />

        <InfoCard
          icon={<BadgeCheck size={20} />}
          title="Status"
          value="Verified"
        />

      </div>
    </section>
  );
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function InfoCard({
  icon,
  title,
  value,
}: CardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#ECE7DB]
        bg-[#FCFBF8]
        p-5
        hover:shadow-md
        transition-all
      "
    >
      <div
        className="
          h-11
          w-11
          rounded-xl
          bg-[#FFF7E3]
          text-[#C89B1C]
          flex
          items-center
          justify-center
          mb-4
        "
      >
        {icon}
      </div>

      <p
        className="
          text-xs
          uppercase
          tracking-wide
          text-gray-500
        "
      >
        {title}
      </p>

      <h3
        className="
          mt-2
          font-semibold
          text-[#161616]
          break-all
        "
      >
        {value}
      </h3>
    </div>
  );
}