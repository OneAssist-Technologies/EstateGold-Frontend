import api from "../lib/api";

export const getProperties = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  city?: string;
}) => {
  const response = await api.get("/admin/properties", {
    params,
  });

  return response.data;
};
export const getPropertyById = async (
  id: string
) => {
  const response = await api.get(
    `/admin/properties/${id}`
  );

  return response.data;
};

export const approveProperty = async (
  id: string
) => {

  const response =
    await api.patch(
      `/admin/properties/${id}/approve`
    );

  return response.data;
};

export const rejectProperty = async (
  id: string,
  reason: string
) => {

  const response =
    await api.patch(
      `/admin/properties/${id}/reject`,
      {
        reason,
      }
    );

  return response.data;
};

export const deleteProperty = async (
  id: string,
  reason: string
) => {

  const response = await api.delete(
    `/admin/properties/${id}`,
    {
      data: {
        reason,
      },
    }
  );

  return response.data;
};

export const requestDelete = async (id: string, reason: string) => {
  const response = await api.patch(`/properties/${id}/request-delete`, { reason });
  return response.data;
};

export const rejectDeleteRequest = async (id: string) => {
  const response = await api.patch(`/admin/properties/${id}/reject-delete-request`);
  return response.data;
};

export const updatePropertyAvailabilityStatus = async (
  id: string,
  availabilityStatus: "on_sale" | "hold" | "sold" | "rented"
) => {
  const response = await api.patch(
    `/admin/properties/${id}/availability-status`,
    { availabilityStatus }
  );

  return response.data;
};

export const getDashboard = async () => {

  const response =
    await api.get(
      "/admin/dashboard"
    );

  return response.data;
};

export const getAnalytics = async (params?: {
  range?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await api.get("/admin/analytics", {
    params,
  });
  return response.data;
};

export const getUnreadCounts = async (params: {
  lastVisitedProperties?: string;
  lastVisitedUsers?: string;
  lastVisitedLocations?: string;
}) => {
  const response = await api.get("/admin/unread-counts", { params });
  return response.data;
};