import createRoutineImage from "@/assets/moodcustom/나만의 루틴 만들기.png";
import moodCustomImage from "@/assets/moodcustom/나의 무드 커스텀.png";
import SmartRoutineHeader from "@/components/SmartRoutineHeader";
import MobileLayout from "@/layouts/MobileLayout";
import { useMoodCustomDraft } from "@/state/useMoodCustomDraft";
import { useNavigate } from "react-router-dom";
import "./SmartRoutineCreatePage.css";
import "./SmartRoutineShared.css";

const routineDescription =
  "내가 원할 때 여러 제품들을 한번에 작동시킬 수 있어요.";
const moodDescription =
  "여러 제품 설정을 조합해서 내가 원하는 분위기를 만들 수 있어요.";

export default function SmartRoutineCreatePage() {
  const navigate = useNavigate();
  const { resetDraft } = useMoodCustomDraft();

  return (
    <MobileLayout>
      <div className="page smart-routine-page">
        <SmartRoutineHeader
          title="스마트 루틴 / 무드 커스텀"
          backTo="/smartroutine"
        />

        <main className="smart-routine-create-content">
          <button
            type="button"
            className="smart-routine-option"
            onClick={() =>
              navigate("/smartroutine/create/recipe/coffee-machine")
            }
          >
            <img
              src={createRoutineImage}
              alt="나만의 루틴 만들기"
              className="smart-routine-option-image"
            />
            <div className="smart-routine-card-copy">
              <h2>루틴을 만들어보세요.</h2>
              <p>{routineDescription}</p>
            </div>
            <p className="smart-routine-option-title">나만의 루틴 만들기</p>
          </button>

          <button
            type="button"
            className="smart-routine-option"
            onClick={() => {
              resetDraft();
              navigate("/smartroutine/mood-custom");
            }}
          >
            <img
              src={moodCustomImage}
              alt="나의 무드 커스텀"
              className="smart-routine-option-image"
            />
            <div className="smart-routine-card-copy">
              <h2>무드를 만들어보세요.</h2>
              <p>{moodDescription}</p>
            </div>
            <p className="smart-routine-option-title">나의 무드 커스텀</p>
          </button>
        </main>
      </div>
    </MobileLayout>
  );
}
