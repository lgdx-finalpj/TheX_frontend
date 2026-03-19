import type { ProductInfoRecord, UsersInfoRecord } from "@/state/moodCustom.types";

export const usersInfoMock: UsersInfoRecord = {
  user_id: "user0000001",
  user_name: "THE X USER",
  user_email: "thex@example.com",
  user_phone: "010-0000-0000",
  password: "",
  machine_no: ["machine-01", "machine-02", "machine-03", "machine-04"],
  user_nickname: "THE X",
};

export const productInfoMock: ProductInfoRecord[] = [
  {
    product_info_id: "product-01",
    product_name: "커피머신",
    product_code: "COFFEE01",
    product_no: "machine-01",
    group_id: "group-01",
  },
  {
    product_info_id: "product-02",
    product_name: "조명",
    product_code: "LIGHT01",
    product_no: "machine-02",
    group_id: "group-01",
  },
  {
    product_info_id: "product-03",
    product_name: "스피커",
    product_code: "SPEAKER01",
    product_no: "machine-03",
    group_id: "group-01",
  },
  {
    product_info_id: "product-04",
    product_name: "냉장고",
    product_code: "FRIDGE01",
    product_no: "machine-04",
    group_id: "group-01",
  },
];
