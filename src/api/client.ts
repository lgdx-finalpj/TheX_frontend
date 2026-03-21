import axios from "axios";

const configuredBaseUrl =
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : "";

export const apiClient = axios.create({
  baseURL: configuredBaseUrl || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});
