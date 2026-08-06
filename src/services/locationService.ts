import api from "./api";
import { LocationResponse, ServiceLocation } from "../types/location";

export const getLocations = async (params?: {
  search?: string;
  status?: string;
  state?: string;
  page?: number;
  limit?: number;
}): Promise<LocationResponse> => {
  const response = await api.get("/admin/locations", { params });
  return response.data;
};

export const getLocationById = async (
  id: string
): Promise<{ success: boolean; location: ServiceLocation }> => {
  const response = await api.get(`/admin/locations/${id}`);
  return response.data;
};

export const createLocation = async (
  data: Partial<ServiceLocation>
): Promise<{ success: boolean; message: string; location: ServiceLocation }> => {
  const response = await api.post("/admin/locations", data);
  return response.data;
};

export const updateLocation = async (
  id: string,
  data: Partial<ServiceLocation>
): Promise<{ success: boolean; message: string; location: ServiceLocation }> => {
  const response = await api.patch(`/admin/locations/${id}`, data);
  return response.data;
};

export const deleteLocation = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/admin/locations/${id}`);
  return response.data;
};
