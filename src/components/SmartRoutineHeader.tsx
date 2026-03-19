import { useNavigate } from "react-router-dom";
import "./SmartRoutineHeader.css";

interface SmartRoutineHeaderProps {
  title: string;
  backTo: string;
  showActions?: boolean;
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 6L9 12L15 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5V19M5 12H19"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
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

export default function SmartRoutineHeader({
  title,
  backTo,
  showActions = false,
}: SmartRoutineHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="smart-routine-header">
      <div className="smart-routine-header-left">
        <button
          type="button"
          className="icon-button"
          aria-label="뒤로가기"
          onClick={() => navigate(backTo)}
        >
          <ArrowLeftIcon />
        </button>
        <h1 className="smart-routine-title">{title}</h1>
      </div>

      {showActions ? (
        <div className="smart-routine-header-actions">
          <button type="button" className="icon-button" aria-label="추가">
            <PlusIcon />
          </button>
          <button type="button" className="icon-button" aria-label="더보기">
            <MoreIcon />
          </button>
        </div>
      ) : null}
    </header>
  );
}
