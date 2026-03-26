import {
  deleteMoodCustom,
  executeMoodCustom,
  fetchSharedMoodCustomList,
  saveMoodCustom,
  shareMoodCustom,
  unsaveMoodCustom,
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

  const speakerType = mapSpeakerMusicTypeToLabel(
    item.customProduct?.speakerCustom?.musicType ?? "",
  );

  if (speakerType === "Rest" || speakerType === "Chill") {
    return "#5A48C2";
  }

  if (speakerType === "Focusing" || speakerType === "Classical") {
    return "#1E4F3D";
  }

  if (speakerType === "Movie" || speakerType === "Musical") {
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
      summary: `${mapSpeakerMusicTypeToLabel(speaker.musicType)}, ${speaker.volume}/20`,
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
    startEditingMoodCustom,
  } = useMoodCustomDraft();

  const [activeTab, setActiveTab] = useState<"mine" | "recommend">("mine");
  const [openedMenuMoodId, setOpenedMenuMoodId] = useState<string | null>(null);
  const [ownedMoodIds, setOwnedMoodIds] = useState<string[]>([]);
  const [savedRecommendedMoodIds, setSavedRecommendedMoodIds] = useState<string[]>(
    [],
  );
  const [runningMoodCustom, setRunningMoodCustom] = useState<SavedMoodCustom | null>(
    null,
  );
  const [isSharingMoodId, setIsSharingMoodId] = useState<string | null>(null);
  const [isSavingMoodId, setIsSavingMoodId] = useState<string | null>(null);
  const [isDeletingMoodId, setIsDeletingMoodId] = useState<string | null>(null);
  const [isExecutingMoodId, setIsExecutingMoodId] = useState<string | null>(null);
  const [shareMoodError, setShareMoodError] = useState<string | null>(null);
  const [saveMoodError, setSaveMoodError] = useState<string | null>(null);
  const [deleteMoodError, setDeleteMoodError] = useState<string | null>(null);
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
      const mappedMoodCustoms = response.map(mapSharedMoodItemToRecommended);
      setRecommendedMoodCustoms(mappedMoodCustoms);
      return mappedMoodCustoms;
    } catch (error) {
      setRecommendedMoodCustomsError(
        getApiErrorMessage(error, "Failed to load recommended mood customs."),
      );
      return [];
    } finally {
      setIsRecommendedMoodCustomsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSharedMoodCustoms();
  }, [refreshSharedMoodCustoms]);

  useEffect(() => {
    const state = location.state as {
      activeTab?: "mine" | "recommend";
      prioritizedMoodId?: string;
    } | null;

    if (!state) {
      return;
    }

    if (state.activeTab) {
      setActiveTab(state.activeTab);
    }

    if (typeof state.prioritizedMoodId === "string" && state.prioritizedMoodId) {
      setPrioritizedMoodId(state.prioritizedMoodId);
      if (state.activeTab !== "recommend") {
        setOwnedMoodIds((current) =>
          current.includes(state.prioritizedMoodId as string)
            ? current
            : [state.prioritizedMoodId as string, ...current],
        );
      }
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (ownedMoodIds.length > 0 || savedMoodCustoms.length === 0) {
      return;
    }

    setOwnedMoodIds(savedMoodCustoms.map((moodCustom) => moodCustom.mood_id));
  }, [ownedMoodIds.length, savedMoodCustoms]);

  const sortedSavedMoodCustoms = useMemo(
    () => prioritizeMoodById(savedMoodCustoms, prioritizedMoodId),
    [prioritizedMoodId, savedMoodCustoms],
  );

  const sortedRecommendedMoodCustoms = useMemo(
    () => prioritizeMoodById(recommendedMoodCustoms, prioritizedMoodId),
    [prioritizedMoodId, recommendedMoodCustoms],
  );

  const savedMoodIdSet = useMemo(
    () => new Set(savedMoodCustoms.map((moodCustom) => moodCustom.mood_id)),
    [savedMoodCustoms],
  );

  const ownedMoodIdSet = useMemo(() => new Set(ownedMoodIds), [ownedMoodIds]);

  const ownedSavedMoodCustoms = useMemo(
    () =>
      sortedSavedMoodCustoms.filter((moodCustom) =>
        ownedMoodIdSet.has(moodCustom.mood_id),
      ),
    [ownedMoodIdSet, sortedSavedMoodCustoms],
  );

  const externalSavedMoodCustoms = useMemo(
    () =>
      sortedSavedMoodCustoms.filter(
        (moodCustom) => !ownedMoodIdSet.has(moodCustom.mood_id),
      ),
    [ownedMoodIdSet, sortedSavedMoodCustoms],
  );

  const mySharedMoodIdSet = useMemo(
    () =>
      new Set(
        sortedRecommendedMoodCustoms
          .filter((moodCustom) => ownedMoodIdSet.has(moodCustom.mood_id))
          .map((moodCustom) => moodCustom.mood_id),
      ),
    [ownedMoodIdSet, sortedRecommendedMoodCustoms],
  );

  const serverSavedRecommendedMoodIdSet = useMemo(
    () =>
      new Set(
        sortedRecommendedMoodCustoms
          .filter(
            (moodCustom) =>
              savedMoodIdSet.has(moodCustom.mood_id) &&
              !ownedMoodIdSet.has(moodCustom.mood_id),
          )
          .map((moodCustom) => moodCustom.mood_id),
      ),
    [ownedMoodIdSet, savedMoodIdSet, sortedRecommendedMoodCustoms],
  );

  const savedRecommendedMoodIdSet = useMemo(
    () => new Set([...savedRecommendedMoodIds, ...serverSavedRecommendedMoodIdSet]),
    [savedRecommendedMoodIds, serverSavedRecommendedMoodIdSet],
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
      const nextRecommendedMoodCustoms = await refreshSharedMoodCustoms();
      const isShared = nextRecommendedMoodCustoms.some(
        (moodCustom) => moodCustom.mood_id === moodId,
      );

      if (isShared) {
        setPrioritizedMoodId(moodId);
        setActiveTab("recommend");
      } else if (prioritizedMoodId === moodId) {
        setPrioritizedMoodId(null);
      }
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

  const handleEditMood = (moodCustom: SavedMoodCustom) => {
    startEditingMoodCustom(moodCustom);
    setOpenedMenuMoodId(null);
    navigate("/smartroutine/mood-custom");
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
      setSavedRecommendedMoodIds((current) =>
        current.includes(moodId) ? current : [moodId, ...current],
      );
    } catch (error) {
      setSaveMoodError(getApiErrorMessage(error, "Failed to save mood custom."));
    } finally {
      setIsSavingMoodId(null);
    }
  };

  const handleUnsaveMood = async (moodId: string) => {
    if (isSavingMoodId) {
      return;
    }

    const numericMoodId = Number(moodId);
    if (!Number.isFinite(numericMoodId)) {
      setSaveMoodError("Invalid mood id for unsave.");
      return;
    }

    setIsSavingMoodId(moodId);
    setSaveMoodError(null);
    setOpenedMenuMoodId(null);

    try {
      await unsaveMoodCustom(numericMoodId);
      await refreshSavedMoodCustoms();
      await refreshSharedMoodCustoms();
      setSavedRecommendedMoodIds((current) =>
        current.filter((currentMoodId) => currentMoodId !== moodId),
      );
    } catch (error) {
      setSaveMoodError(getApiErrorMessage(error, "Failed to unsave mood custom."));
    } finally {
      setIsSavingMoodId(null);
    }
  };

  const handleDeleteMood = async (moodId: string) => {
    if (isDeletingMoodId) {
      return;
    }

    const numericMoodId = Number(moodId);
    if (!Number.isFinite(numericMoodId)) {
      setDeleteMoodError("Invalid mood id for delete.");
      setOpenedMenuMoodId(null);
      return;
    }

    setIsDeletingMoodId(moodId);
    setDeleteMoodError(null);

    try {
      await deleteMoodCustom(numericMoodId);
      await refreshSavedMoodCustoms();
      await refreshSharedMoodCustoms();
      setOwnedMoodIds((current) =>
        current.filter((currentMoodId) => currentMoodId !== moodId),
      );
      setSavedRecommendedMoodIds((current) =>
        current.filter((currentMoodId) => currentMoodId !== moodId),
      );

      if (runningMoodCustom?.mood_id === moodId) {
        setRunningMoodCustom(null);
      }

      if (prioritizedMoodId === moodId) {
        setPrioritizedMoodId(null);
      }
    } catch (error) {
      setDeleteMoodError(getApiErrorMessage(error, "Failed to delete mood custom."));
    } finally {
      setIsDeletingMoodId(null);
      setOpenedMenuMoodId(null);
    }
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
            className={`smart-routine-tab ${
              activeTab === "recommend" ? "active" : ""
            }`}
            aria-current={activeTab === "recommend" ? "page" : undefined}
            onClick={() => handleTabChange("recommend")}
          >
            추천
          </button>
        </nav>

        {activeTab === "mine" ? (
          <MineTabSection
            ownedMoodCustoms={ownedSavedMoodCustoms}
            savedMoodCustoms={externalSavedMoodCustoms}
            sharedMoodIdSet={mySharedMoodIdSet}
            openedMenuMoodId={openedMenuMoodId}
            runningMoodCustomId={runningMoodCustom?.mood_id ?? null}
            sharingMoodId={isSharingMoodId}
            deletingMoodId={isDeletingMoodId}
            executingMoodId={isExecutingMoodId}
            onMoodMenuToggle={handleMoodMenuToggle}
            onEditMood={handleEditMood}
            onShareMood={(moodId) => {
              void handleShareMood(moodId);
            }}
            onDeleteMood={(moodId) => {
              void handleDeleteMood(moodId);
            }}
            onExecuteMood={(moodId) => {
              void handleExecuteMood(moodId);
            }}
            onCreateMoodCustom={() => navigate("/smartroutine/create")}
          />
        ) : (
          <RecommendTabSection
            recommendedMoodCustoms={sortedRecommendedMoodCustoms}
            mySharedMoodIdSet={mySharedMoodIdSet}
            savedMoodIdSet={savedRecommendedMoodIdSet}
            openedMenuMoodId={openedMenuMoodId}
            savingMoodId={isSavingMoodId}
            sharingMoodId={isSharingMoodId}
            onMoodMenuToggle={handleMoodMenuToggle}
            onSaveMood={(moodId) => {
              void handleSaveMood(moodId);
            }}
            onUnsaveMood={(moodId) => {
              void handleUnsaveMood(moodId);
            }}
            onShareCancelMood={(moodId) => {
              void handleShareMood(moodId);
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
        {savedMoodCustomsError ? <p role="alert">{savedMoodCustomsError}</p> : null}
        {isRecommendedMoodCustomsLoading ? <p>Loading recommended moods...</p> : null}
        {recommendedMoodCustomsError ? (
          <p role="alert">{recommendedMoodCustomsError}</p>
        ) : null}
        {shareMoodError ? <p role="alert">{shareMoodError}</p> : null}
        {saveMoodError ? <p role="alert">{saveMoodError}</p> : null}
        {deleteMoodError ? <p role="alert">{deleteMoodError}</p> : null}
        {executeMoodError ? <p role="alert">{executeMoodError}</p> : null}
      </div>
    </MobileLayout>
  );
}
