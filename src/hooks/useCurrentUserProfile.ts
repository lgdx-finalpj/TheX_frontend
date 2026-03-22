import { useEffect, useState } from "react";
import {
  getCurrentUserProfile,
  subscribeCurrentUserProfile,
  type CurrentUserProfile,
} from "@/utils/currentUserProfile";

export default function useCurrentUserProfile() {
  const [profile, setProfile] = useState<CurrentUserProfile>(getCurrentUserProfile());

  useEffect(() => {
    return subscribeCurrentUserProfile(() => {
      setProfile(getCurrentUserProfile());
    });
  }, []);

  return profile;
}
