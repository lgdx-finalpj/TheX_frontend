import {
  COFFEE_EXTRACTION_STEP_UNIT,
  COFFEE_MIN_EXTRACTION_STEP_ML,
} from "@/features/coffeeMachine/constants";
import type {
  CoffeeExtractionStepKey,
  CoffeeExtractionSteps,
  CoffeeMachineExtractionType,
  CoffeeMachineTemperatureLevel,
} from "@/features/coffeeMachine/types";

function normalizeByStepUnit(value: number) {
  return Math.round(value / COFFEE_EXTRACTION_STEP_UNIT) * COFFEE_EXTRACTION_STEP_UNIT;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function getTemperatureDraftValue(level: CoffeeMachineTemperatureLevel | null) {
  if (level === "low") {
    return 0;
  }

  if (level === "middle") {
    return 50;
  }

  if (level === "high") {
    return 100;
  }

  return 50;
}

export function getTemperatureLevelFromValue(value: number): CoffeeMachineTemperatureLevel {
  if (value < 34) {
    return "low";
  }

  if (value < 67) {
    return "middle";
  }

  return "high";
}

export function getTemperatureLabel(level: CoffeeMachineTemperatureLevel | null) {
  if (level === "low") {
    return "Low";
  }

  if (level === "middle") {
    return "Middle";
  }

  if (level === "high") {
    return "High";
  }

  return "";
}

export function getExtractionLabel(type: CoffeeMachineExtractionType | null) {
  if (type === "espresso") {
    return "espresso (80ml)";
  }

  if (type === "lungo") {
    return "lungo (220ml)";
  }

  return "";
}

export function getExtractionTotalByType(type: CoffeeMachineExtractionType | null): 80 | 220 | null {
  if (type === "espresso") {
    return 80;
  }

  if (type === "lungo") {
    return 220;
  }

  return null;
}

export function getDefaultExtractionSteps(totalExtractionMl: 80 | 220): CoffeeExtractionSteps {
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

export function normalizeExtractionSteps(
  totalExtractionMl: 80 | 220,
  source: Partial<CoffeeExtractionSteps>,
): CoffeeExtractionSteps {
  const fallback = getDefaultExtractionSteps(totalExtractionMl);
  const step1Candidate = Number.isFinite(source.capsule1Step1)
    ? Number(source.capsule1Step1)
    : fallback.capsule1Step1;
  const step2Candidate = Number.isFinite(source.capsule2Step2)
    ? Number(source.capsule2Step2)
    : fallback.capsule2Step2;
  const step3Candidate = Number.isFinite(source.capsule1Step3)
    ? Number(source.capsule1Step3)
    : fallback.capsule1Step3;

  const step1Max = totalExtractionMl - COFFEE_MIN_EXTRACTION_STEP_ML * 3;
  const step1 = clamp(
    normalizeByStepUnit(step1Candidate),
    COFFEE_MIN_EXTRACTION_STEP_ML,
    step1Max,
  );

  const step2Max = totalExtractionMl - step1 - COFFEE_MIN_EXTRACTION_STEP_ML * 2;
  const step2 = clamp(
    normalizeByStepUnit(step2Candidate),
    COFFEE_MIN_EXTRACTION_STEP_ML,
    step2Max,
  );

  const step3Max = totalExtractionMl - step1 - step2 - COFFEE_MIN_EXTRACTION_STEP_ML;
  const step3 = clamp(
    normalizeByStepUnit(step3Candidate),
    COFFEE_MIN_EXTRACTION_STEP_ML,
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

export function isEditableExtractionStepKey(
  stepKey: CoffeeExtractionStepKey,
): stepKey is "capsule1Step1" | "capsule2Step2" | "capsule1Step3" {
  return stepKey !== "capsule2Step4";
}

export function getEditableStepMax(
  totalExtractionMl: 80 | 220,
  stepKey: "capsule1Step1" | "capsule2Step2" | "capsule1Step3",
  steps: CoffeeExtractionSteps,
) {
  if (stepKey === "capsule1Step1") {
    return totalExtractionMl - COFFEE_MIN_EXTRACTION_STEP_ML * 3;
  }

  if (stepKey === "capsule2Step2") {
    return totalExtractionMl - steps.capsule1Step1 - COFFEE_MIN_EXTRACTION_STEP_ML * 2;
  }

  return (
    totalExtractionMl -
    steps.capsule1Step1 -
    steps.capsule2Step2 -
    COFFEE_MIN_EXTRACTION_STEP_ML
  );
}

export function getCoffeeExtractionSummary(
  steps: CoffeeExtractionSteps,
  firstCapsuleName: string,
  secondCapsuleName: string,
) {
  const capsule1Size = steps.capsule1Step1 + steps.capsule1Step3;
  const capsule2Size = steps.capsule2Step2 + steps.capsule2Step4;
  return `${firstCapsuleName} ${capsule1Size}ml · ${secondCapsuleName} ${capsule2Size}ml`;
}

