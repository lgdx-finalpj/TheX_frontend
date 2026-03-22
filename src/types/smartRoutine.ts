import type { ProductType } from "@/state/moodCustom.types";

export interface MoodColorsetRecord {
  colorset_id: string;
  colorset_name: string;
  colorset_main: string;
  color_opacity1: number;
  color_opacity2: number;
  color_opacity3: number;
}

export interface RecommendedCustomProduct {
  product_type: string;
  summary: string;
}

export interface RecommendedMoodCustomRecord {
  mood_id: string;
  user_id: string;
  colorset_id: string;
  mood_name: string;
  custom_product: RecommendedCustomProduct[];
  is_shared: boolean;
  save_count: number;
}

export interface MoodCardTheme {
  cardColor: string;
  badgeColor: string;
  itemColor: string;
}

export interface MoodRoutineCardItem {
  key: string;
  label: string;
}

export interface ExecutionModalItem {
  key: ProductType;
  imageSrc: string;
  title: string;
  description: string;
}
