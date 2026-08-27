import api from "../lib/api";

export const enquiryApi = {
  create: (data: {
    propertyId: string;
    ownerId: string;
    [key: string]: unknown;
  }) => api.post("/enquiries", data),

  getByProperty: (propertyId: string) =>
    api.get(`/enquiries/property/${propertyId}`),

  getMine: () => api.get("/enquiries/mine"),

  updateStatus: (id: string, status: string) =>
    api.patch(`/enquiries/${id}`, { status }),
};
