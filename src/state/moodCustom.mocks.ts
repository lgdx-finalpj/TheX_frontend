import type { ProductInfoRecord, UsersInfoRecord } from "@/state/moodCustom.types";

export const usersInfoMock: UsersInfoRecord = {
  user_id: "3",
  user_name: "THE X USER",
  user_email: "thex@example.com",
  user_phone: "010-0000-0000",
  password: "",
  machine_no: ["1", "2", "3", "4"],
  user_nickname: "THE X",
};

export const productInfoMock: ProductInfoRecord[] = [
  {
    product_info_id: "1",
    product_name: "커피머신",
    product_code: "COFFEE01",
    product_no: "1",
    group_id: "1",
  },
  {
    product_info_id: "2",
    product_name: "조명",
    product_code: "LIGHT01",
    product_no: "2",
    group_id: "1",
  },
  {
    product_info_id: "3",
    product_name: "스피커",
    product_code: "SPEAKER01",
    product_no: "3",
    group_id: "1",
  },
  {
    product_info_id: "4",
    product_name: "냉장고",
    product_code: "FRIDGE01",
    product_no: "4",
    group_id: "1",
  },
];
