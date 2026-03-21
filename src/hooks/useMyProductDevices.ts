import { getMyProductList } from "@/api/products";
import {
  devicePageDevices as deviceCatalog,
  type DevicePageDevice,
} from "@/mocks/devicePageDevices";
import { useEffect, useState } from "react";

const deviceCatalogById = new Map(
  deviceCatalog.map((device) => [device.id, device]),
);

const deviceCatalogByNormalizedName = new Map(
  deviceCatalog.map((device) => [normalizeDeviceName(device.name), device]),
);

const deviceNameAliases: Record<string, string> = {
  coffee: "커피머신",
  coffeemachine: "커피머신",
  light: "조명",
  lamp: "조명",
  speaker: "스피커",
  fridge: "냉장고",
  refrigerator: "냉장고",
  tv: "텔레비전",
  television: "텔레비전",
  washer: "세탁기",
  washingmachine: "세탁기",
  airconditioner: "에어컨",
  aircon: "에어컨",
};

function normalizeDeviceName(name: string) {
  return name.toLowerCase().replace(/[\s_\-()/]/g, "");
}

function findCatalogDevice(productInfoId: number, productName: string) {
  const normalizedProductName = normalizeDeviceName(productName);
  const exactMatch = deviceCatalogByNormalizedName.get(normalizedProductName);

  if (exactMatch) {
    return exactMatch;
  }

  const aliasedName = deviceNameAliases[normalizedProductName];

  if (aliasedName) {
    const aliasMatch = deviceCatalogByNormalizedName.get(
      normalizeDeviceName(aliasedName),
    );

    if (aliasMatch) {
      return aliasMatch;
    }
  }

  return deviceCatalogById.get(productInfoId) ?? null;
}

function mergeMyProductsWithCatalog(myProducts: Awaited<ReturnType<typeof getMyProductList>>) {
  return myProducts.flatMap((product) => {
    const catalogDevice = findCatalogDevice(
      product.productInfoId,
      product.productName,
    );

    if (!catalogDevice) {
      return [];
    }

    return [
      {
        ...catalogDevice,
        id: product.productInfoId,
        name: product.productName.trim() || catalogDevice.name,
      },
    ];
  });
}

export function useMyProductDevices() {
  const [devices, setDevices] = useState<DevicePageDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMyProducts() {
      try {
        setIsLoading(true);
        setError(null);

        const myProducts = await getMyProductList();

        if (!isMounted) {
          return;
        }

        setDevices(mergeMyProductsWithCatalog(myProducts));
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        if (fetchError instanceof Error && fetchError.message.trim()) {
          setError(fetchError.message);
        } else {
          setError("내 제품 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchMyProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    devices,
    isLoading,
    error,
  };
}
