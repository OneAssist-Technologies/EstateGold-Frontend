"use client";

import {
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/src/context/AuthContext";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { ArrowLeft, ArrowRight,CheckCircle2, User, Building2, ShieldCheck, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import PropertyStepper from "../../components/property/PropertyStepper";
import PropertyTypeStep from "../../components/property/PropertyTypeStep";
import OwnerDetailsStep from "../../components/property/OwnerDetailsStep";
import LocationStep from "../../components/property/LocationStep";
import PropertyDetailsStep from "../../components/property/PropertyDetailsStep";
import AmenitiesStep from "../../components/property/AmenitiesStep";
import PricePhotosStep from "../../components/property/PricePhotoStep";
import NeighbourhoodStep
from "../../components/property/NeighbourhoodStep";
import AgentPendingVerification from "@/src/components/auth/AgentPendingVerification";

import api from "../../services/api";
import { PropertyFormData } from "../../types/property";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import toast from "react-hot-toast";


export default function PostPropertyPage() {

  const [step, setStep] =
    useState(1);
const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] =
    useState(false);
const { user ,loading } =
    useAuth();
const [published, setPublished] =
  useState(false);
const [showAgentModal, setShowAgentModal] = useState(true);


 const [formData, setFormData] =
  useState<PropertyFormData>({
    purpose: "",
    propertyType: "",

    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
      ownerType: "",
agentRelation: "",
ownerIdType: "",
ownerIdNumber: "",
alternatePhone: "",
    listingType: "my_own",
    ownerAddress: "",
    ownerGovtIdDoc: "",

    city: "",
    locality: "",
    society: "",
    address: "",

    bedrooms: 0,
    bathrooms: 0,
    balconies: 0,

    area: 0,
    floor: 0,

    furnishing: "",
    parking: false,

    amenities: [],

    price: 0,
    description: "",
    availableFrom: "",

    photos: [],
neighbourhood: {
  nearbyPlaces: {
    school: {
      enabled: false,
      name: "",
      distance: "",
    },
    college: {
      enabled: false,
      name: "",
      distance: "",
    },
    hospital: {
      enabled: false,
      name: "",
      distance: "",
    },
    metro: {
      enabled: false,
      name: "",
      distance: "",
    },
    busStand: {
      enabled: false,
      name: "",
      distance: "",
    },
    airport: {
      enabled: false,
      name: "",
      distance: "",
    },
    park: {
      enabled: false,
      name: "",
      distance: "",
    },
    mall: {
      enabled: false,
      name: "",
      distance: "",
    },
    temple: {
      enabled: false,
      name: "",
      distance: "",
    },
  },

  landmarks: [],

  ratings: {
    connectivity: 0,
    safety: 0,
    powerSupply: 0,
    waterSupply: 0,
    noiseLevel: 0,
    internet: 0,
    greenery: 0,
  },

  notes: "",
},
  });

  const role = user?.role || 'seller';

const totalSteps =
  role === "agent" ? 7 : 6;

const isStepValid = useMemo(() => {
  switch (step) {
    case 1:
      return (
        formData.purpose !== "" &&
        formData.propertyType !== ""
      );

    case 2:
      if (role === "agent") {
        return (
          formData.ownerName.trim() !== "" &&
          formData.ownerPhone.trim() !== ""
        );
      }

      return (
        formData.city.trim() !== "" &&
        formData.locality.trim() !== "" &&
        formData.address.trim() !== ""
      );

    case 3:
      if (role === "agent") {
        return (
          formData.city.trim() !== "" &&
          formData.locality.trim() !== "" &&
          formData.address.trim() !== ""
        );
      }

      return (
        formData.bedrooms > 0 &&
        formData.bathrooms > 0 &&
        formData.area > 0
      );

    case 4:
      if (role === "agent") {
        return (
          formData.bedrooms > 0 &&
          formData.bathrooms > 0 &&
          formData.area > 0
        );
      }

      return true;

    // Amenities
    case 5:
      if (role === "agent") {
        return true;
      }

      return true;

    // Neighbourhood
    case 6:
      if (role === "agent") {
        const enabledPlaces = Object.values(
          formData.neighbourhood.nearbyPlaces
        ).filter((place) => place.enabled);

        return enabledPlaces.length > 0;
      }

      return (
        formData.price > 0 &&
        formData.photos.length > 0
      );

    // Price & Photos (Agent only)
    case 7:
      return (
        formData.price > 0 &&
        formData.photos.length > 0
      );

    default:
      return false;
  }
}, [
  step,
  role,
  formData,
]);


  const nextStep = () => {
    if (
      step < totalSteps &&
      isStepValid
    ) {
      setStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit =
    async () => {
      try {
        setLoadingSubmit(true);

        const payload =
          new FormData();

        payload.append(
          "purpose",
          formData.purpose
        );

        payload.append(
          "propertyType",
          formData.propertyType
        );

        payload.append(
          "ownerName",
          formData.ownerName
        );

        payload.append(
          "ownerPhone",
          formData.ownerPhone
        );

        if (formData.listingType) {
          payload.append("listingType", formData.listingType);
        }
        if (formData.ownerAddress) {
          payload.append("ownerAddress", formData.ownerAddress);
        }
        if (formData.ownerGovtIdDoc) {
          payload.append("ownerGovtIdDoc", formData.ownerGovtIdDoc);
        }

        payload.append(
          "city",
          formData.city
        );

        payload.append(
          "locality",
          formData.locality
        );

        payload.append(
          "society",
          formData.society
        );

        payload.append(
          "address",
          formData.address
        );

        payload.append(
          "bedrooms",
          String(
            formData.bedrooms
          )
        );

        payload.append(
          "bathrooms",
          String(
            formData.bathrooms
          )
        );
        payload.append(
  "balconies",
  String(formData.balconies ?? 0)
);

payload.append(
  "floor",
  String(formData.floor ?? 0)
);

        payload.append(
          "area",
          String(formData.area)
        );

        payload.append(
          "furnishing",
          formData.furnishing
        );

        payload.append(
          "parking",
          String(
            formData.parking
          )
        );

        payload.append(
          "amenities",
          JSON.stringify(
            formData.amenities
          )
        );

        payload.append(
          "price",
          String(formData.price)
        );

        payload.append(
          "description",
          formData.description
        );

        payload.append(
          "availableFrom",
          formData.availableFrom
        );

        formData.photos.forEach(
          (photo) => {
            payload.append(
              "photos",
              photo
            );
          }
        );

        if (formData.latitude !== undefined) {
          payload.append("latitude", String(formData.latitude));
        }
        if (formData.longitude !== undefined) {
          payload.append("longitude", String(formData.longitude));
        }

        payload.append(
   "neighbourhood",
   JSON.stringify(formData.neighbourhood)
);
       const response =
  await api.post(
    "/createproperty",
    payload,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

if (
  response.data.success
) {
  setPublished(true);
}
      } catch (error: any) {
        console.error("Property creation error:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to create property. Please verify location serviceability.";
        toast.error(errorMsg);
      } finally {
        setLoadingSubmit(false);
      }
    }
    if (loading) {
  return null;
}
const isAgent = role === "agent";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please Login
      </div>
    );
  }

  // AGENT VERIFICATION GUARD: Agent is pending ONLY IF not verified AND verificationStatus is not approved
  const isAgentVerified = user?.isVerified === true || user?.verificationStatus === "approved";
  if (isAgent && !isAgentVerified) {
    return <AgentPendingVerification />;
  }
    if (published) {
  return (
     <>
    <Navbar/>
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-6
      "
    >
      <div className="text-center max-w-xl">

        <motion.div
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
          }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{
              scale: [
                1,
                1.05,
                1,
              ],
            }}
            transition={{
              duration: 2,
              repeat:
                Infinity,
            }}
            className="
              h-24
              w-24
              rounded-full
              border-[4px]
              border-green-500
              flex
              items-center
              justify-center
            "
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-green-500"
            >
              <path d="M20 6L9 17L4 12" />
            </svg>
          </motion.div>
        </motion.div>

        <h1
          className="
            text-2xl
            font-playfair
            font-semibold
            text-[#161616]
          "
        >
          Property Listed
          Successfully!
        </h1>

        <p
          className="
            mt-5
            text-xl
            text-gray-600
            leading-relaxed
          "
        >
          The listing is submitted
          for admin review.
          Owner will be notified
          once approved.
        </p>

        <div
          className="
            mt-10
            flex
            justify-center
            gap-4
          "
        >
          <button
            onClick={() =>
              router.push(
                "/property-listing"
              )
            }
            className="
              bg-[#C89B1C]
              text-white
              px-8
              py-4
              rounded-2xl
              font-semibold
              hover:bg-[#B58A16]
            "
          >
            View Listings
          </button>

          <button
            onClick={() =>
              window.location.reload()
            }
className="
  border
  border-[#D8B56A]
  px-8
  py-4
  rounded-2xl
  font-semibold
  text-[#161616]
  hover:bg-[#FFF8E8]
  hover:border-[#C89B1C]
  hover:shadow-[0_4px_20px_rgba(200,155,28,0.15)]
  transition-all
  duration-300
"
          >
            List Another
          </button>
        </div>
      </div>
    </div>
      <Footer/>
    </>
  );
}

  return (
    <>
      <Navbar/>

      {/* AGENT PROPERTY TYPE SELECTION MODAL */}
      {role === "agent" && showAgentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E5D7B3]"
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-[#FFF8E8] text-[#C89B1C] flex items-center justify-center border border-[#F6E4A6]">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#161616]">Choose Property Type</h3>
                <p className="text-xs text-gray-500">Select whose property you are listing today</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    listingType: "my_own",
                    ownerName: user.fullName || "",
                    ownerPhone: user.phone || "",
                    ownerEmail: user.email || "",
                  }));
                  setShowAgentModal(false);
                }}
                className="w-full p-5 rounded-2xl border-2 border-gray-200 hover:border-[#C89B1C] hover:bg-[#FFFBF0] text-left transition-all group flex items-start justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-base text-[#161616] group-hover:text-[#C89B1C]">
                    ○ My Own Property
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically use your personal owner details ({user.fullName}) for this listing.
                  </p>
                </div>
                <User className="text-gray-400 group-hover:text-[#C89B1C] shrink-0" size={24} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    listingType: "another_owner",
                    ownerName: "",
                    ownerPhone: "",
                    ownerEmail: "",
                  }));
                  setShowAgentModal(false);
                }}
                className="w-full p-5 rounded-2xl border-2 border-gray-200 hover:border-[#C89B1C] hover:bg-[#FFFBF0] text-left transition-all group flex items-start justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-base text-[#161616] group-hover:text-[#C89B1C]">
                    ○ Property of Another Owner
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Provide owner contact info, residential address, and government ID details.
                  </p>
                </div>
                <Building2 className="text-gray-400 group-hover:text-[#C89B1C] shrink-0" size={24} />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <section className="min-h-screen bg-[#FAF8F3] py-12">
        <div className="max-w-5xl mx-auto px-6">

 <motion.div
  initial={{
    opacity: 0,
    y: -20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.4,
  }}
  className="mb-8"
>
  <motion.button
    whileHover={{
      x: -4,
    }}
    whileTap={{
      scale: 0.95,
    }}
    onClick={() =>
      router.push("/")
    }
    className="
      flex
      items-center
      gap-2
      text-[#6B7280]
      hover:text-[#C89B1C]
      mb-8
      font-medium
      transition-colors
    "
  >
    <ArrowLeft size={18} />
    Back to Home
  </motion.button>

  <motion.h1
    initial={{
      opacity: 0,
      y: 15,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      delay: 0.1,
    }}
    className="
      text-5xl
      md:text-6xl
      font-playfair
      font-bold
      text-[#161616]
      mb-3
    "
  >
    List Your Property
  </motion.h1>

  <motion.p
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    transition={{
      delay: 0.2,
    }}
    className="
      text-lg
      text-[#6B7280]
      max-w-2xl
    "
  >
    {isAgent
      ? "List a property on behalf of your client. Owner information and authorization details are required for agent listings."
      : "Reach thousands of verified buyers and tenants across India. Publish your property in just a few simple steps."}
  </motion.p>

  {isAgent && (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.3,
      }}
      className="
        mt-6
        rounded-2xl
        border
        border-[#BFDBFE]
        bg-gradient-to-r
        from-[#EFF6FF]
        to-[#DBEAFE]
        px-5
        py-4
        text-[#1D4ED8]
        flex
        items-start
        gap-3
      "
    >
      <div
        className="
          h-8
          w-8
          rounded-full
          bg-[#3B82F6]
          text-white
          flex
          items-center
          justify-center
          font-semibold
          flex-shrink-0
        "
      >
        i
      </div>

      <div>
        <p className="font-semibold">
          Agent Listing
        </p>

        <p className="text-sm mt-1">
          Owner details and written authorization are required before publishing this property.
        </p>
      </div>
    </motion.div>
  )}
</motion.div>
        <motion.div
  initial={{
    opacity: 0,
    y: 30,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.5,
  }}
  className="
    mt-10
    bg-white
    rounded-[32px]
    shadow-sm
    border
    p-10
  "
>

         <PropertyStepper
  currentStep={step}
  totalSteps={totalSteps}
/>

        <div className="mt-12 min-h-[500px]">

  <AnimatePresence mode="wait">

    <motion.div
      key={step}
      initial={{
        opacity: 0,
        x: 50,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -50,
      }}
      transition={{
        duration: 0.35,
        ease: "easeInOut",
      }}
    >

            {step === 1 && (
              <PropertyTypeStep
                value={
                  formData.propertyType
                }
                purpose={
                  formData.purpose
                }
                onPurposeChange={(
                  value
                ) =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      purpose:
                        value,
                    })
                  )
                }
               onTypeChange={(
                  value
                ) =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      propertyType:
                        value,
                    })
                  )
                }
              />
            )}

            {role === "agent" &&
              step === 2 && (
                <OwnerDetailsStep
                  formData={
                    formData
                  }
                  setFormData={
                    setFormData
                  }
                />
              )}

            {((role ===
              "agent" &&
              step === 3) ||
              (role !==
                "agent" &&
                step === 2)) && (
              <LocationStep
                formData={
                  formData
                }
                setFormData={
                  setFormData
                }
              />
            )}

            {((role ===
              "agent" &&
              step === 4) ||
              (role !==
                "agent" &&
                step === 3)) && (
              <PropertyDetailsStep
                formData={
                  formData
                }
                setFormData={
                  setFormData
                }
              />
            )}

            {((role ===
              "agent" &&
              step === 5) ||
              (role !==
                "agent" &&
                step === 4)) && (
              <AmenitiesStep
                formData={
                  formData
                }
                setFormData={
                  setFormData
                }
              />
            )}
            {(
   (role==="agent" && step===6) ||
   (role!=="agent" && step===5)
) && (

<NeighbourhoodStep
    formData={formData}
    setFormData={setFormData}
/>

)}

            {((role ===
              "agent" &&
              step === 7) ||
              (role !==
                "agent" &&
                step === 6)) && (
              <PricePhotosStep
                formData={
                  formData
                }
                setFormData={
                  setFormData
                }
              />
            )}

             </motion.div>

  </AnimatePresence>

</div>

          <div className="flex justify-between items-center mt-12 border-t pt-8">

          <motion.button
  whileHover={{
    scale: 1.05,
    x: -3,
  }}
  whileTap={{
    scale: 0.95,
  }}
  onClick={previousStep}
  disabled={step === 1}
  className="
    flex
    items-center
    gap-2
    px-5
    py-3
    rounded-2xl
    border
    border-[#E5D8B3]
    bg-white
    text-[#6B7280]
    font-medium
    transition-all
    hover:border-[#C89B1C]
    hover:text-[#C89B1C]
    hover:shadow-md
    disabled:opacity-40
    disabled:cursor-not-allowed
    disabled:hover:border-[#E5D8B3]
    disabled:hover:text-[#6B7280]
    disabled:hover:shadow-none
  "
>
 <motion.div
  animate={{
    x: step === 1 ? 0 : [-2, 0, -2],
  }}
  transition={{
    repeat: Infinity,
    duration: 2,
  }}
>
  <ArrowLeft size={18} />
</motion.div>

  Previous
</motion.button>

            <span className="text-gray-500">
              Step {step} of{" "}
              {totalSteps}
            </span>

           {step === totalSteps ? (
  <motion.button
    whileHover={{
      scale: 1.04,
    }}
    whileTap={{
      scale: 0.96,
    }}
    onClick={handleSubmit}
    disabled={loadingSubmit}
    className="
      bg-[#C89B1C]
      hover:bg-[#B58A16]
      text-white
      px-8
      py-3
      rounded-2xl
      font-medium
      flex
      items-center
      gap-2
      shadow-lg
      shadow-[#C89B1C]/20
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
  >
    {loadingSubmit ? (
      <>
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="
            h-4
            w-4
            border-2
            border-white
            border-t-transparent
            rounded-full
          "
        />
        Publishing...
      </>
    ) : (
      <>
        <CheckCircle2 size={18} />
        Publish Property
      </>
    )}
  </motion.button>
) : (
  <motion.button
    whileHover={{
      scale: 1.04,
      x: 3,
    }}
    whileTap={{
      scale: 0.96,
    }}
    onClick={nextStep}
    disabled={!isStepValid}
    className="
      bg-[#C89B1C]
      hover:bg-[#B58A16]
      text-white
      px-8
      py-3
      rounded-2xl
      font-medium
      flex
      items-center
      gap-2
      shadow-lg
      shadow-[#C89B1C]/20
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
  >
    Continue

    <motion.div
      animate={{
        x: [0, 4, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
      }}
    >
      <ArrowRight size={18} />
    </motion.div>
  </motion.button>
)}
          </div>

        </motion.div>
      </div>
    </section>
     <Footer/>
    </>
   
  );
}