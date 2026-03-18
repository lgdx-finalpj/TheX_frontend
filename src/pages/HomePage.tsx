import MobileLayout from "@/layouts/MobileLayout";

export default function HomePage() {
  return (
    <MobileLayout>
      <div className="page">
        <header className="page-header">
          <h1>THE X</h1>
          <p>모바일 레이아웃 초기 세팅 완료</p>
        </header>

        <main className="page-content">
          <section className="card">
            <h2>시작 페이지</h2>
            <p>여기에 실제 기능과 화면 구성을 이어서 붙이면 됩니다.</p>
          </section>
        </main>
      </div>
    </MobileLayout>
  );
}
