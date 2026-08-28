"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Heart, ShieldCheck, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import api from "../../../lib/api";
import { Property } from "../../../types/property";
import { useCompareSession } from "../../../hooks/useCompareSession";
import { removePropertyFromCompare, clearCompareSession } from "../../../services/compareService";;
import { calculatePropertyMatchScore } from "../../../utils/matchScore";
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";

// Helper mapping for dynamic attributes comparison
const getCompareFields = (propertyType: string, commercialType?: string) => {
  const target = propertyType === "Commercial Space" && commercialType ? commercialType : propertyType;
  switch (target) {
    case "Apartment / Flat":
    case "Builder Floor":
      return [
        { key: "bedrooms", label: "BHK", format: (v: any) => (v ? `${v} BHK` : "N/A"), numeric: true },
        { key: "bedrooms", label: "Bedrooms", format: (v: any) => (v ? `${v} Beds` : "N/A"), numeric: true },
        { key: "bathrooms", label: "Bathrooms", format: (v: any) => (v ? `${v} Baths` : "N/A"), numeric: true },
        { key: "balconies", label: "Balconies", format: (v: any) => (v !== undefined ? `${v} Balconies` : "N/A"), numeric: true },
        { key: "area", label: "Built-up Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "carpetArea", label: "Carpet Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "floor", label: "Floor", format: (v: any, p: any) => (v !== undefined ? `${v} of ${p.totalFloors || "N/A"}` : "N/A") },
        { key: "propertyAge", label: "Property Age", format: (v: any) => v || "N/A" },
        { key: "furnishing", label: "Furnishing", format: (v: any) => v || "N/A" },
        { key: "facing", label: "Facing", format: (v: any) => v || "N/A" },
        { key: "parking", label: "Parking", format: (v: any) => (v ? "Available" : "Not Available") },
        { key: "maintenance", label: "Maintenance", format: (v: any) => (v ? `₹${v.toLocaleString()}` : "N/A"), numeric: true },
      ];
    case "Independent House":
      return [
        { key: "bedrooms", label: "BHK", format: (v: any) => (v ? `${v} BHK` : "N/A"), numeric: true },
        { key: "bedrooms", label: "Bedrooms", format: (v: any) => (v ? `${v} Beds` : "N/A"), numeric: true },
        { key: "bathrooms", label: "Bathrooms", format: (v: any) => (v ? `${v} Baths` : "N/A"), numeric: true },
        { key: "plotArea", label: "Plot Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "area", label: "Built-up Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "carpetArea", label: "Carpet Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "totalFloors", label: "Floors", format: (v: any) => (v ? `${v} Floors` : "N/A"), numeric: true },
        { key: "propertyAge", label: "Property Age", format: (v: any) => v || "N/A" },
        { key: "dimensions", label: "Plot Dimensions", format: (v: any, p: any) => (p.length && p.width ? `${p.length} × ${p.width} ft` : "N/A") },
        { key: "roadWidth", label: "Road Width", format: (v: any) => (v ? `${v} ft` : "N/A"), numeric: true },
        { key: "frontage", label: "Frontage", format: (v: any) => (v ? `${v} ft` : "N/A"), numeric: true },
        { key: "facing", label: "Facing", format: (v: any) => v || "N/A" },
        { key: "parking", label: "Parking", format: (v: any) => (v ? "Available" : "Not Available") },
        { key: "furnishing", label: "Furnishing", format: (v: any) => v || "N/A" },
        { key: "garden", label: "Garden", format: (v: any) => (v ? "Yes" : "No") },
        { key: "terrace", label: "Terrace", format: (v: any) => (v ? "Yes" : "No") },
      ];
    case "Villa":
      return [
        { key: "bedrooms", label: "BHK", format: (v: any) => (v ? `${v} BHK` : "N/A"), numeric: true },
        { key: "bedrooms", label: "Bedrooms", format: (v: any) => (v ? `${v} Beds` : "N/A"), numeric: true },
        { key: "bathrooms", label: "Bathrooms", format: (v: any) => (v ? `${v} Baths` : "N/A"), numeric: true },
        { key: "plotArea", label: "Plot Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "area", label: "Built-up Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "carpetArea", label: "Carpet Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "totalFloors", label: "Floors", format: (v: any) => (v ? `${v} Floors` : "N/A"), numeric: true },
        { key: "propertyAge", label: "Property Age", format: (v: any) => v || "N/A" },
        { key: "facing", label: "Facing", format: (v: any) => v || "N/A" },
        { key: "parking", label: "Parking", format: (v: any) => (v ? "Available" : "Not Available") },
        { key: "furnishing", label: "Furnishing", format: (v: any) => v || "N/A" },
        { key: "garden", label: "Garden", format: (v: any) => (v ? "Yes" : "No") },
        { key: "privatePool", label: "Private Pool", format: (v: any) => (v ? "Yes" : "No") },
        { key: "terrace", label: "Terrace", format: (v: any) => (v ? "Yes" : "No") },
        { key: "servantRoom", label: "Servant Room", format: (v: any) => (v ? "Yes" : "No") },
      ];
    case "Plot / Land":
    case "Residential Plot":
      return [
        { key: "plotArea", label: "Plot Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "length", label: "Length", format: (v: any) => (v ? `${v} ft` : "N/A"), numeric: true },
        { key: "width", label: "Width", format: (v: any) => (v ? `${v} ft` : "N/A"), numeric: true },
        { key: "dimensions", label: "Dimensions", format: (v: any, p: any) => (p.length && p.width ? `${p.length} × ${p.width} ft` : "N/A") },
        { key: "roadWidth", label: "Road Width", format: (v: any) => (v ? `${v} ft` : "N/A"), numeric: true },
        { key: "frontage", label: "Frontage", format: (v: any) => (v ? `${v} ft` : "N/A"), numeric: true },
        { key: "facing", label: "Facing", format: (v: any, p: any) => v || p.plotFacing || "N/A" },
        { key: "cornerPlot", label: "Corner Plot", format: (v: any) => (v ? "Yes" : "No") },
        { key: "layoutName", label: "Layout Name", format: (v: any) => v || "N/A" },
        { key: "landApproval", label: "Land Approval", format: (v: any) => v || "N/A" },
        { key: "landClassification", label: "Land Classification", format: (v: any) => v || "N/A" },
        { key: "gatedLayout", label: "Gated Layout", format: (v: any) => (v ? "Yes" : "No") },
        { key: "boundaryWall", label: "Boundary Wall", format: (v: any) => (v ? "Yes" : "No") },
      ];
    case "Agricultural Land":
      return [
        { key: "plotArea", label: "Land Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "pricePerAcre", label: "Price per Acre", format: (v: any) => (v ? `₹${v.toLocaleString("en-IN")}` : "N/A"), numeric: true },
        { key: "surveyNumber", label: "Survey Number", format: (v: any) => v || "N/A" },
        { key: "taluk", label: "Taluk", format: (v: any) => v || "N/A" },
        { key: "soilType", label: "Soil Type", format: (v: any) => v || "N/A" },
        { key: "irrigation", label: "Irrigation", format: (v: any) => (v ? "Yes" : "No") },
        { key: "crops", label: "Crops", format: (v: any) => v || "N/A" },
        { key: "farmhouse", label: "Farmhouse", format: (v: any) => (v ? "Yes" : "No") },
        { key: "electricity", label: "Electricity", format: (v: any) => (v ? "Yes" : "No") },
        { key: "solar", label: "Solar", format: (v: any) => (v ? "Yes" : "No") },
        { key: "borewell", label: "Borewell", format: (v: any) => (v ? "Yes" : "No") },
        { key: "facing", label: "Facing", format: (v: any) => v || "N/A" },
      ];
    case "Office Space":
      return [
        { key: "area", label: "Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "carpetArea", label: "Carpet Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "floor", label: "Floor", format: (v: any, p: any) => (v !== undefined ? `${v} of ${p.totalFloors || "N/A"}` : "N/A") },
        { key: "washrooms", label: "Washrooms", format: (v: any) => (v !== undefined ? String(v) : "N/A"), numeric: true },
        { key: "powerLoad", label: "Power Load", format: (v: any) => (v ? `${v} kW` : "N/A"), numeric: true },
        { key: "workstations", label: "Workstations", format: (v: any) => (v !== undefined ? String(v) : "N/A"), numeric: true },
        { key: "cabins", label: "Cabins", format: (v: any) => (v !== undefined ? String(v) : "N/A"), numeric: true },
        { key: "meetingRooms", label: "Meeting Rooms", format: (v: any) => (v !== undefined ? String(v) : "N/A"), numeric: true },
        { key: "reception", label: "Reception", format: (v: any) => (v ? "Yes" : "No") },
        { key: "pantry", label: "Pantry", format: (v: any) => (v ? "Yes" : "No") },
        { key: "serverRoom", label: "Server Room", format: (v: any) => (v ? "Yes" : "No") },
        { key: "ac", label: "AC", format: (v: any) => (v ? "Yes" : "No") },
        { key: "internet", label: "Internet", format: (v: any) => (v ? "Yes" : "No") },
        { key: "fireSafety", label: "Fire Safety", format: (v: any) => (v ? "Yes" : "No") },
        { key: "parking", label: "Parking", format: (v: any) => (v ? "Available" : "Not Available") },
        { key: "facing", label: "Facing", format: (v: any) => v || "N/A" },
      ];
    case "Shop / Retail":
      return [
        { key: "area", label: "Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "carpetArea", label: "Carpet Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "floor", label: "Floor", format: (v: any, p: any) => (v !== undefined ? `${v} of ${p.totalFloors || "N/A"}` : "N/A") },
        { key: "washrooms", label: "Washrooms", format: (v: any) => (v !== undefined ? String(v) : "N/A"), numeric: true },
        { key: "powerLoad", label: "Power Load", format: (v: any) => (v ? `${v} kW` : "N/A"), numeric: true },
        { key: "entranceWidth", label: "Entrance Width", format: (v: any) => (v ? `${v} ft` : "N/A"), numeric: true },
        { key: "ceilingHeight", label: "Ceiling Height", format: (v: any) => (v ? `${v} ft` : "N/A"), numeric: true },
        { key: "mainRoadFacing", label: "Main Road Facing", format: (v: any) => (v ? "Yes" : "No") },
        { key: "cornerShop", label: "Corner Shop", format: (v: any) => (v ? "Yes" : "No") },
        { key: "shutters", label: "Shutters", format: (v: any) => (v !== undefined ? String(v) : "N/A"), numeric: true },
        { key: "signboard", label: "Signboard", format: (v: any) => (v ? "Yes" : "No") },
        { key: "footfallEstimate", label: "Footfall Estimate", format: (v: any) => v || "N/A" },
        { key: "suitableBusiness", label: "Suitable Business", format: (v: any) => v || "N/A" },
        { key: "parking", label: "Parking", format: (v: any) => (v ? "Available" : "Not Available") },
      ];
    case "Warehouse":
      return [
        { key: "area", label: "Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "ceilingHeight", label: "Ceiling Height", format: (v: any) => (v ? `${v} ft` : "N/A"), numeric: true },
        { key: "loadingUnloading", label: "Loading / Unloading", format: (v: any) => (v ? "Yes" : "No") },
        { key: "dock", label: "Dock", format: (v: any) => (v ? "Yes" : "No") },
        { key: "truckAccess", label: "Truck Access", format: (v: any) => v || "N/A" },
        { key: "storageCapacity", label: "Storage Capacity", format: (v: any) => v || "N/A" },
        { key: "flooring", label: "Flooring", format: (v: any) => v || "N/A" },
        { key: "powerLoad", label: "Power Load", format: (v: any) => (v ? `${v} kW` : "N/A"), numeric: true },
        { key: "officeArea", label: "Office Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "fireSafety", label: "Fire Safety", format: (v: any) => (v ? "Yes" : "No") },
        { key: "parking", label: "Parking", format: (v: any) => (v ? "Available" : "Not Available") },
      ];
    case "Industrial Property":
      return [
        { key: "area", label: "Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "industrialType", label: "Industrial Type", format: (v: any) => v || "N/A" },
        { key: "powerLoad", label: "Power Load", format: (v: any) => (v ? `${v} kW` : "N/A"), numeric: true },
        { key: "productionArea", label: "Production Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "transformer", label: "Transformer", format: (v: any) => (v ? "Yes" : "No") },
        { key: "crane", label: "Crane", format: (v: any) => (v ? "Yes" : "No") },
        { key: "workerFacilities", label: "Worker Facilities", format: (v: any) => (v ? "Yes" : "No") },
        { key: "pollutionCompliance", label: "Pollution Compliance", format: (v: any) => v || "N/A" },
        { key: "zoning", label: "Industrial Zoning", format: (v: any) => v || "N/A" },
        { key: "machineryIncluded", label: "Machinery Included", format: (v: any) => (v ? "Yes" : "No") },
        { key: "parking", label: "Parking", format: (v: any) => (v ? "Available" : "Not Available") },
      ];
    case "Hotel / Resort":
      return [
        { key: "area", label: "Area", format: (v: any) => (v ? `${v.toLocaleString()} sq ft` : "N/A"), numeric: true },
        { key: "numberOfRooms", label: "Number of Rooms", format: (v: any) => (v !== undefined ? String(v) : "N/A"), numeric: true },
        { key: "roomTypes", label: "Room Types", format: (v: any) => v || "N/A" },
        { key: "totalFloors", label: "Floors", format: (v: any) => (v !== undefined ? String(v) : "N/A"), numeric: true },
        { key: "restaurant", label: "Restaurant", format: (v: any) => (v ? "Yes" : "No") },
        { key: "kitchen", label: "Kitchen", format: (v: any) => (v ? "Yes" : "No") },
        { key: "banquetHall", label: "Banquet Hall", format: (v: any) => (v ? "Yes" : "No") },
        { key: "gym", label: "Gym", format: (v: any) => (v ? "Yes" : "No") },
        { key: "occupancy", label: "Occupancy", format: (v: any) => v || "N/A" },
        { key: "revenue", label: "Revenue", format: (v: any) => (v ? `₹${v.toLocaleString("en-IN")}` : "N/A"), numeric: true },
        { key: "parking", label: "Parking", format: (v: any) => (v ? "Available" : "Not Available") },
        { key: "privatePool", label: "Pool", format: (v: any) => (v ? "Yes" : "No") },
      ];
    default:
      return [];
  }
};

function ComparisonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useCompareSession();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightDiff, setHighlightDiff] = useState(false);

  const [aiInsights, setAiInsights] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [matchScores, setMatchScores] = useState<Record<string, any>>({});

  useEffect(() => {
    const saved = localStorage.getItem("estategold_user_preferences");
    if (saved && properties.length > 0) {
      try {
        const prefs = JSON.parse(saved);
        const scores: Record<string, any> = {};
        properties.forEach((p) => {
          scores[p._id] = calculatePropertyMatchScore(p, prefs);
        });
        setMatchScores(scores);
      } catch (e) {
        console.error(e);
      }
    }
  }, [properties]);

  const idsParam = searchParams.get("ids") || "";

  useEffect(() => {
    const fetchAiInsights = async () => {
      const activeProps = properties.filter((p) =>
        session.properties.some((sp) => sp._id === p._id)
      );
      if (activeProps.length < 2) return;
      try {
        setAiLoading(true);
        const res = await api.post("/ai/compare-properties", { ids: idsParam });
        if (res.data && res.data.success) {
          setAiInsights(res.data);
        }
      } catch (err) {
        console.error("AI Comparison Insights error:", err);
      } finally {
        setAiLoading(false);
      }
    };

    if (properties.length >= 2) {
      fetchAiInsights();
    }
  }, [properties]);

  useEffect(() => {
    const fetchCompareData = async () => {
      if (!idsParam) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/properties/compare?ids=${idsParam}`);
        setProperties(response.data.data || []);
      } catch (err: any) {
        console.error("Compare error:", err);
        setError(err.response?.data?.message || "Failed to load properties for comparison.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompareData();
  }, [idsParam]);

  const handleRemove = (id: string) => {
    removePropertyFromCompare(id);
    const updatedIds = idsParam
      .split(",")
      .filter((x) => x !== id)
      .join(",");
    if (updatedIds) {
      router.replace(`/properties/compare?ids=${updatedIds}`);
    } else {
      router.replace("/property-listing");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
          <p className="mt-4 text-xs font-semibold text-gray-500">Loading comparison details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const activeProperties = properties.filter((p) =>
    session.properties.some((sp) => sp._id === p._id)
  );

  if (activeProperties.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <div className="h-16 w-16 rounded-3xl bg-[#FFF9EC] border border-[#E8DCC1] text-[#9A720C] flex items-center justify-center text-2xl shadow-xs mb-4">
            ⚖️
          </div>
          <h2 className="text-xl font-bold text-gray-900">No Properties Selected</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed font-semibold">
            Please select similar properties from listings page to start comparison.
          </p>
          <button
            onClick={() => router.push("/property-listing")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back to Listings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (activeProperties.length === 1) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <div className="h-16 w-16 rounded-3xl bg-[#FFF9EC] border border-[#E8DCC1] text-[#9A720C] flex items-center justify-center text-2xl shadow-xs mb-4">
            ⚖️
          </div>
          <h2 className="text-xl font-bold text-gray-900">Compare Properties</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed font-semibold">
            Select another similar property to compare. At least 2 properties of the same type are required.
          </p>
          <button
            onClick={() => router.push("/property-listing")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Property
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Get dynamic comparative configuration based on type of first property
  const baseProperty = activeProperties[0];
  const compareFields = getCompareFields(baseProperty.propertyType, baseProperty.commercialType);

  // Collect unique amenities present across all selected properties
  const allAmenities = Array.from(
    new Set(activeProperties.flatMap((p) => p.amenities || []))
  ).sort();

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE7DB] pb-6 mb-8">
          <div>
            <button
              onClick={() => router.push("/property-listing")}
              className="text-xs font-bold text-gray-500 hover:text-[#9A720C] flex items-center gap-1 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Listings
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Compare Properties</h1>
            <p className="text-xs text-gray-500 mt-1 font-semibold">
              Compare similar properties side by side
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHighlightDiff(!highlightDiff)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                highlightDiff
                  ? "bg-[#FFF9EC] border-[#9A720C] text-[#9A720C] shadow-3xs"
                  : "bg-white border-[#ECE7DB] text-gray-700 hover:border-[#9A720C] hover:text-[#9A720C]"
              }`}
            >
              <Sparkles size={13} />
              {highlightDiff ? "Highlighting Differences" : "Highlight Differences"}
            </button>
            <button
              onClick={() => router.push("/property-listing")}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#9A720C] hover:bg-[#856108] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <Plus size={13} /> Add Property
            </button>
          </div>
        </div>

        {/* Responsive Side-by-Side Comparison Container */}
        <div className="hidden md:block bg-white border border-[#ECE7DB] rounded-3xl shadow-xl overflow-hidden">
          {/* Header Row: Images, Titles, Remove buttons */}
          <div className="grid grid-cols-12 border-b border-[#ECE7DB]">
            {/* Feature Label Sticky Column */}
            <div className="col-span-3 bg-gray-50/50 p-6 hidden md:flex flex-col justify-end border-r border-[#ECE7DB]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Property comparison
              </span>
            </div>

            {/* Properties Columns */}
            <div className="col-span-12 md:col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] overflow-x-auto">
              {activeProperties.map((p) => {
                const image = p.photos?.[0]
                  ? p.photos[0].startsWith("http")
                    ? p.photos[0]
                    : `http://localhost:5000/uploads/properties/${p.photos[0].replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "")}`
                  : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
                return (
                  <div key={p._id} className="p-6 flex flex-col justify-between space-y-4 min-w-[200px]">
                    <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-[#ECE7DB] bg-gray-100">
                      <img src={image} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemove(p._id)}
                        className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-500 shadow-2xs transition-colors cursor-pointer border border-[#ECE7DB]"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="text-left space-y-1">
                      <span className="inline-block px-2 py-0.5 bg-[#FFF9EC] border border-[#F4E3B5] text-[9px] font-bold text-[#9A720C] rounded-full uppercase">
                        {p.propertyType}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight">
                        {p.bedrooms ? `${p.bedrooms} BHK ` : ""}
                        {p.propertyType} in {p.locality || p.city}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {p.locality ? `${p.locality}, ` : ""}
                        {p.city}
                      </p>
                      <h4 className="text-lg font-bold text-[#9A720C] pt-1">
                        ₹{p.price?.toLocaleString("en-IN")}
                      </h4>

                      {/* Match Compatibility Progress Bar */}
                      {matchScores[p._id] && (
                        <div className="pt-2 border-t border-[#ECE7DB] mt-2 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Match Compatibility</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                              matchScores[p._id].score >= 90 ? "bg-green-50 text-green-700" :
                              matchScores[p._id].score >= 75 ? "bg-emerald-50 text-emerald-700" :
                              matchScores[p._id].score >= 60 ? "bg-yellow-50 text-yellow-700" :
                              matchScores[p._id].score >= 40 ? "bg-amber-50 text-amber-700" :
                              "bg-red-50 text-red-700"
                            }`}>
                              {matchScores[p._id].score}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                matchScores[p._id].score >= 90 ? "bg-green-500" :
                                matchScores[p._id].score >= 75 ? "bg-emerald-500" :
                                matchScores[p._id].score >= 60 ? "bg-yellow-500" :
                                matchScores[p._id].score >= 40 ? "bg-amber-500" :
                                "bg-red-500"
                              }`}
                              style={{ width: `${matchScores[p._id].score}%` }}
                            />
                          </div>
                          <p className="text-[8px] text-gray-500 font-bold mt-1">
                            {matchScores[p._id].label}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                      <button
                        onClick={() => router.push(`/property-detail/${p._id}`)}
                        className="text-[11px] font-bold text-[#9A720C] hover:underline cursor-pointer"
                      >
                        View Details →
                      </button>
                      <button
                        onClick={() => handleRemove(p._id)}
                        className="text-[11px] font-bold text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Overview */}
          <div className="bg-[#FFFDF8] border-b border-[#ECE7DB] p-4 px-6 text-left">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#9A720C]">
              Overview
            </h2>
          </div>

          {/* Common comparison properties grid */}
          <div className="divide-y divide-[#ECE7DB]">
            {/* Match Compatibility Details Row */}
            {Object.keys(matchScores).length > 0 && (
              <div className="grid grid-cols-12 items-start text-left">
                <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB] self-stretch flex flex-col justify-start">
                  <span>Match Details</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 leading-relaxed">
                    Based on search filters
                  </span>
                </div>
                <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] text-xs text-gray-900">
                  {activeProperties.map((p) => {
                    const scoreData = matchScores[p._id];
                    if (!scoreData) {
                      return (
                        <div key={p._id} className="p-4 px-6 text-gray-400 font-medium">
                          No active preferences
                        </div>
                      );
                    }
                    return (
                      <div key={p._id} className="p-4 px-6 space-y-3" style={{ minWidth: "200px" }}>
                        {scoreData.matchedReasons.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-green-700 uppercase tracking-wide">✓ Matched</span>
                            <div className="flex flex-col gap-0.5">
                              {scoreData.matchedReasons.map((r: string, idx: number) => (
                                <span key={idx} className="text-[10px] font-bold text-green-700 leading-tight">
                                  ✓ {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {scoreData.mismatchedReasons.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-red-600 uppercase tracking-wide">✕ Mismatched</span>
                            <div className="flex flex-col gap-0.5">
                              {scoreData.mismatchedReasons.map((r: string, idx: number) => (
                                <span key={idx} className="text-[10px] font-bold text-red-600 leading-tight">
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {scoreData.unverifiedReasons.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-amber-700 uppercase tracking-wide">⚠ Unverified</span>
                            <div className="flex flex-wrap gap-1">
                              {scoreData.unverifiedReasons.map((r: string, idx: number) => (
                                <span key={idx} className="text-[9px] font-semibold text-amber-700 bg-amber-50/70 border border-amber-100 rounded-md px-1 py-0.5 animate-pulse">
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Price Row */}
            <div className="grid grid-cols-12 items-center text-left">
              <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                Price
              </div>
              <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-semibold text-xs text-gray-900">
                {activeProperties.map((p) => {
                  const prices = activeProperties.map((ap) => ap.price);
                  const isLowest = highlightDiff && p.price === Math.min(...prices);
                  return (
                    <div
                      key={p._id}
                      className={`p-4 px-6 flex items-center justify-between gap-2 ${
                        isLowest ? "bg-green-50/70" : ""
                      }`}
                    >
                      <span>₹{p.price?.toLocaleString("en-IN")}</span>
                      {isLowest && (
                        <span className="text-[9px] font-black text-green-700 uppercase tracking-wide bg-green-100 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0">
                          Lowest Price
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Area Row */}
            <div className="grid grid-cols-12 items-center text-left">
              <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                Area
              </div>
              <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-semibold text-xs text-gray-900">
                {activeProperties.map((p) => {
                  const areas = activeProperties.map((ap) => ap.area || 0);
                  const isBest = highlightDiff && p.area === Math.max(...areas);
                  return (
                    <div
                      key={p._id}
                      className={`p-4 px-6 flex items-center justify-between gap-2 ${
                        isBest ? "bg-green-50/70" : ""
                      }`}
                    >
                      <span>{(p.area || 0).toLocaleString()} sq ft</span>
                      {isBest && (
                        <span className="text-[9px] font-black text-green-700 uppercase tracking-wide bg-green-100 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0">
                          Largest Area
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Facing Row */}
            <div className="grid grid-cols-12 items-center text-left">
              <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                Facing Direction
              </div>
              <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-semibold text-xs text-gray-900">
                {activeProperties.map((p) => {
                  const facings = activeProperties.map((ap) => ap.facing || "");
                  const isDiff = highlightDiff && new Set(facings).size > 1;
                  return (
                    <div
                      key={p._id}
                      className={`p-4 px-6 ${
                        isDiff ? "bg-amber-50/40 text-amber-900" : ""
                      }`}
                    >
                      {p.facing || "N/A"}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Row */}
            <div className="grid grid-cols-12 items-center text-left">
              <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                Listing Status
              </div>
              <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-semibold text-xs text-gray-900">
                {activeProperties.map((p) => (
                  <div key={p._id} className="p-4 px-6 capitalize">
                    {p.status || "Active"}
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Status Row */}
            <div className="grid grid-cols-12 items-center text-left">
              <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                Availability
              </div>
              <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-semibold text-xs text-gray-900">
                {activeProperties.map((p) => (
                  <div key={p._id} className="p-4 px-6 capitalize">
                    {p.availabilityStatus === "on_sale"
                      ? "On Sale"
                      : p.availabilityStatus === "hold"
                      ? "Hold"
                      : p.availabilityStatus || "Available"}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Specifications */}
          {compareFields.length > 0 && (
            <>
              <div className="bg-[#FFFDF8] border-y border-[#ECE7DB] p-4 px-6 text-left">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#9A720C]">
                  Specifications
                </h2>
              </div>
              <div className="divide-y divide-[#ECE7DB]">
                {compareFields.map((f, fIdx) => (
                  <div key={fIdx} className="grid grid-cols-12 items-center text-left">
                    <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                      {f.label}
                    </div>
                    <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-semibold text-xs text-gray-900">
                      {activeProperties.map((p) => {
                        const val = p[f.key as keyof Property];
                        const allValues = activeProperties.map((ap) => ap[f.key as keyof Property]);
                        const isDiff = highlightDiff && new Set(allValues).size > 1;
                        return (
                          <div
                            key={p._id}
                            className={`p-4 px-6 ${
                              isDiff ? "bg-amber-50/40 text-amber-900" : ""
                            }`}
                          >
                            {f.format(val, p)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Section: Amenities */}
          <div className="bg-[#FFFDF8] border-y border-[#ECE7DB] p-4 px-6 text-left">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#9A720C]">
              Amenities
            </h2>
          </div>
          <div className="divide-y divide-[#ECE7DB]">
            {allAmenities.length > 0 ? (
              allAmenities.map((amenity, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center text-left">
                  <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                    {amenity}
                  </div>
                  <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-bold text-xs">
                    {activeProperties.map((p) => {
                      const hasAmenity = p.amenities?.includes(amenity);
                      return (
                        <div
                          key={p._id}
                          className={`p-4 px-6 flex items-center gap-2 ${
                            hasAmenity ? "text-green-700" : "text-gray-400"
                          }`}
                        >
                          <span className="text-base">{hasAmenity ? "✓" : "✕"}</span>
                          <span className="font-semibold">{hasAmenity ? "Available" : "Not Available"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-gray-400 italic">
                No amenities registered for comparison.
              </div>
            )}
          </div>

          {/* Section: Market Insight */}
          <div className="bg-[#FFFDF8] border-y border-[#ECE7DB] p-4 px-6 text-left">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#9A720C]">
              Market Insight
            </h2>
          </div>
          <div className="divide-y divide-[#ECE7DB]">
            <div className="grid grid-cols-12 items-center text-left">
              <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                Locality Price Index
              </div>
              <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-semibold text-xs text-gray-900">
                {activeProperties.map((p) => {
                  const indexPrice = p.marketInsight?.averageLocalityPrice;
                  return (
                    <div key={p._id} className="p-4 px-6">
                      {indexPrice ? `₹${indexPrice.toLocaleString("en-IN")}/sq ft` : "Market insight unavailable"}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center text-left">
              <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                Estimated Value
              </div>
              <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-semibold text-xs text-gray-900">
                {activeProperties.map((p) => {
                  const est = p.marketInsight?.estimatedPropertyValue;
                  return (
                    <div key={p._id} className="p-4 px-6">
                      {est ? `₹${est.toLocaleString("en-IN")}` : "Market insight unavailable"}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center text-left">
              <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                Confidence Level
              </div>
              <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-semibold text-xs text-gray-900">
                {activeProperties.map((p) => {
                  const confidence = p.marketInsight?.confidence;
                  return (
                    <div key={p._id} className="p-4 px-6">
                      {confidence ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                          {confidence}
                        </span>
                      ) : (
                        "Market insight unavailable"
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Documents */}
          <div className="bg-[#FFFDF8] border-y border-[#ECE7DB] p-4 px-6 text-left">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#9A720C]">
              Documents Status
            </h2>
          </div>
          <div className="divide-y divide-[#ECE7DB]">
            <div className="grid grid-cols-12 items-center text-left">
              <div className="col-span-3 bg-gray-50/50 p-4 px-6 font-bold text-xs text-gray-700 border-r border-[#ECE7DB]">
                Verification Status
              </div>
              <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 divide-x divide-[#ECE7DB] font-bold text-xs">
                {activeProperties.map((p) => (
                  <div
                    key={p._id}
                    className={`p-4 px-6 flex items-center gap-1.5 ${
                      p.documentsAvailable ? "text-green-700" : "text-gray-400"
                    }`}
                  >
                    <span>{p.documentsAvailable ? "✓" : "✕"}</span>
                    <span>{p.documentsAvailable ? "Documents Available" : "No Documents Available"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stacked Vertical Comparison Cards */}
        <div className="md:hidden space-y-6">
          {activeProperties.map((p) => {
            const image = p.photos?.[0]
              ? (p.photos[0].startsWith("http")
                ? p.photos[0]
                : `http://localhost:5000/uploads/properties/${p.photos[0].replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "")}`)
              : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
            
            const fields = getCompareFields(p.propertyType, (p as any).commercialType);
            const scoreData = matchScores[p._id];

            return (
              <div key={p._id} className="bg-white border border-[#ECE7DB] rounded-3xl p-6 shadow-md space-y-4 text-left">
                {/* Header card with image & title */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#ECE7DB] bg-gray-100">
                  <img src={image} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemove(p._id)}
                    className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-gray-405 hover:text-red-500 shadow-sm transition-colors cursor-pointer border border-[#ECE7DB]"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 bg-[#FFF9EC] border border-[#F4E3B5] text-[10px] font-bold text-[#9A720C] rounded-full uppercase">
                    {p.propertyType}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base leading-snug">
                    {p.bedrooms ? `${p.bedrooms} BHK ` : ""}
                    {p.propertyType} in {p.locality || p.city}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">
                    {p.locality ? `${p.locality}, ` : ""}{p.city}
                  </p>
                  <h4 className="text-xl font-bold text-[#9A720C] pt-1">
                    ₹{p.price?.toLocaleString("en-IN")}
                  </h4>
                </div>

                {/* Match Score */}
                {scoreData && (
                  <div className="bg-[#FFFDF6] border border-[#F4E3B5] rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Match Compatibility</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        scoreData.score >= 90 ? "bg-green-50 text-green-700 border border-green-200" :
                        scoreData.score >= 75 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        scoreData.score >= 60 ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                        scoreData.score >= 40 ? "bg-amber-50 text-amber-700 border border-[#FFF9EC]" :
                        "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {scoreData.score}% Match
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          scoreData.score >= 90 ? "bg-green-500" :
                          scoreData.score >= 75 ? "bg-emerald-500" :
                          scoreData.score >= 60 ? "bg-yellow-500" :
                          scoreData.score >= 40 ? "bg-amber-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${scoreData.score}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {scoreData.matchedReasons.map((det: string, i: number) => (
                        <span key={i} className="text-[9px] font-semibold text-green-700 bg-green-50/70 border border-green-100 rounded-md px-1.5 py-0.5">
                          ✓ {det}
                        </span>
                      ))}
                      {scoreData.mismatchedReasons.map((det: string, i: number) => (
                        <span key={i} className="text-[9px] font-semibold text-red-700 bg-red-50/70 border border-red-100 rounded-md px-1.5 py-0.5">
                          ✕ {det}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attributes Grid */}
                <div className="divide-y divide-[#ECE7DB]/60 text-xs font-semibold text-gray-705">
                  <div className="py-2.5 flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Purpose</span><span className="text-gray-900 font-bold">{p.purpose}</span></div>
                  {fields.map((f: any) => {
                    const rawVal = p[f.key as keyof Property];
                    const displayVal = f.format(rawVal, p);
                    return (
                      <div key={f.label} className="py-2.5 flex justify-between">
                        <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">{f.label}</span>
                        <span className="text-gray-900 font-bold">{displayVal}</span>
                      </div>
                    );
                  })}
                  {p.amenities && p.amenities.length > 0 && (
                    <div className="py-2.5 space-y-1.5">
                      <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Amenities</span>
                      <div className="flex flex-wrap gap-1">
                        {p.amenities.map((a: string) => (
                          <span key={a} className="bg-gray-100 text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-gray-200">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#ECE7DB]/80 flex gap-3">
                  <button
                    onClick={() => router.push(`/property-detail/${p._id}`)}
                    className="flex-1 h-10 rounded-xl bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center animate-none"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleRemove(p._id)}
                    className="h-10 px-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Eyva's Recommendation Section */}
        {activeProperties.length >= 2 && (
          <div className="mt-10 bg-gradient-to-br from-[#FFFDF6] via-white to-[#FFF9EC] border border-[#E8DCC1] rounded-3xl p-5 sm:p-8 shadow-md text-left space-y-7">
            {/* 1. EYVA HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DCC1]/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    Eyva’s Recommendation
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Personalized insights from Eyva
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-[#9A720C] font-bold bg-[#FFF9EC] border border-[#F4E3B5] px-3 py-1.5 rounded-full w-fit shrink-0">
                Personalized Advisor
              </div>
            </div>

            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-xs font-semibold text-gray-500">
                <Loader2 size={24} className="animate-spin text-[#9A720C]" />
                <p>Analyzing property attributes, locality rates, and facilities...</p>
              </div>
            ) : aiInsights ? (
              (() => {
                // Find recommended property dynamically
                const prices = activeProperties.map((p) => p.price || Infinity);
                const minPrice = Math.min(...prices);

                const areas = activeProperties.map((p) => p.area || p.plotArea || 0);
                const maxArea = Math.max(...areas);

                const recommendedProp = activeProperties.reduce((best, p) => {
                  const bestScore = matchScores[best._id]?.score || 0;
                  const pScore = matchScores[p._id]?.score || 0;
                  if (pScore > bestScore) return p;
                  if (pScore === bestScore) {
                    const bestArea = best.area || best.plotArea || 1;
                    const pArea = p.area || p.plotArea || 1;
                    const bestRate = (best.price || Infinity) / bestArea;
                    const pRate = (p.price || Infinity) / pArea;
                    return pRate < bestRate ? p : best;
                  }
                  return best;
                }, activeProperties[0]);

                const recTitle = `${recommendedProp.bedrooms ? `${recommendedProp.bedrooms} BHK ` : ""}${recommendedProp.propertyType} in ${recommendedProp.locality || recommendedProp.city}`;
                const recPrice = `₹${recommendedProp.price?.toLocaleString("en-IN")}`;
                const recAreaVal = recommendedProp.area || recommendedProp.plotArea;
                const recArea = recAreaVal ? `${recAreaVal.toLocaleString("en-IN")} sq ft` : "N/A";

                const recPros = aiInsights.prosCons?.[recommendedProp._id]?.pros || [];

                return (
                  <div className="space-y-8">
                    {/* 2. EYVA RECOMMENDATION CARD */}
                    <div className="bg-gradient-to-r from-[#FFFDF5] via-[#FFF9EC] to-white border-2 border-[#9A720C]/30 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#9A720C]/5 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                        <div className="space-y-3 flex-1">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#9A720C] text-white text-[10px] sm:text-xs font-bold tracking-wider rounded-full uppercase shadow-2xs">
                            <Sparkles size={13} />
                            EYVA RECOMMENDS
                          </div>

                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                              {recTitle}
                            </h3>
                            <div className="text-base sm:text-lg font-bold text-[#9A720C] mt-1">
                              {recPrice} <span className="text-gray-400 font-normal text-sm">· {recArea}</span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-semibold bg-white/80 p-3 rounded-xl border border-[#E8DCC1]/60">
                            {aiInsights.summary || "Best overall value among the compared properties."}
                          </p>
                        </div>

                        {/* 3. WHY THIS PROPERTY? */}
                        <div className="w-full md:w-72 bg-white border border-[#E8DCC1] rounded-xl p-4 shrink-0 shadow-2xs space-y-2.5">
                          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="text-[#9A720C]">Why This Property?</span>
                          </h4>

                          <ul className="space-y-2">
                            {recommendedProp.price === minPrice && (
                              <li className="text-xs text-gray-700 font-medium flex items-start gap-1.5 leading-snug">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span>Lowest price among options compared</span>
                              </li>
                            )}
                            {recAreaVal === maxArea && (
                              <li className="text-xs text-gray-700 font-medium flex items-start gap-1.5 leading-snug">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span>Largest available space ({recArea})</span>
                              </li>
                            )}
                            {recPros.slice(0, 3).map((pro: string, idx: number) => (
                              <li key={idx} className="text-xs text-gray-700 font-medium flex items-start gap-1.5 leading-snug">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                            {recPros.length === 0 && recommendedProp.price !== minPrice && recAreaVal !== maxArea && (
                              <li className="text-xs text-gray-700 font-medium flex items-start gap-1.5 leading-snug">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span>Balanced price and facility package</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 4. EYVA'S COMPARISON MATRIX TABLE */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                        EYVA’S COMPARISON
                      </h4>

                      <div className="bg-white border border-[#ECE7DB] rounded-2xl overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-[#FAF8F5] border-b border-[#ECE7DB]">
                                <th className="p-3.5 font-bold text-gray-600 w-36 sm:w-44">Attribute</th>
                                {activeProperties.map((p) => {
                                  const isRec = p._id === recommendedProp._id;
                                  return (
                                    <th key={p._id} className={`p-3.5 font-bold min-w-[160px] ${isRec ? "bg-[#FFF9EC]/80 text-[#9A720C]" : "text-gray-800"}`}>
                                      <div className="flex items-center gap-1.5">
                                        <span className="line-clamp-1">{p.bedrooms ? `${p.bedrooms} BHK ` : ""}{p.propertyType}</span>
                                        {isRec && (
                                          <span className="text-[9px] bg-[#9A720C] text-white px-1.5 py-0.5 rounded font-bold uppercase shrink-0">Top Pick</span>
                                        )}
                                      </div>
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F2EC] text-gray-700 font-medium">
                              {/* Row: Price */}
                              <tr>
                                <td className="p-3.5 font-bold text-gray-500 bg-[#FAF8F5]/50">Price</td>
                                {activeProperties.map((p) => {
                                  const isCheapest = p.price === minPrice;
                                  return (
                                    <td key={p._id} className="p-3.5 font-bold text-gray-900">
                                      <span>₹{p.price?.toLocaleString("en-IN")}</span>
                                      {isCheapest && (
                                        <span className="ml-2 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                          Best Price
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>

                              {/* Row: Area */}
                              <tr>
                                <td className="p-3.5 font-bold text-gray-500 bg-[#FAF8F5]/50">Area</td>
                                {activeProperties.map((p) => {
                                  const areaVal = p.area || p.plotArea || 0;
                                  const isLargest = areaVal === maxArea && maxArea > 0;
                                  return (
                                    <td key={p._id} className="p-3.5">
                                      <span>{areaVal ? `${areaVal.toLocaleString("en-IN")} sq ft` : "N/A"}</span>
                                      {isLargest && (
                                        <span className="ml-2 text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                          Largest Space
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>

                              {/* Row: Property Type */}
                              <tr>
                                <td className="p-3.5 font-bold text-gray-500 bg-[#FAF8F5]/50">Type</td>
                                {activeProperties.map((p) => (
                                  <td key={p._id} className="p-3.5">
                                    {p.propertyType}
                                  </td>
                                ))}
                              </tr>

                              {/* Row: Facilities / Amenities */}
                              <tr>
                                <td className="p-3.5 font-bold text-gray-500 bg-[#FAF8F5]/50">Facilities</td>
                                {activeProperties.map((p) => {
                                  const count = p.amenities?.length || 0;
                                  return (
                                    <td key={p._id} className="p-3.5">
                                      {count > 0 ? `${count} Amenities Listed` : "Standard Facilities"}
                                    </td>
                                  );
                                })}
                              </tr>

                              {/* Row: Locality */}
                              <tr>
                                <td className="p-3.5 font-bold text-gray-500 bg-[#FAF8F5]/50">Locality</td>
                                {activeProperties.map((p) => (
                                  <td key={p._id} className="p-3.5">
                                    {p.locality || p.city}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* 5. EYVA'S VERDICT & VALUE ASSESSMENT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      {/* Value Assessment */}
                      <div className="bg-white border border-[#ECE7DB] rounded-2xl p-5 shadow-2xs space-y-2">
                        <h4 className="text-xs font-black text-[#9A720C] uppercase tracking-widest flex items-center gap-1.5">
                          VALUE ASSESSMENT
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold">
                          {aiInsights.valueAnalysis || "Both properties offer distinct trade-offs between pricing, space, and community amenities."}
                        </p>
                      </div>

                      {/* Eyva's Verdict */}
                      <div className="bg-gradient-to-br from-[#FFFDF6] to-white border border-[#E8DCC1] rounded-2xl p-5 shadow-2xs space-y-2">
                        <h4 className="text-xs font-black text-[#9A720C] uppercase tracking-widest flex items-center gap-1.5">
                          EYVA’S VERDICT
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-semibold">
                          {aiInsights.recommendation || "Evaluate space requirements against your target budget to make the optimal decision."}
                        </p>
                      </div>
                    </div>

                    {/* 6. CONSIDERATIONS (THINGS TO CONSIDER) */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                          Things to Consider
                        </h4>
                        <span className="text-[10px] text-gray-400 font-semibold">Limitations & Highlights per Property</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {activeProperties.map((p) => {
                          const prosCons = aiInsights.prosCons?.[p._id] || { pros: [], cons: [] };
                          return (
                            <div key={p._id} className="bg-white border border-[#ECE7DB] rounded-2xl p-4 shadow-2xs space-y-3">
                              <div className="border-b border-[#F5F2EC] pb-2 flex items-center justify-between gap-2">
                                <h5 className="font-bold text-gray-900 text-xs truncate">
                                  {p.bedrooms ? `${p.bedrooms} BHK ` : ""}{p.propertyType}
                                </h5>
                                <span className="text-[9px] font-bold text-gray-400 shrink-0">
                                  {p.locality || p.city}
                                </span>
                              </div>

                              {/* Limitations / Cons */}
                              <div className="space-y-1.5">
                                {prosCons.cons && prosCons.cons.length > 0 ? (
                                  prosCons.cons.map((con: string, idx: number) => (
                                    <div key={idx} className="text-xs text-gray-600 flex items-start gap-1.5 leading-snug">
                                      <span className="text-amber-500 font-bold shrink-0">⚠️</span>
                                      <span>{con}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-xs text-gray-400 italic flex items-center gap-1.5">
                                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                                    <span>No major limitations noted.</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="py-8 text-center bg-white border border-[#ECE7DB] rounded-2xl p-6 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#FFF9EC] border border-[#F4E3B5] text-[#9A720C] flex items-center justify-center mx-auto">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Eyva’s insights are currently unavailable.</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Compare the property details above to make your decision.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col font-sans">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
          </div>
          <Footer />
        </div>
      }
    >
      <ComparisonContent />
    </Suspense>
  );
}
