import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MobileLayout from "@/layouts/MobileLayout";
import { moodOptions } from "@/state/moodCustom.constants";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SmartRoutineShared.css";
import "./MoodCustomFlow.css";

export default function MoodCustomMoodPage() {
  const navigate = useNavigate();
  const { draft, setSelectedMood } = useMoodCustomDraft();
  const hasMoodName = draft.mood_name.trim().length > 0;

  useEffect(() => {
    if (!hasMoodName) {
      navigate("/smartroutine/mood-custom/name", { replace: true });
    }
  }, [hasMoodName, navigate]);

  return (
    <MobileLayout>
      <div className="page smart-routine-page mood-custom-page">
        <SmartRoutineHeader
          title="어떤 무드를 만들까요?"
          backTo="/smartroutine/mood-custom"
        />

        <main className="mood-select-page">
          <div className="mood-option-grid">
            {moodOptions.map((option) => {
              const isSelected = draft.selected_mood_id === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`mood-option-card ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedMood(option.id);
                    navigate("/smartroutine/mood-custom");
                  }}
                >
                  <div className="mood-option-preview">
                    <img
                      src={option.imageSrc}
                      alt={option.label}
                      className="mood-option-image"
                    />
                  </div>
                  <span className="mood-option-label">{option.label}</span>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    </MobileLayout>
  );
}
