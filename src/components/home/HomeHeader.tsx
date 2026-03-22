import { useNavigate } from "react-router-dom";
import "./HomeHeader.css";
import useCurrentUserProfile from "@/hooks/useCurrentUserProfile";
import {
  BellIcon,
  ChevronDownIcon,
  MoreIcon,
  PlusIcon,
} from "@/components/home/HomeIcons";

export default function HomeHeader() {
  const navigate = useNavigate();
  const { user_nickname } = useCurrentUserProfile();
  const homeOwnerNickname = user_nickname || "사용자";

  return (
    <header className="home-header">
      <div className="home-header__title-group">
        <button
          type="button"
          className="home-header__title-button"
          onClick={() => navigate("/")}
          aria-label={`${homeOwnerNickname} 홈으로 이동`}
        >
          <span className="home-header__title">{homeOwnerNickname} 홈</span>
          <span className="home-header__title-icon">
            <ChevronDownIcon />
          </span>
        </button>
      </div>

      <div className="home-header__actions" aria-label="상단 메뉴">
        <button type="button" className="icon-button" aria-label="추가">
          <PlusIcon />
        </button>
        <button type="button" className="icon-button" aria-label="알림">
          <BellIcon />
        </button>
        <button type="button" className="icon-button" aria-label="더보기">
          <MoreIcon />
        </button>
      </div>
    </header>
  );
}
