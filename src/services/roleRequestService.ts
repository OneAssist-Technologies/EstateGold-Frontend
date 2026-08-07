import api from "./api";
import { GetRoleRequestsResponse, RoleRequest } from "../types/roleRequest";

export async function getRoleRequests(
  status: string = "all",
  search: string = "",
  page: number = 1,
  limit: number = 20
): Promise<GetRoleRequestsResponse> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);
  params.append("page", String(page));
  params.append("limit", String(limit));

  const response = await api.get(`/role-requests/admin/list?${params.toString()}`);
  return response.data;
}

export async function approveRoleRequest(id: string): Promise<{ success: boolean; roleRequest: RoleRequest }> {
  const response = await api.patch(`/role-requests/admin/${id}/approve`);
  return response.data;
}

export async function rejectRoleRequest(
  id: string,
  reason: string
): Promise<{ success: boolean; roleRequest: RoleRequest }> {
  const response = await api.patch(`/role-requests/admin/${id}/reject`, { reason });
  return response.data;
}

export async function submitRoleRequest(data: {
  requestedRole: "seller" | "agent";
  reason?: string;
  experience?: string;
  agencyName?: string;
  reraNumber?: string;
  documents?: { name: string; url: string }[];
}): Promise<{ success: boolean; roleRequest: RoleRequest; message?: string }> {
  const response = await api.post("/role-requests/request", data);
  return response.data;
}

export async function getMyRoleRequests(): Promise<{
  success: boolean;
  user: any;
  requests: RoleRequest[];
}> {
  const response = await api.get("/role-requests/my-requests");
  return response.data;
}
