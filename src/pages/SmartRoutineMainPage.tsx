import {
  executeMoodCustom,
  fetchSharedMoodCustomList,
  saveMoodCustom,
  shareMoodCustom,
  type MoodCustomListResponseDTO,
} from "@/api/moodCustomApi";
import { getApiErrorMessage } from "@/api/httpClient";
import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MoodExecutionModal from "@/components/smartRoutine/MoodExecutionModal";
import MineTabSection from "@/components/smartRoutine/MineTabSection";
import RecommendTabSection from "@/components/smartRoutine/RecommendTabSection";
import MobileLayout from "@/layouts/MobileLayout";
import { getExecutionModalItems } from "@/pages/smartRoutineMainPage.utils";
import { mapSpeakerMusicTypeToLabel } from "@/state/moodCustom.constants";
import type { SavedMoodCustom } from "@/state/moodCustom.types";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import type { RecommendedMoodCustomRecord } from "@/types/smartRoutine";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./SmartRoutineShared.css";
import "./SmartRoutineMainPage.css";

function inferColorsetId(item: MoodCustomListResponseDTO) {
  if (
    typeof item.colorsetMain === "string" &&
    item.colorsetMain.trim().length > 0
  ) {
    return item.colorsetMain.trim();
  }

  const speakerType = item.customProduct?.speakerCustom?.musicType;

  if (speakerType === "REST") {
    return "#5A48C2";
  }

  if (speakerType === "FOCUSING") {
    return "#1E4F3D";
  }

  if (speakerType === "MOVIE") {
    return "#3B3E73";
  }

  return "#A36D00";
}

function mapSharedMoodItemToRecommended(
  item: MoodCustomListResponseDTO,
): RecommendedMoodCustomRecord {
  const customProduct = item.customProduct ?? {};
  const products: RecommendedMoodCustomRecord["custom_product"] = [];

  if (customProduct.coffeeCustom) {
    const coffee = customProduct.coffeeCustom;
    const recipeName = coffee.recipeName?.trim() || "Coffee";
    products.push({
      product_type: "coffee_machine",
      summary: `${recipeName}, ${coffee.capsuleTemp}`,
    });
  }

  if (customProduct.lightCustom) {
    const light = customProduct.lightCustom;
    products.push({
      product_type: "light",
      summary: `${light.lightColor}, ${light.lightBright}/10`,
    });
  }

  if (customProduct.speakerCustom) {
    const speaker = customProduct.speakerCustom;
    products.push({
      product_type: "speaker",
      summary: `${mapSpeakerMusicTypeToLabel(speaker.musicType)}, ${speaker.volume}/10`,
    });
  }

  return {
    mood_id: String(item.moodId),
    user_id: "unknown",
    colorset_id: inferColorsetId(item),
    mood_name: item.moodName,
    custom_product: products,
    is_shared: true,
    save_count: 0,
  };
}

function prioritizeMoodById<T extends { mood_id: string }>(
  items: T[],
  prioritizedMoodId: string | null,
) {
  if (!prioritizedMoodId) {
    return items;
  }

  const targetIndex = items.findIndex((item) => item.mood_id === prioritizedMoodId);
  if (targetIndex <= 0) {
    return items;
  }

  const prioritizedItem = items[targetIndex];
  return [
    prioritizedItem,
    ...items.slice(0, targetIndex),
    ...items.slice(targetIndex + 1),
  ];
}

export default function SmartRoutineMainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    savedMoodCustoms,
    isSavedMoodCustomsLoading,
    savedMoodCustomsError,
    refreshSavedMoodCustoms,
  } = useMoodCustomDraft();
  const [activeTab, setActiveTab] = useState<"mine" | "recommend">("mine");
  const [openedMenuMoodId, setOpenedMenuMoodId] = useState<string | null>(null);
  const [bookmarkedMoodIds, setBookmarkedMoodIds] = useState<string[]>([]);
  const [runningMoodCustom, setRunningMoodCustom] = useState<SavedMoodCustom | null>(
    null,
  );
  const [isSharingMoodId, setIsSharingMoodId] = useState<string | null>(null);
  const [isSavingMoodId, setIsSavingMoodId] = useState<string | null>(null);
  const [isExecutingMoodId, setIsExecutingMoodId] = useState<string | null>(null);
  const [shareMoodError, setShareMoodError] = useState<string | null>(null);
  const [saveMoodError, setSaveMoodError] = useState<string | null>(null);
  const [executeMoodError, setExecuteMoodError] = useState<string | null>(null);
  const [recommendedMoodCustoms, setRecommendedMoodCustoms] = useState<
    RecommendedMoodCustomRecord[]
  >([]);
  const [prioritizedMoodId, setPrioritizedMoodId] = useState<string | null>(null);
  const [isRecommendedMoodCustomsLoading, setIsRecommendedMoodCustomsLoading] =
    useState(false);
  const [recommendedMoodCustomsError, setRecommendedMoodCustomsError] = useState<
    string | null
  >(null);

  const refreshSharedMoodCustoms = useCallback(async () => {
    setIsRecommendedMoodCustomsLoading(true);
    setRecommendedMoodCustomsError(null);

    try {
      const response = await fetchSharedMoodCustomList();
      setRecommendedMoodCustoms(response.map(mapSharedMoodItemToRecommended));
    } catch (error) {
      setRecommendedMoodCustomsError(
        getApiErrorMessage(error, "Failed to load recommended mood customs."),
      );
    } finally {
      setIsRecommendedMoodCustomsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSharedMoodCustoms();
  }, [refreshSharedMoodCustoms]);

  useEffect(() => {
    const state = location.state as { activeTab?: "mine" | "recommend"; prioritizedMoodId?: string } | null;

    if (!state) {
      return;
    }

    if (state.activeTab) {
      setActiveTab(state.activeTab);
    }

    if (typeof state.prioritizedMoodId === "string" && state.prioritizedMoodId) {
      setPrioritizedMoodId(state.prioritizedMoodId);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const sortedSavedMoodCustoms = useMemo(
    () => prioritizeMoodById(savedMoodCustoms, prioritizedMoodId),
    [prioritizedMoodId, savedMoodCustoms],
  );

  const savedMoodIdSet = useMemo(
    () => new Set(sortedSavedMoodCustoms.map((moodCustom) => moodCustom.mood_id)),
    [sortedSavedMoodCustoms],
  );

  const bookmarkedRecommendedMoodCustoms = recommendedMoodCustoms.filter(
    (moodCustom) =>
      bookmarkedMoodIds.includes(moodCustom.mood_id) &&
      !savedMoodIdSet.has(moodCustom.mood_id),
  );

  const runningMoodItems = runningMoodCustom
    ? getExecutionModalItems(runningMoodCustom)
    : [];

  const handleTabChange = (tab: "mine" | "recommend") => {
    setActiveTab(tab);
    setOpenedMenuMoodId(null);
  };

  const handleShareMood = async (moodId: string) => {
    if (isSharingMoodId) {
      return;
    }

    const numericMoodId = Number(moodId);
    if (!Number.isFinite(numericMoodId)) {
      setShareMoodError("Invalid mood id for share.");
      setOpenedMenuMoodId(null);
      return;
    }

    setIsSharingMoodId(moodId);
    setShareMoodError(null);

    try {
      await shareMoodCustom(numericMoodId);
      await refreshSavedMoodCustoms();
      await refreshSharedMoodCustoms();
      setPrioritizedMoodId(moodId);
    } catch (error) {
      setShareMoodError(getApiErrorMessage(error, "Failed to share mood custom."));
    } finally {
      setIsSharingMoodId(null);
      setOpenedMenuMoodId(null);
    }
  };

  const handleExecuteMood = async (moodId: string) => {
    if (isExecutingMoodId) {
      return;
    }

    const targetMoodCustom = savedMoodCustoms.find(
      (moodCustom) => moodCustom.mood_id === moodId,
    );

    if (!targetMoodCustom) {
      return;
    }

    const numericMoodId = Number(moodId);
    if (!Number.isFinite(numericMoodId)) {
      setExecuteMoodError("Invalid mood id for execute.");
      setOpenedMenuMoodId(null);
      return;
    }

    setRunningMoodCustom(targetMoodCustom);
    setIsExecutingMoodId(moodId);
    setExecuteMoodError(null);
    setOpenedMenuMoodId(null);

    try {
      await executeMoodCustom(numericMoodId);
    } catch (error) {
      setExecuteMoodError(
        getApiErrorMessage(error, "Failed to execute mood custom."),
      );
    } finally {
      setIsExecutingMoodId(null);
    }
  };

  const handleSaveMood = async (moodId: string) => {
    if (isSavingMoodId) {
      return;
    }

    const numericMoodId = Number(moodId);
    if (!Number.isFinite(numericMoodId)) {
      setSaveMoodError("Invalid mood id for save.");
      return;
    }

    setIsSavingMoodId(moodId);
    setSaveMoodError(null);

    try {
      await saveMoodCustom(numericMoodId);
      await refreshSavedMoodCustoms();
      await refreshSharedMoodCustoms();
      setPrioritizedMoodId(moodId);
      setActiveTab("mine");
      setBookmarkedMoodIds((current) =>
        current.includes(moodId) ? current : [moodId, ...current],
      );
    } catch (error) {
      setSaveMoodError(getApiErrorMessage(error, "Failed to save mood custom."));
    } finally {
      setIsSavingMoodId(null);
    }
  };

  const handleBookmarkToggle = (moodId: string) => {
    setBookmarkedMoodIds((current) =>
      current.includes(moodId)
        ? current.filter((id) => id !== moodId)
        : [...current, moodId],
    );
  };

  const handleMoodMenuToggle = (moodId: string) => {
    setOpenedMenuMoodId((current) => (current === moodId ? null : moodId));
  };

  return (
    <MobileLayout>
      <div className="page smart-routine-page">
        <SmartRoutineHeader title="스마트 루틴" backTo="/" showActions />

        <nav className="smart-routine-tabs" aria-label="Smart routine tabs">
          <button
            type="button"
            className={`smart-routine-tab ${activeTab === "mine" ? "active" : ""}`}
            aria-current={activeTab === "mine" ? "page" : undefined}
            onClick={() => handleTabChange("mine")}
          >
            나의 루틴
          </button>
          <button
            type="button"
            className={`smart-routine-tab ${activeTab === "recommend" ? "active" : ""}`}
            aria-current={activeTab === "recommend" ? "page" : undefined}
            onClick={() => handleTabChange("recommend")}
          >
            추천
          </button>
        </nav>

        {activeTab === "mine" ? (
          <MineTabSection
            savedMoodCustoms={sortedSavedMoodCustoms}
            bookmarkedRecommendedMoodCustoms={bookmarkedRecommendedMoodCustoms}
            bookmarkedMoodIds={bookmarkedMoodIds}
            openedMenuMoodId={openedMenuMoodId}
            runningMoodCustomId={runningMoodCustom?.mood_id ?? null}
            onMoodMenuToggle={handleMoodMenuToggle}
            onShareMood={(moodId) => {
              void handleShareMood(moodId);
            }}
            onExecuteMood={(moodId) => {
              void handleExecuteMood(moodId);
            }}
            onBookmarkToggle={handleBookmarkToggle}
            onCreateMoodCustom={() => navigate("/smartroutine/create")}
          />
        ) : (
          <RecommendTabSection
            recommendedMoodCustoms={recommendedMoodCustoms}
            savedMoodIds={Array.from(savedMoodIdSet)}
            savingMoodId={isSavingMoodId}
            onSaveMood={(moodId) => {
              void handleSaveMood(moodId);
            }}
          />
        )}

        {runningMoodCustom ? (
          <MoodExecutionModal
            items={runningMoodItems}
            onClose={() => setRunningMoodCustom(null)}
          />
        ) : null}
        {isSavedMoodCustomsLoading ? <p>Loading your moods...</p> : null}
        {savedMoodCustomsError ? (
          <p role="alert">{savedMoodCustomsError}</p>
        ) : null}
        {isRecommendedMoodCustomsLoading ? <p>Loading recommended moods...</p> : null}
        {recommendedMoodCustomsError ? (
          <p role="alert">{recommendedMoodCustomsError}</p>
        ) : null}
        {shareMoodError ? <p role="alert">{shareMoodError}</p> : null}
        {saveMoodError ? <p role="alert">{saveMoodError}</p> : null}
        {executeMoodError ? <p role="alert">{executeMoodError}</p> : null}
      </div>
    </MobileLayout>
  );
}
