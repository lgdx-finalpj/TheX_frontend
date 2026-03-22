import type {
  CoffeeRecipeCustomizeCoffeeRequestDTO,
  MoodCustomListResponseDTO,
  MyProductListResponseDTO,
  SpeakerMusicType,
} from "@/api/moodCustomApi";
import { coffeeCapsuleAssets } from "@/state/moodCustom.constants";
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

const EXTRACTION_STEP_UNIT = 10;
const MIN_EXTRACTION_STEP_ML = 10;

type CoffeeExtractionSteps = {
  capsule1Step1: number;
  capsule2Step2: number;
  capsule1Step3: number;
  capsule2Step4: number;
};

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

function mapSpeakerTypeToMoodOptionId(musicType?: SpeakerMusicType): MoodOptionId {
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

function mapSpeakerTypeToSummary(musicType: SpeakerMusicType) {
  if (musicType === "HOMECAFE") {
    return "Home Cafe";
  }

  if (musicType === "MOVIE") {
    return "Movie";
  }

  if (musicType === "FOCUSING") {
    return "Focusing";
  }

  return "Rest";
}

function mapCapsuleTempToTemperatureLevel(
  value: string,
): TemperatureLevel | null {
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

  if (normalized.startsWith("v")) {
    return "velocity";
  }

  if (normalized.startsWith("s")) {
    return "stoneandbean";
  }

  if (normalized.includes("velocity")) {
    return "velocity";
  }

  if (normalized.includes("stone")) {
    return "stoneandbean";
  }

  return "";
}

function normalizeByStepUnit(value: number) {
  return Math.round(value / EXTRACTION_STEP_UNIT) * EXTRACTION_STEP_UNIT;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function getDefaultCoffeeExtractionSteps(
  totalExtractionMl: 80 | 220,
): CoffeeExtractionSteps {
  if (totalExtractionMl === 80) {
    return {
      capsule1Step1: 20,
      capsule2Step2: 20,
      capsule1Step3: 20,
      capsule2Step4: 20,
    };
  }

  return {
    capsule1Step1: 60,
    capsule2Step2: 50,
    capsule1Step3: 60,
    capsule2Step4: 50,
  };
}

function resolveTotalExtractionMl(
  rawTotalMl: number,
  fallback: 80 | 220,
): 80 | 220 {
  if (rawTotalMl === 80 || rawTotalMl === 220) {
    return rawTotalMl;
  }

  return fallback;
}

function normalizeCoffeeExtractionSteps(
  totalExtractionMl: 80 | 220,
  source: Partial<CoffeeExtractionSteps>,
): CoffeeExtractionSteps {
  const fallback = getDefaultCoffeeExtractionSteps(totalExtractionMl);
  const step1Candidate = Number.isFinite(source.capsule1Step1)
    ? Number(source.capsule1Step1)
    : fallback.capsule1Step1;
  const step2Candidate = Number.isFinite(source.capsule2Step2)
    ? Number(source.capsule2Step2)
    : fallback.capsule2Step2;
  const step3Candidate = Number.isFinite(source.capsule1Step3)
    ? Number(source.capsule1Step3)
    : fallback.capsule1Step3;

  const step1Max = totalExtractionMl - MIN_EXTRACTION_STEP_ML * 3;
  const step1 = clamp(
    normalizeByStepUnit(step1Candidate),
    MIN_EXTRACTION_STEP_ML,
    step1Max,
  );

  const step2Max = totalExtractionMl - step1 - MIN_EXTRACTION_STEP_ML * 2;
  const step2 = clamp(
    normalizeByStepUnit(step2Candidate),
    MIN_EXTRACTION_STEP_ML,
    step2Max,
  );

  const step3Max = totalExtractionMl - step1 - step2 - MIN_EXTRACTION_STEP_ML;
  const step3 = clamp(
    normalizeByStepUnit(step3Candidate),
    MIN_EXTRACTION_STEP_ML,
    step3Max,
  );

  const step4 = totalExtractionMl - step1 - step2 - step3;

  return {
    capsule1Step1: step1,
    capsule2Step2: step2,
    capsule1Step3: step3,
    capsule2Step4: step4,
  };
}

function mapCapsuleNameToCapsuleId(name: string, fallbackId: number) {
  const normalized = name.trim().toLowerCase();

  if (normalized === "v1" || normalized.includes("velocity")) {
    return 1;
  }

  if (normalized === "s1" || normalized.includes("stone")) {
    return 2;
  }

  return fallbackId;
}

export function mapMoodCustomListItemToSavedMoodCustom(
  item: MoodCustomListResponseDTO,
): SavedMoodCustom {
  const customProduct = item.customProduct ?? {};
  const nextProducts: SavedMoodCustom["custom_product"] = [];

  if (customProduct.coffeeCustom) {
    const option = getProductOptionByType("coffee_machine");
    const coffee = customProduct.coffeeCustom;
    const summaryName = coffee.recipeName.trim();
    const summary = summaryName.length > 0 ? summaryName : "Coffee recipe";
    const totalMlBySteps =
      coffee.capsule1Step1 +
      coffee.capsule2Step2 +
      coffee.capsule1Step3 +
      coffee.capsule2Step4;
    const totalExtractionMl = resolveTotalExtractionMl(totalMlBySteps, 220);
    const normalizedSteps = normalizeCoffeeExtractionSteps(totalExtractionMl, {
      capsule1Step1: coffee.capsule1Step1,
      capsule2Step2: coffee.capsule2Step2,
      capsule1Step3: coffee.capsule1Step3,
      capsule2Step4: coffee.capsule2Step4,
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
          capsule_brand: mapCapsuleNameToBrand(coffee.capsule1Name),
          capsule_name: coffee.capsule1Name,
        },
        second_capsule: {
          capsule_id: coffeeCapsuleAssets[1]?.capsule_id ?? "capsule-02",
          image_src: coffeeCapsuleAssets[1]?.image_src ?? "",
          capsule_brand: mapCapsuleNameToBrand(coffee.capsule2Name),
          capsule_name: coffee.capsule2Name,
        },
        temperature: mappedTemperature ?? "middle",
        total_extraction_type: totalExtractionMl === 80 ? "espresso" : "lungo",
        total_extraction_ml: totalExtractionMl,
        capsule1_step1: normalizedSteps.capsule1Step1,
        capsule2_step2: normalizedSteps.capsule2Step2,
        capsule1_step3: normalizedSteps.capsule1Step3,
        capsule2_step4: normalizedSteps.capsule2Step4,
        capsule1_size:
          normalizedSteps.capsule1Step1 + normalizedSteps.capsule1Step3,
        capsule2_size:
          normalizedSteps.capsule2Step2 + normalizedSteps.capsule2Step4,
      },
      summary: `${summary} - ${totalExtractionMl}ml`,
    });
  }

  if (customProduct.lightCustom) {
    const option = getProductOptionByType("light");

    nextProducts.push({
      product_type: "light",
      product_code: option?.product_code ?? "LIGHT01",
      product_label: option?.label ?? "Light",
      config: null,
      summary: `${customProduct.lightCustom.lightColor}, ${customProduct.lightCustom.lightBright}%`,
    });
  }

  if (customProduct.speakerCustom) {
    const option = getProductOptionByType("speaker");

    nextProducts.push({
      product_type: "speaker",
      product_code: option?.product_code ?? "SPEAKER01",
      product_label: option?.label ?? "Speaker",
      config: null,
      summary: `${mapSpeakerTypeToSummary(customProduct.speakerCustom.musicType)}, ${customProduct.speakerCustom.volume}%`,
    });
  }

  return {
    mood_id: String(item.moodId),
    mood_name: item.moodName,
    selected_mood_id: mapSpeakerTypeToMoodOptionId(
      customProduct.speakerCustom?.musicType,
    ),
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

function mapTemperatureLevelToCapsuleTemp(level: TemperatureLevel): "LOW" | "MIDDLE" | "HIGH" {
  if (level === "low") {
    return "LOW";
  }

  if (level === "middle") {
    return "MIDDLE";
  }

  return "HIGH";
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
  const totalExtractionMl = config.total_extraction_ml;
  const steps = normalizeCoffeeExtractionSteps(totalExtractionMl, {
    capsule1Step1: config.capsule1_step1,
    capsule2Step2: config.capsule2_step2,
    capsule1Step3: config.capsule1_step3,
    capsule2Step4: config.capsule2_step4,
  });
  const cleanMemo = moodMemo.trim();
  const capsule1Name = config.first_capsule.capsule_name;
  const capsule2Name = config.second_capsule.capsule_name;

  return {
    recipeName: "아메리카노",
    recipeCategory: "COFFEE",
    capsule1Id: mapCapsuleNameToCapsuleId(capsule1Name, 1),
    capsule2Id: mapCapsuleNameToCapsuleId(capsule2Name, 2),
    capsuleTemp: mapTemperatureLevelToCapsuleTemp(config.temperature),
    capsule1Size: steps.capsule1Step1 + steps.capsule1Step3,
    capsule2Size: steps.capsule2Step2 + steps.capsule2Step4,
    capsule1Step1: steps.capsule1Step1,
    capsule2Step2: steps.capsule2Step2,
    capsule1Step3: steps.capsule1Step3,
    capsule2Step4: steps.capsule2Step4,
    addObj: `${capsule1Name}, ${capsule2Name}`,
    recipeMemo: cleanMemo,
    recipeLevel: "EASY",
  };
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
