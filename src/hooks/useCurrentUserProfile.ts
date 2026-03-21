import { useEffect, useState } from "react";
import axios from "axios";
import {
  getCurrentUserProfile,
  setCurrentUserProfile,
  subscribeCurrentUserProfile,
  type CurrentUserProfile,
} from "@/utils/currentUserProfile";

interface UserProfilePayload {
  user_id?: string;
  user_nickname?: string;
}

function parseUserProfile(payload: unknown): CurrentUserProfile | null {
  const candidates: UserProfilePayload[] = [];

  if (payload && typeof payload === "object") {
    const rootCandidate = payload as Record<string, unknown>;
    candidates.push(rootCandidate as UserProfilePayload);

    if (rootCandidate.data && typeof rootCandidate.data === "object") {
      candidates.push(rootCandidate.data as UserProfilePayload);
    }

    if (rootCandidate.result && typeof rootCandidate.result === "object") {
      candidates.push(rootCandidate.result as UserProfilePayload);
    }

    if (rootCandidate.user && typeof rootCandidate.user === "object") {
      candidates.push(rootCandidate.user as UserProfilePayload);
    }
  }

  for (const candidate of candidates) {
    if (
      typeof candidate.user_id === "string" &&
      candidate.user_id.trim() !== "" &&
      typeof candidate.user_nickname === "string" &&
      candidate.user_nickname.trim() !== ""
    ) {
      return {
        user_id: candidate.user_id,
        user_nickname: candidate.user_nickname,
      };
    }
  }

  return null;
}

export default function useCurrentUserProfile() {
  const [profile, setProfile] = useState<CurrentUserProfile>(getCurrentUserProfile());

  useEffect(() => {
    return subscribeCurrentUserProfile(() => {
      setProfile(getCurrentUserProfile());
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUserProfile = async () => {
      try {
        const endpoint =
          import.meta.env.VITE_CURRENT_USER_ENDPOINT ?? "/api/users/me";
        const response = await axios.get(endpoint);
        const parsedProfile = parseUserProfile(response.data);

        if (!isMounted || !parsedProfile) {
          return;
        }

        setCurrentUserProfile(parsedProfile);
      } catch {
        // Keep fallback/local profile when backend profile is unavailable.
      }
    };

    void fetchCurrentUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return profile;
}
