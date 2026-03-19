import { MoodCustomDraftContext } from "@/state/MoodCustomDraftContext";
import { useContext } from "react";

export function useMoodCustomDraft() {
  const context = useContext(MoodCustomDraftContext);

  if (!context) {
    throw new Error(
      "useMoodCustomDraft must be used within MoodCustomDraftProvider",
    );
  }

  return context;
}
