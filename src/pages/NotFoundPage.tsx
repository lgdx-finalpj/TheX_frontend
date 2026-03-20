import MobileLayout from "@/layouts/MobileLayout";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <MobileLayout>
      <main className="device-page device-page--centered">
        <section className="empty-card">
          <p className="empty-card__code">404</p>
          <h1 className="empty-card__title">페이지를 찾을 수 없습니다.</h1>
          <p className="empty-card__body">요청한 화면이 없거나 이동되었어요. 홈 화면에서 다시 시작해보세요.</p>
          <Link className="empty-card__action" to="/">
            홈으로 돌아가기
          </Link>
        </section>
      </main>
    </MobileLayout>
  );
}
