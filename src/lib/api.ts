import axios from "axios";
import { API_URL } from "../config/index";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    // Prevent double /api/api prefix if the request URL already starts with /api/
    if (config.url && config.url.startsWith("/api/")) {
      config.url = config.url.substring(4);
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  }
);

export default api;
