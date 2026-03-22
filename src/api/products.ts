import apiClient from "@/api/client";

export interface MyProductListItem {
  productInfoId: number;
  productName: string;
}

function isMyProductListItem(value: unknown): value is MyProductListItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.productInfoId === "number" &&
    typeof record.productName === "string"
  );
}

export async function getMyProductList() {
  const response = await apiClient.get("/auth/my-product-list");

  if (!Array.isArray(response.data)) {
    throw new Error("내 제품 목록 응답 형식이 올바르지 않습니다.");
  }

  return response.data.filter(isMyProductListItem);
}
