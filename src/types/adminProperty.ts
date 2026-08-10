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

export interface AdminProperty {
  _id: string;

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

  neighbourhood: Neighbourhood;

  status: "pending" | "approved" | "rejected";
  availabilityStatus?: "on_sale" | "hold" | "sold";

 createdBy?: {
  _id: string;

  fullName: string;

  email: string;

  phone: string;

  role: "seller" | "agent" | "admin";

  agencyName?: string;

  profileImage?: string;

  isVerified?: boolean;
};

  createdAt: string;
  updatedAt: string;
}