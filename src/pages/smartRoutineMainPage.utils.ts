import duoboImage from "@/assets/elc_icon/듀오보.png";
import lightDeviceImage from "@/assets/elc_icon/조명.png";
import speakerDeviceImage from "@/assets/elc_icon/스피커.png";
import type {
  ExecutionModalItem,
  MoodCardTheme,
  MoodRoutineCardItem,
  RecommendedMoodCustomRecord,
} from "@/types/smartRoutine";
import type { SavedMoodCustom } from "@/state/moodCustom.types";

const productTypeLabelMap: Record<string, string> = {
  coffee_machine: "커피머신",
  light: "조명",
  speaker: "스피커",
};

function toProductSettingLabel(productType: string, summary: string) {
  const productLabel = productTypeLabelMap[productType] ?? productType;
  const trimmedSummary = summary.trim();

  if (trimmedSummary.startsWith(`${productLabel} -`)) {
    return trimmedSummary;
  }

  return `${productLabel} - ${trimmedSummary}`;
}

function hexToRgba(hexColor: string, opacity: number) {
  const sanitized = hexColor.replace("#", "");
  const red = Number.parseInt(sanitized.slice(0, 2), 16);
  const green = Number.parseInt(sanitized.slice(2, 4), 16);
  const blue = Number.parseInt(sanitized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`;
}

export function getColorsetTheme(colorsetId: string): MoodCardTheme {
  const sanitized = colorsetId.trim();

  if (!/^#[0-9a-fA-F]{6}$/.test(sanitized)) {
    return {
      cardColor: "rgba(163, 109, 0, 0.5)",
      badgeColor: "#A36D00",
      itemColor: "rgba(163, 109, 0, 0.7)",
    };
  }

  return {
    cardColor: hexToRgba(sanitized, 50),
    badgeColor: sanitized,
    itemColor: hexToRgba(sanitized, 70),
  };
}

export function toSavedMoodItems(moodCustom: SavedMoodCustom): MoodRoutineCardItem[] {
  return moodCustom.custom_product.map((product) => ({
    key: product.product_type,
    label: toProductSettingLabel(product.product_type, product.summary),
  }));
}

export function toRecommendedMoodItems(
  moodCustom: RecommendedMoodCustomRecord,
): MoodRoutineCardItem[] {
  return moodCustom.custom_product.map((product) => ({
    key: `${moodCustom.mood_id}-${product.product_type}`,
    label: toProductSettingLabel(product.product_type, product.summary),
  }));
}

export function getExecutionModalItems(
  moodCustom: SavedMoodCustom,
): ExecutionModalItem[] {
  const includedProducts = new Set(
    moodCustom.custom_product.map((product) => product.product_type),
  );
  const items: ExecutionModalItem[] = [];

  if (includedProducts.has("coffee_machine")) {
    items.push({
      key: "coffee_machine",
      imageSrc: duoboImage,
      title: "듀오보",
      description: "커피 추출중",
    });
  }

  if (includedProducts.has("light")) {
    items.push({
      key: "light",
      imageSrc: lightDeviceImage,
      title: "LG 조명",
      description: "무드 커스텀 실행중",
    });
  }

  if (includedProducts.has("speaker")) {
    items.push({
      key: "speaker",
      imageSrc: speakerDeviceImage,
      title: "LG 스피커",
      description: "무드 커스텀 실행중",
    });
  }

  return items;
}
