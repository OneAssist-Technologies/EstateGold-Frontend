export type LocationStatus = "active" | "inactive";

export interface ServiceLocation {
  _id: string;
  city: string;
  state: string;
  country?: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  pincodes?: string[];
  propertyTypes?: string[];
  allowedServices?: string[];
  maxListings?: number;
  displayPriority?: number;
  isFeatured?: boolean;
  bannerImage?: string;
  activeListings?: number;
  status: LocationStatus;
  notes?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationStatsData {
  totalCities: number;
  activeCities: number;
  inactiveCities: number;
  totalListings: number;
  averageRadius: number;
}

export type LocationStats = LocationStatsData;

export interface LocationResponse {
  success: boolean;
  locations: ServiceLocation[];
  page: number;
  pages: number;
  total: number;
  stats?: LocationStatsData;
}