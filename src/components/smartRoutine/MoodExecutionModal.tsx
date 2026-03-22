import type { ExecutionModalItem } from "@/types/smartRoutine";

interface MoodExecutionModalProps {
  items: ExecutionModalItem[];
  onClose: () => void;
}

export default function MoodExecutionModal({
  items,
  onClose,
}: MoodExecutionModalProps) {
  return (
    <div className="mood-execution-overlay" role="presentation" onClick={onClose}>
      <div
        className="mood-execution-modal"
        role="dialog"
        aria-modal="true"
        aria-label="무드 커스텀 실행 상태"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mood-execution-list">
          {items.map((item) => (
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
  );
}
