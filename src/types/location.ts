export type LocationStatus = "active" | "inactive";

export interface ServiceLocation {
  _id: string;

  city: string;
  state: string;

  latitude: number;
  longitude: number;

  radiusKm: number;

  activeListings: number;

  status: LocationStatus;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface LocationStats {
  totalCities: number;
  activeCities: number;
  inactiveCities: number;
  totalListings: number;
  averageRadius: number;
}

export interface LocationResponse {
  success: boolean;
  locations: ServiceLocation[];

  page: number;
  pages: number;
  total: number;
}