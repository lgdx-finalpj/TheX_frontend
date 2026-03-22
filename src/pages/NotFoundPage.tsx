import "./NotFoundPage.css";
import MobileLayout from "@/layouts/MobileLayout";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <MobileLayout>
      <div className="page">
        <header className="not-found-page__header">
          <h1>404</h1>
          <p>페이지를 찾을 수 없습니다.</p>
        </header>

        <main className="not-found-page__content">
          <section className="not-found-page__card">
            <Link to="/">홈으로 돌아가기</Link>
          </section>
        </main>
      </div>
    </MobileLayout>
  );
}
