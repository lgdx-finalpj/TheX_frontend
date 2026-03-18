import airConditionerIcon from "@/assets/elc_icon/에어컨.png";
import coffeeMachineIcon from "@/assets/elc_icon/커피머신.png";
import fridgeIcon from "@/assets/elc_icon/냉장고.png";
import lightIcon from "@/assets/elc_icon/조명.png";
import speakerIcon from "@/assets/elc_icon/스피커.png";
import televisionIcon from "@/assets/elc_icon/텔레비전.png";
import washerIcon from "@/assets/elc_icon/세탁기.png";

export interface DevicePageDevice {
  id: string;
  name: string;
  iconSrc: string;
  isOn: boolean;
  statusLabel: string;
}

export const defaultGroupedDeviceIds = [
  "coffee-machine",
  "light",
  "speaker",
];

export const groupedDeviceDescriptions: Record<string, string[]> = {
  "coffee-machine": [
    "온도: 80 °C",
    "추출시간: 30초",
    "풍미: 은은하게",
  ],
  light: [
    "타입: 노랑",
    "스타일: Warm",
    "지속시간: 3시간",
  ],
  speaker: [
    "볼륨: 50%",
    "스타일: Cafe BGM",
    "지속시간: 3시간",
  ],
};

export const devicePageDevices: DevicePageDevice[] = [
  {
    id: "coffee-machine",
    name: "커피머신",
    iconSrc: coffeeMachineIcon,
    isOn: false,
    statusLabel: "꺼짐",
  },
  {
    id: "light",
    name: "조명",
    iconSrc: lightIcon,
    isOn: true,
    statusLabel: "켜짐",
  },
  {
    id: "washer",
    name: "세탁기",
    iconSrc: washerIcon,
    isOn: true,
    statusLabel: "01:22 남음",
  },
  {
    id: "speaker",
    name: "스피커",
    iconSrc: speakerIcon,
    isOn: false,
    statusLabel: "꺼짐",
  },
  {
    id: "television",
    name: "텔레비전",
    iconSrc: televisionIcon,
    isOn: false,
    statusLabel: "꺼짐",
  },
  {
    id: "fridge",
    name: "냉장고",
    iconSrc: fridgeIcon,
    isOn: true,
    statusLabel: "켜짐",
  },
  {
    id: "air-conditioner",
    name: "에어컨",
    iconSrc: airConditionerIcon,
    isOn: false,
    statusLabel: "꺼짐",
  },
];
