import type {
  MoodColorsetRecord,
  RecommendedMoodCustomRecord,
} from "@/types/smartRoutine";

export const moodColorsetMock: MoodColorsetRecord[] = [
  {
    colorset_id: "#A36D00",
    colorset_name: "홈카페",
    colorset_main: "#A36D00",
    color_opacity1: 30,
    color_opacity2: 50,
    color_opacity3: 100,
  },
  {
    colorset_id: "#5A48C2",
    colorset_name: "휴식",
    colorset_main: "#5A48C2",
    color_opacity1: 30,
    color_opacity2: 50,
    color_opacity3: 100,
  },
  {
    colorset_id: "#1E4F3D",
    colorset_name: "집중 모드",
    colorset_main: "#1E4F3D",
    color_opacity1: 30,
    color_opacity2: 50,
    color_opacity3: 100,
  },
];

export const recommendedMoodCustomsMock: RecommendedMoodCustomRecord[] = [
  {
    mood_id: "mood-8f21a7",
    user_id: "user3141592",
    colorset_id: "#A36D00",
    mood_name: "홈카페",
    custom_product: [
      { product_type: "coffee_machine", summary: "커피머신 - 에스프레소 2샷" },
      { product_type: "light", summary: "조명 - Warm Orange, 30%" },
      { product_type: "speaker", summary: "스피커 - Jazz Playlist, 60%" },
    ],
    is_shared: true,
    save_count: 87,
  },
  {
    mood_id: "mood-5b93ce",
    user_id: "user2718281",
    colorset_id: "#5A48C2",
    mood_name: "휴식",
    custom_product: [
      { product_type: "coffee_machine", summary: "커피머신 - 카페라떼" },
      { product_type: "light", summary: "조명 - Warm White, 25%" },
      { product_type: "speaker", summary: "스피커 - Acoustic Chill, 40%" },
    ],
    is_shared: true,
    save_count: 64,
  },
  {
    mood_id: "mood-c71d42",
    user_id: "user1618033",
    colorset_id: "#1E4F3D",
    mood_name: "집중 모드",
    custom_product: [
      { product_type: "coffee_machine", summary: "커피머신 - 아메리카노 진하게" },
      { product_type: "light", summary: "조명 - Daylight, 80%" },
      { product_type: "speaker", summary: "스피커 - Lo-fi Study, 30%" },
    ],
    is_shared: true,
    save_count: 92,
  },
];
