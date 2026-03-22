import MobileLayout from "@/layouts/MobileLayout";
import RecipeDetailContent from "@/components/recipe-detail/RecipeDetailContent";
import { recipeFlavorChips, type RecipeItem } from "@/types/recipe";

const mockAiRecommendedRecipe: RecipeItem = {
  recipe_id: 999001,
  recipe_name: "\uCE74\uD398\uB77C\uB5BC",
  save_count: 128,
  recipe_type: "COFFEE",
  recipe_category: "COFFEE",
  filter_label: recipeFlavorChips[1],
  recipe_level: "EASY",
  capsule_temp1: "HIGH",
  total_size: 220,
  recipe_memo: [
  "1. 우유 캡슐 1개와 에스프레소 캡슐 1개를 장착한다.",
  "2. 부드러운 카페라떼 220mL를 만든다.",
  "[캡슐 A(우유) 추출량: 180mL,",
  "캡슐 B(커피) 추출량: 40mL로 설정]",
  "3. 온도를 90°C로 설정한다.",
  "4. 추출하기 버튼을 클릭한다.",
].join("\n"),
  is_coffee: true,
};

export default function AiRecommendedRecipeDetailPage() {
  return (
    <MobileLayout>
      <RecipeDetailContent
        pageTitle={"AI \uCD94\uCC9C \uB808\uC2DC\uD53C \uC870\uD68C"}
        backPath="/devices/coffee-machine"
        recipe={mockAiRecommendedRecipe}
      />
    </MobileLayout>
  );
}
