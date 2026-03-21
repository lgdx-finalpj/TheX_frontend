import axios from "axios";

const configuredBaseUrl =
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : "";

const apiClient = axios.create({
  baseURL: configuredBaseUrl || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;