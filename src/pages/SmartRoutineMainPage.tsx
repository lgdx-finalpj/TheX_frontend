import createRoutineImage from "@/assets/moodcustom/나만의 루틴 만들기.png";
import duoboImage from "@/assets/elc_icon/듀오보.png";
import lightDeviceImage from "@/assets/elc_icon/조명.png";
import speakerDeviceImage from "@/assets/elc_icon/스피커.png";
import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MobileLayout from "@/layouts/MobileLayout";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import type {
  MoodOptionId,
  ProductType,
  SavedMoodCustom,
} from "@/state/moodCustom.types";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import "./SmartRoutineShared.css";
import "./SmartRoutineMainPage.css";

interface MoodColorsetRecord {
  colorset_id: string;
  colorset_name: string;
  colorset_main: string;
  color_opacity1: number;
  color_opacity2: number;
  color_opacity3: number;
}

interface RecommendedCustomProduct {
  product_type: string;
  summary: string;
}

interface RecommendedMoodCustomRecord {
  mood_id: string;
  user_id: string;
  colorset_id: string;
  mood_name: string;
  custom_product: RecommendedCustomProduct[];
  is_shared: boolean;
  save_count: number;
}

interface MoodCardTheme {
  cardColor: string;
  badgeColor: string;
  itemColor: string;
}

interface MoodRoutineCardProps {
  title: string;
  items: Array<{ key: string; label: string }>;
  theme: MoodCardTheme;
  actionSlot: ReactNode;
  isExecuting?: boolean;
}

interface ExecutionModalItem {
  key: ProductType;
  imageSrc: string;
  title: string;
  description: string;
}

const moodColorsetMock: MoodColorsetRecord[] = [
  {
    colorset_id: "#A36D00",
    colorset_name: "홈카페",
    colorset_main: "#A36D00",
    color_opacity1: 30,
    color_opacity2: 50,
    color_opacity3: 100,
  },
  {
    colorset_id: "#5A48C2",
    colorset_name: "휴식",
    colorset_main: "#5A48C2",
    color_opacity1: 30,
    color_opacity2: 50,
    color_opacity3: 100,
  },
  {
    colorset_id: "#1E4F3D",
    colorset_name: "집중 모드",
    colorset_main: "#1E4F3D",
    color_opacity1: 30,
    color_opacity2: 50,
    color_opacity3: 100,
  },
];

const recommendedMoodCustomsMock: RecommendedMoodCustomRecord[] = [
  {
    mood_id: "mood-8f21a7",
    user_id: "user3141592",
    colorset_id: "#A36D00",
    mood_name: "홈카페",
    custom_product: [
      { product_type: "coffee_machine", summary: "커피머신 - 에스프레소, 2샷" },
      { product_type: "light", summary: "조명 - Warm Orange, 30%" },
      { product_type: "speaker", summary: "스피커 - Jazz Playlist, 60%" },
    ],
    is_shared: true,
    save_count: 87,
  },
  {
    mood_id: "mood-5b93ce",
    user_id: "user2718281",
    colorset_id: "#5A48C2",
    mood_name: "휴식",
    custom_product: [
      { product_type: "coffee_machine", summary: "커피머신 - 카페라떼" },
      { product_type: "light", summary: "조명 - Warm White, 25%" },
      { product_type: "speaker", summary: "스피커 - Acoustic Chill, 40%" },
    ],
    is_shared: true,
    save_count: 64,
  },
  {
    mood_id: "mood-c71d42",
    user_id: "user1618033",
    colorset_id: "#1E4F3D",
    mood_name: "집중 모드",
    custom_product: [
      { product_type: "coffee_machine", summary: "커피머신 - 아메리카노, 연하게" },
      { product_type: "light", summary: "조명 - Daylight, 80%" },
      { product_type: "speaker", summary: "스피커 - Lo-fi Study, 30%" },
    ],
    is_shared: true,
    save_count: 92,
  },
];

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

function hexToRgba(hexColor: string, opacity: number) {
  const sanitized = hexColor.replace("#", "");
  const red = Number.parseInt(sanitized.slice(0, 2), 16);
  const green = Number.parseInt(sanitized.slice(2, 4), 16);
  const blue = Number.parseInt(sanitized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`;
}

function getColorsetTheme(colorsetId: string): MoodCardTheme {
  const colorset = moodColorsetMock.find(
    (item) => item.colorset_id === colorsetId,
  );

  if (!colorset) {
    return {
      cardColor: "rgba(163, 109, 0, 0.3)",
      badgeColor: "#A36D00",
      itemColor: "rgba(163, 109, 0, 0.5)",
    };
  }

  return {
    cardColor: hexToRgba(colorset.colorset_main, colorset.color_opacity1),
    badgeColor: hexToRgba(colorset.colorset_main, colorset.color_opacity3),
    itemColor: hexToRgba(colorset.colorset_main, colorset.color_opacity2),
  };
}

function getMoodTheme(selectedMoodId: MoodOptionId): MoodCardTheme {
  if (selectedMoodId === "home-cafe") {
    return getColorsetTheme("#A36D00");
  }

  if (selectedMoodId === "rest") {
    return getColorsetTheme("#5A48C2");
  }

  if (selectedMoodId === "focus-mode") {
    return getColorsetTheme("#1E4F3D");
  }

  if (selectedMoodId === "movie-night") {
    return {
      cardColor: "rgba(59, 62, 115, 0.3)",
      badgeColor: "#3B3E73",
      itemColor: "rgba(59, 62, 115, 0.5)",
    };
  }

  return {
    cardColor: "rgba(121, 72, 152, 0.3)",
    badgeColor: "#794898",
    itemColor: "rgba(121, 72, 152, 0.5)",
  };
}

function MoodRoutineCard({
  title,
  items,
  theme,
  actionSlot,
  isExecuting = false,
}: MoodRoutineCardProps) {
  return (
    <article
      className={`saved-mood-card ${isExecuting ? "executing" : ""}`}
      style={{ backgroundColor: theme.cardColor }}
    >
      <div className="saved-mood-card-header">
        <span
          className="saved-mood-badge"
          style={{ backgroundColor: theme.badgeColor }}
        >
          무드
        </span>
        <strong className="saved-mood-title">{title}</strong>
        {actionSlot}
      </div>

      <div className="saved-mood-settings">
        {items.map((item) => (
          <div
            key={item.key}
            className="saved-mood-setting-chip"
            style={{ backgroundColor: theme.itemColor }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </article>
  );
}

function toSavedMoodItems(moodCustom: SavedMoodCustom) {
  return moodCustom.custom_product.map((product) => ({
    key: product.product_type,
    label: product.summary,
  }));
}

function toRecommendedMoodItems(moodCustom: RecommendedMoodCustomRecord) {
  return moodCustom.custom_product.map((product) => ({
    key: `${moodCustom.mood_id}-${product.product_type}`,
    label: product.summary,
  }));
}

function getExecutionModalItems(moodCustom: SavedMoodCustom): ExecutionModalItem[] {
  const includedProducts = new Set(
    moodCustom.custom_product.map((product) => product.product_type),
  );
  const items: ExecutionModalItem[] = [];

  if (includedProducts.has("coffee_machine")) {
    items.push({
      key: "coffee_machine",
      imageSrc: duoboImage,
      title: "듀오보",
      description: "커피 추출중",
    });
  }

  if (includedProducts.has("light")) {
    items.push({
      key: "light",
      imageSrc: lightDeviceImage,
      title: "LG 조명",
      description: "무드 커스텀 실행중",
    });
  }

  if (includedProducts.has("speaker")) {
    items.push({
      key: "speaker",
      imageSrc: speakerDeviceImage,
      title: "LG 스피커",
      description: "무드 커스텀 실행중",
    });
  }

  return items;
}

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

  useEffect(() => {
    setOpenedMenuMoodId(null);
  }, [activeTab]);

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

  const hasMineCards =
    savedMoodCustoms.length > 0 || bookmarkedRecommendedMoodCustoms.length > 0;

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

  return (
    <MobileLayout>
      <div className="page smart-routine-page">
        <SmartRoutineHeader title="스마트 루틴" backTo="/" showActions />

        <nav className="smart-routine-tabs" aria-label="스마트 루틴 탭">
          <button
            type="button"
            className={`smart-routine-tab ${activeTab === "mine" ? "active" : ""}`}
            aria-current={activeTab === "mine" ? "page" : undefined}
            onClick={() => setActiveTab("mine")}
          >
            나의 루틴
          </button>
          <button
            type="button"
            className={`smart-routine-tab ${activeTab === "recommend" ? "active" : ""}`}
            aria-current={activeTab === "recommend" ? "page" : undefined}
            onClick={() => setActiveTab("recommend")}
          >
            추천
          </button>
        </nav>

        {activeTab === "mine" ? (
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
                    isExecuting={runningMoodCustom?.mood_id === moodCustom.mood_id}
                    actionSlot={
                      <div className="saved-mood-action-shell">
                        <button
                          type="button"
                          className="saved-mood-action-button"
                          aria-label="무드 커스텀 옵션 열기"
                          onClick={() =>
                            setOpenedMenuMoodId((current) =>
                              current === moodCustom.mood_id
                                ? null
                                : moodCustom.mood_id,
                            )
                          }
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
                              onClick={() => handleShareMood(moodCustom.mood_id)}
                            >
                              무드 커스텀 공유
                            </button>
                            <button
                              type="button"
                              className="mood-card-menu-button"
                              onClick={() => handleExecuteMood(moodCustom.mood_id)}
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
                          aria-label="북마크 토글"
                          onClick={() => handleBookmarkToggle(moodCustom.mood_id)}
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
                  <p>내가 원할 때 여러 제품을 한 번에 작동할 수 있어요.</p>
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
                onClick={() => navigate("/smartroutine/create")}
              >
                나만의 무드 커스텀하기
              </button>
            </div>
          </main>
        ) : (
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
                        aria-label="북마크 토글"
                        onClick={() => handleBookmarkToggle(moodCustom.mood_id)}
                      >
                        <BookmarkIcon filled={isBookmarked} />
                      </button>
                    }
                  />
                );
              })}
            </section>
          </main>
        )}

        {runningMoodCustom ? (
          <div
            className="mood-execution-overlay"
            role="presentation"
            onClick={() => setRunningMoodCustom(null)}
          >
            <div
              className="mood-execution-modal"
              role="dialog"
              aria-modal="true"
              aria-label="무드 커스텀 실행 상태"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mood-execution-list">
                {runningMoodItems.map((item) => (
                  <div key={item.key} className="mood-execution-item">
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="mood-execution-item-image"
                    />
                    <div className="mood-execution-item-copy">
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </MobileLayout>
  );
}
