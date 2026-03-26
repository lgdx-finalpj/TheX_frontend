import createRoutineImage from "@/assets/moodcustom/나만의 루틴 만들기.png";
import type { SavedMoodCustom } from "@/state/moodCustom.types";
import MoodRoutineCard from "@/components/smartRoutine/MoodRoutineCard";
import {
  getColorsetTheme,
  toSavedMoodItems,
} from "@/pages/smartRoutineMainPage.utils";

interface MineTabSectionProps {
  ownedMoodCustoms: SavedMoodCustom[];
  savedMoodCustoms: SavedMoodCustom[];
  sharedMoodIdSet: ReadonlySet<string>;
  openedMenuMoodId: string | null;
  runningMoodCustomId: string | null;
  sharingMoodId: string | null;
  deletingMoodId: string | null;
  executingMoodId: string | null;
  onMoodMenuToggle: (moodId: string) => void;
  onEditMood: (moodCustom: SavedMoodCustom) => void;
  onShareMood: (moodId: string) => void;
  onDeleteMood: (moodId: string) => void;
  onExecuteMood: (moodId: string) => void;
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

export default function MineTabSection({
  ownedMoodCustoms,
  savedMoodCustoms,
  sharedMoodIdSet,
  openedMenuMoodId,
  runningMoodCustomId,
  sharingMoodId,
  deletingMoodId,
  executingMoodId,
  onMoodMenuToggle,
  onEditMood,
  onShareMood,
  onDeleteMood,
  onExecuteMood,
  onCreateMoodCustom,
}: MineTabSectionProps) {
  const hasMineCards =
    ownedMoodCustoms.length > 0 || savedMoodCustoms.length > 0;

  return (
    <main
      className={`smart-routine-body ${hasMineCards ? "smart-routine-body-filled" : ""}`}
    >
      {hasMineCards ? (
        <section className="saved-mood-card-list">
          {ownedMoodCustoms.map((moodCustom) => {
            const moodId = moodCustom.mood_id;
            const isShared = sharedMoodIdSet.has(moodId);
            const isPending =
              sharingMoodId === moodId ||
              deletingMoodId === moodId ||
              executingMoodId === moodId;

            return (
              <MoodRoutineCard
                key={moodId}
                title={moodCustom.mood_name}
                items={toSavedMoodItems(moodCustom)}
                theme={getColorsetTheme(moodCustom.colorset_main)}
                isExecuting={runningMoodCustomId === moodId}
                actionSlot={
                  <div className="saved-mood-action-shell">
                    <button
                      type="button"
                      className="saved-mood-action-button"
                      aria-label="무드 커스텀 옵션 열기"
                      disabled={isPending}
                      onClick={() => onMoodMenuToggle(moodId)}
                    >
                      <MoreIcon />
                    </button>

                    {openedMenuMoodId === moodId ? (
                      <div className="mood-card-menu">
                        <button
                          type="button"
                          className="mood-card-menu-button"
                          disabled={isPending}
                          onClick={() => onEditMood(moodCustom)}
                        >
                          무드 커스텀 수정
                        </button>
                        <button
                          type="button"
                          className="mood-card-menu-button"
                          disabled={deletingMoodId === moodId}
                          onClick={() => onDeleteMood(moodId)}
                        >
                          무드 커스텀 삭제
                        </button>
                        <button
                          type="button"
                          className="mood-card-menu-button"
                          disabled={sharingMoodId === moodId}
                          onClick={() => onShareMood(moodId)}
                        >
                          {isShared ? "공유 취소" : "무드 커스텀 공유"}
                        </button>
                        <button
                          type="button"
                          className="mood-card-menu-button"
                          disabled={executingMoodId === moodId}
                          onClick={() => onExecuteMood(moodId)}
                        >
                          무드 커스텀 실행
                        </button>
                      </div>
                    ) : null}
                  </div>
                }
              />
            );
          })}

          {savedMoodCustoms.map((moodCustom) => {
            const moodId = moodCustom.mood_id;
            return (
              <MoodRoutineCard
                key={moodId}
                title={moodCustom.mood_name}
                items={toSavedMoodItems(moodCustom)}
                theme={getColorsetTheme(moodCustom.colorset_main)}
                actionSlot={
                  <div className="saved-mood-action-shell">
                    <button
                      type="button"
                      className="saved-mood-action-button"
                      aria-label="저장한 무드 커스텀 옵션 열기"
                      disabled={executingMoodId === moodId}
                      onClick={() => onMoodMenuToggle(moodId)}
                    >
                      <MoreIcon />
                    </button>

                    {openedMenuMoodId === moodId ? (
                      <div className="mood-card-menu">
                        <button
                          type="button"
                          className="mood-card-menu-button"
                          disabled={executingMoodId === moodId}
                          onClick={() => onExecuteMood(moodId)}
                        >
                          무드 커스텀 실행
                        </button>
                      </div>
                    ) : null}
                  </div>
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
            <p>
              기기와 연결된 제품을 한 번에 실행할 수 있는
              {"\n"}
              나만의 무드 커스텀을 추가해보세요.
            </p>
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
