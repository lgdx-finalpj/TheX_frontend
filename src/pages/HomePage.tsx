import MobileLayout from "@/layouts/MobileLayout";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function ChevronRightIcon() {
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

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="page home-page">
        <header className="page-header home-header">
          <p className="home-eyebrow">나의 무드 커스텀</p>
          <h1>THE X</h1>
          <p className="home-description">
            홈에서 스마트 루틴과 무드 커스텀 흐름을 바로 시작할 수 있어요.
          </p>
        </header>

        <main className="page-content">
          <section className="home-section">
            <div className="section-heading">
              <h2>스마트 루틴</h2>
              <p>루틴과 무드 커스텀을 한 번에 관리해보세요.</p>
            </div>

            <button
              type="button"
              className="home-shortcut"
              onClick={() => navigate("/smartroutine")}
            >
              <div className="home-shortcut-copy">
                <span className="home-shortcut-label">스마트 루틴</span>
                <span className="home-shortcut-meta">
                  나의 루틴과 무드 커스텀 만들기
                </span>
              </div>

              <span className="home-shortcut-arrow" aria-hidden="true">
                <ChevronRightIcon />
              </span>
            </button>
          </section>
        </main>
      </div>
    </MobileLayout>
  );
}
