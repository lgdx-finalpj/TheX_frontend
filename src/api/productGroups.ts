import apiClient from "@/api/client";

type GroupIdentifier = string | number;

interface CreateProductGroupResponseCandidate {
  [key: string]: unknown;
}

export interface AssignProductsToGroupRequest {
  groupId: number;
  productInfoIds: number[];
}

function isGroupIdentifier(value: unknown): value is GroupIdentifier {
  return typeof value === "string" || typeof value === "number";
}

function toNumericIdentifier(value: GroupIdentifier): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

function extractGroupIdFromResponse(value: unknown): number | null {
  if (isGroupIdentifier(value)) {
    return toNumericIdentifier(value);
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as CreateProductGroupResponseCandidate;
  const directKeys = [
    "groupId",
    "group_id",
    "id",
    "productGroupId",
    "product_group_id",
  ];

  for (const key of directKeys) {
    const candidate = record[key];

    if (isGroupIdentifier(candidate)) {
      return toNumericIdentifier(candidate);
    }
  }

  const nestedKeys = ["data", "result", "payload"];

  for (const key of nestedKeys) {
    const nestedValue = record[key];
    const nestedGroupId = extractGroupIdFromResponse(nestedValue);

    if (nestedGroupId !== null) {
      return nestedGroupId;
    }
  }

  const primitiveValues = Object.values(record).filter(isGroupIdentifier);

  return primitiveValues.length === 1
    ? toNumericIdentifier(primitiveValues[0])
    : null;
}

export async function createProductGroup(groupName: string) {
  const response = await apiClient.post("/product/create-group", {
    groupName,
  });

  const groupId = extractGroupIdFromResponse(response.data);

  if (groupId === null) {
    throw new Error(
      "create-group 응답에서 groupId를 찾지 못했습니다. 응답 스키마를 확인해주세요.",
    );
  }

  return groupId;
}

export async function assignProductsToGroup({
  groupId,
  productInfoIds,
}: AssignProductsToGroupRequest) {
  await apiClient.patch("/product/group", {
    groupId,
    productInfoIds,
  });
}

export async function createAndAssignProductGroup(
  groupName: string,
  productInfoIds: number[],
) {
  const groupId = await createProductGroup(groupName);

  await assignProductsToGroup({
    groupId,
    productInfoIds,
  });

  return groupId;
}
