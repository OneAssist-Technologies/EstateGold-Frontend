import axios from "axios";
import { API_URL } from "../config/index";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.warn("Network Warning: Backend API server unreachable or connection changed:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
