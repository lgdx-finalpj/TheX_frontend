export interface CurrentUserProfile {
  user_id: string;
  user_nickname: string;
}

export const DEFAULT_CURRENT_USER_PROFILE: CurrentUserProfile = {
  user_id: "3",
  user_nickname: "LHCS",
};
