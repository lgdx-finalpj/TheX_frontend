import { useEffect, useState } from "react";
import {
  getHiddenMyRecipeIds,
  subscribeHiddenMyRecipes,
} from "@/utils/savedRecipes";

export default function useHiddenMyRecipeIds() {
  const [hiddenMyRecipeIds, setHiddenMyRecipeIds] = useState<string[]>(() =>
    getHiddenMyRecipeIds(),
  );

  useEffect(() => {
    setHiddenMyRecipeIds(getHiddenMyRecipeIds());

    return subscribeHiddenMyRecipes(() => {
      setHiddenMyRecipeIds(getHiddenMyRecipeIds());
    });
  }, []);

  return hiddenMyRecipeIds;
}
