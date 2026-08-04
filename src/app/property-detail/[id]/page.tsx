"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { useAuth } from "@/src/context/AuthContext";

import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

import api from "@/src/services/api";

import { Property } from "@/src/types/property";

import PropertyGallery from "../../../components/property-detail/PropertyGallery";
import PropertyInfo from "../../../components/property-detail/PropertyInfo";
import PropertyFeatures from "../../../components/property-detail/PropertyFeatures";
import PropertyDescription from "../../../components/property-detail/PropertyDescription";
import Amenities from "../../../components/property-detail/Amenities";
import PropertyMap from "../../../components/property-detail/PropertyMap";
import SimilarProperties from "../../../components/property-detail/SimilarProperties";

import StickyContactCard from "../../../components/property-detail/StickyContactCard";

import LoginRequiredModal from "../../../components/property-detail/LoginRequiredModal";
import RequestCallbackModal from "../../../components/property-detail/RequestCallbackModal";

export default function PropertyDetailsPage() {
const router = useRouter();
const {
  user,
  isAuthenticated,
  loading: authLoading,
} = useAuth();

const params = useParams();

const id = params.id as string;

const [property,setProperty] =
useState<Property | null>(null);

const [similarProperties,
setSimilarProperties] =
useState<Property[]>([]);

const [loading,setLoading] =
useState(true);

const [loginOpen,setLoginOpen] =
useState(false);

const [callbackOpen,setCallbackOpen] =
useState(false);

const fetchProperty = async () => {

try{

setLoading(true);

const response =
await api.get(`/properties/${id}`);

setProperty(response.data.data);

}catch(err){

console.log(err);

}

finally{

setLoading(false);

}

};

const fetchSimilar = async () => {

try{

const response =
await api.get(`/properties/similar/${id}`);

setSimilarProperties(response.data.data);

}catch(err){

console.log(err);

}

};

useEffect(()=>{

if(!id) return;

fetchProperty();

fetchSimilar();

},[id]);

if (loading || authLoading) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#E8DCC1] border-t-[#C89B1C] animate-spin" />
      </div>
      <Footer />
    </>
  );
}

if(!property){

return(

<>

<Navbar/>

<div
className="
min-h-screen
flex
items-center
justify-center
bg-[#FAFAFA]
"
>

<h2
className="
text-4xl
font-bold
"
>

Property Not Found

</h2>

</div>

<Footer/>

</>

);

}

const isGuest = !isAuthenticated;
const isOwner =
user?._id === property.createdBy;

const canManage =
  isOwner &&
  (
    user?.role==="seller" ||
    user?.role==="agent"
  );

const handleLoginRequired=()=>{

setLoginOpen(true);

};

const handleShare=()=>{

if(navigator.share){

navigator.share({

title:property.propertyType,

url:window.location.href

});

}else{

navigator.clipboard.writeText(
window.location.href
);

alert("Link copied");

}

};

const handleFavourite=()=>{

console.log("Favourite");

};

const handleReport=()=>{

console.log("Report");

};

const handleCall=()=>{

window.location.href=
`tel:${property.ownerPhone}`;

};

const handleWhatsapp=()=>{

window.open(

`https://wa.me/${property.ownerPhone}`,

"_blank"

);

};

const handleEdit=()=>{

router.push(

`/post-property?id=${property._id}`

);

};

const handleEnquiries=()=>{

router.push(

`/my-properties/${property._id}/enquiries`

);

};

const handleToggleStatus=async()=>{

try{

await api.patch(

`/properties/${property._id}/status`,

{

status:

property.status==="active"

?

"inactive"

:

"active"

}

);

fetchProperty();

}catch(err){

console.log(err);

}

};
return (
  <>
    <Navbar />

    <div className="min-h-screen bg-[#FAFAFA]">

      <div className="max-w-[1600px] mx-auto px-8 py-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="
            grid
            lg:grid-cols-12
            gap-10
          "
        >

          {/* LEFT */}

          <div
            className="
              lg:col-span-8
            "
          >

            {/* Gallery */}

            <PropertyGallery
              photos={property.photos}
            />

            {/* Info */}

            <PropertyInfo
              property={property}
              isLoggedIn={!isGuest}
              onLoginRequired={
                handleLoginRequired
              }
              onShare={handleShare}
              onFavourite={
                handleFavourite
              }
              onReport={handleReport}
            />

            {/* Features */}

            <PropertyFeatures
              property={property}
            />

            {/* Description */}

            <PropertyDescription
              property={property}
            />

            {/* Amenities */}

            <Amenities
              amenities={
                property.amenities
              }
            />

          </div>

          {/* RIGHT */}

          <div
            className="
              lg:col-span-4
            "
          >

            <div
              className="
                sticky
                top-28
              "
            >

 {!(
  user &&
  user._id === property.createdBy &&
  (user?.role === "seller" || user?.role === "agent")
) && (
  <StickyContactCard
    property={property}
    user={user}
    onLogin={handleLoginRequired}
    onRequestCallback={() => setCallbackOpen(true)}
    onCall={handleCall}
    onWhatsapp={handleWhatsapp}
    onEdit={handleEdit}
    onViewEnquiries={handleEnquiries}
    onToggleStatus={handleToggleStatus}
  />
)}
            </div>

          </div>

        </motion.div>

        {/* Property Map */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: .4,
          }}
          className="mt-12"
        >

          <PropertyMap
            address={property.address}
            locality={property.locality}
            city={property.city}
          />

        </motion.div>
                {/* Similar Properties */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mt-12"
        >
          <SimilarProperties
            properties={similarProperties}
          />
        </motion.div>

      </div>

      {/* Login Required */}

      <LoginRequiredModal
        open={loginOpen}
        onClose={() =>
          setLoginOpen(false)
        }
      />

      {/* Request Callback */}

    <RequestCallbackModal
  open={callbackOpen}
  propertyId={property._id}
  ownerId={property.createdBy}
  onClose={() => setCallbackOpen(false)}
/>

    </div>

    <Footer />

  </>
);

}