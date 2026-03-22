import type {
  CoffeeRecipeCustomizeCoffeeRequestDTO,
  CapsuleTemp,
} from "@/api/moodCustomApi";
import { normalizeExtractionSteps } from "@/features/coffeeMachine/extraction";
import type {
  CoffeeMachineConfig,
  CoffeeMachineTemperatureLevel,
} from "@/features/coffeeMachine/types";

function mapTemperatureLevelToCapsuleTemp(
  level: CoffeeMachineTemperatureLevel,
): CapsuleTemp {
  if (level === "low") {
    return "LOW";
  }

  if (level === "middle") {
    return "MIDDLE";
  }

  return "HIGH";
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

export function buildCoffeeRecipePayloadFromConfig({
  recipeName = "아메리카노",
  recipeMemo,
  config,
}: {
  recipeName?: string;
  recipeMemo: string;
  config: CoffeeMachineConfig;
}): CoffeeRecipeCustomizeCoffeeRequestDTO {
  const totalExtractionMl = config.total_extraction_ml;
  const steps = normalizeExtractionSteps(totalExtractionMl, {
    capsule1Step1: config.capsule1_step1,
    capsule2Step2: config.capsule2_step2,
    capsule1Step3: config.capsule1_step3,
    capsule2Step4: config.capsule2_step4,
  });
  const cleanMemo = recipeMemo.trim();
  const capsule1Name = config.first_capsule.capsule_name;
  const capsule2Name = config.second_capsule.capsule_name;

  return {
    recipeName,
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

