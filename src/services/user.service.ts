import api from "../lib/api";
import { AxiosRequestConfig } from "axios";

export const userApi = {
  getMe: () => api.get("/users/me"),

  updateMe: (data: Record<string, unknown>) => api.put("/users/me", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/users/me/password", data),

  uploadAvatar: (formData: FormData, config?: AxiosRequestConfig) =>
    api.post("/users/me/avatar", formData, config),

  getPublishedCount: () => api.get("/users/me/published-count"),
};
