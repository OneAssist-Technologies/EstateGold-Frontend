"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Lock,
  X,
  LogIn,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  const handleRegister = () => {
    onClose();
    router.push("/register");
  };

  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            transition={{
              duration: 0.25,
            }}
            className="w-full max-w-xl bg-white rounded-[32px] overflow-hidden shadow-2xl"
          >

            {/* Header */}

            <div
              className="relative bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white px-10 py-10"
            >

              <button
                onClick={onClose}
                className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <X size={20} />
              </button>

              <div
                className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mb-6"
              >
                <Lock size={38} />
              </div>

              <h2 className="text-4xl font-bold">
                Login Required
              </h2>

              <p className="mt-3 text-white/90 leading-7">
                Sign in to unlock premium property
                features and instantly connect with
                owners and agents.
              </p>

            </div>

            {/* Body */}

            <div className="px-10 py-8">

              <h3 className="text-xl font-semibold mb-6">
                After Login You Can
              </h3>

              <div className="space-y-5">

                <div className="flex items-center gap-4">

                  <CheckCircle2
                    className="text-[#C89B1C]"
                    size={22}
                  />

                  <span>
                    Contact Property Owner
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <PhoneCall
                    className="text-[#C89B1C]"
                    size={22}
                  />

                  <span>
                    Request Callback
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <Heart
                    className="text-[#C89B1C]"
                    size={22}
                  />

                  <span>
                    Save Favourite Properties
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <ShieldCheck
                    className="text-[#C89B1C]"
                    size={22}
                  />

                  <span>
                    Schedule Property Visit
                  </span>

                </div>

              </div>

              {/* Divider */}

              <div className="my-8 flex items-center">

                <div className="flex-1 h-px bg-gray-200" />

                <span className="mx-4 text-gray-400">
                  Continue
                </span>

                <div className="flex-1 h-px bg-gray-200" />

              </div>

              {/* Login */}

              <button
                onClick={handleLogin}
                className="w-full h-14 rounded-2xl bg-[#C89B1C] hover:bg-[#B78717] text-white font-semibold flex items-center justify-center gap-3 transition"
              >

                <LogIn size={20} />

                Login

              </button>

              {/* Register */}

              <button
                onClick={handleRegister}
                className="w-full h-14 mt-5 rounded-2xl border-2 border-[#C89B1C] text-[#C89B1C] font-semibold flex items-center justify-center gap-3 hover:bg-[#FFF9EB] transition"
              >

                <UserPlus size={20} />

                Create Account

              </button>

              {/* Footer */}

              <p
                className="mt-8 text-center text-sm text-gray-500 leading-6"
              >
                By continuing you agree to our Terms
                of Service and Privacy Policy.
              </p>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}