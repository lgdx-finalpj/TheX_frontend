import axios from "axios";

const configuredBaseUrl =
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : "";

export const httpClient = axios.create({
  baseURL: configuredBaseUrl || "/api",
});

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "API request failed. Please try again.",
) {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim().length > 0) {
    return responseData;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "message" in responseData &&
    typeof responseData.message === "string" &&
    responseData.message.trim().length > 0
  ) {
    return responseData.message;
  }

  if (typeof error.message === "string" && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}
