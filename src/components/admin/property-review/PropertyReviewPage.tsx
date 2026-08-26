"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getPropertyById,  approveProperty,
  rejectProperty,
  deleteProperty, } from "@/src/services/adminPropertyService";
  import PropertyActionModal from "./PropertyActionModal";
  import { toast } from "react-hot-toast";

import { AdminProperty } from "@/src/types/adminProperty";
import { useRouter } from "next/navigation";
import PropertyReviewHeader from "./PropertyReviewHeader";
import PropertyHero from "./PropertyHero";
import PropertyOverview from "./PropertyOverview";
import AmenitiesSection from "./AmenitiesSection";
import NeighbourhoodSection from "./NeighbourhoodSection";
// import OwnerCard from "./OwnerCard";
import SubmissionInfo from "./SubmissionInfo";
import LoadingSkeleton from "./LoadingSkeleton";

export default function PropertyReview() {

  const params = useParams();

  const propertyId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);
    const [actionLoading, setActionLoading] =
  useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);

const [deleteOpen, setDeleteOpen] = useState(false);



  const [property, setProperty] =
    useState<AdminProperty | null>(null);
      async function fetchProperty() {

    try {

      setLoading(true);

      const response =
        await getPropertyById(
          propertyId
        );

      setProperty(
        response.property
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    if (propertyId) {

      fetchProperty();

    }

  }, [propertyId]);

const router = useRouter();

async function handleApprove() {
  try {

    setActionLoading(true);

    await approveProperty(property!._id);

    toast.success(
      "Property approved successfully."
    );

    fetchProperty();

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to approve property."
    );

  } finally {

    setActionLoading(false);

  }
}

async function handleReject(
  reason: string
) {
  try {

    setActionLoading(true);

    await rejectProperty(
      property!._id,
      reason
    );

    toast.success(
      "Property rejected successfully."
    );

    setRejectOpen(false);

    fetchProperty();

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to reject property."
    );

  } finally {

    setActionLoading(false);

  }
}

async function handleDelete(
  reason: string
) {
  try {

    setActionLoading(true);

    await deleteProperty(
      property!._id,
      reason
    );

    toast.success(
      "Property deleted successfully."
    );

    router.push("/admin/properties");

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to delete property."
    );

  } finally {

    setActionLoading(false);

    setDeleteOpen(false);

  }
}
  if (loading) {

    return <LoadingSkeleton />;

  }

  if (!property) {

    return (

      <div
        className="min-h-screen flex items-center justify-center text-gray-500 text-lg"
      >

        Property not found.

      </div>

    );

  }

  return (
    <>
 <PropertyReviewHeader
  status={property.status}
  onApprove={handleApprove}
  onReject={() =>
    setRejectOpen(true)
  }
  onDelete={() =>
    setDeleteOpen(true)
  }
  onClose={() =>
    router.push("/admin/properties")
  }
/>
    <main
      className="min-h-screen bg-[#FAF8F3] py-10"
    >

      <div
        className="max-w-[1600px] mx-auto px-8 space-y-8"
      >

        {/* Hero */}

        <PropertyHero
          property={property}
        />

        {/* Overview */}

        <PropertyOverview
          property={property}
        />


        {/* Amenities */}

        <AmenitiesSection
          amenities={
            property.amenities
          }
        />

        {/* Neighbourhood */}

        <NeighbourhoodSection
          neighbourhood={
            property.neighbourhood
          }
        />

        {/* Documents */}
        <section className="bg-white border border-[#ECE7DB] rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold text-[#161616]">
            Uploaded Documents
          </h2>
          {property.documents && property.documents.length > 0 ? (
            <div className="mt-5 space-y-4">
              {property.documents.map((doc: any, index: number) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#ECE7DB] rounded-xl hover:bg-gray-50 transition-colors gap-3">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 bg-[#FFF9EC] text-[#C89B1C] text-[10px] font-bold rounded-full border border-[#E8DCC1] uppercase">
                      {doc.documentType || "Document"}
                    </span>
                    <p className="text-sm font-bold text-gray-900 break-all">
                      {doc.fileName || "File"}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                      <span>Status: <strong className={`capitalize ${doc.verificationStatus === "Verified" ? "text-green-600" : doc.verificationStatus === "Rejected" ? "text-red-500" : "text-amber-600"}`}>{doc.verificationStatus || "Uploaded"}</strong></span>
                      {doc.uploadedAt && (
                        <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.fileUrl && (
                      <>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-lg bg-[#C89B1C] text-white text-xs font-bold hover:bg-[#b08714] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          View File
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs text-gray-400 italic">No documents uploaded.</p>
          )}
        </section>

        {/* Submission */}

        <SubmissionInfo
          property={property}
        />

      </div>
<PropertyActionModal
  open={rejectOpen}
  type="reject"
  loading={actionLoading}
  onClose={() =>
    setRejectOpen(false)
  }
  onSubmit={handleReject}
/>

<PropertyActionModal
  open={deleteOpen}
  type="delete"
  loading={actionLoading}
  onClose={() =>
    setDeleteOpen(false)
  }
  onSubmit={handleDelete}
/>
    </main>
</>
  );

}