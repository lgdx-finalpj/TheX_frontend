import { useEffect, useState } from "react";
import {
  getSharedRecipeIds,
  subscribeSharedRecipes,
} from "@/utils/savedRecipes";

export default function useSharedRecipeIds() {
  const [sharedRecipeIds, setSharedRecipeIds] = useState<string[]>(() =>
    getSharedRecipeIds(),
  );

  useEffect(() => {
    setSharedRecipeIds(getSharedRecipeIds());

    return subscribeSharedRecipes(() => {
      setSharedRecipeIds(getSharedRecipeIds());
    });
  }, []);

  return sharedRecipeIds;
}
