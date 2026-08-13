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
}