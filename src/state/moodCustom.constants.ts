import coffeeBrandLogo1 from "@/assets/coffee_brand_logo/커피 브랜드 로고1.png";
import coffeeBrandLogo2 from "@/assets/coffee_brand_logo/커피 브랜드 로고2.png";
import coffeeMachineImage from "@/assets/elc_icon/커피머신.png";
import fridgeImage from "@/assets/elc_icon/냉장고.png";
import lightImage from "@/assets/elc_icon/조명.png";
import speakerImage from "@/assets/elc_icon/스피커.png";
import coffeeCapsule1Image from "@/assets/coffee_capsule/coffeecapsule1.png";
import coffeeCapsule2Image from "@/assets/coffee_capsule/coffeecapsule2.png";
import customMoodImage from "@/assets/moodcustom/직접만들기무드.png";
import focusMoodImage from "@/assets/moodcustom/집중무드.png";
import homeCafeMoodImage from "@/assets/moodcustom/홈카페무드.png";
import movieMoodImage from "@/assets/moodcustom/영화무드.png";
import restMoodImage from "@/assets/moodcustom/휴식무드.png";
import type {
  CapsuleBrandOption,
  CoffeeCapsuleAsset,
  MoodCustomDraft,
  MoodOption,
  ProductOption,
} from "@/state/moodCustom.types";

export const defaultDraft: MoodCustomDraft = {
  mood_id: "",
  user_id: "user0000001",
  colorset_id: "",
  mood_name: "",
  mood_memo: "",
  custom_product: [],
  is_shared: false,
  save_count: 0,
  selected_mood_id: null,
};

export const moodOptions: MoodOption[] = [
  { id: "home-cafe", label: "홈카페", imageSrc: homeCafeMoodImage },
  { id: "movie-night", label: "영화 감상", imageSrc: movieMoodImage },
  { id: "focus-mode", label: "집중 모드", imageSrc: focusMoodImage },
  { id: "rest", label: "휴식", imageSrc: restMoodImage },
  { id: "custom", label: "직접 만들기", imageSrc: customMoodImage },
];

export const productOptions: ProductOption[] = [
  {
    id: "coffee_machine",
    label: "커피머신",
    product_code: "COFFEE01",
    imageSrc: coffeeMachineImage,
    previewClassName: "product-option-coffee-machine",
  },
  {
    id: "light",
    label: "조명",
    product_code: "LIGHT01",
    imageSrc: lightImage,
    previewClassName: "product-option-light",
  },
  {
    id: "speaker",
    label: "스피커",
    product_code: "SPEAKER01",
    imageSrc: speakerImage,
    previewClassName: "product-option-speaker",
  },
];

export const displayOnlyProductOptions = [
  ...productOptions,
  {
    id: "fridge",
    label: "냉장고",
    product_code: "FRIDGE01",
    imageSrc: fridgeImage,
    previewClassName: "product-option-fridge",
  },
] as const;

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

export const capsuleBrandOptions: CapsuleBrandOption[] = [
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
  {
    id: "custom",
    label: "직접 입력",
    displayName: "직접 입력",
  },
];

export const lightColorOptions = [
  "Warm White",
  "Soft White",
  "Daylight",
  "Amber",
  "Orange",
  "Blue",
  "Purple",
];

export const speakerMusicOptions = [
  "Jazz",
  "Acoustic",
  "Classical",
  "Cafe BGM",
  "Chill",
  "K-pop",
  "Musical",
];
