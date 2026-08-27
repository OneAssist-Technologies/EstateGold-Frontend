import api from "../lib/api";
import { MarketInsight } from "../types/property";

export interface GetLocalityInsightsParams {
  country?: string;
  state?: string;
  city: string;
  locality: string;
  propertyType: string;
  bedrooms?: number | null;
  area?: number | null;
}

/**
 * Fetch market insights for a specific locality and property type context
 */
export const getLocalityInsights = async (
  params: GetLocalityInsightsParams
): Promise<MarketInsight> => {
  const response = await api.post("/market-insights/locality", params);
  return response.data;
};
