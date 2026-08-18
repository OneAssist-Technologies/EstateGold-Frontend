"use client";

import {
  useMemo,
  useState,
  useEffect,
} from "react";
import { useAuth } from "@/src/context/AuthContext";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Building2, X, ShieldCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import PropertyStepper from "./PropertyStepper";
import PropertyTypeStep from "./PropertyTypeStep";
import OwnerDetailsStep from "./OwnerDetailsStep";
import LocationStep from "./LocationStep";
import PropertyDetailsStep from "./PropertyDetailsStep";
import AmenitiesStep from "./AmenitiesStep";
import PricePhotosStep from "./PricePhotoStep";
import NeighbourhoodStep from "./NeighbourhoodStep";
import AgentPendingVerification from "@/src/components/auth/AgentPendingVerification";
import PendingIssuesStep from "./PendingIssuesStep";
import DocumentsStep from "./DocumentsStep";
import ReviewSubmitStep from "./ReviewSubmitStep";

import api from "@/src/services/api";
import { PropertyFormData } from "@/src/types/property";
import { getLocalityInsights } from "@/src/services/marketInsightService";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import toast from "react-hot-toast";
import { validatePropertyStep, validateAllPropertySteps } from "@/src/services/propertyValidation";

interface PropertyFormProps {
  mode: "create" | "edit";
  propertyId?: string;
}

export default function PropertyForm({ mode, propertyId }: PropertyFormProps) {
  const editId = mode === "edit" ? propertyId : null;
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [step, setStep] = useState(1);
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { user, loading } = useAuth();
  const [published, setPublished] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(true);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PropertyFormData>({
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
    ownerNegotiable: false,
    ownerReadyToMeet: false,

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
        school: { enabled: false, name: "", distance: "" },
        college: { enabled: false, name: "", distance: "" },
        hospital: { enabled: false, name: "", distance: "" },
        metro: { enabled: false, name: "", distance: "" },
        busStand: { enabled: false, name: "", distance: "" },
        airport: { enabled: false, name: "", distance: "" },
        park: { enabled: false, name: "", distance: "" },
        mall: { enabled: false, name: "", distance: "" },
        temple: { enabled: false, name: "", distance: "" },
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

  const role = user?.role || "seller";

  const stepsList = useMemo(() => {
    const list = [];
    list.push({ id: "type", name: "Property Type" });
    if (role === "agent" || role === "seller" || role === "buyer") {
      list.push({ id: "owner", name: "Owner Details" });
    }
    list.push({ id: "location", name: "Location" });
    list.push({ id: "details", name: "Property Details" });
    list.push({ id: "amenities", name: "Amenities" });
    list.push({ id: "neighbourhood", name: "Neighbourhood" });
    list.push({ id: "issues", name: "Pending Issues" });
    list.push({ id: "documents", name: "Documents" });
    list.push({ id: "price", name: "Price & Media" });
    list.push({ id: "review", name: "Review & Submit" });
    return list;
  }, [role]);

  const totalSteps = stepsList.length;
  const currentStepId = stepsList[step - 1]?.id;

  const isPropertyDetailsStepValid = (type: string, data: any) => {
    switch (type) {
      case "Apartment / Flat":
      case "Independent House":
      case "Villa":
      case "Builder Floor":
        return data.bedrooms > 0 && data.bathrooms > 0 && data.area > 0;
      case "Plot / Land":
      case "Residential Plot":
      case "Agricultural Land":
        return data.plotArea > 0;
      case "Commercial Space":
      case "Office Space":
      case "Shop / Retail":
      case "Warehouse":
      case "Industrial Property":
      case "Hotel / Resort":
      case "Builder / New Project":
        return data.area > 0;
      case "PG / Hostel":
        return data.totalBeds > 0;
      default:
        return true;
    }
  };

  const getRequiredDocTypesForType = (type: string): string[] => {
    switch (type) {
      case "Apartment / Flat":
        return ["sale_deed", "parent_deeds", "encumbrance_certificate", "owner_kyc"];
      case "Independent House":
        return ["sale_deed", "parent_deeds", "encumbrance_certificate", "owner_kyc"];
      case "Villa":
        return ["sale_deed", "parent_deeds", "encumbrance_certificate", "owner_kyc"];
      case "Builder Floor":
        return ["sale_deed", "parent_deeds", "encumbrance_certificate", "owner_kyc"];
      case "Plot / Land":
      case "Residential Plot":
        return ["sale_deed", "parent_deeds", "encumbrance_certificate", "patta_records", "owner_kyc"];
      case "Agricultural Land":
        return ["sale_deed", "parent_deeds", "encumbrance_certificate", "patta_records", "owner_kyc"];
      case "Commercial Space":
      case "Office Space":
      case "Shop / Retail":
        return ["sale_deed", "encumbrance_certificate", "owner_kyc"];
      case "Warehouse":
      case "Industrial Property":
        return ["sale_deed", "encumbrance_certificate", "owner_kyc"];
      case "Hotel / Resort":
        return ["sale_deed", "encumbrance_certificate", "fire_safety", "business_licences", "owner_kyc"];
      case "PG / Hostel":
        return ["lease_document", "local_permissions", "owner_kyc"];
      case "Builder / New Project":
        return ["rera_details", "sale_deed", "commencement_certificate", "owner_kyc"];
      default:
        return ["sale_deed", "owner_kyc"];
    }
  };

  const isStepValid = useMemo(() => {
    const currentStepId = stepsList[step - 1]?.id;
    if (!currentStepId) return false;
    return validatePropertyStep(currentStepId, formData).isValid;
  }, [step, stepsList, formData]);

  useEffect(() => {
    if (!editId) return;

    const fetchEditProperty = async () => {
      try {
        setLoadingEdit(true);
        const res = await api.get(`/properties/${editId}`);
        const property = res.data.data;

        if (!property) {
          toast.error("Property not found");
          router.push("/my-properties");
          return;
        }

        const currentUserId = user?._id;
        const ownerId = property.ownerId || property.createdBy?._id || property.createdBy;
        if (ownerId && currentUserId && ownerId.toString() !== currentUserId.toString() && user?.role !== "admin") {
          toast.error("You are not authorized to edit this property");
          router.push("/my-properties");
          return;
        }

        setFormData({
          purpose: property.purpose || "",
          propertyType: property.propertyType || "",
          ownerName: property.ownerName || "",
          ownerPhone: property.ownerPhone || "",
          ownerEmail: property.ownerEmail || "",
          ownerType: property.ownerType || "",
          agentRelation: property.agentRelation || "",
          ownerIdType: property.ownerIdType || "",
          ownerIdNumber: property.ownerIdNumber || "",
          alternatePhone: property.alternatePhone || "",
          listingType: property.listingType || "my_own",
          ownerAddress: property.ownerAddress || "",
          carpetArea: property.carpetArea,
          totalFloors: property.totalFloors,
          plotArea: property.plotArea,
          facing: property.facing,
          length: property.length,
          width: property.width,
          propertyAge: property.propertyAge,
          plotFacing: property.plotFacing,
          roadWidth: property.roadWidth,
          cornerPlot: property.cornerPlot,
          boundaryWall: property.boundaryWall,
          plotType: property.plotType,
          landApproval: property.landApproval,
          waterAvailability: property.waterAvailability,
          electricityAvailability: property.electricityAvailability,
          commercialType: property.commercialType,
          washrooms: property.washrooms,
          entranceWidth: property.entranceWidth,
          powerLoad: property.powerLoad,
          // New dynamic details fields
          lift: property.lift,
          powerBackup: property.powerBackup,
          security: property.security,
          society: property.society,
          maintenance: property.maintenance,
          frontage: property.frontage,
          compoundWall: property.compoundWall,
          garden: property.garden,
          terrace: property.terrace,
          borewell: property.borewell,
          electricity: property.electricity,
          solar: property.solar,
          community: property.community,
          privatePool: property.privatePool,
          servantRoom: property.servantRoom,
          gatedLayout: property.gatedLayout,
          drainage: property.drainage,
          roadAccess: property.roadAccess,
          gps: property.gps,
          surveyNumber: property.surveyNumber,
          subdivisionNumber: property.subdivisionNumber,
          landClassification: property.landClassification,
          zoning: property.zoning,
          taluk: property.taluk,
          irrigation: property.irrigation,
          crops: property.crops,
          soilType: property.soilType,
          farmhouse: property.farmhouse,
          pricePerAcre: property.pricePerAcre,
          workstations: property.workstations,
          cabins: property.cabins,
          meetingRooms: property.meetingRooms,
          reception: property.reception,
          pantry: property.pantry,
          serverRoom: property.serverRoom,
          ac: property.ac,
          internet: property.internet,
          fireSafety: property.fireSafety,
          ceilingHeight: property.ceilingHeight,
          mainRoadFacing: property.mainRoadFacing,
          cornerShop: property.cornerShop,
          shutters: property.shutters,
          signboard: property.signboard,
          footfallEstimate: property.footfallEstimate,
          suitableBusiness: property.suitableBusiness,
          loadingUnloading: property.loadingUnloading,
          dock: property.dock,
          truckAccess: property.truckAccess,
          storageCapacity: property.storageCapacity,
          flooring: property.flooring,
          officeArea: property.officeArea,
          industrialType: property.industrialType,
          transformer: property.transformer,
          productionArea: property.productionArea,
          crane: property.crane,
          workerFacilities: property.workerFacilities,
          pollutionCompliance: property.pollutionCompliance,
          machineryIncluded: property.machineryIncluded,
          numberOfRooms: property.numberOfRooms,
          roomTypes: property.roomTypes,
          restaurant: property.restaurant,
          kitchen: property.kitchen,
          banquetHall: property.banquetHall,
          gym: property.gym,
          occupancy: property.occupancy,
          revenue: property.revenue,
          genderType: property.genderType,
          totalBeds: property.totalBeds,
          availableBeds: property.availableBeds,
          roomSharingType: property.roomSharingType,
          rentPerBed: property.rentPerBed,
          deposit: property.deposit,
          foodIncluded: property.foodIncluded,
          laundry: property.laundry,
          housekeeping: property.housekeeping,
          rules: property.rules,
          projectName: property.projectName,
          towers: property.towers,
          totalUnits: property.totalUnits,
          availableUnits: property.availableUnits,
          bhkTypes: property.bhkTypes,
          constructionStatus: property.constructionStatus,
          possessionDate: property.possessionDate ? new Date(property.possessionDate).toISOString().split("T")[0] : "",
          paymentPlan: property.paymentPlan,
          pendingIssues: property.pendingIssues || { hasPendingIssues: "no", issues: [] },
          documents: property.documents || [],
          ownershipType: property.ownershipType || "",
          numberOfOwners: property.numberOfOwners || 1,
          pan: property.pan || "",
        } as any);
      } catch (err) {
        console.error("Failed to load property for edit:", err);
        toast.error("Error loading property details");
        router.push("/my-properties");
      } finally {
        setLoadingEdit(false);
      }
    };

    if (user) {
      fetchEditProperty();
    }
  }, [editId, user]);

  useEffect(() => {
    const fetchInsight = async () => {
      if (
        formData.city &&
        formData.city.trim() !== "" &&
        formData.locality &&
        formData.locality.trim() !== "" &&
        formData.propertyType &&
        formData.propertyType.trim() !== ""
      ) {
        try {
          const relevantArea =
            formData.propertyType === "Plot / Land"
              ? formData.plotArea
              : formData.area || formData.carpetArea;
          const insightData = await getLocalityInsights({
            city: formData.city.trim(),
            locality: formData.locality.trim(),
            propertyType: formData.propertyType.trim(),
            bedrooms: formData.bedrooms || null,
            area: relevantArea || null,
          });
          setFormData((prev) => ({
            ...prev,
            marketInsight: insightData,
          }));
        } catch (error) {
          console.error("Failed to fetch market insights in page:", error);
        }
      }
    };

    fetchInsight();
  }, [formData.city, formData.locality, formData.propertyType, formData.bedrooms, formData.area, formData.carpetArea, formData.plotArea]);

  useEffect(() => {
    if (mode !== "edit") {
      const savedDraft = localStorage.getItem("property_form_draft");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setFormData((prev) => ({
            ...prev,
            ...parsed,
            photos: [],
          }));
          toast.success("Loaded your previously saved draft!");
        } catch (err) {
          console.error("Failed to parse saved draft:", err);
        }
      }
    }
  }, [mode]);

  if (loadingEdit || loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const nextStep = () => {
    const currentStepId = stepsList[step - 1]?.id;
    if (!currentStepId) return;
    const result = validatePropertyStep(currentStepId, formData);
    if (!result.isValid) {
      setStepErrors(result.errors);
      const firstErrorKey = Object.keys(result.errors)[0];
      toast.error(result.errors[firstErrorKey]);
      return;
    }
    setStepErrors({});
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const allErrors = validateAllPropertySteps(formData, stepsList);
    const stepWithErrors = stepsList.find((s) => allErrors[s.id] && Object.keys(allErrors[s.id]).length > 0);
    if (stepWithErrors) {
      const stepIndex = stepsList.findIndex((s) => s.id === stepWithErrors.id) + 1;
      setStep(stepIndex);
      setStepErrors(allErrors[stepWithErrors.id]);
      const firstErrorKey = Object.keys(allErrors[stepWithErrors.id])[0];
      toast.error(`Error on step ${stepWithErrors.name}: ${allErrors[stepWithErrors.id][firstErrorKey]}`);
      return;
    }

    try {
      setLoadingSubmit(true);

      const payload = new FormData();

      payload.append("purpose", formData.purpose);
      payload.append("propertyType", formData.propertyType);
      payload.append("ownerName", formData.ownerName);
      payload.append("ownerPhone", formData.ownerPhone);

      if (formData.listingType) {
        payload.append("listingType", formData.listingType);
      }
      if (formData.ownerAddress) {
        payload.append("ownerAddress", formData.ownerAddress);
      }
      if (formData.ownerGovtIdDoc) {
        payload.append("ownerGovtIdDoc", formData.ownerGovtIdDoc);
      }
      payload.append("ownerNegotiable", String(formData.ownerNegotiable ?? false));
      payload.append("ownerReadyToMeet", String(formData.ownerReadyToMeet ?? false));
      payload.append("city", formData.city);
      if (formData.state) {
        payload.append("state", formData.state);
      }
      payload.append("locality", formData.locality);
      payload.append("society", formData.society);
      payload.append("address", formData.address);
      payload.append("bedrooms", String(formData.bedrooms));
      payload.append("bathrooms", String(formData.bathrooms));
      payload.append("balconies", String(formData.balconies ?? 0));
      payload.append("floor", String(formData.floor ?? 0));
      payload.append("area", String(formData.area));
      payload.append("furnishing", formData.furnishing);
      payload.append("parking", String(formData.parking));
      payload.append("amenities", JSON.stringify(formData.amenities));
      payload.append("price", String(formData.price));
      payload.append("description", formData.description);
      payload.append("availableFrom", formData.availableFrom);

      formData.photos.forEach((photo) => {
        payload.append("photos", photo);
      });

      if (formData.latitude !== undefined) {
        payload.append("latitude", String(formData.latitude));
      }
      if (formData.longitude !== undefined) {
        payload.append("longitude", String(formData.longitude));
      }

      payload.append("neighbourhood", JSON.stringify(formData.neighbourhood));

      if (formData.marketInsight) {
        payload.append("marketInsight", JSON.stringify(formData.marketInsight));
      }

      // Dynamic specifications fields
      if ((formData as any).carpetArea) payload.append("carpetArea", String((formData as any).carpetArea));
      if ((formData as any).totalFloors) payload.append("totalFloors", String((formData as any).totalFloors));
      if ((formData as any).plotArea) payload.append("plotArea", String((formData as any).plotArea));
      if ((formData as any).facing) payload.append("facing", (formData as any).facing);
      if ((formData as any).length) payload.append("length", String((formData as any).length));
      if ((formData as any).width) payload.append("width", String((formData as any).width));
      if ((formData as any).propertyAge) payload.append("propertyAge", (formData as any).propertyAge);
      if ((formData as any).plotFacing) payload.append("plotFacing", (formData as any).plotFacing);
      if ((formData as any).roadWidth) payload.append("roadWidth", String((formData as any).roadWidth));
      if ((formData as any).cornerPlot !== undefined) payload.append("cornerPlot", String((formData as any).cornerPlot));
      if ((formData as any).boundaryWall !== undefined) payload.append("boundaryWall", String((formData as any).boundaryWall));
      if ((formData as any).plotType) payload.append("plotType", (formData as any).plotType);
      if ((formData as any).landApproval) payload.append("landApproval", (formData as any).landApproval);
      if ((formData as any).waterAvailability) payload.append("waterAvailability", (formData as any).waterAvailability);
      if ((formData as any).electricityAvailability) payload.append("electricityAvailability", (formData as any).electricityAvailability);
      if ((formData as any).commercialType) payload.append("commercialType", (formData as any).commercialType);
      if ((formData as any).washrooms !== undefined) payload.append("washrooms", String((formData as any).washrooms));
      if ((formData as any).entranceWidth) payload.append("entranceWidth", String((formData as any).entranceWidth));
      if ((formData as any).powerLoad) payload.append("powerLoad", String((formData as any).powerLoad));

      // New specifications keys
      if ((formData as any).lift !== undefined) payload.append("lift", String((formData as any).lift));
      if ((formData as any).powerBackup) payload.append("powerBackup", (formData as any).powerBackup);
      if ((formData as any).security) payload.append("security", (formData as any).security);
      if ((formData as any).maintenance !== undefined) payload.append("maintenance", String((formData as any).maintenance));
      if ((formData as any).frontage !== undefined) payload.append("frontage", String((formData as any).frontage));
      if ((formData as any).compoundWall !== undefined) payload.append("compoundWall", String((formData as any).compoundWall));
      if ((formData as any).garden !== undefined) payload.append("garden", String((formData as any).garden));
      if ((formData as any).terrace !== undefined) payload.append("terrace", String((formData as any).terrace));
      if ((formData as any).borewell !== undefined) payload.append("borewell", String((formData as any).borewell));
      if ((formData as any).electricity !== undefined) payload.append("electricity", String((formData as any).electricity));
      if ((formData as any).solar !== undefined) payload.append("solar", String((formData as any).solar));
      if ((formData as any).community) payload.append("community", (formData as any).community);
      if ((formData as any).privatePool !== undefined) payload.append("privatePool", String((formData as any).privatePool));
      if ((formData as any).servantRoom !== undefined) payload.append("servantRoom", String((formData as any).servantRoom));
      if ((formData as any).gatedLayout !== undefined) payload.append("gatedLayout", String((formData as any).gatedLayout));
      if ((formData as any).drainage !== undefined) payload.append("drainage", String((formData as any).drainage));
      if ((formData as any).roadAccess) payload.append("roadAccess", (formData as any).roadAccess);
      if ((formData as any).gps) payload.append("gps", (formData as any).gps);
      if ((formData as any).surveyNumber) payload.append("surveyNumber", (formData as any).surveyNumber);
      if ((formData as any).subdivisionNumber) payload.append("subdivisionNumber", (formData as any).subdivisionNumber);
      if ((formData as any).landClassification) payload.append("landClassification", (formData as any).landClassification);
      if ((formData as any).zoning) payload.append("zoning", (formData as any).zoning);
      if ((formData as any).taluk) payload.append("taluk", (formData as any).taluk);
      if ((formData as any).irrigation) payload.append("irrigation", (formData as any).irrigation);
      if ((formData as any).crops) payload.append("crops", (formData as any).crops);
      if ((formData as any).soilType) payload.append("soilType", (formData as any).soilType);
      if ((formData as any).farmhouse !== undefined) payload.append("farmhouse", String((formData as any).farmhouse));
      if ((formData as any).pricePerAcre !== undefined) payload.append("pricePerAcre", String((formData as any).pricePerAcre));
      if ((formData as any).workstations !== undefined) payload.append("workstations", String((formData as any).workstations));
      if ((formData as any).cabins !== undefined) payload.append("cabins", String((formData as any).cabins));
      if ((formData as any).meetingRooms !== undefined) payload.append("meetingRooms", String((formData as any).meetingRooms));
      if ((formData as any).reception !== undefined) payload.append("reception", String((formData as any).reception));
      if ((formData as any).pantry !== undefined) payload.append("pantry", String((formData as any).pantry));
      if ((formData as any).serverRoom !== undefined) payload.append("serverRoom", String((formData as any).serverRoom));
      if ((formData as any).ac !== undefined) payload.append("ac", String((formData as any).ac));
      if ((formData as any).internet !== undefined) payload.append("internet", String((formData as any).internet));
      if ((formData as any).fireSafety !== undefined) payload.append("fireSafety", String((formData as any).fireSafety));
      if ((formData as any).ceilingHeight !== undefined) payload.append("ceilingHeight", String((formData as any).ceilingHeight));
      if ((formData as any).mainRoadFacing !== undefined) payload.append("mainRoadFacing", String((formData as any).mainRoadFacing));
      if ((formData as any).cornerShop !== undefined) payload.append("cornerShop", String((formData as any).cornerShop));
      if ((formData as any).shutters !== undefined) payload.append("shutters", String((formData as any).shutters));
      if ((formData as any).signboard !== undefined) payload.append("signboard", String((formData as any).signboard));
      if ((formData as any).footfallEstimate) payload.append("footfallEstimate", (formData as any).footfallEstimate);
      if ((formData as any).suitableBusiness) payload.append("suitableBusiness", (formData as any).suitableBusiness);
      if ((formData as any).loadingUnloading !== undefined) payload.append("loadingUnloading", String((formData as any).loadingUnloading));
      if ((formData as any).dock !== undefined) payload.append("dock", String((formData as any).dock));
      if ((formData as any).truckAccess) payload.append("truckAccess", (formData as any).truckAccess);
      if ((formData as any).storageCapacity) payload.append("storageCapacity", (formData as any).storageCapacity);
      if ((formData as any).flooring) payload.append("flooring", (formData as any).flooring);
      if ((formData as any).officeArea !== undefined) payload.append("officeArea", String((formData as any).officeArea));
      if ((formData as any).industrialType) payload.append("industrialType", (formData as any).industrialType);
      if ((formData as any).transformer !== undefined) payload.append("transformer", String((formData as any).transformer));
      if ((formData as any).productionArea !== undefined) payload.append("productionArea", String((formData as any).productionArea));
      if ((formData as any).crane !== undefined) payload.append("crane", String((formData as any).crane));
      if ((formData as any).workerFacilities !== undefined) payload.append("workerFacilities", String((formData as any).workerFacilities));
      if ((formData as any).pollutionCompliance) payload.append("pollutionCompliance", (formData as any).pollutionCompliance);
      if ((formData as any).machineryIncluded !== undefined) payload.append("machineryIncluded", String((formData as any).machineryIncluded));
      if ((formData as any).numberOfRooms !== undefined) payload.append("numberOfRooms", String((formData as any).numberOfRooms));
      if ((formData as any).roomTypes) payload.append("roomTypes", (formData as any).roomTypes);
      if ((formData as any).restaurant !== undefined) payload.append("restaurant", String((formData as any).restaurant));
      if ((formData as any).kitchen !== undefined) payload.append("kitchen", String((formData as any).kitchen));
      if ((formData as any).banquetHall !== undefined) payload.append("banquetHall", String((formData as any).banquetHall));
      if ((formData as any).gym !== undefined) payload.append("gym", String((formData as any).gym));
      if ((formData as any).occupancy) payload.append("occupancy", (formData as any).occupancy);
      if ((formData as any).revenue !== undefined) payload.append("revenue", String((formData as any).revenue));
      if ((formData as any).genderType) payload.append("genderType", (formData as any).genderType);
      if ((formData as any).totalBeds !== undefined) payload.append("totalBeds", String((formData as any).totalBeds));
      if ((formData as any).availableBeds !== undefined) payload.append("availableBeds", String((formData as any).availableBeds));
      if ((formData as any).roomSharingType) payload.append("roomSharingType", (formData as any).roomSharingType);
      if ((formData as any).rentPerBed !== undefined) payload.append("rentPerBed", String((formData as any).rentPerBed));
      if ((formData as any).deposit !== undefined) payload.append("deposit", String((formData as any).deposit));
      if ((formData as any).foodIncluded !== undefined) payload.append("foodIncluded", String((formData as any).foodIncluded));
      if ((formData as any).laundry !== undefined) payload.append("laundry", String((formData as any).laundry));
      if ((formData as any).housekeeping !== undefined) payload.append("housekeeping", String((formData as any).housekeeping));
      if ((formData as any).rules) payload.append("rules", (formData as any).rules);
      if ((formData as any).projectName) payload.append("projectName", (formData as any).projectName);
      if ((formData as any).towers !== undefined) payload.append("towers", String((formData as any).towers));
      if ((formData as any).totalUnits !== undefined) payload.append("totalUnits", String((formData as any).totalUnits));
      if ((formData as any).availableUnits !== undefined) payload.append("availableUnits", String((formData as any).availableUnits));
      if ((formData as any).bhkTypes) payload.append("bhkTypes", (formData as any).bhkTypes);
      if ((formData as any).constructionStatus) payload.append("constructionStatus", (formData as any).constructionStatus);
      if ((formData as any).possessionDate) payload.append("possessionDate", (formData as any).possessionDate);
      if ((formData as any).paymentPlan) payload.append("paymentPlan", (formData as any).paymentPlan);

      if (formData.pendingIssues) {
        payload.append("pendingIssues", JSON.stringify(formData.pendingIssues));
      }
      if (formData.documents) {
        payload.append("documents", JSON.stringify(formData.documents));
      }
      if (formData.ownershipType) {
        payload.append("ownershipType", formData.ownershipType);
      }
      if (formData.numberOfOwners !== undefined) {
        payload.append("numberOfOwners", String(formData.numberOfOwners));
      }
      if (formData.pan) {
        payload.append("pan", formData.pan);
      }

      if (formData.existingPhotos) {
        payload.append("existingPhotos", JSON.stringify(formData.existingPhotos));
      }

      let response;
      if (editId) {
        response = await api.put(`/properties/${editId}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post("/createproperty", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data.success) {
        if (editId) {
          toast.success("Property updated successfully");
          router.push("/my-properties");
        } else {
          setPublished(true);
        }
      }
    } catch (error: any) {
      console.error("Property action error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to save property details. Please verify location serviceability.";
      toast.error(errorMsg);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSaveDraft = () => {
    try {
      const { photos, ...serializableData } = formData;
      localStorage.setItem("property_form_draft", JSON.stringify(serializableData));
      toast.success("Draft saved successfully! Your progress is stored on this page.");
    } catch (err) {
      console.error("Failed to save draft:", err);
      toast.error("Failed to save draft.");
    }
  };

  const isAgent = role === "agent";

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Please Login</div>;
  }

  const isAgentVerified = user?.isVerified === true || user?.verificationStatus === "approved";
  if (isAgent && !isAgentVerified) {
    return <AgentPendingVerification />;
  }

  if (published) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-xl">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="flex justify-center mb-8"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-24 w-24 rounded-full border-[4px] border-green-500 flex items-center justify-center"
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

            <h1 className="text-2xl font-playfair font-semibold text-[#161616]">
              Property Listed Successfully!
            </h1>

            <p className="mt-5 text-xl text-gray-600 leading-relaxed">
              The listing is submitted for admin review. Owner will be notified once approved.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => router.push("/property-listing")}
                className="bg-[#C89B1C] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#B58A16]"
              >
                View Listings
              </button>

              <button
                onClick={() => window.location.reload()}
                className="border border-[#D8B56A] px-8 py-4 rounded-2xl font-semibold text-[#161616] hover:bg-[#FFF8E8] hover:border-[#C89B1C] hover:shadow-[0_4px_20px_rgba(200,155,28,0.15)] transition-all duration-300"
              >
                List Another
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const renderStep = () => {
    switch (currentStepId) {
      case "type":
        return (
          <PropertyTypeStep
            value={formData.propertyType}
            purpose={formData.purpose}
            onPurposeChange={(val) => setFormData((prev) => ({ ...prev, purpose: val }))}
            onTypeChange={(val) => setFormData((prev) => ({ ...prev, propertyType: val }))}
          />
        );
      case "owner":
        return <OwnerDetailsStep formData={formData} setFormData={setFormData} errors={stepErrors} />;
      case "location":
        return <LocationStep formData={formData} setFormData={setFormData} errors={stepErrors} />;
      case "details":
        return <PropertyDetailsStep formData={formData} setFormData={setFormData} errors={stepErrors} />;
      case "amenities":
        return <AmenitiesStep formData={formData} setFormData={setFormData} />;
      case "neighbourhood":
        return <NeighbourhoodStep formData={formData} setFormData={setFormData} errors={stepErrors} />;
      case "price":
        return <PricePhotosStep formData={formData} setFormData={setFormData} errors={stepErrors} />;
      case "issues":
        return <PendingIssuesStep formData={formData} setFormData={setFormData} errors={stepErrors} />;
      case "documents":
        return <DocumentsStep formData={formData} setFormData={setFormData} errors={stepErrors} />;
      case "review":
        return (
          <ReviewSubmitStep
            formData={formData}
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            loading={loadingSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      {/* AGENT PROPERTY TYPE SELECTION MODAL */}
      {role === "agent" && showAgentModal && !editId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E5D7B3]"
          >
            <button
              onClick={() => setShowAgentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFFBF0] border border-[#F3E5C8] flex items-center justify-center text-[#C89B1C]">
                <ShieldCheck size={24} />
              </div>
            </div>

            <h3 className="text-center font-playfair font-bold text-xl sm:text-2xl text-[#161616]">
              Listing As Verified Agent
            </h3>
            <p className="text-center text-xs text-gray-500 mt-2 leading-relaxed">
              Please choose whether this property belongs to you or you are listing it on behalf of another owner.
            </p>

            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    listingType: "my_own",
                    ownerName: user?.fullName || "",
                    ownerPhone: user?.phone || "",
                    ownerEmail: user?.email || "",
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
                    Listed directly by you as the property owner.
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (mode === "edit") {
                  router.push("/my-properties");
                } else {
                  router.push("/");
                }
              }}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#C89B1C] mb-5 font-medium transition-colors cursor-pointer text-sm"
            >
              <ArrowLeft size={16} />
              {mode === "edit" ? "Cancel & Return to My Properties" : "Back to Home"}
            </motion.button>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-playfair font-bold text-[#161616] mb-2 tracking-tight"
            >
              {mode === "edit" ? "Edit Property" : "List Your Property"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-[#6B7280] max-w-2xl leading-relaxed"
            >
              {mode === "edit"
                ? "Update your property information"
                : isAgent
                  ? "List a property on behalf of your client. Owner information and authorization details are required for agent listings."
                  : "Reach thousands of verified buyers and tenants across India. Publish your property in just a few simple steps."}
            </motion.p>
          </motion.div>

          <motion.div
            layout={currentStepId === "location" ? false : "position"}
            className="bg-white border border-[#E5D7B3] p-8 sm:p-10 rounded-[32px] shadow-sm flex flex-col justify-between min-h-[580px]"
          >
            <div>
              <PropertyStepper currentStep={step} stepsList={stepsList} />

              <div className="mt-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-10">
              {step > 1 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={previousStep}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#E5D8B3] bg-white text-[#6B7280] font-medium transition-all hover:border-[#C89B1C] hover:text-[#C89B1C] hover:shadow-md"
                >
                  <motion.div
                    animate={{ x: [-2, 0, -2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ArrowLeft size={18} />
                  </motion.div>
                  Previous
                </motion.button>
              ) : (
                <div className="w-[110px]" />
              )}

              <span className="text-gray-500 text-sm">
                Step {step} of {totalSteps}
              </span>

              {step === totalSteps ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSubmit}
                  disabled={loadingSubmit}
                  className="bg-[#C89B1C] hover:bg-[#B58A16] text-white px-8 py-3 rounded-2xl font-medium flex items-center gap-2 shadow-lg shadow-[#C89B1C]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loadingSubmit ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Submit & Publish Property
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.04, x: 3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={nextStep}
                  disabled={false}
                  className="bg-[#C89B1C] hover:bg-[#B58A16] text-white px-8 py-3 rounded-2xl font-medium flex items-center gap-2 shadow-lg shadow-[#C89B1C]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}
