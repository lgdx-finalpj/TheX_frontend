import { httpClient } from "@/api/httpClient";

type NumericMapResponse = Record<string, number>;

export type SpeakerMusicType =
  | "Jazz"
  | "Acoustic"
  | "Classical"
  | "Cafe BGM"
  | "Chill"
  | "K-POP"
  | "Musical";
export type CoffeeRecipeLevel = "EASY" | "NORMAL" | "HARD";
export type CoffeeRecipeCategory = "COFFEE" | "SMOOTHIE" | "TEA";
export type CapsuleTemp = "HIGH" | "MIDDLE" | "LOW";

export interface MyProductListResponseDTO {
  productInfoId: number;
  productName: string;
  isOn: boolean;
}

export interface LightCustomRequestDTO {
  lightColor: string;
  lightBright: number;
}

export interface SpeakerCustomRequestDTO {
  volume: number;
  musicType: SpeakerMusicType;
  musicLink?: string;
}

export interface CoffeeRecipeCustomizeCoffeeRequestDTO {
  recipeName: string;
  recipeCategory: CoffeeRecipeCategory;
  capsule1Id: number;
  capsule2Id: number;
  capsuleTemp: CapsuleTemp;
  capsule1Size: number;
  capsule2Size: number;
  capsule1Step1: number;
  capsule2Step2: number;
  capsule1Step3: number;
  capsule2Step4: number;
  addObj: string;
  recipeMemo: string;
  recipeLevel: CoffeeRecipeLevel;
}

export interface CoffeeRecipeCustomizeResponseDTO {
  recipeId: number;
  userId: number;
  recipeType: string;
  recipeName: string;
  recipeCategory: CoffeeRecipeCategory;
  isExtract: boolean;
  isShared: boolean;
  saveCount: number;
}

export interface CoffeeCustomRequestDTO {
  recipeId: number;
}

export interface MoodCustomProductRequestDTO {
  lightCustom?: number;
  speakerCustom?: number;
  coffeeCustom?: number;
}

export interface MoodCustomRequestDTO {
  colorsetId: number;
  moodName: string;
  moodMemo: string;
  customProduct: MoodCustomProductRequestDTO;
}

export interface LightCustomDetailResponseDTO {
  lightColor: string;
  lightBright: number;
}

export interface SpeakerCustomDetailResponseDTO {
  musicLink: string;
  volume: number;
  musicType: SpeakerMusicType;
}

export interface CoffeeCustomDetailResponseDTO {
  recipeName: string;
  recipeCategory: CoffeeRecipeCategory;
  capsule1Name: string;
  capsule2Name: string | null;
  capsuleTemp: CapsuleTemp;
  capsule1Size: number | null;
  capsule2Size: number | null;
  capsule1Step1: number | null;
  capsule2Step2: number | null;
  capsule1Step3: number | null;
  capsule2Step4: number | null;
  addObj: string | null;
  recipeMemo: string | null;
  isExtract: boolean;
  recipeLevel: CoffeeRecipeLevel;
  isShared: boolean;
  saveCount: number;
}

export interface MoodCustomProductResponseDTO {
  lightCustom?: LightCustomDetailResponseDTO;
  speakerCustom?: SpeakerCustomDetailResponseDTO;
  coffeeCustom?: CoffeeCustomDetailResponseDTO;
}

export interface MoodCustomListResponseDTO {
  moodId: number;
  moodName: string;
  colorsetMain?: string;
  customProduct: MoodCustomProductResponseDTO;
}

function extractNumericId(payload: NumericMapResponse, key: string) {
  const directValue = payload[key];
  if (typeof directValue === "number") {
    return directValue;
  }

  const firstNumericValue = Object.values(payload).find(
    (value) => typeof value === "number",
  );

  if (typeof firstNumericValue === "number") {
    return firstNumericValue;
  }

  throw new Error("API response did not include a numeric id.");
}

export async function fetchMyProductList() {
  const { data } = await httpClient.get<MyProductListResponseDTO[]>(
    "/auth/my-product-list",
  );
  return data;
}

export async function fetchMyMoodCustomList() {
  const { data } =
    await httpClient.get<MoodCustomListResponseDTO[]>("/auth/my-mood-list");
  return data;
}

export async function fetchSharedMoodCustomList() {
  const { data } =
    await httpClient.get<MoodCustomListResponseDTO[]>("/mood/shared");
  return data;
}

export async function createLightCustom(payload: LightCustomRequestDTO) {
  const { data } = await httpClient.post<NumericMapResponse>(
    "/mood/light-custom",
    payload,
  );
  return extractNumericId(data, "lightId");
}

export async function createSpeakerCustom(payload: SpeakerCustomRequestDTO) {
  const { data } = await httpClient.post<NumericMapResponse>(
    "/mood/speaker-custom",
    payload,
  );
  return extractNumericId(data, "speakerId");
}

export async function createCoffeeRecipe(
  payload: CoffeeRecipeCustomizeCoffeeRequestDTO,
) {
  const { data } = await httpClient.post<CoffeeRecipeCustomizeResponseDTO>(
    "/coffee/recipes/customize/coffee",
    payload,
  );
  return data;
}

export async function createCoffeeCustom(payload: CoffeeCustomRequestDTO) {
  const { data } = await httpClient.post<NumericMapResponse>(
    "/mood/coffee-custom",
    payload,
  );
  return extractNumericId(data, "coffeeCustomId");
}

export async function createMoodCustom(payload: MoodCustomRequestDTO) {
  const { data } = await httpClient.post<NumericMapResponse>(
    "/mood/custom",
    payload,
  );
  return extractNumericId(data, "moodId");
}

export async function shareMoodCustom(moodId: number) {
  const { data } = await httpClient.patch<NumericMapResponse>(
    `/mood/${moodId}/share`,
  );
  return extractNumericId(data, "moodId");
}

export async function saveMoodCustom(moodId: number) {
  const { data } = await httpClient.post<NumericMapResponse>(
    `/mood/${moodId}/save`,
  );
  return extractNumericId(data, "moodId");
}

export async function unsaveMoodCustom(moodId: number) {
  const { data } = await httpClient.delete<NumericMapResponse>(
    `/mood/${moodId}/save`,
  );
  return extractNumericId(data, "moodId");
}

export async function deleteMoodCustom(moodId: number) {
  const { data } = await httpClient.delete<NumericMapResponse>(`/mood/${moodId}`);
  return extractNumericId(data, "moodId");
}

export async function executeMoodCustom(moodId: number) {
  const { data } = await httpClient.post<void>(`/mood/select/${moodId}`);
  return data;
}
