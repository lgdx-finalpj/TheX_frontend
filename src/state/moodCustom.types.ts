import type {
  CoffeeCapsuleAsset as SharedCoffeeCapsuleAsset,
  CoffeeCapsuleBrandValue,
  CoffeeCapsuleInfo as SharedCoffeeCapsuleInfo,
  CoffeeCapsuleOption,
  CoffeeMachineConfig as SharedCoffeeMachineConfig,
  CoffeeMachineExtractionType,
  CoffeeMachineTemperatureLevel,
} from "@/features/coffeeMachine/types";
import type { SpeakerMusicType } from "@/api/moodCustomApi";

export type MoodOptionId =
  | "home-cafe"
  | "movie-night"
  | "focus-mode"
  | "rest"
  | "custom";

export type ProductType = "coffee_machine" | "light" | "speaker";
export type TemperatureLevel = CoffeeMachineTemperatureLevel;
export type ExtractionType = CoffeeMachineExtractionType;
export type CapsuleBrandValue = CoffeeCapsuleBrandValue;

export interface MoodOption {
  id: MoodOptionId;
  label: string;
  imageSrc: string;
}

export type CoffeeCapsuleAsset = SharedCoffeeCapsuleAsset;
export type CoffeeCapsuleInfo = SharedCoffeeCapsuleInfo;
export type CoffeeMachineConfig = SharedCoffeeMachineConfig;

export interface LightConfig {
  product_code: string;
  light_color: string;
  brightness: number;
}

export interface SpeakerConfig {
  speaker_id: string;
  product_code: string;
  music_type: SpeakerMusicType;
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
  colorset_main: string;
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

export type CapsuleBrandOption = CoffeeCapsuleOption;

export interface MoodCustomDraftContextValue {
  draft: MoodCustomDraft;
  savedMoodCustoms: SavedMoodCustom[];
  isSavedMoodCustomsLoading: boolean;
  savedMoodCustomsError: string | null;
  isApplyingDraft: boolean;
  applyDraftError: string | null;
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
  applyDraft: () => Promise<string | null>;
  refreshSavedMoodCustoms: () => Promise<void>;
  resetDraft: () => void;
}
