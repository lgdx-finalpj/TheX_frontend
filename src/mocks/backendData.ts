export interface UsersInfoRecord {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  password: string;
  machine_no: string[];
  user_nickname: string;
}

export interface ProductGroupRecord {
  group_id: number;
  group_name: string;
  user_id: string;
}

export interface ProductInfoRecord {
  product_info_id: number;
  product_name: string;
  product_code: string;
  product_no: string;
  group_id: number | null;
}

export const mockUserInfo: UsersInfoRecord = {
  user_id: "USER0000001",
  user_name: "이현수",
  user_email: "hyunsu.lhcs@example.com",
  user_phone: "010-1234-5678",
  password: "mock_password_hash",
  machine_no: [
    "CM-2026-LHCS-0001",
    "LT-2026-LHCS-0001",
    "WM-2026-LHCS-0001",
    "SP-2026-LHCS-0001",
    "TV-2026-LHCS-0001",
    "RF-2026-LHCS-0001",
    "AC-2026-LHCS-0001",
  ],
  user_nickname: "LHCS",
};

export const mockProductGroups: ProductGroupRecord[] = [
  {
    group_id: 1,
    group_name: "LG Home Cafe Solution",
    user_id: mockUserInfo.user_id,
  },
];

const defaultGroupId = mockProductGroups[0]?.group_id ?? null;

export const mockProductInfo: ProductInfoRecord[] = [
  {
    product_info_id: 1,
    product_name: "커피머신",
    product_code: "COFFEE001",
    product_no: "CM-2026-LHCS-0001",
    group_id: defaultGroupId,
  },
  {
    product_info_id: 2,
    product_name: "조명",
    product_code: "LIGHT001",
    product_no: "LT-2026-LHCS-0001",
    group_id: defaultGroupId,
  },
  {
    product_info_id: 3,
    product_name: "세탁기",
    product_code: "WASHER001",
    product_no: "WM-2026-LHCS-0001",
    group_id: null,
  },
  {
    product_info_id: 4,
    product_name: "스피커",
    product_code: "SPEAKER01",
    product_no: "SP-2026-LHCS-0001",
    group_id: defaultGroupId,
  },
  {
    product_info_id: 5,
    product_name: "텔레비전",
    product_code: "TV001",
    product_no: "TV-2026-LHCS-0001",
    group_id: null,
  },
  {
    product_info_id: 6,
    product_name: "냉장고",
    product_code: "FRIDGE001",
    product_no: "RF-2026-LHCS-0001",
    group_id: null,
  },
  {
    product_info_id: 7,
    product_name: "에어컨",
    product_code: "AIRCON001",
    product_no: "AC-2026-LHCS-0001",
    group_id: null,
  },
];
