"use client";

import {
  User,
  Home,
  Building2,
  CheckCircle,
} from "lucide-react";

interface Props {
  role: string;
  setRole: (role: string) => void;
}

export default function RoleSelector({
  role,
  setRole,
}: Props) {
  const roles = [
    {
      id: "buyer",
      title: "Buyer",
      icon: User,
      description:
        "I want to buy or rent a property",
    },
    {
      id: "seller",
      title: "Owner / Seller",
      icon: Home,
      description:
        "I want to sell or rent my property",
    },
    {
      id: "agent",
      title: "Agent / Broker",
      icon: Building2,
      description:
        "I manage properties professionally",
    },
  ];

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">
        I am a...
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {roles.map((item) => {
          const Icon = item.icon;

          const active =
            role === item.id;

          return (
       <button
  key={item.id}
  type="button"
  onClick={() => setRole(item.id)}
  className={`
    group
    h-44
    rounded-3xl
    border-2
    flex
    flex-col
    items-center
    justify-center
    gap-4
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-xl
    hover:scale-[1.02]
    ${
      active
        ? `
          border-[#C89B1C]
          bg-[#FFF9EC]
          shadow-lg
          scale-[1.02]
        `
        : `
          border-gray-200
          bg-white
        `
    }
  `}
>
             <div
  className={`
    h-16
    w-16
    rounded-full
    flex
    items-center
    justify-center
    transition-all
    duration-300
    group-hover:scale-110
    ${
      active
        ? "bg-[#F3E5B5]"
        : "bg-gray-100"
    }
  `}
>
               <Icon
  size={28}
  className={`
    transition-all
    duration-300
    group-hover:scale-110
    ${
      active
        ? "text-[#C89B1C]"
        : "text-gray-500"
    }
  `}
/>
              </div>

              <span
  className={`
    font-semibold
    text-lg
    transition-all
    duration-300
    ${
      active
        ? "text-[#C89B1C]"
        : "text-gray-700"
    }
  `}
>
                {item.title}
              </span>

              {active && (
                <CheckCircle
                  size={18}
                  className="text-[#C89B1C]"
                />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-gray-500 mt-4">
        {
          roles.find(
            (item) =>
              item.id === role
          )?.description
        }
      </p>
    </div>
  );
}