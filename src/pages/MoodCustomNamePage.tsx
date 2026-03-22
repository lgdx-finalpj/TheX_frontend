import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MobileLayout from "@/layouts/MobileLayout";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SmartRoutineShared.css";
import "./MoodCustomFlow.css";

export default function MoodCustomNamePage() {
  const navigate = useNavigate();
  const { draft, setMoodName } = useMoodCustomDraft();
  const [name, setName] = useState(draft.mood_name);
  const trimmedName = name.trim();

  const handleSave = () => {
    if (!trimmedName) {
      return;
    }

    setMoodName(trimmedName);
    navigate("/smartroutine/mood-custom");
  };

  return (
    <MobileLayout>
      <div className="page smart-routine-page mood-custom-page">
        <SmartRoutineHeader
          title="무드 이름은 어떻게 설정할까요?"
          backTo="/smartroutine/mood-custom"
        />

        <main className="mood-name-page">
          <section className="mood-name-section">
            <h2>무드 이름 설정</h2>
            <textarea
              className="mood-name-textarea"
              value={name}
              rows={2}
              maxLength={24}
              onChange={(event) => setName(event.target.value)}
            />
          </section>

          <div className="mood-name-footer">
            <button
              type="button"
              className="mood-save-button"
              disabled={!trimmedName}
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </main>
      </div>
    </MobileLayout>
  );
}
