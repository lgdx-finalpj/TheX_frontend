import coffeeBrandLogo1 from "@/assets/coffee_brand_logo/커피 브랜드 로고1.png";
import coffeeBrandLogo2 from "@/assets/coffee_brand_logo/커피 브랜드 로고2.png";
import coffeeCapsule1Image from "@/assets/coffee_capsule/coffeecapsule1.png";
import coffeeCapsule2Image from "@/assets/coffee_capsule/coffeecapsule2.png";
import type {
  CoffeeCapsuleAsset,
  CoffeeCapsuleOption,
  CoffeeExtractionStepKey,
} from "@/features/coffeeMachine/types";

export const DEFAULT_COFFEE_CAPSULE_NAMES = {
  first: "V1",
  second: "S1",
} as const;

export const COFFEE_EXTRACTION_STEP_UNIT = 10;
export const COFFEE_MIN_EXTRACTION_STEP_ML = 10;

export const coffeeCapsuleAssets: CoffeeCapsuleAsset[] = [
  {
    capsule_id: "capsule-01",
    image_src: coffeeCapsule1Image,
  },
  {
    capsule_id: "capsule-02",
    image_src: coffeeCapsule2Image,
  },
];

export const capsuleBrandOptions: CoffeeCapsuleOption[] = [
  {
    id: "velocity",
    label: "VelocityCoffee",
    displayName: "VelocityCoffee",
    logoSrc: coffeeBrandLogo1,
  },
  {
    id: "stoneandbean",
    label: "StoneandBean",
    displayName: "StoneandBean",
    logoSrc: coffeeBrandLogo2,
  },
];

export const capsuleNameOptions: CoffeeCapsuleOption[] = [
  {
    id: "velocity",
    label: "V1",
    displayName: "V1",
    logoSrc: coffeeCapsule1Image,
  },
  {
    id: "stoneandbean",
    label: "S1",
    displayName: "S1",
    logoSrc: coffeeCapsule2Image,
  },
];

export const COFFEE_EDITABLE_EXTRACTION_STEP_KEYS: Array<
  "capsule1Step1" | "capsule2Step2" | "capsule1Step3"
> = ["capsule1Step1", "capsule2Step2", "capsule1Step3"];

export function getCoffeeStepLabel(stepKey: CoffeeExtractionStepKey) {
  if (stepKey === "capsule1Step1") {
    return "1단계 (V1)";
  }

  if (stepKey === "capsule2Step2") {
    return "2단계 (S1)";
  }

  if (stepKey === "capsule1Step3") {
    return "3단계 (V1)";
  }

  return "4단계 (S1, 자동)";
}

