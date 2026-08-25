import api from "../lib/api";
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

export const toggleUserStatus = async (id: string, reason?: string) => {
  const response = await api.patch(`/admin/users/${id}/status`, { reason });
  return response.data;
};

export const deleteUser = async (id: string, reason: string) => {
  const response = await api.delete(`/admin/users/${id}`, {
    data: { reason },
  });
  return response.data;
};
