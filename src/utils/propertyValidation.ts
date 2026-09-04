import { PropertyFormData } from "../types/property";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePan(pan: string): boolean {
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
  return re.test(pan);
}

export function validateAadhaar(aadhaar: string): boolean {
  const clean = aadhaar.replace(/\s/g, "");
  return /^\d{12}$/.test(clean);
}

export function getRequiredDocTypesForType(type: string): string[] {
  switch (type) {
    case "Apartment / Flat":
    case "Independent House":
    case "Villa":
    case "Builder Floor":
      return ["sale_deed", "parent_deeds", "encumbrance_certificate", "owner_kyc"];
    case "Plot / Land":
    case "Residential Plot":
    case "Agricultural Land":
      return ["sale_deed", "parent_deeds", "encumbrance_certificate", "patta_records", "owner_kyc"];
    case "Commercial Space":
    case "Office Space":
    case "Shop / Retail":
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
}

export function validatePropertyStep(
  stepId: string,
  formData: PropertyFormData
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const type = formData.propertyType;

  switch (stepId) {
    case "type":
      if (!formData.purpose) {
        errors.purpose = "Purpose is required.";
      }
      if (!formData.propertyType) {
        errors.propertyType = "Property Type is required.";
      }
      break;

    case "owner":
      if (!formData.ownerName || !formData.ownerName.trim()) {
        errors.ownerName = "Owner Full Name is required.";
      }
      if (!formData.ownerPhone || !formData.ownerPhone.trim()) {
        errors.ownerPhone = "Owner Phone Number is required.";
      } else if (!/^\d{10}$/.test(formData.ownerPhone.trim())) {
        errors.ownerPhone = "Phone Number must be exactly 10 digits.";
      }
      if (!formData.ownerEmail || !formData.ownerEmail.trim()) {
        errors.ownerEmail = "Owner Email is required.";
      } else if (!validateEmail(formData.ownerEmail.trim())) {
        errors.ownerEmail = "Please enter a valid email address.";
      }
      if (!formData.ownerAddress || !formData.ownerAddress.trim()) {
        errors.ownerAddress = "Owner Residential / Office Address is required.";
      }
      if (!formData.ownerIdType) {
        errors.ownerIdType = "ID Type is required.";
      }
      if (!formData.ownerIdNumber || !formData.ownerIdNumber.trim()) {
        errors.ownerIdNumber = "ID Number is required.";
      } else {
        const idType = formData.ownerIdType;
        const idNum = formData.ownerIdNumber.trim();
        if (idType === "Aadhaar Card" && !validateAadhaar(idNum)) {
          errors.ownerIdNumber = "Aadhaar Card must be exactly 12 digits.";
        } else if (idType === "PAN Card" && !validatePan(idNum)) {
          errors.ownerIdNumber = "PAN Card must be a valid 10-character alphanumeric PAN.";
        }
      }
      if (formData.listingType === "another_owner" && !formData.agentRelation) {
        errors.agentRelation = "Agent's Relation to Owner is required.";
      }
      break;

    case "location":
      if (!formData.state || !formData.state.trim()) {
        errors.state = "State is required.";
      }
      if (!formData.city || !formData.city.trim()) {
        errors.city = "City is required.";
      }
      if (!formData.locality || !formData.locality.trim()) {
        errors.locality = "Locality is required.";
      }
      if (!formData.address || !formData.address.trim()) {
        errors.address = "Full Address is required.";
      }
      
      const lat = parseFloat(String(formData.latitude));
      const lng = parseFloat(String(formData.longitude));
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.latitude = "Latitude must be between -90 and 90.";
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.longitude = "Longitude must be between -180 and 180.";
      }
      break;

    case "pg_details":
      if (!formData.pgDetails?.pgName || !formData.pgDetails.pgName.trim()) {
        errors.pgName = "PG / Co-Living Name is required.";
      }
      if (!formData.pgDetails?.suitableFor) {
        errors.suitableFor = "Please select who this accommodation is suitable for.";
      }
      break;

    case "pg_rooms":
      const rooms = formData.pgDetails?.rooms || [];
      if (rooms.length === 0) {
        errors.rooms = "Please add at least one room configuration.";
      } else {
        rooms.forEach((r, idx) => {
          if (!r.roomType) {
            errors[`room_${idx}`] = `Room #${idx + 1}: Sharing type is required.`;
          }
          if (!r.totalBeds || r.totalBeds <= 0) {
            errors[`room_${idx}`] = `Room #${idx + 1}: Total beds must be greater than 0.`;
          }
          if (r.occupiedBeds > r.totalBeds) {
            errors[`room_${idx}`] = `Room #${idx + 1}: Available beds cannot be negative / Occupied cannot exceed total.`;
          }
          if (!r.pricePerPerson || r.pricePerPerson <= 0) {
            errors[`room_${idx}`] = `Room #${idx + 1}: Price per person must be greater than ₹0.`;
          }
        });
      }
      break;

    case "details":
      const data = formData as any;
      
      if (type === "Apartment / Flat") {
        if (!data.bedrooms || Number(data.bedrooms) < 1) {
          errors.bedrooms = "Bedrooms/BHK is required.";
        }
        if (!data.bathrooms || Number(data.bathrooms) < 1) {
          errors.bathrooms = "Bathrooms is required.";
        }
        if (data.balconies === undefined || data.balconies === "") {
          errors.balconies = "Balconies is required.";
        }
        if (!data.facing) {
          errors.facing = "Facing Direction is required.";
        }
        if (!data.carpetArea || Number(data.carpetArea) <= 0) {
          errors.carpetArea = "Carpet Area is required.";
        }
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Built-up Area is required.";
        }

        if (data.floor === undefined || data.floor === "") {
          errors.floor = "Floor Number is required.";
        }
        if (data.totalFloors === undefined || data.totalFloors === "") {
          errors.totalFloors = "Total Floors is required.";
        }
        if (Number(data.floor) > Number(data.totalFloors)) {
          errors.floor = "Floor cannot exceed Total Floors.";
        }
        if (!data.propertyAge) {
          errors.propertyAge = "Property Age is required.";
        }
        if (!data.society || !data.society.trim()) {
          errors.society = "Society / Association Name is required.";
        }
        if (data.maintenance === undefined || data.maintenance === "") {
          errors.maintenance = "Monthly Maintenance is required.";
        }
        if (!data.furnishing) {
          errors.furnishing = "Furnishing Status is required.";
        }
      }

      else if (type === "Independent House") {
        if (!data.bedrooms || Number(data.bedrooms) < 1) {
          errors.bedrooms = "Bedrooms/BHK is required.";
        }
        if (!data.bathrooms || Number(data.bathrooms) < 1) {
          errors.bathrooms = "Bathrooms is required.";
        }
        if (data.balconies === undefined || data.balconies === "") {
          errors.balconies = "Balconies is required.";
        }
        if (!data.facing) {
          errors.facing = "Facing Direction is required.";
        }
        if (!data.plotArea || Number(data.plotArea) <= 0) {
          errors.plotArea = "Plot Area is required.";
        }
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Built-up Area is required.";
        }
        if (!data.carpetArea || Number(data.carpetArea) <= 0) {
          errors.carpetArea = "Carpet Area is required.";
        }
        if (!data.length || Number(data.length) <= 0) {
          errors.length = "Length is required.";
        }
        if (!data.width || Number(data.width) <= 0) {
          errors.width = "Width is required.";
        }
        if (!data.roadWidth || Number(data.roadWidth) <= 0) {
          errors.roadWidth = "Road Width is required.";
        }
        if (!data.frontage || Number(data.frontage) <= 0) {
          errors.frontage = "Frontage is required.";
        }
        if (!data.totalFloors || Number(data.totalFloors) <= 0) {
          errors.totalFloors = "Total Floors is required.";
        }
        if (!data.propertyAge) {
          errors.propertyAge = "Property Age is required.";
        }
        if (!data.furnishing) {
          errors.furnishing = "Furnishing Status is required.";
        }
      }

      else if (type === "Villa") {
        if (!data.bedrooms || Number(data.bedrooms) < 1) {
          errors.bedrooms = "Bedrooms/BHK is required.";
        }
        if (!data.bathrooms || Number(data.bathrooms) < 1) {
          errors.bathrooms = "Bathrooms is required.";
        }
        if (data.balconies === undefined || data.balconies === "") {
          errors.balconies = "Balconies is required.";
        }
        if (!data.facing) {
          errors.facing = "Facing Direction is required.";
        }
        if (!data.plotArea || Number(data.plotArea) <= 0) {
          errors.plotArea = "Plot Area is required.";
        }
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Built-up Area is required.";
        }
        if (!data.carpetArea || Number(data.carpetArea) <= 0) {
          errors.carpetArea = "Carpet Area is required.";
        }
        if (!data.totalFloors || Number(data.totalFloors) <= 0) {
          errors.totalFloors = "Total Floors is required.";
        }
        if (data.maintenance === undefined || data.maintenance === "") {
          errors.maintenance = "Monthly Maintenance is required.";
        }
        if (!data.propertyAge) {
          errors.propertyAge = "Property Age is required.";
        }
      }

      else if (type === "Builder Floor") {
        if (!data.bedrooms || Number(data.bedrooms) < 1) {
          errors.bedrooms = "Bedrooms/BHK is required.";
        }
        if (!data.bathrooms || Number(data.bathrooms) < 1) {
          errors.bathrooms = "Bathrooms is required.";
        }
        if (data.balconies === undefined || data.balconies === "") {
          errors.balconies = "Balconies is required.";
        }
        if (!data.facing) {
          errors.facing = "Facing Direction is required.";
        }
        if (!data.carpetArea || Number(data.carpetArea) <= 0) {
          errors.carpetArea = "Carpet Area is required.";
        }
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Built-up Area is required.";
        }
        if (data.floor === undefined || data.floor === "") {
          errors.floor = "Floor Number is required.";
        }
        if (data.totalFloors === undefined || data.totalFloors === "") {
          errors.totalFloors = "Total Floors is required.";
        }
        if (Number(data.floor) > Number(data.totalFloors)) {
          errors.floor = "Floor cannot exceed Total Floors.";
        }
        if (!data.numberOfUnits || Number(data.numberOfUnits) <= 0) {
          errors.numberOfUnits = "Number of Units is required.";
        }
        if (data.maintenance === undefined || data.maintenance === "") {
          errors.maintenance = "Monthly Maintenance is required.";
        }
        if (!data.propertyAge) {
          errors.propertyAge = "Floor Age is required.";
        }
        if (!data.furnishing) {
          errors.furnishing = "Furnishing Status is required.";
        }
        if (data.gatedLayout && (!data.society || !data.society.trim())) {
          errors.society = "Association Name is required for gated community.";
        }
      }

      else if (["Plot / Land", "Residential Plot"].includes(type)) {
        if (!data.plotArea || Number(data.plotArea) <= 0) {
          errors.plotArea = "Plot Area is required.";
        }
        if (!data.length || Number(data.length) <= 0) {
          errors.length = "Length is required.";
        }
        if (!data.width || Number(data.width) <= 0) {
          errors.width = "Width is required.";
        }
        if (!data.roadWidth || Number(data.roadWidth) <= 0) {
          errors.roadWidth = "Road Width is required.";
        }
        if (!data.frontage || Number(data.frontage) <= 0) {
          errors.frontage = "Frontage is required.";
        }
        if (!data.layoutName || !data.layoutName.trim()) {
          errors.layoutName = "Layout / Society Name is required.";
        }
        if (!data.surveyNumber || !data.surveyNumber.trim()) {
          errors.surveyNumber = "Survey Number is required.";
        }
        if (!data.subdivisionNumber || !data.subdivisionNumber.trim()) {
          errors.subdivisionNumber = "Subdivision / Patta Number is required.";
        }
        if (!data.gps || !data.gps.trim()) {
          errors.gps = "GPS Coordinates is required.";
        }
        if (!data.landApproval) {
          errors.landApproval = "Layout Approval Authority is required.";
        }
        if (!data.landClassification) {
          errors.landClassification = "Land Classification is required.";
        }
        if (!data.facing) {
          errors.facing = "Facing Direction is required.";
        }
      }

      else if (type === "Agricultural Land") {
        if (!data.plotArea || Number(data.plotArea) <= 0) {
          errors.plotArea = "Land Area is required.";
        }
        if (!data.pricePerAcre || Number(data.pricePerAcre) <= 0) {
          errors.pricePerAcre = "Price per Acre is required.";
        }
        if (!data.surveyNumber || !data.surveyNumber.trim()) {
          errors.surveyNumber = "Survey Number is required.";
        }
        if (!data.society || !data.society.trim()) {
          errors.society = "Village is required.";
        }
        if (!data.taluk || !data.taluk.trim()) {
          errors.taluk = "Taluk is required.";
        }
        if (!data.roadAccess || !data.roadAccess.trim()) {
          errors.roadAccess = "Road Access Type is required.";
        }
        if (!data.roadWidth || Number(data.roadWidth) <= 0) {
          errors.roadWidth = "Road Width is required.";
        }
        if (!data.crops || !data.crops.trim()) {
          errors.crops = "Crops Currently Cultivated is required.";
        }
        if (!data.soilType || !data.soilType.trim()) {
          errors.soilType = "Soil Type is required.";
        }
        if (!data.landClassification) {
          errors.landClassification = "Land Classification is required.";
        }
      }

      else if (type === "Commercial Space") {
        if (!data.commercialType) {
          errors.commercialType = "Commercial Type is required.";
        }
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Built-up Area is required.";
        }
        if (!data.carpetArea || Number(data.carpetArea) <= 0) {
          errors.carpetArea = "Carpet Area is required.";
        }
        if (data.floor === undefined || data.floor === "") {
          errors.floor = "Floor Number is required.";
        }
        if (data.totalFloors === undefined || data.totalFloors === "") {
          errors.totalFloors = "Total Floors is required.";
        }
        if (!data.workstations || Number(data.workstations) <= 0) {
          errors.workstations = "Number of Workstations is required.";
        }
        if (!data.cabins || Number(data.cabins) <= 0) {
          errors.cabins = "Number of Cabins is required.";
        }
        if (!data.meetingRooms || Number(data.meetingRooms) <= 0) {
          errors.meetingRooms = "Number of Meeting Rooms is required.";
        }
        if (!data.washrooms || Number(data.washrooms) <= 0) {
          errors.washrooms = "Number of Washrooms is required.";
        }
        if (data.maintenance === undefined || data.maintenance === "") {
          errors.maintenance = "Monthly Maintenance is required.";
        }
        if (!data.powerLoad || Number(data.powerLoad) <= 0) {
          errors.powerLoad = "Power Load Capacity is required.";
        }
        if (!data.furnishing) {
          errors.furnishing = "Furnished Status is required.";
        }
        if (!data.propertyAge) {
          errors.propertyAge = "Property Age is required.";
        }
        if (!data.facing) {
          errors.facing = "Facing Direction is required.";
        }
      }

      else if (type === "Office Space") {
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Built-up Area is required.";
        }
        if (!data.carpetArea || Number(data.carpetArea) <= 0) {
          errors.carpetArea = "Carpet Area is required.";
        }
        if (data.floor === undefined || data.floor === "") {
          errors.floor = "Floor Number is required.";
        }
        if (data.totalFloors === undefined || data.totalFloors === "") {
          errors.totalFloors = "Total Floors is required.";
        }
        if (!data.workstations || Number(data.workstations) <= 0) {
          errors.workstations = "Number of Workstations is required.";
        }
        if (!data.cabins || Number(data.cabins) <= 0) {
          errors.cabins = "Number of Cabins is required.";
        }
        if (!data.meetingRooms || Number(data.meetingRooms) <= 0) {
          errors.meetingRooms = "Number of Meeting Rooms is required.";
        }
        if (!data.washrooms || Number(data.washrooms) <= 0) {
          errors.washrooms = "Number of Washrooms is required.";
        }
        if (data.maintenance === undefined || data.maintenance === "") {
          errors.maintenance = "Monthly Maintenance is required.";
        }
        if (!data.powerLoad || Number(data.powerLoad) <= 0) {
          errors.powerLoad = "Power Load Capacity is required.";
        }
        if (!data.furnishing) {
          errors.furnishing = "Furnished Status is required.";
        }
        if (!data.propertyAge) {
          errors.propertyAge = "Property Age is required.";
        }
        if (!data.facing) {
          errors.facing = "Facing Direction is required.";
        }
      }

      else if (type === "Shop / Retail") {
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Built-up Area is required.";
        }
        if (!data.carpetArea || Number(data.carpetArea) <= 0) {
          errors.carpetArea = "Carpet Area is required.";
        }
        if (data.floor === undefined || data.floor === "") {
          errors.floor = "Shop Floor Level is required.";
        }
        if (!data.frontage || Number(data.frontage) <= 0) {
          errors.frontage = "Shop Frontage is required.";
        }
        if (!data.ceilingHeight || Number(data.ceilingHeight) <= 0) {
          errors.ceilingHeight = "Ceiling Height is required.";
        }
        if (!data.roadWidth || Number(data.roadWidth) <= 0) {
          errors.roadWidth = "Road Width is required.";
        }
        if (!data.shutters || Number(data.shutters) <= 0) {
          errors.shutters = "Number of Shutters is required.";
        }
        if (data.maintenance === undefined || data.maintenance === "") {
          errors.maintenance = "Monthly Maintenance is required.";
        }
        if (!data.propertyAge) {
          errors.propertyAge = "Property Age is required.";
        }
        if (!data.entranceWidth || Number(data.entranceWidth) <= 0) {
          errors.entranceWidth = "Entrance Width is required.";
        }
        if (!data.footfallEstimate || !data.footfallEstimate.trim()) {
          errors.footfallEstimate = "Footfall Estimate Description is required.";
        }
        if (!data.suitableBusiness || !data.suitableBusiness.trim()) {
          errors.suitableBusiness = "Suitable Business Types is required.";
        }
      }

      else if (type === "Warehouse") {
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Warehouse Area is required.";
        }
        if (!data.ceilingHeight || Number(data.ceilingHeight) <= 0) {
          errors.ceilingHeight = "Ceiling Center Height is required.";
        }
        if (!data.officeArea || Number(data.officeArea) <= 0) {
          errors.officeArea = "Office Area inside is required.";
        }
        if (!data.roadWidth || Number(data.roadWidth) <= 0) {
          errors.roadWidth = "Truck Access Road Width is required.";
        }
        if (!data.powerLoad || Number(data.powerLoad) <= 0) {
          errors.powerLoad = "Power Capacity is required.";
        }
        if (!data.flooring || !data.flooring.trim()) {
          errors.flooring = "Flooring Type Description is required.";
        }
        if (!data.storageCapacity || !data.storageCapacity.trim()) {
          errors.storageCapacity = "Storage Capacity is required.";
        }
        if (!data.truckAccess || !data.truckAccess.trim()) {
          errors.truckAccess = "Truck Access Vehicle Compatibility is required.";
        }
      }

      else if (type === "Industrial Property") {
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Factory / Land Area is required.";
        }
        if (!data.productionArea || Number(data.productionArea) <= 0) {
          errors.productionArea = "Production Area is required.";
        }
        if (!data.powerLoad || Number(data.powerLoad) <= 0) {
          errors.powerLoad = "Power Capacity Connected is required.";
        }
        if (!data.roadWidth || Number(data.roadWidth) <= 0) {
          errors.roadWidth = "Road Width is required.";
        }
        if (!data.zoning || !data.zoning.trim()) {
          errors.zoning = "Industrial Zoning Authority is required.";
        }
        if (!data.industrialType || !data.industrialType.trim()) {
          errors.industrialType = "Industrial Category Type is required.";
        }
        if (!data.pollutionCompliance || !data.pollutionCompliance.trim()) {
          errors.pollutionCompliance = "Pollution Compliance Code / Details is required.";
        }
      }

      else if (type === "Hotel / Resort") {
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Plot / Built-up Area is required.";
        }
        if (!data.numberOfRooms || Number(data.numberOfRooms) <= 0) {
          errors.numberOfRooms = "Total Rooms Count is required.";
        }
        if (!data.roomTypes || !data.roomTypes.trim()) {
          errors.roomTypes = "Room Types Description is required.";
        }
        if (!data.totalFloors || Number(data.totalFloors) <= 0) {
          errors.totalFloors = "Number of Floors is required.";
        }
        if (!data.occupancy || !data.occupancy.trim()) {
          errors.occupancy = "Average Occupancy Rate is required.";
        }
        if (!data.revenue || Number(data.revenue) <= 0) {
          errors.revenue = "Annual Revenue is required.";
        }
      }

      else if (type === "PG / Hostel") {
        if (!data.genderType) {
          errors.genderType = "Tenant Gender Type is required.";
        }
        if (!data.numberOfRooms || Number(data.numberOfRooms) <= 0) {
          errors.numberOfRooms = "Total Rooms Count is required.";
        }
        if (!data.totalBeds || Number(data.totalBeds) <= 0) {
          errors.totalBeds = "Total Beds Count is required.";
        }
        if (data.availableBeds === undefined || data.availableBeds === "") {
          errors.availableBeds = "Available Beds is required.";
        }
        if (!data.rentPerBed || Number(data.rentPerBed) <= 0) {
          errors.rentPerBed = "Rent per Bed / Month is required.";
        }
        if (!data.deposit || Number(data.deposit) <= 0) {
          errors.deposit = "Security Deposit is required.";
        }
        if (!data.rules || !data.rules.trim()) {
          errors.rules = "Rules / Curfew Timings is required.";
        }
        if (!data.roomSharingType || !data.roomSharingType.trim()) {
          errors.roomSharingType = "Sharing Types Available is required.";
        }
      }

      else if (type === "Builder / New Project") {
        if (!data.projectName || !data.projectName.trim()) {
          errors.projectName = "Project Name is required.";
        }
        if (!data.community || !data.community.trim()) {
          errors.community = "Developer / Company Name is required.";
        }
        if (!data.commercialType || !data.commercialType.trim()) {
          errors.commercialType = "Developer Project Type Description is required.";
        }
        if (!data.plotArea || Number(data.plotArea) <= 0) {
          errors.plotArea = "Total Project Land Area is required.";
        }
        if (!data.towers || Number(data.towers) <= 0) {
          errors.towers = "Number of Towers is required.";
        }
        if (!data.totalFloors || Number(data.totalFloors) <= 0) {
          errors.totalFloors = "Max Tower Floors is required.";
        }
        if (!data.totalUnits || Number(data.totalUnits) <= 0) {
          errors.totalUnits = "Total Project Units is required.";
        }
        if (data.availableUnits === undefined || data.availableUnits === "") {
          errors.availableUnits = "Available Units for Sale is required.";
        }
        if (!data.bhkTypes || !data.bhkTypes.trim()) {
          errors.bhkTypes = "BHK configurations available is required.";
        }
        if (!data.area || Number(data.area) <= 0) {
          errors.area = "Built-up Area / Size Range is required.";
        }
        if (!data.carpetArea || Number(data.carpetArea) <= 0) {
          errors.carpetArea = "Carpet Area Range is required.";
        }
        if (!data.maintenance || Number(data.maintenance) <= 0) {
          errors.maintenance = "Monthly Maintenance Estimate is required.";
        }
        if (!data.possessionDate) {
          errors.possessionDate = "Expected Possession Date is required.";
        }
        if (!data.paymentPlan || !data.paymentPlan.trim()) {
          errors.paymentPlan = "Payment Plan Description is required.";
        }
        if (!data.constructionStatus) {
          errors.constructionStatus = "Construction Status is required.";
        }
      }
      break;

    case "amenities":
      // Optional. No validation required.
      break;

    case "neighbourhood":
      // Check each enabled nearby place
      const nb = formData.neighbourhood;
      if (nb && nb.nearbyPlaces) {
        const places = nb.nearbyPlaces as any;
        Object.keys(places).forEach((key) => {
          const place = places[key];
          if (place.enabled) {
            if (!place.name || !place.name.trim()) {
              errors[`neighbourhood.nearbyPlaces.${key}.name`] = `Name is required for ${key}.`;
            }
            if (!place.distance || Number(place.distance) <= 0) {
              errors[`neighbourhood.nearbyPlaces.${key}.distance`] = `Distance must be greater than 0 for ${key}.`;
            }
          }
        });
      }
      // Check ratings (connectivity, safety, powerSupply, waterSupply, noiseLevel, internet, greenery)
      if (nb && nb.ratings) {
        const ratings = nb.ratings as any;
        Object.keys(ratings).forEach((key) => {
          const val = ratings[key];
          if (val !== undefined && val !== "" && val !== 0) {
            const num = Number(val);
            if (isNaN(num) || num < 1 || num > 5) {
              errors[`neighbourhood.ratings.${key}`] = `Rating must be between 1 and 5.`;
            }
          }
        });
      }
      break;

    case "issues":
      if (formData.pendingIssues?.hasPendingIssues === "yes") {
        const issues = formData.pendingIssues.issues || [];
        if (issues.length === 0) {
          errors.issuesCount = "Please add at least one pending issue.";
        } else {
          issues.forEach((issue, index) => {
            if (!issue.type || !issue.type.trim()) {
              errors[`issues.${index}.type`] = "Issue Type is required.";
            }
            if (!issue.description || !issue.description.trim()) {
              errors[`issues.${index}.description`] = "Description is required.";
            }
            if (issue.amount !== undefined && issue.amount !== 0) {
              if (Number(issue.amount) < 0) {
                errors[`issues.${index}.amount`] = "Amount cannot be negative.";
              }
            }
          });
        }
      }
      break;

    case "documents":
      const reqDocs = getRequiredDocTypesForType(type);
      const uploadedDocs = formData.documents || [];
      reqDocs.forEach((docType) => {
        const match = uploadedDocs.find((d) => d.documentType === docType);
        if (!match || !match.fileUrl) {
          errors[docType] = `${docType.replace(/_/g, " ").toUpperCase()} is required.`;
        }
      });
      break;

    case "agreement":
      const isRentOrLease = formData.purpose === "Rent" || formData.purpose === "Lease";
      if (isRentOrLease) {
        const agreement = formData.agreementDetails || {};
        if (!agreement.agreementType || !agreement.agreementType.trim()) {
          errors.agreementType = "Agreement Type is required.";
        }
        if (!agreement.amount || Number(agreement.amount) <= 0) {
          errors.amount = "Rent / Lease Amount must be greater than 0.";
        }
        if (agreement.securityDeposit === undefined || agreement.securityDeposit === null || Number(agreement.securityDeposit) < 0) {
          errors.securityDeposit = "Security Deposit amount is required.";
        }
        if (!agreement.duration || !agreement.duration.trim()) {
          errors.duration = "Agreement Duration is required.";
        }
        if (!agreement.startDate) {
          errors.startDate = "Agreement Start Date is required.";
        }
        if (!agreement.noticePeriod || !agreement.noticePeriod.trim()) {
          errors.noticePeriod = "Notice Period is required.";
        }
      }
      break;

    case "price":
      if (!formData.price || Number(formData.price) <= 0) {
        errors.price = "Listing Price must be greater than 0.";
      }
      if (!formData.availableFrom) {
        errors.availableFrom = "Availability date is required.";
      }
      // Require at least 1 photo
      const hasPhotos = (formData.photos && formData.photos.length > 0) || 
                        (formData.existingPhotos && formData.existingPhotos.length > 0);
      if (!hasPhotos) {
        errors.photos = "At least one property photo is required.";
      }
      break;

    case "review":
      // Validated globally
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateAllPropertySteps(
  formData: PropertyFormData,
  stepsList: { id: string; name: string }[]
): Record<string, Record<string, string>> {
  const allErrors: Record<string, Record<string, string>> = {};
  stepsList.forEach((step) => {
    const result = validatePropertyStep(step.id, formData);
    if (!result.isValid) {
      allErrors[step.id] = result.errors;
    }
  });
  return allErrors;
}
