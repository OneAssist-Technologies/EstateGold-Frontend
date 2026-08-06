import api from "./api";
import { GetUsersResponse } from "../types/adminUser";

export const getUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<GetUsersResponse> => {
  const response = await api.get("/admin/users", {
    params,
  });
  return response.data;
};

export const toggleUserVerify = async (id: string) => {
  const response = await api.patch(`/admin/users/${id}/verify`);
  return response.data;
};

export const toggleUserStatus = async (id: string) => {
  const response = await api.patch(`/admin/users/${id}/status`);
  return response.data;
};
