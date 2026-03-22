import createRoutineImage from "@/assets/moodcustom/나만의 루틴 만들기.png";
import MoodRoutineCard from "@/components/smartRoutine/MoodRoutineCard";
import {
  getColorsetTheme,
  getMoodTheme,
  toRecommendedMoodItems,
  toSavedMoodItems,
} from "@/pages/smartRoutineMainPage.utils";
import type { RecommendedMoodCustomRecord } from "@/types/smartRoutine";
import type { SavedMoodCustom } from "@/state/moodCustom.types";

interface MineTabSectionProps {
  savedMoodCustoms: SavedMoodCustom[];
  bookmarkedRecommendedMoodCustoms: RecommendedMoodCustomRecord[];
  bookmarkedMoodIds: string[];
  openedMenuMoodId: string | null;
  runningMoodCustomId: string | null;
  onMoodMenuToggle: (moodId: string) => void;
  onShareMood: (moodId: string) => void;
  onExecuteMood: (moodId: string) => void;
  onBookmarkToggle: (moodId: string) => void;
  onCreateMoodCustom: () => void;
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 6L15 12L9 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
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

export default function MineTabSection({
  savedMoodCustoms,
  bookmarkedRecommendedMoodCustoms,
  bookmarkedMoodIds,
  openedMenuMoodId,
  runningMoodCustomId,
  onMoodMenuToggle,
  onShareMood,
  onExecuteMood,
  onBookmarkToggle,
  onCreateMoodCustom,
}: MineTabSectionProps) {
  const hasMineCards =
    savedMoodCustoms.length > 0 || bookmarkedRecommendedMoodCustoms.length > 0;

  return (
    <main
      className={`smart-routine-body ${hasMineCards ? "smart-routine-body-filled" : ""}`}
    >
      {hasMineCards ? (
        <section className="saved-mood-card-list">
          {savedMoodCustoms.map((moodCustom) => (
            <MoodRoutineCard
              key={moodCustom.mood_id}
              title={moodCustom.mood_name}
              items={toSavedMoodItems(moodCustom)}
              theme={getMoodTheme(moodCustom.selected_mood_id)}
              isExecuting={runningMoodCustomId === moodCustom.mood_id}
              actionSlot={
                <div className="saved-mood-action-shell">
                  <button
                    type="button"
                    className="saved-mood-action-button"
                    aria-label="무드 커스텀 옵션 열기"
                    onClick={() => onMoodMenuToggle(moodCustom.mood_id)}
                  >
                    <MoreIcon />
                  </button>

                  {openedMenuMoodId === moodCustom.mood_id ? (
                    <div className="mood-card-menu">
                      <button type="button" className="mood-card-menu-button">
                        무드 커스텀 수정
                      </button>
                      <button type="button" className="mood-card-menu-button">
                        무드 커스텀 삭제
                      </button>
                      <button
                        type="button"
                        className="mood-card-menu-button"
                        onClick={() => onShareMood(moodCustom.mood_id)}
                      >
                        무드 커스텀 공유
                      </button>
                      <button
                        type="button"
                        className="mood-card-menu-button"
                        onClick={() => onExecuteMood(moodCustom.mood_id)}
                      >
                        무드 커스텀 실행
                      </button>
                    </div>
                  ) : null}
                </div>
              }
            />
          ))}

          {bookmarkedRecommendedMoodCustoms.map((moodCustom) => {
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
      ) : (
        <section className="smart-routine-main-content">
          <img
            src={createRoutineImage}
            alt="나만의 루틴 만들기"
            className="smart-routine-image"
          />

          <div className="smart-routine-copy">
            <h2>루틴을 만들어보세요.</h2>
            <p>내가 원하는 여러 제품들을 한 번에 연동해서 실행할 수 있어요.</p>
          </div>

          <button type="button" className="smart-routine-link">
            루틴 알아보기
            <ArrowRightIcon />
          </button>
        </section>
      )}

      <div className="smart-routine-footer">
        <button
          type="button"
          className="primary-pill-button"
          onClick={onCreateMoodCustom}
        >
          나만의 무드 커스텀하기
        </button>
      </div>
    </main>
  );
}
