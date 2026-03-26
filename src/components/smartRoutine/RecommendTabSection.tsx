import MoodRoutineCard from "@/components/smartRoutine/MoodRoutineCard";
import {
  getColorsetTheme,
  toRecommendedMoodItems,
} from "@/pages/smartRoutineMainPage.utils";
import type { RecommendedMoodCustomRecord } from "@/types/smartRoutine";

interface RecommendTabSectionProps {
  recommendedMoodCustoms: RecommendedMoodCustomRecord[];
  mySharedMoodIdSet: ReadonlySet<string>;
  savedMoodIdSet: ReadonlySet<string>;
  openedMenuMoodId: string | null;
  savingMoodId: string | null;
  sharingMoodId: string | null;
  onMoodMenuToggle: (moodId: string) => void;
  onSaveMood: (moodId: string) => void;
  onUnsaveMood: (moodId: string) => void;
  onShareCancelMood: (moodId: string) => void;
}

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 4.75H16C16.69 4.75 17.25 5.31 17.25 6V19L12 15.9L6.75 19V6C6.75 5.31 7.31 4.75 8 4.75Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="5.5" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="18.5" r="1.8" fill="currentColor" />
    </svg>
  );
}

export default function RecommendTabSection({
  recommendedMoodCustoms,
  mySharedMoodIdSet,
  savedMoodIdSet,
  openedMenuMoodId,
  savingMoodId,
  sharingMoodId,
  onMoodMenuToggle,
  onSaveMood,
  onUnsaveMood,
  onShareCancelMood,
}: RecommendTabSectionProps) {
  return (
    <main className="smart-routine-body smart-routine-body-filled smart-routine-recommend-body">
      <section className="saved-mood-card-list recommend-card-list">
        {recommendedMoodCustoms.map((moodCustom) => {
          const moodId = moodCustom.mood_id;
          const isMySharedMood = mySharedMoodIdSet.has(moodId);
          const isSaved = savedMoodIdSet.has(moodId);
          const isSaving = savingMoodId === moodId;
          const isSharing = sharingMoodId === moodId;

          return (
            <MoodRoutineCard
              key={moodId}
              title={moodCustom.mood_name}
              items={toRecommendedMoodItems(moodCustom)}
              theme={getColorsetTheme(moodCustom.colorset_id)}
              actionSlot={
                isMySharedMood ? (
                  <div className="saved-mood-header-actions">
                    <span className="saved-mood-my-chip">MY</span>
                    <div className="saved-mood-action-shell">
                      <button
                        type="button"
                        className="saved-mood-action-button"
                        aria-label="내 공유 무드 옵션 열기"
                        disabled={isSharing}
                        onClick={() => onMoodMenuToggle(moodId)}
                      >
                        <MoreIcon />
                      </button>

                      {openedMenuMoodId === moodId ? (
                        <div className="mood-card-menu">
                          <button
                            type="button"
                            className="mood-card-menu-button"
                            disabled={isSharing}
                            onClick={() => onShareCancelMood(moodId)}
                          >
                            공유 취소
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`saved-mood-bookmark-button ${isSaved ? "active" : ""}`}
                    aria-label={isSaved ? "무드 커스텀 저장 취소" : "무드 커스텀 저장"}
                    disabled={isSaving}
                    onClick={() =>
                      isSaved ? onUnsaveMood(moodId) : onSaveMood(moodId)
                    }
                  >
                    <BookmarkIcon filled={isSaved} />
                  </button>
                )
              }
            />
          );
        })}
      </section>
    </main>
  );
}
