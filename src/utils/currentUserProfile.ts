export interface CurrentUserProfile {
  user_id: string;
  user_nickname: string;
}

export const DEFAULT_CURRENT_USER_PROFILE: CurrentUserProfile = {
  user_id: "3",
  user_nickname: "LHCS",
};

const CURRENT_USER_PROFILE_KEY = "current-user-profile";
const CURRENT_USER_PROFILE_EVENT = "current-user-profile-change";

function isCurrentUserProfile(value: unknown): value is CurrentUserProfile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    (typeof candidate.user_id === "string" ||
      typeof candidate.user_id === "number") &&
    String(candidate.user_id).trim() !== "" &&
    typeof candidate.user_nickname === "string" &&
    candidate.user_nickname.trim() !== ""
  );
}

export function getCurrentUserProfile(): CurrentUserProfile {
  if (typeof window === "undefined") {
    return DEFAULT_CURRENT_USER_PROFILE;
  }

  const rawValue = window.localStorage.getItem(CURRENT_USER_PROFILE_KEY);
  if (!rawValue) {
    return DEFAULT_CURRENT_USER_PROFILE;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    if (!isCurrentUserProfile(parsedValue)) {
      return DEFAULT_CURRENT_USER_PROFILE;
    }

    return {
      user_id: String((parsedValue as { user_id: string | number }).user_id),
      user_nickname: parsedValue.user_nickname,
    };
  } catch {
    return DEFAULT_CURRENT_USER_PROFILE;
  }
}

export function setCurrentUserProfile(profile: CurrentUserProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CURRENT_USER_PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(CURRENT_USER_PROFILE_EVENT));
}

export function subscribeCurrentUserProfile(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === CURRENT_USER_PROFILE_KEY) {
      listener();
    }
  };

  window.addEventListener(CURRENT_USER_PROFILE_EVENT, listener);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(CURRENT_USER_PROFILE_EVENT, listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}