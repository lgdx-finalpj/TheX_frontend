import airConditionerIcon from "@/assets/elc_icon/에어컨.png";
import coffeeMachineIcon from "@/assets/elc_icon/커피머신.png";
import fridgeIcon from "@/assets/elc_icon/냉장고.png";
import lightIcon from "@/assets/elc_icon/조명.png";
import washerIcon from "@/assets/elc_icon/세탁기.png";
import televisionIcon from "@/assets/elc_icon/텔레비전.png";
import speakerIcon from "@/assets/elc_icon/스피커.png";
import { mockUserInfo, mockProductInfo } from "@/mocks/backendData";

const productIconsByCode: Record<string, string> = {
  COFFEE001: coffeeMachineIcon,
  LIGHT001: lightIcon,
  WASHER001: washerIcon,
  SPEAKER01: speakerIcon,
  TV001: televisionIcon,
  FRIDGE001: fridgeIcon,
  AIRCON001: airConditionerIcon,
};

export interface HomeDevice {
  id: number;
  productCode: string;
  name: string;
  iconSrc?: string;
}

export const homeOwnerUserId = mockUserInfo.user_id;
export const homeOwnerName = mockUserInfo.user_name;
export const homeOwnerNickname = mockUserInfo.user_nickname;

export const homeDevices: HomeDevice[] = mockProductInfo.map((product) => ({
  id: product.product_info_id,
  productCode: product.product_code,
  name: product.product_name,
  iconSrc: productIconsByCode[product.product_code],
}));
