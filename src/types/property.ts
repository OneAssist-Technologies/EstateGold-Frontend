export interface Place {
  enabled: boolean;
  name: string;
  distance: string;
}

export interface Landmark {
  name: string;
  distance: string;
}

export interface NeighbourhoodRatings {
  connectivity: number;
  safety: number;
  powerSupply: number;
  waterSupply: number;
  noiseLevel: number;
  internet: number;
  greenery: number;
}

export interface Neighbourhood {
  nearbyPlaces: {
    school: Place;
    college: Place;
    hospital: Place;
    metro: Place;
    busStand: Place;
    airport: Place;
    park: Place;
    mall: Place;
    temple: Place;
  };

  landmarks: Landmark[];

  ratings: NeighbourhoodRatings;

  notes: string;
}

export interface PropertyFormData {
  purpose: string;
  propertyType: string;

  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerType: string;
  agentRelation: string;
  ownerIdType: string;
  ownerIdNumber: string;
  alternatePhone: string;
  listingType?: "my_own" | "another_owner";
  ownerAddress?: string;
  ownerGovtIdDoc?: string;
  ownerNegotiable?: boolean;
  ownerReadyToMeet?: boolean;

  city: string;
  state?: string;
  locality: string;
  society: string;
  address: string;
  latitude?: number;
  longitude?: number;
  serviceableAreaId?: string;

  bedrooms: number;
  bathrooms: number;
  balconies: number;

  area: number;
  floor: number;

  furnishing: string;
  parking: boolean;

  amenities: string[];

  price: number;
  description: string;
  availableFrom: string;

  photos: File[];

  neighbourhood: Neighbourhood;
  existingPhotos?: string[];
  marketInsight?: MarketInsight;
  facing?: string;
  length?: number;
  width?: number;
  ownershipType?: string;
  numberOfOwners?: number;
  pan?: string;
  pendingIssues?: {
    hasPendingIssues: string; // "yes" | "no" | "not_sure"
    issues: PendingIssue[];
  };
  documents?: DocumentItem[];
  carpetArea?: number;
  totalFloors?: number;
  plotArea?: number;
  propertyAge?: string;
  plotFacing?: string;
  roadWidth?: number;
  cornerPlot?: boolean;
  boundaryWall?: boolean;
  plotType?: string;
  landApproval?: string;
  waterAvailability?: string;
  electricityAvailability?: string;
  commercialType?: string;
  washrooms?: number;
  entranceWidth?: number;
  powerLoad?: number;
  maintenance?: number;
  deposit?: number;
  superArea?: number;
  lift?: boolean;
  powerBackup?: string;
  security?: string;
  community?: string;
  privatePool?: boolean;
  servantRoom?: boolean;
  garden?: boolean;
  terrace?: boolean;
  borewell?: boolean;
  electricity?: boolean;
  solar?: boolean;
  compoundWall?: boolean;
  numberOfUnits?: number;
  gatedLayout?: boolean;
  drainage?: boolean;
  roadAccess?: string;
  gps?: string;
  surveyNumber?: string;
  subdivisionNumber?: string;
  landClassification?: string;
  zoning?: string;
  layoutName?: string;
  taluk?: string;
  irrigation?: string;
  crops?: string;
  soilType?: string;
  farmhouse?: boolean;
  pricePerAcre?: number;
  workstations?: number;
  cabins?: number;
  meetingRooms?: number;
  reception?: boolean;
  pantry?: boolean;
  serverRoom?: boolean;
  ac?: boolean;
  internet?: boolean;
  fireSafety?: boolean;
  ceilingHeight?: number;
  mainRoadFacing?: boolean;
  cornerShop?: boolean;
  shutters?: number;
  signboard?: boolean;
  footfallEstimate?: string;
  suitableBusiness?: string;
  loadingUnloading?: boolean;
  dock?: boolean;
  truckAccess?: string;
  storageCapacity?: string;
  flooring?: string;
  officeArea?: number;
  industrialType?: string;
  transformer?: boolean;
  productionArea?: number;
  crane?: boolean;
  workerFacilities?: boolean;
  pollutionCompliance?: string;
  machineryIncluded?: boolean;
  numberOfRooms?: number;
  roomTypes?: string;
  restaurant?: boolean;
  kitchen?: boolean;
  banquetHall?: boolean;
  gym?: boolean;
  occupancy?: string;
  revenue?: number;
  genderType?: string;
  totalBeds?: number;
  availableBeds?: number;
  roomSharingType?: string;
  rentPerBed?: number;
  foodIncluded?: boolean;
  laundry?: boolean;
  housekeeping?: boolean;
  rules?: string;
  projectName?: string;
  towers?: number;
  totalUnits?: number;
  availableUnits?: number;
  bhkTypes?: string;
  possessionDate?: string;
  paymentPlan?: string;
  constructionStatus?: string;
}
export interface Property {
  _id: string;

  ownerId?: string;
  purpose: string;
  propertyType: string;

  ownerName: string;
  ownerPhone: string;
  listingType?: string;

  city: string;
  state?: string;
  locality: string;
  society: string;
  address: string;

  bedrooms: number;
  bathrooms: number;
  balconies: number;

  area: number;
  floor: number;

  furnishing: string;
  parking: boolean;

  amenities: string[];

  price: number;
  description: string;

  availableFrom: string;

  photos: string[];

  neighbourhood?: Neighbourhood | any;

  status: string;
  availabilityStatus?: "on_sale" | "hold" | "sold";
  role?: string;
  ownerNegotiable?: boolean;
  ownerReadyToMeet?: boolean;
  views?: number;
  enquiries?: any[];
  deleteRequested?: boolean;
  deleteRequestedReason?: string;
  deleteRequestedAt?: string;
  carpetArea?: number;
  totalFloors?: number;
  plotArea?: number;
  facing?: string;
  length?: number;
  width?: number;
  propertyAge?: string;
  plotFacing?: string;
  roadWidth?: number;
  cornerPlot?: boolean;
  boundaryWall?: boolean;
  plotType?: string;
  landApproval?: string;
  waterAvailability?: string;
  electricityAvailability?: string;
  commercialType?: string;
  washrooms?: number;
  entranceWidth?: number;
  powerLoad?: number;
  createdBy: any; 
  createdAt: string;
  updatedAt: string;
  marketInsight?: MarketInsight;
  ownershipType?: string;
  numberOfOwners?: number;
  pan?: string;
  pendingIssues?: {
    hasPendingIssues: string;
    issues: PendingIssue[];
  };
  documents?: DocumentItem[];
  documentsAvailable?: boolean;
  uploadedDocumentTypes?: string[];
}

export interface MarketInsight {
  success: boolean;
  source: string;
  locality: string;
  city: string;
  supported?: boolean;
  message?: string;
  averageLocalityPrice?: number | null;
  estimatedPricePerSqft?: number | null;
  comparableCount?: number;
  estimatedPropertyValue?: number | null;
  confidence?: string | null;
  marketData?: {
    averagePrice: number | null;
    supply: number;
    demandPulse: string | null;
    livabilityGrade: number | null;
    highlights: string[];
    priceTrends: Array<{ period: string; value: number }>;
  };
  retrievedAt: string;
}

export interface PendingIssue {
  type: string;
  amount: number;
  description: string;
  expectedResolutionDate?: string;
  supportingDocument?: string;
}

export interface DocumentItem {
  documentType: string;
  fileUrl: string;
  fileName: string;
  uploadedAt?: string;
  verificationStatus?: string;
  reviewer?: any;
  remarks?: string;
  expiryDate?: string;
}