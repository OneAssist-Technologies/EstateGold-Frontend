"use client";

import {
  BedDouble,
  Bath,
  Building2,
  Home,
  Sofa,
  Car,
  Layers3,
  Ruler,
  Compass,
  Calendar,
  Sparkles,
  DollarSign,
  FileText,
  MapPin,
  User,
  ShieldCheck,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function PropertyFeatures({ property }: Props) {
  const propertyType = property.propertyType || "Apartment / Flat";
  let features: { icon: any; title: string; value: string }[] = [];

  switch (propertyType) {
    case "Apartment / Flat":
    case "Builder Floor":
      features = [
        { icon: <BedDouble size={16} />, title: "Bedrooms", value: property.bedrooms ? `${property.bedrooms} BHK` : "N/A" },
        { icon: <Bath size={16} />, title: "Bathrooms", value: property.bathrooms ? `${property.bathrooms} Bath` : "N/A" },
        { icon: <Layers3 size={16} />, title: "Balconies", value: property.balconies !== undefined ? `${property.balconies} Balconies` : "N/A" },
        { icon: <Ruler size={16} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Carpet Area", value: (property as any).carpetArea ? `${(property as any).carpetArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Super Area", value: (property as any).superArea ? `${(property as any).superArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Building2 size={16} />, title: "Floor", value: property.floor !== undefined ? `${property.floor} of ${(property as any).totalFloors || 'N/A'}` : "N/A" },
        { icon: <Sofa size={16} />, title: "Furnishing", value: property.furnishing || "N/A" },
        { icon: <Car size={16} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <Compass size={16} />, title: "Facing", value: property.facing || "N/A" },
        { icon: <Calendar size={16} />, title: "Age", value: (property as any).propertyAge || "N/A" },
        { icon: <Building2 size={16} />, title: "Society", value: (property as any).society || "N/A" },
        { icon: <Building2 size={16} />, title: "Units", value: (property as any).numberOfUnits ? String((property as any).numberOfUnits) : "N/A" },
      ];
      break;

    case "Independent House":
    case "Villa":
      features = [
        { icon: <BedDouble size={16} />, title: "Bedrooms", value: property.bedrooms ? `${property.bedrooms} BHK` : "N/A" },
        { icon: <Bath size={16} />, title: "Bathrooms", value: property.bathrooms ? `${property.bathrooms} Bath` : "N/A" },
        { icon: <Ruler size={16} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Plot Area", value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Dimensions", value: (property as any).length && (property as any).width ? `${(property as any).length} × ${(property as any).width} ft` : "N/A" },
        { icon: <Building2 size={16} />, title: "Total Floors", value: (property as any).totalFloors ? `${(property as any).totalFloors} Floors` : "N/A" },
        { icon: <Sofa size={16} />, title: "Furnishing", value: property.furnishing || "N/A" },
        { icon: <Car size={16} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <Compass size={16} />, title: "Facing", value: property.facing || "N/A" },
        { icon: <Calendar size={16} />, title: "Age", value: (property as any).propertyAge || "N/A" },
        { icon: <Building2 size={16} />, title: "Gated Community", value: (property as any).community || "N/A" },
      ];
      break;

    case "Plot / Land":
    case "Residential Plot":
      features = [
        { icon: <Ruler size={16} />, title: "Plot Area", value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Compass size={16} />, title: "Facing", value: property.facing || (property as any).plotFacing || "N/A" },
        { icon: <Ruler size={16} />, title: "Dimensions", value: (property as any).length && (property as any).width ? `${(property as any).length} × ${(property as any).width} ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Frontage", value: (property as any).frontage ? `${(property as any).frontage} ft` : "N/A" },
        { icon: <Compass size={16} />, title: "Corner Plot", value: (property as any).cornerPlot ? "Yes" : "No" },
        { icon: <Building2 size={16} />, title: "Boundary Wall", value: (property as any).boundaryWall ? "Yes" : "No" },
        { icon: <Building2 size={16} />, title: "Plot Type", value: (property as any).plotType || "N/A" },
        { icon: <Building2 size={16} />, title: "Land Approval", value: (property as any).landApproval || "N/A" },
        { icon: <Building2 size={16} />, title: "Layout Name", value: (property as any).layoutName || "N/A" },
        { icon: <Building2 size={16} />, title: "Gated Layout", value: (property as any).gatedLayout ? "Yes" : "No" },
      ];
      break;

    case "Agricultural Land":
      features = [
        { icon: <Ruler size={16} />, title: "Land Area", value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <DollarSign size={16} />, title: "Price/Acre", value: (property as any).pricePerAcre ? `₹${(property as any).pricePerAcre.toLocaleString("en-IN")}` : "N/A" },
        { icon: <FileText size={16} />, title: "Survey No.", value: (property as any).surveyNumber || "N/A" },
        { icon: <MapPin size={16} />, title: "Village", value: (property as any).society || "N/A" },
        { icon: <MapPin size={16} />, title: "Taluk", value: (property as any).taluk || "N/A" },
        { icon: <Compass size={16} />, title: "Facing", value: property.facing || "N/A" },
        { icon: <Ruler size={16} />, title: "Dimensions", value: (property as any).length && (property as any).width ? `${(property as any).length} × ${(property as any).width} ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Road Access", value: (property as any).roadAccess || "N/A" },
        { icon: <Ruler size={16} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Sparkles size={16} />, title: "Crops", value: (property as any).crops || "N/A" },
        { icon: <Sparkles size={16} />, title: "Soil Type", value: (property as any).soilType || "N/A" },
        { icon: <Building2 size={16} />, title: "Farmhouse", value: (property as any).farmhouse ? "Yes" : "No" },
        { icon: <Building2 size={16} />, title: "Fenced", value: (property as any).boundaryWall ? "Yes" : "No" },
      ];
      break;

    case "Commercial Space":
    case "Office Space":
      features = [
        { icon: <Building2 size={16} />, title: "Commercial Type", value: (property as any).commercialType || "N/A" },
        { icon: <Ruler size={16} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Carpet Area", value: (property as any).carpetArea ? `${(property as any).carpetArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Building2 size={16} />, title: "Floor", value: property.floor !== undefined ? `${property.floor} of ${(property as any).totalFloors || 'N/A'}` : "N/A" },
        { icon: <Bath size={16} />, title: "Washrooms", value: (property as any).washrooms !== undefined ? `${(property as any).washrooms} Washrooms` : "N/A" },
        { icon: <Car size={16} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <Ruler size={16} />, title: "Entrance Width", value: (property as any).entranceWidth ? `${(property as any).entranceWidth} ft` : "N/A" },
        { icon: <Sparkles size={16} />, title: "Power Load", value: (property as any).powerLoad ? `${(property as any).powerLoad} kW` : "N/A" },
        { icon: <Calendar size={16} />, title: "Age", value: (property as any).propertyAge || "N/A" },
        { icon: <Compass size={16} />, title: "Facing", value: property.facing || "N/A" },
        { icon: <Sofa size={16} />, title: "Furnishing", value: property.furnishing || "N/A" },
        { icon: <Building2 size={16} />, title: "Workstations", value: (property as any).workstations ? String((property as any).workstations) : "N/A" },
        { icon: <Building2 size={16} />, title: "Cabins", value: (property as any).cabins ? String((property as any).cabins) : "N/A" },
        { icon: <Building2 size={16} />, title: "Meeting Rooms", value: (property as any).meetingRooms ? String((property as any).meetingRooms) : "N/A" },
      ];
      break;

    case "Shop / Retail":
      features = [
        { icon: <Ruler size={16} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Carpet Area", value: (property as any).carpetArea ? `${(property as any).carpetArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Building2 size={16} />, title: "Floor", value: property.floor !== undefined ? `${property.floor} of ${(property as any).totalFloors || 'N/A'}` : "N/A" },
        { icon: <Ruler size={16} />, title: "Frontage", value: (property as any).frontage ? `${(property as any).frontage} ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Ceiling Height", value: (property as any).ceilingHeight ? `${(property as any).ceilingHeight} ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Compass size={16} />, title: "Main-road Facing", value: (property as any).mainRoadFacing ? "Yes" : "No" },
        { icon: <Compass size={16} />, title: "Corner Shop", value: (property as any).cornerShop ? "Yes" : "No" },
        { icon: <Building2 size={16} />, title: "Shutters", value: (property as any).shutters ? String((property as any).shutters) : "N/A" },
        { icon: <Car size={16} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <User size={16} />, title: "Footfall", value: (property as any).footfallEstimate || "N/A" },
        { icon: <Sparkles size={16} />, title: "Suitable For", value: (property as any).suitableBusiness || "N/A" },
      ];
      break;

    case "Warehouse":
      features = [
        { icon: <Ruler size={16} />, title: "Warehouse Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Ceiling Height", value: (property as any).ceilingHeight ? `${(property as any).ceilingHeight} ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Office Area", value: (property as any).officeArea ? `${(property as any).officeArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Car size={16} />, title: "Truck Access", value: (property as any).truckAccess || "N/A" },
        { icon: <Ruler size={16} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Sparkles size={16} />, title: "Power Capacity", value: (property as any).powerLoad ? `${(property as any).powerLoad} kW` : "N/A" },
        { icon: <Sparkles size={16} />, title: "Flooring", value: (property as any).flooring || "N/A" },
        { icon: <Sparkles size={16} />, title: "Storage", value: (property as any).storageCapacity || "N/A" },
        { icon: <Car size={16} />, title: "Loading Bays", value: (property as any).loadingUnloading ? "Yes" : "No" },
        { icon: <Building2 size={16} />, title: "Dock Levelers", value: (property as any).dock ? "Yes" : "No" },
        { icon: <Car size={16} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
      ];
      break;

    case "Industrial Property":
      features = [
        { icon: <Building2 size={16} />, title: "Industrial Type", value: (property as any).industrialType || "N/A" },
        { icon: <Ruler size={16} />, title: "Factory Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <Ruler size={16} />, title: "Production Area", value: (property as any).productionArea ? `${(property as any).productionArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Sparkles size={16} />, title: "Power Load", value: (property as any).powerLoad ? `${(property as any).powerLoad} kW` : "N/A" },
        { icon: <Car size={16} />, title: "Loading Bays", value: (property as any).loadingUnloading ? "Yes" : "No" },
        { icon: <Ruler size={16} />, title: "Road Width", value: (property as any).roadWidth ? `${(property as any).roadWidth} ft` : "N/A" },
        { icon: <Car size={16} />, title: "Parking", value: property.parking ? "Available" : "Not Available" },
        { icon: <ShieldCheck size={16} />, title: "Pollution Status", value: (property as any).pollutionCompliance || "N/A" },
        { icon: <Building2 size={16} />, title: "Zoning", value: (property as any).zoning || "N/A" },
        { icon: <Sparkles size={16} />, title: "Machinery Inc.", value: (property as any).machineryIncluded ? "Yes" : "No" },
      ];
      break;

    case "Hotel / Resort":
      features = [
        { icon: <Ruler size={16} />, title: "Built-up Area", value: property.area ? `${property.area.toLocaleString()} sq ft` : "N/A" },
        { icon: <BedDouble size={16} />, title: "Rooms Count", value: (property as any).numberOfRooms ? String((property as any).numberOfRooms) : "N/A" },
        { icon: <BedDouble size={16} />, title: "Room Types", value: (property as any).roomTypes || "N/A" },
        { icon: <Building2 size={16} />, title: "Floors Count", value: (property as any).totalFloors ? String((property as any).totalFloors) : "N/A" },
        { icon: <User size={16} />, title: "Occupancy Rate", value: (property as any).occupancy || "N/A" },
        { icon: <DollarSign size={16} />, title: "Annual Revenue", value: (property as any).revenue ? `₹${(property as any).revenue.toLocaleString("en-IN")}` : "N/A" },
      ];
      break;

    case "PG / Hostel":
      features = [
        { icon: <User size={16} />, title: "Gender Allowed", value: (property as any).genderType || "N/A" },
        { icon: <Building2 size={16} />, title: "Total Rooms", value: (property as any).numberOfRooms ? String((property as any).numberOfRooms) : "N/A" },
        { icon: <BedDouble size={16} />, title: "Total Beds", value: (property as any).totalBeds ? String((property as any).totalBeds) : "N/A" },
        { icon: <BedDouble size={16} />, title: "Available Beds", value: (property as any).availableBeds ? String((property as any).availableBeds) : "N/A" },
        { icon: <DollarSign size={16} />, title: "Rent per Bed", value: (property as any).rentPerBed ? `₹${(property as any).rentPerBed.toLocaleString("en-IN")}/mo` : "N/A" },
        { icon: <DollarSign size={16} />, title: "Security Deposit", value: (property as any).deposit ? `₹${(property as any).deposit.toLocaleString("en-IN")}` : "N/A" },
        { icon: <ShieldCheck size={16} />, title: "Rules / Curfew", value: (property as any).rules || "N/A" },
      ];
      break;

    case "Builder / New Project":
      features = [
        { icon: <Building2 size={16} />, title: "Project Name", value: (property as any).projectName || "N/A" },
        { icon: <Building2 size={16} />, title: "Developer Name", value: (property as any).community || "N/A" },
        { icon: <Building2 size={16} />, title: "Project Type", value: (property as any).commercialType || "N/A" },
        { icon: <Ruler size={16} />, title: "Land Area", value: (property as any).plotArea ? `${(property as any).plotArea.toLocaleString()} sq ft` : "N/A" },
        { icon: <Building2 size={16} />, title: "Towers Count", value: (property as any).towers ? String((property as any).towers) : "N/A" },
        { icon: <Building2 size={16} />, title: "Total Units", value: (property as any).totalUnits ? String((property as any).totalUnits) : "N/A" },
        { icon: <BedDouble size={16} />, title: "BHK Configurations", value: (property as any).bhkTypes || "N/A" },
        { icon: <Building2 size={16} />, title: "Project Status", value: (property as any).constructionStatus || "N/A" },
        { icon: <Calendar size={16} />, title: "Possession Date", value: (property as any).possessionDate ? new Date((property as any).possessionDate).toLocaleDateString() : "N/A" },
      ];
      break;

    default:
      features = [
        {
          icon: <Home size={16} />,
          title: "Type",
          value: property.propertyType || "N/A",
        },
        {
          icon: <Building2 size={16} />,
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
    <div className="py-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activeFeatures.map((item, index) => (
          <div
            key={index}
            className="bg-[#FFFDF6] border border-[#F4E3B5] rounded-xl p-3 flex items-center gap-3 transition-all hover:border-[#9A720C]"
          >
            <div className="h-8 w-8 rounded-lg bg-[#FFF9EC] text-[#9A720C] flex items-center justify-center shrink-0 border border-[#F4E3B5]">
              {item.icon}
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider leading-none">
                {item.title}
              </span>
              <span className="text-xs font-bold text-gray-900 block truncate mt-1">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}