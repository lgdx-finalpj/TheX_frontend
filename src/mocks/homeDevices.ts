import coffeeMachineIcon from "@/assets/elc_icon/커피머신.png";
import lightIcon from "@/assets/elc_icon/조명.png";
import washerIcon from "@/assets/elc_icon/세탁기.png";
import televisionIcon from "@/assets/elc_icon/텔레비전.png";
import speakerIcon from "@/assets/elc_icon/스피커.png";

export interface HomeDevice {
  id: string;
  name: string;
  iconSrc?: string;
}

export const homeOwnerNickname = "LHCS";

export const homeDevices: HomeDevice[] = [
  {
    id: "coffee-machine",
    name: "커피머신",
    iconSrc: coffeeMachineIcon,
  },
  {
    id: "light",
    name: "조명",
    iconSrc: lightIcon,
  },
  {
    id: "washer",
    name: "세탁기",
    iconSrc: washerIcon,
  },
  {
    id: "television",
    name: "텔레비전",
    iconSrc: televisionIcon,
  },
  {
    id: "speaker",
    name: "스피커",
    iconSrc: speakerIcon,
  },
];
