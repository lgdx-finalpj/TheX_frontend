import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MoodExecutionModal from "@/components/smartRoutine/MoodExecutionModal";
import MineTabSection from "@/components/smartRoutine/MineTabSection";
import RecommendTabSection from "@/components/smartRoutine/RecommendTabSection";
import MobileLayout from "@/layouts/MobileLayout";
import { recommendedMoodCustomsMock } from "@/pages/smartRoutineMainPage.mocks";
import { getExecutionModalItems } from "@/pages/smartRoutineMainPage.utils";
import type { SavedMoodCustom } from "@/state/moodCustom.types";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SmartRoutineShared.css";
import "./SmartRoutineMainPage.css";

export default function SmartRoutineMainPage() {
  const navigate = useNavigate();
  const { savedMoodCustoms } = useMoodCustomDraft();
  const [activeTab, setActiveTab] = useState<"mine" | "recommend">("mine");
  const [openedMenuMoodId, setOpenedMenuMoodId] = useState<string | null>(null);
  const [sharedMoodIds, setSharedMoodIds] = useState<string[]>([]);
  const [bookmarkedMoodIds, setBookmarkedMoodIds] = useState<string[]>([]);
  const [runningMoodCustom, setRunningMoodCustom] = useState<SavedMoodCustom | null>(
    null,
  );

  const recommendedMoodCustoms = useMemo(
    () =>
      recommendedMoodCustomsMock.filter(
        (moodCustom) =>
          moodCustom.is_shared === true && moodCustom.custom_product.length >= 2,
      ),
    [],
  );

  const bookmarkedRecommendedMoodCustoms = recommendedMoodCustoms.filter(
    (moodCustom) => bookmarkedMoodIds.includes(moodCustom.mood_id),
  );

  const sharedSavedMoodCustoms = savedMoodCustoms.filter((moodCustom) =>
    sharedMoodIds.includes(moodCustom.mood_id),
  );

  const runningMoodItems = runningMoodCustom
    ? getExecutionModalItems(runningMoodCustom)
    : [];
  const handleTabChange = (tab: "mine" | "recommend") => {
    setActiveTab(tab);
    setOpenedMenuMoodId(null);
  };

  const handleShareMood = (moodId: string) => {
    setSharedMoodIds((current) =>
      current.includes(moodId) ? current : [...current, moodId],
    );
    setOpenedMenuMoodId(null);
  };

  const handleExecuteMood = (moodId: string) => {
    const targetMoodCustom = savedMoodCustoms.find(
      (moodCustom) => moodCustom.mood_id === moodId,
    );

    if (!targetMoodCustom) {
      return;
    }

    setRunningMoodCustom(targetMoodCustom);
    setOpenedMenuMoodId(null);
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

        <nav className="smart-routine-tabs" aria-label="스마트 루틴 탭">
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
            savedMoodCustoms={savedMoodCustoms}
            bookmarkedRecommendedMoodCustoms={bookmarkedRecommendedMoodCustoms}
            bookmarkedMoodIds={bookmarkedMoodIds}
            openedMenuMoodId={openedMenuMoodId}
            runningMoodCustomId={runningMoodCustom?.mood_id ?? null}
            onMoodMenuToggle={handleMoodMenuToggle}
            onShareMood={handleShareMood}
            onExecuteMood={handleExecuteMood}
            onBookmarkToggle={handleBookmarkToggle}
            onCreateMoodCustom={() => navigate("/smartroutine/create")}
          />
        ) : (
          <RecommendTabSection
            sharedSavedMoodCustoms={sharedSavedMoodCustoms}
            recommendedMoodCustoms={recommendedMoodCustoms}
            bookmarkedMoodIds={bookmarkedMoodIds}
            onBookmarkToggle={handleBookmarkToggle}
          />
        )}

        {runningMoodCustom ? (
          <MoodExecutionModal
            items={runningMoodItems}
            onClose={() => setRunningMoodCustom(null)}
          />
        ) : null}
      </div>
    </MobileLayout>
  );
}
