"use client";

import {
  User,
  Phone,
  Mail,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

import { AdminProperty } from "@/src/types/adminProperty";

interface Props {
  property: AdminProperty;
}

export default function SubmissionDetails({
  property,
}: Props) {
  const submitter = property.createdBy;

  const isAgent =
    submitter?.role === "agent";

  return (
    <section
      className="mt-8 rounded-xl border border-[#ECE7DB] bg-white p-6"
    >
      <h2
        className="text-xl font-semibold text-[#161616]"
      >
        Submission Details
      </h2>

      {/* Submitted By */}

      <div className="mt-5">

        <h3
          className="text-sm font-semibold text-[#C89B1C] uppercase"
        >
          Submitted By ({isAgent ? "Agent" : "Seller"})
        </h3>

        <div className="mt-3 grid md:grid-cols-3 gap-4">

          <InfoRow
            icon={<User size={15} />}
            label="Name"
            value={
              submitter?.fullName ??
              property.ownerName
            }
          />

          <InfoRow
            icon={<Phone size={15} />}
            label="Phone"
            value={
              submitter?.phone ??
              property.ownerPhone
            }
          />

          <InfoRow
            icon={<Mail size={15} />}
            label="Email"
            value={
              submitter?.email ??
              property.ownerEmail
            }
          />

        </div>

      </div>

      {/* Owner */}

      {isAgent && (
        <>
          <div className="my-5 border-t border-[#ECE7DB]" />

          <h3
            className="text-sm font-semibold text-[#C89B1C] uppercase"
          >
            Property Owner
          </h3>

          <div className="mt-3 grid md:grid-cols-3 gap-4">

            <InfoRow
              icon={<User size={15} />}
              label="Name"
              value={property.ownerName}
            />

            <InfoRow
              icon={<Phone size={15} />}
              label="Phone"
              value={property.ownerPhone}
            />

            <InfoRow
              icon={<Mail size={15} />}
              label="Email"
              value={property.ownerEmail}
            />

          </div>
        </>
      )}

      <div className="my-5 border-t border-[#ECE7DB]" />

      {/* Footer */}

      <div className="grid md:grid-cols-3 gap-4">

        <InfoRow
          icon={<CalendarDays size={15} />}
          label="Submitted"
          value={new Date(
            property.createdAt
          ).toLocaleDateString()}
        />

        <InfoRow
          icon={<BadgeCheck size={15} />}
          label="Status"
          value={property.status}
        />

        {/* <InfoRow
          icon={<BadgeCheck size={15} />}
          label="Role"
          value={
            isAgent
              ? "Agent Listing"
              : "Seller Listing"
          }
        /> */}

      </div>

    </section>
  );
}

interface InfoProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

function InfoRow({
  icon,
  label,
  value,
}: InfoProps) {
  return (
    <div
      className="flex items-start gap-3"
    >
      <div
        className="mt-0.5 text-[#C89B1C]"
      >
        {icon}
      </div>

      <div>

        <p
          className="text-xs text-gray-500"
        >
          {label}
        </p>

        <p
          className="text-sm font-medium text-[#161616] break-all"
        >
          {value || "-"}
        </p>

      </div>

    </div>
  );
}