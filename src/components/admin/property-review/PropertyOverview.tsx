"use client";

import {
  BedDouble,
  Bath,
  Ruler,
  Layers3,
  DoorOpen,
  Sofa,
  Car,
  MapPin,
  IndianRupee,
  Building2,
  Home,
  Compass,
  Calendar,
  Sparkles,
  DollarSign,
  FileText,
  User,
  ShieldCheck,
} from "lucide-react";

import { AdminProperty } from "@/src/types/adminProperty";

interface Props {
  property: AdminProperty;
}

export default function PropertySummary({
  property,
}: Props) {
  const propertyType = property.propertyType || "Apartment / Flat";
  let features: { icon: any; title: string; value: string }[] = [];

  switch (propertyType) {
    case "Apartment / Flat":
    case "Builder Floor":
      features = [
        { icon: <BedDouble size={17} />, title: "Bedrooms", value: property.bedrooms ? `${property.bedrooms} BHK` : "N/A" },
        { icon: <Bath size={17} />, title: "Bathrooms", value: property.bathrooms ? `${property.bathrooms} Bath` : "N/A" },
        { icon: <Layers3 size={17} />, title: "Balconies", value: property.balconies !== undefined ? `${property.balconies} Balconies` : "N/A" },
        { icon: <Ruler size={17} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Carpet Area", value: (property as any).carpetArea ? `${(property as any).carpetArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Building2 size={17} />, title: "Floor", value: property.floor !== undefined ? `${property.floor} of ${(property as any).totalFloors || 'N/A'}` : "N/A" },
        { icon: <Sofa size={17} />, title: "Furnishing", value: property.furnishing || "N/A" },
        { icon: <Car size={17} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <Compass size={17} />, title: "Facing", value: (property as any).facing || "N/A" },
        { icon: <Calendar size={17} />, title: "Age", value: (property as any).propertyAge || "N/A" },
        { icon: <Building2 size={17} />, title: "Society", value: (property as any).society || "N/A" },
        { icon: <Building2 size={17} />, title: "Units", value: (property as any).numberOfUnits ? String((property as any).numberOfUnits) : "N/A" },
      ];
      break;

    case "Independent House":
    case "Villa":
      features = [
        { icon: <BedDouble size={17} />, title: "Bedrooms", value: property.bedrooms ? `${property.bedrooms} BHK` : "N/A" },
        { icon: <Bath size={17} />, title: "Bathrooms", value: property.bathrooms ? `${property.bathrooms} Bath` : "N/A" },
        { icon: <Layers3 size={17} />, title: "Balconies", value: property.balconies !== undefined ? `${property.balconies} Balconies` : "N/A" },
        { icon: <Ruler size={17} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Plot Area", value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Dimensions", value: (property as any).length && (property as any).width ? `${(property as any).length} × ${(property as any).width} ft` : "N/A" },
        { icon: <Building2 size={17} />, title: "Total Floors", value: (property as any).totalFloors ? `${(property as any).totalFloors} Floors` : "N/A" },
        { icon: <Sofa size={17} />, title: "Furnishing", value: property.furnishing || "N/A" },
        { icon: <Car size={17} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <Compass size={17} />, title: "Facing", value: (property as any).facing || "N/A" },
        { icon: <Calendar size={17} />, title: "Age", value: (property as any).propertyAge || "N/A" },
        { icon: <Building2 size={17} />, title: "Gated Community", value: (property as any).community || "N/A" },
      ];
      break;

    case "Plot / Land":
    case "Residential Plot":
      features = [
        { icon: <Ruler size={17} />, title: "Plot Area", value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Compass size={17} />, title: "Facing", value: (property as any).facing || (property as any).plotFacing || "N/A" },
        { icon: <Ruler size={17} />, title: "Dimensions", value: (property as any).length && (property as any).width ? `${(property as any).length} × ${(property as any).width} ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Frontage", value: (property as any).frontage ? `${(property as any).frontage} ft` : "N/A" },
        { icon: <Compass size={17} />, title: "Corner Plot", value: (property as any).cornerPlot ? "Yes" : "No" },
        { icon: <Building2 size={17} />, title: "Boundary Wall", value: (property as any).boundaryWall ? "Yes" : "No" },
        { icon: <Building2 size={17} />, title: "Plot Type", value: (property as any).plotType || "N/A" },
        { icon: <Building2 size={17} />, title: "Land Approval", value: (property as any).landApproval || "N/A" },
        { icon: <Building2 size={17} />, title: "Layout Name", value: (property as any).layoutName || "N/A" },
        { icon: <Building2 size={17} />, title: "Gated Layout", value: (property as any).gatedLayout ? "Yes" : "No" },
      ];
      break;

    case "Agricultural Land":
      features = [
        { icon: <Ruler size={17} />, title: "Land Area", value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <DollarSign size={17} />, title: "Price/Acre", value: (property as any).pricePerAcre ? `₹${(property as any).pricePerAcre.toLocaleString("en-IN")}` : "N/A" },
        { icon: <FileText size={17} />, title: "Survey No.", value: (property as any).surveyNumber || "N/A" },
        { icon: <MapPin size={17} />, title: "Village", value: (property as any).society || "N/A" },
        { icon: <MapPin size={17} />, title: "Taluk", value: (property as any).taluk || "N/A" },
        { icon: <Compass size={17} />, title: "Facing", value: (property as any).facing || "N/A" },
        { icon: <Ruler size={17} />, title: "Dimensions", value: (property as any).length && (property as any).width ? `${(property as any).length} × ${(property as any).width} ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Road Access", value: (property as any).roadAccess || "N/A" },
        { icon: <Ruler size={17} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Sparkles size={17} />, title: "Crops", value: (property as any).crops || "N/A" },
        { icon: <Sparkles size={17} />, title: "Soil Type", value: (property as any).soilType || "N/A" },
        { icon: <Building2 size={17} />, title: "Farmhouse", value: (property as any).farmhouse ? "Yes" : "No" },
        { icon: <Building2 size={17} />, title: "Fenced", value: (property as any).boundaryWall ? "Yes" : "No" },
      ];
      break;

    case "Commercial Space":
    case "Office Space":
      features = [
        { icon: <Building2 size={17} />, title: "Commercial Type", value: (property as any).commercialType || "N/A" },
        { icon: <Ruler size={17} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Carpet Area", value: (property as any).carpetArea ? `${(property as any).carpetArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Building2 size={17} />, title: "Floor", value: property.floor !== undefined ? `${property.floor} of ${(property as any).totalFloors || 'N/A'}` : "N/A" },
        { icon: <Bath size={17} />, title: "Washrooms", value: (property as any).washrooms !== undefined ? `${(property as any).washrooms} Washrooms` : "N/A" },
        { icon: <Car size={17} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <Ruler size={17} />, title: "Entrance Width", value: (property as any).entranceWidth ? `${(property as any).entranceWidth} ft` : "N/A" },
        { icon: <Sparkles size={17} />, title: "Power Load", value: (property as any).powerLoad ? `${(property as any).powerLoad} kW` : "N/A" },
        { icon: <Calendar size={17} />, title: "Age", value: (property as any).propertyAge || "N/A" },
        { icon: <Compass size={17} />, title: "Facing", value: (property as any).facing || "N/A" },
        { icon: <Sofa size={17} />, title: "Furnishing", value: property.furnishing || "N/A" },
        { icon: <Building2 size={17} />, title: "Workstations", value: (property as any).workstations ? String((property as any).workstations) : "N/A" },
        { icon: <Building2 size={17} />, title: "Cabins", value: (property as any).cabins ? String((property as any).cabins) : "N/A" },
        { icon: <Building2 size={17} />, title: "Meeting Rooms", value: (property as any).meetingRooms ? String((property as any).meetingRooms) : "N/A" },
      ];
      break;

    case "Shop / Retail":
      features = [
        { icon: <Ruler size={17} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Carpet Area", value: (property as any).carpetArea ? `${(property as any).carpetArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Building2 size={17} />, title: "Floor", value: property.floor !== undefined ? `${property.floor} of ${(property as any).totalFloors || 'N/A'}` : "N/A" },
        { icon: <Ruler size={17} />, title: "Frontage", value: (property as any).frontage ? `${(property as any).frontage} ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Ceiling Height", value: (property as any).ceilingHeight ? `${(property as any).ceilingHeight} ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Compass size={17} />, title: "Main-road Facing", value: (property as any).mainRoadFacing ? "Yes" : "No" },
        { icon: <Compass size={17} />, title: "Corner Shop", value: (property as any).cornerShop ? "Yes" : "No" },
        { icon: <Building2 size={17} />, title: "Shutters", value: (property as any).shutters ? String((property as any).shutters) : "N/A" },
        { icon: <Car size={17} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <User size={17} />, title: "Footfall", value: (property as any).footfallEstimate || "N/A" },
        { icon: <Sparkles size={17} />, title: "Suitable For", value: (property as any).suitableBusiness || "N/A" },
      ];
      break;

    case "Warehouse":
      features = [
        { icon: <Ruler size={17} />, title: "Warehouse Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Ceiling Height", value: (property as any).ceilingHeight ? `${(property as any).ceilingHeight} ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Office Area", value: (property as any).officeArea ? `${(property as any).officeArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Car size={17} />, title: "Truck Access", value: (property as any).truckAccess || "N/A" },
        { icon: <Ruler size={17} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Sparkles size={17} />, title: "Power Capacity", value: (property as any).powerLoad ? `${(property as any).powerLoad} kW` : "N/A" },
        { icon: <Sparkles size={17} />, title: "Flooring", value: (property as any).flooring || "N/A" },
        { icon: <Sparkles size={17} />, title: "Storage", value: (property as any).storageCapacity || "N/A" },
        { icon: <Car size={17} />, title: "Loading Bays", value: (property as any).loadingUnloading ? "Yes" : "No" },
        { icon: <Building2 size={17} />, title: "Dock Levelers", value: (property as any).dock ? "Yes" : "No" },
        { icon: <Car size={17} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
      ];
      break;

    case "Industrial Property":
      features = [
        { icon: <Building2 size={17} />, title: "Industrial Type", value: (property as any).industrialType || "N/A" },
        { icon: <Ruler size={17} />, title: "Factory Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={17} />, title: "Production Area", value: (property as any).productionArea ? `${(property as any).productionArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Sparkles size={17} />, title: "Power Load", value: (property as any).powerLoad ? `${(property as any).powerLoad} kW` : "N/A" },
        { icon: <Car size={17} />, title: "Loading Bays", value: (property as any).loadingUnloading ? "Yes" : "No" },
        { icon: <Ruler size={17} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Car size={17} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <ShieldCheck size={17} />, title: "Pollution Status", value: (property as any).pollutionCompliance || "N/A" },
        { icon: <Building2 size={17} />, title: "Zoning", value: (property as any).zoning || "N/A" },
        { icon: <Sparkles size={17} />, title: "Machinery Inc.", value: (property as any).machineryIncluded ? "Yes" : "No" },
      ];
      break;

    case "Hotel / Resort":
      features = [
        { icon: <Ruler size={17} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <BedDouble size={17} />, title: "Rooms Count", value: (property as any).numberOfRooms ? String((property as any).numberOfRooms) : "N/A" },
        { icon: <BedDouble size={17} />, title: "Room Types", value: (property as any).roomTypes || "N/A" },
        { icon: <Building2 size={17} />, title: "Floors Count", value: (property as any).totalFloors ? String((property as any).totalFloors) : "N/A" },
        { icon: <User size={17} />, title: "Occupancy Rate", value: (property as any).occupancy || "N/A" },
        { icon: <DollarSign size={17} />, title: "Annual Revenue", value: (property as any).revenue ? `₹${(property as any).revenue.toLocaleString("en-IN")}` : "N/A" },
      ];
      break;

    case "PG / Hostel":
      features = [
        { icon: <User size={17} />, title: "Gender Allowed", value: (property as any).genderType || "N/A" },
        { icon: <Building2 size={17} />, title: "Total Rooms", value: (property as any).numberOfRooms ? String((property as any).numberOfRooms) : "N/A" },
        { icon: <BedDouble size={17} />, title: "Total Beds", value: (property as any).totalBeds ? String((property as any).totalBeds) : "N/A" },
        { icon: <BedDouble size={17} />, title: "Available Beds", value: (property as any).availableBeds ? String((property as any).availableBeds) : "N/A" },
        { icon: <DollarSign size={17} />, title: "Rent per Bed", value: (property as any).rentPerBed ? `₹${(property as any).rentPerBed.toLocaleString("en-IN")}/mo` : "N/A" },
        { icon: <DollarSign size={17} />, title: "Security Deposit", value: (property as any).deposit ? `₹${(property as any).deposit.toLocaleString("en-IN")}` : "N/A" },
        { icon: <ShieldCheck size={17} />, title: "Rules / Curfew", value: (property as any).rules || "N/A" },
      ];
      break;

    case "Builder / New Project":
      features = [
        { icon: <Building2 size={17} />, title: "Project Name", value: (property as any).projectName || "N/A" },
        { icon: <Building2 size={17} />, title: "Developer Name", value: (property as any).community || "N/A" },
        { icon: <Building2 size={17} />, title: "Project Type", value: (property as any).commercialType || "N/A" },
        { icon: <Ruler size={17} />, title: "Land Area", value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Building2 size={17} />, title: "Towers Count", value: (property as any).towers ? String((property as any).towers) : "N/A" },
        { icon: <Building2 size={17} />, title: "Total Units", value: (property as any).totalUnits ? String((property as any).totalUnits) : "N/A" },
        { icon: <BedDouble size={17} />, title: "BHK Configurations", value: (property as any).bhkTypes || "N/A" },
        { icon: <Building2 size={17} />, title: "Project Status", value: (property as any).constructionStatus || "N/A" },
        { icon: <Calendar size={17} />, title: "Possession Date", value: (property as any).possessionDate ? new Date((property as any).possessionDate).toLocaleDateString() : "N/A" },
      ];
      break;

    default:
      features = [
        {
          icon: <Home size={17} />,
          title: "Type",
          value: property.propertyType || "N/A",
        },
        {
          icon: <Building2 size={17} />,
          title: "Status",
          value: "Verified",
        },
      ];
      break;
  }

  const activeFeatures = features.filter((item) => {
    if (!item.value) return false;
    const lower = item.value.toLowerCase().trim();
    return lower !== "n/a" && lower !== "0" && lower !== "0 bath" && lower !== "0 bhk" && lower !== "0 balconies" && lower !== "not available";
  });

  return (
    <section className="mt-6">

      {/* Title */}

      <div className="flex items-start justify-between gap-6">

        <div>

          <h1
            className="text-3xl font-bold text-[#161616]"
          >
            {property.propertyType}
          </h1>

          <div
            className="mt-2 flex items-center gap-2 text-[15px] text-[#6B7280]"
          >
            <MapPin
              size={16}
              className="text-[#C89B1C]"
            />

            <span>
              {property.locality}
              {property.city && `, ${property.city}`}
            </span>

          </div>

        </div>

        <div
          className="flex items-center gap-1 text-[#C89B1C] shrink-0"
        >

          <IndianRupee size={22} />

          <h2
            className="text-3xl font-bold text-[#C89B1C]"
          >
            {property.price.toLocaleString()}
          </h2>

        </div>

      </div>

      {/* Overview */}

      <div className="mt-4 flex flex-wrap gap-3">
        {activeFeatures.map((item, index) => (
          <OverviewCard
            key={index}
            icon={item.icon}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>

      {/* Description */}

      <div className="mt-8">

        <h2
          className="text-2xl font-bold text-[#161616]"
        >
          Description
        </h2>

        <p
          className="mt-3 text-[15px] leading-7 text-gray-600"
        >
          {property.description ||
            "No description available."}
        </p>

      </div>

    </section>
  );
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function OverviewCard({
  icon,
  title,
  value,
}: CardProps) {
  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full border border-[#E7D8B6] bg-[#FFFDF8] px-4 py-2 hover:bg-[#FFF8EA] transition"
    >
      <div
        className="h-8 w-8 rounded-full bg-[#FFF3D8] text-[#C89B1C] flex items-center justify-center shrink-0"
      >
        {icon}
      </div>

      <div className="leading-tight">

        <p
          className="text-[10px] uppercase tracking-wide text-gray-500"
        >
          {title}
        </p>

        <p
          className="text-sm font-semibold text-[#161616] whitespace-nowrap"
        >
          {value}
        </p>

      </div>

    </div>
  );
}