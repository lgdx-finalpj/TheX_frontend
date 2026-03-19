export type MoodOptionId =
  | "home-cafe"
  | "movie-night"
  | "focus-mode"
  | "rest"
  | "custom";

export type ProductType = "coffee_machine" | "light" | "speaker";
export type TemperatureLevel = "low" | "middle" | "high";
export type ExtractionType = "espresso" | "lungo";
export type CapsuleBrandValue = "velocity" | "stoneandbean" | "custom";

export interface MoodOption {
  id: MoodOptionId;
  label: string;
  imageSrc: string;
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
  temperature: TemperatureLevel;
  total_extraction_type: ExtractionType;
  total_extraction_ml: 80 | 220;
}

export interface LightConfig {
  product_code: string;
  light_color: string;
  brightness: number;
}

export interface SpeakerConfig {
  speaker_id: string;
  product_code: string;
  music_type: string;
  music_link: string;
  volume: number;
}

export type ProductConfig =
  | CoffeeMachineConfig
  | LightConfig
  | SpeakerConfig;

export interface CustomProductEntry {
  product_type: ProductType;
  product_code: string;
  product_label: string;
  config: ProductConfig | null;
  summary: string;
}

export interface MoodCustomDraft {
  mood_id: string;
  user_id: string;
  colorset_id: string;
  mood_name: string;
  mood_memo: string;
  custom_product: CustomProductEntry[];
  is_shared: boolean;
  save_count: number;
  selected_mood_id: MoodOptionId | null;
}

export interface SavedMoodCustom {
  mood_id: string;
  mood_name: string;
  selected_mood_id: MoodOptionId;
  custom_product: CustomProductEntry[];
}

export interface UsersInfoRecord {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  password: string;
  machine_no: string[];
  user_nickname: string;
}

export interface ProductInfoRecord {
  product_info_id: string;
  product_name: string;
  product_code: string;
  product_no: string;
  group_id: string;
}

export interface ProductOption {
  id: ProductType;
  label: string;
  product_code: string;
  imageSrc: string;
  previewClassName: string;
}

export interface CapsuleBrandOption {
  id: CapsuleBrandValue;
  label: string;
  displayName: string;
  logoSrc?: string;
}

export interface MoodCustomDraftContextValue {
  draft: MoodCustomDraft;
  savedMoodCustoms: SavedMoodCustom[];
  setMoodName: (moodName: string) => void;
  clearMoodName: () => void;
  setSelectedMood: (moodId: MoodOptionId) => void;
  clearSelectedMood: () => void;
  addProduct: (productType: ProductType) => void;
  removeProduct: (productType: ProductType) => void;
  upsertProductConfig: (
    productType: ProductType,
    config: ProductConfig,
    summary: string,
  ) => void;
  clearProductConfig: (productType: ProductType) => void;
  applyDraft: () => boolean;
  resetDraft: () => void;
}
