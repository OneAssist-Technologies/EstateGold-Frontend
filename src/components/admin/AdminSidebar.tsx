"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import {
  useAuth,
} from "../../context/AuthContext";

const menu = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Properties",
    icon: Building2,
    href: "/admin/properties",
    badge: 4,
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Agents",
    icon: Shield,
    href: "/admin/agents",
  },
  {
    title: "Locations",
    icon: MapPin,
    href: "/admin/locations",
  },
  {
    title: "Role Requests",
    icon: Shield,
    href: "/admin/role-requests",
    badge: 3,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function AdminSidebar() {

  const pathname = usePathname();
 const {
  logout,
} = useAuth();
  return (

    <aside
      className="
        w-[290px]
        bg-[#171412]
        text-white
        flex
        flex-col
        border-r
        border-[#2A2724]
      "
    >

      {/* Logo */}

      <div
        className="
          px-7
          py-7
          border-b
          border-[#2A2724]
        "
      >

        <div className="flex items-center gap-4">

          <div
            className="
              h-12
              w-12
              rounded-xl
              bg-[#C89B1C]
              flex
              items-center
              justify-center
            "
          >

            <Home size={22} />

          </div>

          <div>

            <h2
              className="
                text-2xl
                font-bold
                text-[#F6E4A6]
              "
            >
              EstateGold
            </h2>

            <p className="text-sm text-gray-400">
              Admin Console
            </p>

          </div>

        </div>

      </div>

      {/* Menu */}

      <nav
        className="
          flex-1
          px-4
          py-6
        "
      >

        <div className="space-y-2">

          {menu.map((item) => {

            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (

              <Link
                key={item.title}
                href={item.href}
                className={`
                  flex
                  items-center
                  justify-between
                  px-5
                  py-4
                  rounded-2xl
                  transition-all
                  duration-300
                  ${
                    active
                      ? "bg-[#3C3112] text-[#F6D56E]"
                      : "hover:bg-[#23201D] text-gray-300"
                  }
                `}
              >

                <div className="flex items-center gap-4">

                  <Icon size={20} />

                  <span className="font-medium">

                    {item.title}

                  </span>

                </div>

                {item.badge && (

                  <span
                    className="
                      h-6
                      w-6
                      rounded-full
                      bg-red-500
                      text-xs
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    {item.badge}
                  </span>

                )}

              </Link>

            );

          })}

        </div>

      </nav>

      {/* Profile */}

     {/* Bottom */}

<div
  className="
    mt-auto
    border-t
    border-[#2A2724]
    p-5
  "
>

  {/* Profile */}
  <div className="flex items-center gap-3 mb-4 px-2">
    <div className="h-10 w-10 rounded-full bg-[#C89B1C] text-black font-bold flex items-center justify-center text-sm shadow-md">
      A
    </div>
    <div>
      <h4 className="text-sm font-bold text-white leading-tight">Admin User</h4>
      <p className="text-xs text-gray-400">Administrator</p>
    </div>
  </div>

  {/* Sign Out */}

<motion.button
  onClick={logout}
  whileHover={{
    x: 4,
    scale: 1.02,
  }}
  whileTap={{
    scale: 0.97,
  }}
  className="
    relative
    mt-5
    w-full
    flex
    items-center
    gap-3
    rounded-xl
    px-4
    py-3
    bg-[#26221E]
    text-[#F5D46A]
    transition-all
    duration-300
    overflow-hidden
  "
>

  {/* Permanent Gold Indicator */}

  <span
    className="
      absolute
      left-0
      top-2
      bottom-2
      w-1
      rounded-r-full
      bg-[#C89B1C]
    "
  />

  {/* Permanent Glow */}

  <span
    className="
      absolute
      inset-0
      bg-gradient-to-r
      from-[#C89B1C]/10
      via-transparent
      to-transparent
    "
  />

  <motion.div
    animate={{
      x: [0, 2, 0],
      rotate: [0, -8, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="relative z-10"
  >
    <LogOut size={20} />
  </motion.div>

  <motion.span
    animate={{
      x: [0, 2, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="
      relative
      z-10
      font-medium
      text-[16px]
    "
  >
    Sign Out
  </motion.span>

</motion.button>

</div>

    </aside>

  );

}