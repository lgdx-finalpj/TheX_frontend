import "./SmartRoutineSection.css";
import { ChevronRightIcon } from "@/components/home/HomeIcons";

interface SmartRoutineSectionProps {
  onOpenMoodCreate: () => void;
}

export default function SmartRoutineSection({
  onOpenMoodCreate,
}: SmartRoutineSectionProps) {
  return (
    <section className="home-section">
      <div className="section-heading">
        <button
          type="button"
          className="section-heading__title-button"
          onClick={onOpenMoodCreate}
        >
          <h2>스마트 루틴</h2>
        </button>
        <button
          type="button"
          className="icon-button icon-button--small icon-button--interactive"
          aria-label="스마트 루틴 더보기"
          onClick={onOpenMoodCreate}
        >
          <ChevronRightIcon />
        </button>
      </div>

      <button type="button" className="routine-card" onClick={onOpenMoodCreate}>
        <span className="routine-card__icon" aria-hidden="true">
          <span className="routine-card__spark" />
        </span>
        <span className="routine-card__label">루틴 알아보기</span>
      </button>
    </section>
  );
}
