import { useEffect, useState } from "react";
import {
  getSavedRecipeIds,
  subscribeSavedRecipes,
} from "@/utils/savedRecipes";

export default function useSavedRecipeIds() {
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(() =>
    getSavedRecipeIds(),
  );

  useEffect(() => {
    setSavedRecipeIds(getSavedRecipeIds());

    return subscribeSavedRecipes(() => {
      setSavedRecipeIds(getSavedRecipeIds());
    });
  }, []);

  return savedRecipeIds;
}
