import { useNavigate } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";
import "@/components/device-detail/DeviceCommon.css";
import "./RecipeHomePage.css";

export default function RecipeHomePage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <main className="device-page recipe-home-page">
        <header className="device-topbar">
          <button
            className="icon-button icon-button--plain back-button"
            type="button"
            onClick={() => navigate("/devices/coffee-machine")}
            aria-label="이전으로"
          >
            <span aria-hidden="true">&lt;</span>
          </button>

          <h1 className="device-topbar__title">기본 레시피</h1>

          <span className="recipe-home-page__spacer" aria-hidden="true" />
        </header>

        <section className="recipe-home-card">
          <h2 className="recipe-home-card__title">레시피 홈</h2>
          <p className="recipe-home-card__body">
            기본 레시피 목록 화면입니다. 이후 메인 브랜치 병합 시 이 경로에 실제 레시피 리스트가 연결됩니다.
          </p>
        </section>
      </main>
    </MobileLayout>
  );
}
