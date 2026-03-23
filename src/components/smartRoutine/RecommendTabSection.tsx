import MoodRoutineCard from "@/components/smartRoutine/MoodRoutineCard";
import {
  getColorsetTheme,
  toRecommendedMoodItems,
} from "@/pages/smartRoutineMainPage.utils";
import type { RecommendedMoodCustomRecord } from "@/types/smartRoutine";

interface RecommendTabSectionProps {
  recommendedMoodCustoms: RecommendedMoodCustomRecord[];
  savedMoodIds: string[];
  savingMoodId: string | null;
  onSaveMood: (moodId: string) => void;
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

export default function RecommendTabSection({
  recommendedMoodCustoms,
  savedMoodIds,
  savingMoodId,
  onSaveMood,
}: RecommendTabSectionProps) {
  return (
    <main className="smart-routine-body smart-routine-body-filled smart-routine-recommend-body">
      <section className="saved-mood-card-list recommend-card-list">
        {recommendedMoodCustoms.map((moodCustom) => {
          const isSaved = savedMoodIds.includes(moodCustom.mood_id);
          const isSaving = savingMoodId === moodCustom.mood_id;

          return (
            <MoodRoutineCard
              key={moodCustom.mood_id}
              title={moodCustom.mood_name}
              items={toRecommendedMoodItems(moodCustom)}
              theme={getColorsetTheme(moodCustom.colorset_id)}
              actionSlot={
                <button
                  type="button"
                  className={`saved-mood-bookmark-button ${isSaved ? "active" : ""}`}
                  aria-label="무드 커스텀 저장"
                  disabled={isSaving || isSaved}
                  onClick={() => onSaveMood(moodCustom.mood_id)}
                >
                  <BookmarkIcon filled={isSaved} />
                </button>
              }
            />
          );
        })}
      </section>
    </main>
  );
}
