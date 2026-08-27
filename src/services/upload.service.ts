import api from "../lib/api";
import { AxiosRequestConfig } from "axios";

export const uploadApi = {
  uploadDocument: (formData: FormData, config?: AxiosRequestConfig) =>
    api.post("/uploads/documents", formData, config),
};
