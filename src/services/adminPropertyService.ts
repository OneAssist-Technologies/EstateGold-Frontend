import api from "./api";

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

export const getDashboard = async () => {

  const response =
    await api.get(
      "/admin/dashboard"
    );

  return response.data;
};