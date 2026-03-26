import type { CoffeeRecipeDetailResponse } from "@/api/recipeApi";
import { coffeeCapsuleAssets } from "@/features/coffeeMachine/constants";
import type {
  CoffeeMachineConfig,
  CoffeeMachineTemperatureLevel,
} from "@/features/coffeeMachine/types";
import type { RecipeCategory, RecipeLevel } from "@/types/recipe";

export interface CoffeeRecipeEditState {
  mode: "edit";
  recipeId: number;
  isCoffee: true;
  recipeName: string;
  recipeMemo: string;
  recipeLevel: RecipeLevel;
  initialConfig: CoffeeMachineConfig;
}

export interface NonCoffeeRecipeEditState {
  mode: "edit";
  recipeId: number;
  isCoffee: false;
  recipeCategory: Exclude<RecipeCategory, "COFFEE">;
  recipeName: string;
  ingredient: string;
  totalSize: string;
  recipeLevel: RecipeLevel;
  recipeContent: string;
}

export type RecipeEditState = CoffeeRecipeEditState | NonCoffeeRecipeEditState;

function mapCapsuleTempToLevel(
  capsuleTemp: CoffeeRecipeDetailResponse["capsuleTemp"],
): CoffeeMachineTemperatureLevel {
  if (capsuleTemp === "LOW") {
    return "low";
  }

  if (capsuleTemp === "MIDDLE") {
    return "middle";
  }

  return "high";
}

function inferCapsuleBrand(capsuleName: string | null | undefined) {
  if (capsuleName?.trim().toUpperCase() === "S1") {
    return "stoneandbean" as const;
  }

  return "velocity" as const;
}

function inferExtractionType(totalSize: number) {
  return totalSize <= 80 ? "espresso" : "lungo";
}

export function buildRecipeEditState(
  detail: CoffeeRecipeDetailResponse,
): RecipeEditState {
  if (detail.recipeCategory === "COFFEE") {
    const totalExtractionMl =
      detail.capsule1Size && detail.capsule2Size
        ? detail.capsule1Size + detail.capsule2Size
        : detail.totalSize ?? 220;
    const firstCapsuleName = detail.capsule1Name?.trim() || "V1";
    const secondCapsuleName = detail.capsule2Name?.trim() || "S1";

    return {
      mode: "edit",
      recipeId: detail.recipeId,
      isCoffee: true,
      recipeName: detail.recipeName,
      recipeMemo: detail.recipeMemo ?? "",
      recipeLevel: detail.recipeLevel ?? "EASY",
      initialConfig: {
        product_code: "COFFEE001",
        first_capsule: {
          capsule_id: coffeeCapsuleAssets[0]?.capsule_id ?? "capsule-01",
          image_src: coffeeCapsuleAssets[0]?.image_src ?? "",
          capsule_brand: inferCapsuleBrand(firstCapsuleName),
          capsule_name: firstCapsuleName,
        },
        second_capsule: {
          capsule_id: coffeeCapsuleAssets[1]?.capsule_id ?? "capsule-02",
          image_src: coffeeCapsuleAssets[1]?.image_src ?? "",
          capsule_brand: inferCapsuleBrand(secondCapsuleName),
          capsule_name: secondCapsuleName,
        },
        temperature: mapCapsuleTempToLevel(detail.capsuleTemp),
        total_extraction_type: inferExtractionType(totalExtractionMl),
        total_extraction_ml: totalExtractionMl <= 80 ? 80 : 220,
        capsule1_step1: detail.capsule1Step1 ?? undefined,
        capsule2_step2: detail.capsule2Step2 ?? undefined,
        capsule1_step3: detail.capsule1Step3 ?? undefined,
        capsule2_step4: detail.capsule2Step4 ?? undefined,
        capsule1_size: detail.capsule1Size ?? undefined,
        capsule2_size: detail.capsule2Size ?? undefined,
      },
    };
  }

  return {
    mode: "edit",
    recipeId: detail.recipeId,
    isCoffee: false,
    recipeCategory: detail.recipeCategory,
    recipeName: detail.recipeName,
    ingredient: detail.ingredient ?? "",
    totalSize: String(detail.totalSize ?? ""),
    recipeLevel: detail.recipeLevel ?? "EASY",
    recipeContent: detail.recipeContent ?? "",
  };
}

export function isRecipeEditState(value: unknown): value is RecipeEditState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<RecipeEditState>;

  return candidate.mode === "edit" && typeof candidate.recipeId === "number";
}
