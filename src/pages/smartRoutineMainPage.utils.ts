import duoboImage from "@/assets/elc_icon/듀오보.png";
import lightDeviceImage from "@/assets/elc_icon/조명.png";
import speakerDeviceImage from "@/assets/elc_icon/스피커.png";
import { moodColorsetMock } from "@/pages/smartRoutineMainPage.mocks";
import type {
  ExecutionModalItem,
  MoodCardTheme,
  MoodRoutineCardItem,
  RecommendedMoodCustomRecord,
} from "@/types/smartRoutine";
import type { MoodOptionId, SavedMoodCustom } from "@/state/moodCustom.types";

function hexToRgba(hexColor: string, opacity: number) {
  const sanitized = hexColor.replace("#", "");
  const red = Number.parseInt(sanitized.slice(0, 2), 16);
  const green = Number.parseInt(sanitized.slice(2, 4), 16);
  const blue = Number.parseInt(sanitized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`;
}

export function getColorsetTheme(colorsetId: string): MoodCardTheme {
  const colorset = moodColorsetMock.find(
    (item) => item.colorset_id === colorsetId,
  );

  if (!colorset) {
    return {
      cardColor: "rgba(163, 109, 0, 0.3)",
      badgeColor: "#A36D00",
      itemColor: "rgba(163, 109, 0, 0.5)",
    };
  }

  return {
    cardColor: hexToRgba(colorset.colorset_main, colorset.color_opacity1),
    badgeColor: hexToRgba(colorset.colorset_main, colorset.color_opacity3),
    itemColor: hexToRgba(colorset.colorset_main, colorset.color_opacity2),
  };
}

export function getMoodTheme(selectedMoodId: MoodOptionId): MoodCardTheme {
  if (selectedMoodId === "home-cafe") {
    return getColorsetTheme("#A36D00");
  }

  if (selectedMoodId === "rest") {
    return getColorsetTheme("#5A48C2");
  }

  if (selectedMoodId === "focus-mode") {
    return getColorsetTheme("#1E4F3D");
  }

  if (selectedMoodId === "movie-night") {
    return {
      cardColor: "rgba(59, 62, 115, 0.3)",
      badgeColor: "#3B3E73",
      itemColor: "rgba(59, 62, 115, 0.5)",
    };
  }

  return {
    cardColor: "rgba(121, 72, 152, 0.3)",
    badgeColor: "#794898",
    itemColor: "rgba(121, 72, 152, 0.5)",
  };
}

export function toSavedMoodItems(moodCustom: SavedMoodCustom): MoodRoutineCardItem[] {
  return moodCustom.custom_product.map((product) => ({
    key: product.product_type,
    label: product.summary,
  }));
}

export function toRecommendedMoodItems(
  moodCustom: RecommendedMoodCustomRecord,
): MoodRoutineCardItem[] {
  return moodCustom.custom_product.map((product) => ({
    key: `${moodCustom.mood_id}-${product.product_type}`,
    label: product.summary,
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
