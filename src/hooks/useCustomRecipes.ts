import { useEffect, useState } from "react";
import {
  getCustomRecipes,
  subscribeCustomRecipes,
} from "@/utils/customRecipes";
import type { RecipeItem } from "@/mocks/basicRecipes";

export default function useCustomRecipes() {
  const [customRecipes, setCustomRecipes] = useState<RecipeItem[]>(() =>
    getCustomRecipes(),
  );

  useEffect(() => {
    setCustomRecipes(getCustomRecipes());

    return subscribeCustomRecipes(() => {
      setCustomRecipes(getCustomRecipes());
    });
  }, []);

  return customRecipes;
}
