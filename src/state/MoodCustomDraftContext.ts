import { createContext } from "react";
import type { MoodCustomDraftContextValue } from "@/state/moodCustom.types";

export const MoodCustomDraftContext =
  createContext<MoodCustomDraftContextValue | null>(null);
