import { moodOptions, productOptions } from "@/state/moodCustom.constants";
import { productInfoMock, usersInfoMock } from "@/state/moodCustom.mocks";
import type { MoodOptionId, ProductType } from "@/state/moodCustom.types";

export function getMoodOptionById(id: MoodOptionId | null) {
  if (!id) {
    return null;
  }

  return moodOptions.find((option) => option.id === id) ?? null;
}

export function getProductOptionByType(productType: ProductType) {
  return productOptions.find((option) => option.id === productType) ?? null;
}

export function getAvailableUserProducts(userId: string) {
  if (userId !== usersInfoMock.user_id) {
    return [];
  }

  return productInfoMock.filter((product) =>
    usersInfoMock.machine_no.includes(product.product_no),
  );
}

export function getCapsuleBrandDisplayName(brandValue: string) {
  if (brandValue === "velocity") {
    return "VelocityCoffee";
  }

  if (brandValue === "stoneandbean") {
    return "StoneandBean";
  }

  return brandValue;
}
