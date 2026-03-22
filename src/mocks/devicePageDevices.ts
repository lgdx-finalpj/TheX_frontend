import airConditionerIcon from "@/assets/elc_icon/에어컨.png";
import coffeeMachineIcon from "@/assets/elc_icon/커피머신.png";
import fridgeIcon from "@/assets/elc_icon/냉장고.png";
import lightIcon from "@/assets/elc_icon/조명.png";
import speakerIcon from "@/assets/elc_icon/스피커.png";
import televisionIcon from "@/assets/elc_icon/텔레비전.png";
import washerIcon from "@/assets/elc_icon/세탁기.png";
import { mockProductGroups, mockProductInfo } from "@/mocks/backendData";

const productIconsByCode: Record<string, string> = {
  COFFEE001: coffeeMachineIcon,
  LIGHT001: lightIcon,
  WASHER001: washerIcon,
  SPEAKER01: speakerIcon,
  TV001: televisionIcon,
  FRIDGE001: fridgeIcon,
  AIRCON001: airConditionerIcon,
};

const productStateByCode: Record<
  string,
  {
    isOn: boolean;
    statusLabel: string;
  }
> = {
  COFFEE001: {
    isOn: false,
    statusLabel: "꺼짐",
  },
  LIGHT001: {
    isOn: true,
    statusLabel: "켜짐",
  },
  WASHER001: {
    isOn: true,
    statusLabel: "01:22 남음",
  },
  SPEAKER01: {
    isOn: false,
    statusLabel: "꺼짐",
  },
  TV001: {
    isOn: false,
    statusLabel: "꺼짐",
  },
  FRIDGE001: {
    isOn: true,
    statusLabel: "켜짐",
  },
  AIRCON001: {
    isOn: false,
    statusLabel: "꺼짐",
  },
};

export const groupedDescriptionsByCode: Record<string, string[]> = {
  COFFEE001: [
    "온도: 80 °C",
    "추출시간: 30초",
    "풍미: 은은하게",
  ],
  LIGHT001: [
    "타입: 노랑",
    "스타일: Warm",
    "지속시간: 3시간",
  ],
  SPEAKER01: [
    "볼륨: 50%",
    "스타일: Cafe BGM",
    "지속시간: 3시간",
  ],
};

const defaultProductGroup = mockProductGroups[0] ?? null;

export interface DevicePageDevice {
  id: number;
  productCode: string;
  productNo: string;
  groupId: number | null;
  name: string;
  iconSrc: string;
  isOn: boolean;
  statusLabel: string;
}

export const defaultGroupedDeviceIds = mockProductInfo
  .filter((product) => product.group_id === defaultProductGroup?.group_id)
  .map((product) => product.product_info_id);

export const defaultGroupedGroupName =
  defaultProductGroup?.group_name ?? "제품 그룹화";

export const groupedDeviceDescriptions: Record<number, string[]> = Object.fromEntries(
  mockProductInfo.map((product) => [
    product.product_info_id,
    groupedDescriptionsByCode[product.product_code] ?? [],
  ]),
);

export const devicePageDevices: DevicePageDevice[] = mockProductInfo.map((product) => ({
  id: product.product_info_id,
  productCode: product.product_code,
  productNo: product.product_no,
  groupId: product.group_id,
  name: product.product_name,
  iconSrc: productIconsByCode[product.product_code],
  isOn: productStateByCode[product.product_code]?.isOn ?? false,
  statusLabel: productStateByCode[product.product_code]?.statusLabel ?? "꺼짐",
}));
