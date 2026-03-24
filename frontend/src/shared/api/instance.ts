import axios from "axios";
import { config } from "@/shared/config";

export const apiInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use((reqConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
  }
  return reqConfig;
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
