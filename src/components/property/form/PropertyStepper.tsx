"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  currentStep: number;
  stepsList: Array<{ id: string; name: string }>;
}

export default function PropertyStepper({
  currentStep,
  stepsList,
}: Props) {

  return (
    <div className="w-full overflow-x-auto py-3 sm:py-6 custom-scrollbar">
      <div className="flex items-start min-w-[700px] sm:min-w-[800px]">

        {stepsList.map((stepObj, index) => {
          const completed =
            index + 1 < currentStep;

          const active =
            index + 1 === currentStep;

          const step = stepObj.name;

          return (
            <div
              key={stepObj.id}
              className="flex items-start flex-1"
            >
              {/* Step */}

              <div className="flex flex-col items-center shrink-0 w-[110px]">

                <motion.div
                  initial={false}
                  animate={{
                    scale: active
                      ? 1.08
                      : 1,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className={`
                    h-8
                    w-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-semibold
                    transition-all
                    ${
                      completed
                        ? "bg-green-500 text-white shadow-md"
                        : active
                        ? "bg-[#C89B1C] text-white shadow-lg"
                        : "bg-[#F5F1E8] text-[#8B7355]"
                    }
                  `}
                >
                  {completed ? (
                    <Check size={18} />
                  ) : (
                    index + 1
                  )}
                </motion.div>

                <motion.span
                  animate={{
                    color: active
                      ? "#161616"
                      : "#6B7280",
                  }}
                  className={`
                    mt-3
                    text-sm
                    text-center
                    leading-tight
                    max-w-[110px]
                  `}
                >
                  {step}
                </motion.span>
              </div>

              {/* Connector */}

              {index <
                stepsList.length - 1 && (
                <div
                  className="flex-1 pt-[20px]"
                >
                  <div
                    className="relative h-[2px] bg-[#E5E7EB] rounded-full overflow-hidden"
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        width: completed
                          ? "100%"
                          : "0%",
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      className="absolute left-0 top-0 h-full bg-[#16A34A] rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}