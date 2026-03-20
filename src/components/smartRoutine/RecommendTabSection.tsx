import MoodRoutineCard from "@/components/smartRoutine/MoodRoutineCard";
import {
  getColorsetTheme,
  getMoodTheme,
  toRecommendedMoodItems,
  toSavedMoodItems,
} from "@/pages/smartRoutineMainPage.utils";
import type { RecommendedMoodCustomRecord } from "@/types/smartRoutine";
import type { SavedMoodCustom } from "@/state/moodCustom.types";

interface RecommendTabSectionProps {
  sharedSavedMoodCustoms: SavedMoodCustom[];
  recommendedMoodCustoms: RecommendedMoodCustomRecord[];
  bookmarkedMoodIds: string[];
  onBookmarkToggle: (moodId: string) => void;
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
  sharedSavedMoodCustoms,
  recommendedMoodCustoms,
  bookmarkedMoodIds,
  onBookmarkToggle,
}: RecommendTabSectionProps) {
  return (
    <main className="smart-routine-body smart-routine-body-filled smart-routine-recommend-body">
      <section className="saved-mood-card-list recommend-card-list">
        {sharedSavedMoodCustoms.map((moodCustom) => (
          <MoodRoutineCard
            key={`shared-${moodCustom.mood_id}`}
            title={moodCustom.mood_name}
            items={toSavedMoodItems(moodCustom)}
            theme={getMoodTheme(moodCustom.selected_mood_id)}
            actionSlot={<span className="saved-mood-my-chip">MY</span>}
          />
        ))}

        {recommendedMoodCustoms.map((moodCustom) => {
          const isBookmarked = bookmarkedMoodIds.includes(moodCustom.mood_id);

          return (
            <MoodRoutineCard
              key={moodCustom.mood_id}
              title={moodCustom.mood_name}
              items={toRecommendedMoodItems(moodCustom)}
              theme={getColorsetTheme(moodCustom.colorset_id)}
              actionSlot={
                <button
                  type="button"
                  className={`saved-mood-bookmark-button ${isBookmarked ? "active" : ""}`}
                  aria-label="북마크 추가"
                  onClick={() => onBookmarkToggle(moodCustom.mood_id)}
                >
                  <BookmarkIcon filled={isBookmarked} />
                </button>
              }
            />
          );
        })}
      </section>
    </main>
  );
}
