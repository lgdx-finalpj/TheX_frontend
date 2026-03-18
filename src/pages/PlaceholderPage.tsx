import MobileLayout from "@/layouts/MobileLayout";

interface PlaceholderPageProps {
  message: string;
}

export default function PlaceholderPage({ message }: PlaceholderPageProps) {
  return (
    <MobileLayout>
      <div className="page placeholder-page">
        <div className="placeholder-page__content">
          <p className="placeholder-page__eyebrow">구현준비중 /</p>
          <h1>{message}</h1>
        </div>
      </div>
    </MobileLayout>
  );
}
