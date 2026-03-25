import apiClient from "@/api/client";

export interface LatestSensorResponse {
  temperature: number;
  humidity: number;
  recordedAt: string;
}

export async function getLatestSensor() {
  const response = await apiClient.get<LatestSensorResponse>("/sensor/latest");
  return response.data;
}
