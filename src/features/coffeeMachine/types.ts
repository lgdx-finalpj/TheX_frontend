export type CoffeeMachineTemperatureLevel = "low" | "middle" | "high";
export type CoffeeMachineExtractionType = "espresso" | "lungo";
export type CoffeeCapsuleBrandValue = "velocity" | "stoneandbean" | "custom";

export type CoffeeExtractionStepKey =
  | "capsule1Step1"
  | "capsule2Step2"
  | "capsule1Step3"
  | "capsule2Step4";

export interface CoffeeExtractionSteps {
  capsule1Step1: number;
  capsule2Step2: number;
  capsule1Step3: number;
  capsule2Step4: number;
}

export interface CoffeeCapsuleAsset {
  capsule_id: string;
  image_src: string;
}

export interface CoffeeCapsuleInfo {
  capsule_id: string;
  capsule_brand: string;
  capsule_name: string;
  image_src: string;
}

export interface CoffeeMachineConfig {
  product_code: string;
  first_capsule: CoffeeCapsuleInfo;
  second_capsule: CoffeeCapsuleInfo;
  temperature: CoffeeMachineTemperatureLevel;
  total_extraction_type: CoffeeMachineExtractionType;
  total_extraction_ml: 80 | 220;
  capsule1_step1?: number;
  capsule2_step2?: number;
  capsule1_step3?: number;
  capsule2_step4?: number;
  capsule1_size?: number;
  capsule2_size?: number;
}

export interface CoffeeCapsuleOption {
  id: CoffeeCapsuleBrandValue;
  label: string;
  displayName: string;
  logoSrc?: string;
}

