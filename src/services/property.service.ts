import api from "../lib/api";
import { AxiosRequestConfig } from "axios";

export const propertyApi = {
  // List / search / filter
  list: (params?: Record<string, unknown>) =>
    api.get("/properties", { params }),

  search: (params?: Record<string, unknown>) =>
    api.get("/properties/search", { params }),

  filter: (params?: Record<string, unknown>) =>
    api.get("/properties/filter", { params }),

  compare: (ids: string) =>
    api.get(`/properties/compare?ids=${ids}`),

  // Single property
  getById: (id: string) => api.get(`/properties/${id}`),

  create: (data: FormData, config?: AxiosRequestConfig) =>
    api.post("/properties", data, config),

  update: (id: string, data: FormData, config?: AxiosRequestConfig) =>
    api.put(`/properties/${id}`, data, config),

  delete: (id: string) => api.delete(`/properties/${id}`),

  // Property actions
  getSimilar: (id: string) => api.get(`/properties/${id}/similar`),

  updateStatus: (id: string, data: Record<string, unknown>) =>
    api.patch(`/properties/${id}/status`, data),

  requestDelete: (id: string, reason: string) =>
    api.patch(`/properties/${id}/request-delete`, { reason }),

  // Mine
  getMine: (params?: Record<string, unknown>) =>
    api.get("/properties/mine", { params }),

  // Drafts
  createDraft: (data: Record<string, unknown>) =>
    api.post("/properties/drafts", data),

  getDraft: (id: string) => api.get(`/properties/drafts/${id}`),

  updateDraft: (id: string, data: Record<string, unknown>) =>
    api.put(`/properties/drafts/${id}`, data),

  deleteDraft: (id: string) => api.delete(`/properties/drafts/${id}`),
};
