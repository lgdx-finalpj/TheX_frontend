import type {
  CoffeeRecipeCustomizeCoffeeRequestDTO,
  MoodCustomListResponseDTO,
  MyProductListResponseDTO,
  SpeakerMusicType,
} from "@/api/moodCustomApi";
import { normalizeExtractionSteps } from "@/features/coffeeMachine/extraction";
import { buildCoffeeRecipePayloadFromConfig } from "@/features/coffeeMachine/payload";
import {
  coffeeCapsuleAssets,
  mapSpeakerMusicTypeToLabel,
} from "@/state/moodCustom.constants";
import { getProductOptionByType } from "@/state/moodCustom.utils";
import type {
  CoffeeMachineConfig,
  MoodOptionId,
  ProductType,
  SavedMoodCustom,
  TemperatureLevel,
} from "@/state/moodCustom.types";

export type UserProductCode =
  | "COFFEE01"
  | "LIGHT01"
  | "SPEAKER01"
  | "FRIDGE01"
  | "WASHER01";

function mapProductInfoIdToCode(productInfoId: number): UserProductCode | null {
  if (productInfoId === 1) {
    return "COFFEE01";
  }

  if (productInfoId === 2) {
    return "LIGHT01";
  }

  if (productInfoId === 3) {
    return "SPEAKER01";
  }

  if (productInfoId === 4) {
    return "FRIDGE01";
  }

  if (productInfoId === 5) {
    return "WASHER01";
  }

  return null;
}

function mapProductNameToCode(productName: string): UserProductCode | null {
  const normalized = productName.toLowerCase().replace(/\s+/g, "");

  if (
    normalized.includes("coffee") ||
    normalized.includes("duobo") ||
    normalized.includes("커피")
  ) {
    return "COFFEE01";
  }

  if (normalized.includes("light") || normalized.includes("조명")) {
    return "LIGHT01";
  }

  if (normalized.includes("speaker") || normalized.includes("스피커")) {
    return "SPEAKER01";
  }

  if (normalized.includes("fridge") || normalized.includes("냉장고")) {
    return "FRIDGE01";
  }

  if (normalized.includes("washer") || normalized.includes("세탁기")) {
    return "WASHER01";
  }

  return null;
}

export function getAvailableProductCodes(products: MyProductListResponseDTO[]) {
  const availableCodes = new Set<UserProductCode>();

  products.forEach((product) => {
    if (!product.isOn) {
      return;
    }

    const byId = mapProductInfoIdToCode(product.productInfoId);
    if (byId) {
      availableCodes.add(byId);
      return;
    }

    const byName = mapProductNameToCode(product.productName);
    if (byName) {
      availableCodes.add(byName);
    }
  });

  return availableCodes;
}

function mapSpeakerTypeToMoodOptionId(musicType?: string): MoodOptionId {
  if (musicType === "HOMECAFE") {
    return "home-cafe";
  }

  if (musicType === "MOVIE") {
    return "movie-night";
  }

  if (musicType === "FOCUSING") {
    return "focus-mode";
  }

  if (musicType === "REST") {
    return "rest";
  }

  return "custom";
}


function mapCapsuleTempToTemperatureLevel(value: string): TemperatureLevel | null {
  if (value === "LOW") {
    return "low";
  }

  if (value === "MIDDLE") {
    return "middle";
  }

  if (value === "HIGH") {
    return "high";
  }

  return null;
}

function mapCapsuleNameToBrand(name: string) {
  const normalized = name.trim().toLowerCase();

  if (normalized.startsWith("v") || normalized.includes("velocity")) {
    return "velocity";
  }

  if (normalized.startsWith("s") || normalized.includes("stone")) {
    return "stoneandbean";
  }

  return "";
}

function getSafeNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function getSafeString(value: string | null | undefined, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function getSafeCapsuleName(value: string | null | undefined, fallback: string) {
  return getSafeString(value, fallback);
}

function mapMoodOptionIdToColorsetMain(selectedMoodId: MoodOptionId) {
  if (selectedMoodId === "rest") {
    return "#5A48C2";
  }

  if (selectedMoodId === "focus-mode") {
    return "#1E4F3D";
  }

  if (selectedMoodId === "movie-night") {
    return "#3B3E73";
  }

  return "#A36D00";
}

function resolveTotalExtractionMl(rawTotalMl: number, fallback: 80 | 220): 80 | 220 {
  if (rawTotalMl === 80 || rawTotalMl === 220) {
    return rawTotalMl;
  }

  return fallback;
}

export function mapMoodCustomListItemToSavedMoodCustom(
  item: MoodCustomListResponseDTO,
): SavedMoodCustom {
  const customProduct = item.customProduct ?? {};
  const nextProducts: SavedMoodCustom["custom_product"] = [];
  const selectedMoodId = mapSpeakerTypeToMoodOptionId(
    customProduct.speakerCustom?.musicType,
  );

  if (customProduct.coffeeCustom) {
    const option = getProductOptionByType("coffee_machine");
    const coffee = customProduct.coffeeCustom;
    const firstCapsuleName = getSafeCapsuleName(coffee.capsule1Name, "기본 캡슐");
    const secondCapsuleName = getSafeCapsuleName(
      coffee.capsule2Name,
      "캡슐 미선택",
    );
    const summaryName = getSafeString(coffee.recipeName);
    const summary = summaryName.length > 0 ? summaryName : "Coffee recipe";
    const totalMlBySteps =
      getSafeNumber(coffee.capsule1Step1) +
      getSafeNumber(coffee.capsule2Step2) +
      getSafeNumber(coffee.capsule1Step3) +
      getSafeNumber(coffee.capsule2Step4);
    const totalExtractionMl = resolveTotalExtractionMl(totalMlBySteps, 220);
    const normalizedSteps = normalizeExtractionSteps(totalExtractionMl, {
      capsule1Step1: getSafeNumber(coffee.capsule1Step1),
      capsule2Step2: getSafeNumber(coffee.capsule2Step2),
      capsule1Step3: getSafeNumber(coffee.capsule1Step3),
      capsule2Step4: getSafeNumber(coffee.capsule2Step4),
    });
    const mappedTemperature = mapCapsuleTempToTemperatureLevel(coffee.capsuleTemp);

    nextProducts.push({
      product_type: "coffee_machine",
      product_code: option?.product_code ?? "COFFEE01",
      product_label: option?.label ?? "Coffee Machine",
      config: {
        product_code: option?.product_code ?? "COFFEE01",
        first_capsule: {
          capsule_id: coffeeCapsuleAssets[0]?.capsule_id ?? "capsule-01",
          image_src: coffeeCapsuleAssets[0]?.image_src ?? "",
          capsule_brand: mapCapsuleNameToBrand(firstCapsuleName),
          capsule_name: firstCapsuleName,
        },
        second_capsule: {
          capsule_id: coffeeCapsuleAssets[1]?.capsule_id ?? "capsule-02",
          image_src: coffeeCapsuleAssets[1]?.image_src ?? "",
          capsule_brand: mapCapsuleNameToBrand(secondCapsuleName),
          capsule_name: secondCapsuleName,
        },
        temperature: mappedTemperature ?? "middle",
        total_extraction_type: totalExtractionMl === 80 ? "espresso" : "lungo",
        total_extraction_ml: totalExtractionMl,
        capsule1_step1: normalizedSteps.capsule1Step1,
        capsule2_step2: normalizedSteps.capsule2Step2,
        capsule1_step3: normalizedSteps.capsule1Step3,
        capsule2_step4: normalizedSteps.capsule2Step4,
        capsule1_size:
          getSafeNumber(coffee.capsule1Size) ||
          normalizedSteps.capsule1Step1 + normalizedSteps.capsule1Step3,
        capsule2_size:
          getSafeNumber(coffee.capsule2Size) ||
          normalizedSteps.capsule2Step2 + normalizedSteps.capsule2Step4,
      },
      summary: `${summary}, ${totalExtractionMl}ml`,
    });
  }

  if (customProduct.lightCustom) {
    const option = getProductOptionByType("light");

    nextProducts.push({
      product_type: "light",
      product_code: option?.product_code ?? "LIGHT01",
      product_label: option?.label ?? "Light",
      config: null,
      summary: `${customProduct.lightCustom.lightColor}, ${customProduct.lightCustom.lightBright}/10`,
    });
  }

  if (customProduct.speakerCustom) {
    const option = getProductOptionByType("speaker");
    const speakerMusicType = getSafeString(
      mapSpeakerMusicTypeToLabel(customProduct.speakerCustom.musicType),
      "Speaker",
    );

    nextProducts.push({
      product_type: "speaker",
      product_code: option?.product_code ?? "SPEAKER01",
      product_label: option?.label ?? "Speaker",
      config: null,
      summary: `${speakerMusicType}, ${customProduct.speakerCustom.volume}/10`,
    });
  }

  return {
    mood_id: String(item.moodId),
    mood_name: item.moodName,
    colorset_main:
      getSafeString(item.colorsetMain) || mapMoodOptionIdToColorsetMain(selectedMoodId),
    selected_mood_id: selectedMoodId,
    custom_product: nextProducts,
  };
}

export function mapMoodOptionIdToColorsetId(selectedMoodId: MoodOptionId | null) {
  if (selectedMoodId === "rest") {
    return 2;
  }

  if (selectedMoodId === "focus-mode") {
    return 3;
  }

  return 1;
}

export function mapMoodOptionIdToSpeakerMusicType(
  selectedMoodId: MoodOptionId | null,
): SpeakerMusicType {
  if (selectedMoodId === "home-cafe") {
    return "HOMECAFE";
  }

  if (selectedMoodId === "movie-night") {
    return "MOVIE";
  }

  if (selectedMoodId === "focus-mode") {
    return "FOCUSING";
  }

  return "REST";
}

export function buildCoffeeRecipeCustomizePayload({
  moodName: _moodName,
  moodMemo,
  config,
}: {
  moodName: string;
  moodMemo: string;
  config: CoffeeMachineConfig;
}): CoffeeRecipeCustomizeCoffeeRequestDTO {
  return buildCoffeeRecipePayloadFromConfig({
    recipeName: "아메리카노",
    recipeMemo: moodMemo,
    config,
  });
}

export function findProductTypeByCode(productCode: UserProductCode): ProductType | null {
  if (productCode === "COFFEE01") {
    return "coffee_machine";
  }

  if (productCode === "LIGHT01") {
    return "light";
  }

  if (productCode === "SPEAKER01") {
    return "speaker";
  }

  return null;
}
