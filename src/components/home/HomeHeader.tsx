import "./HomeHeader.css";
import { homeOwnerNickname } from "@/mocks/homeDevices";
import {
  BellIcon,
  ChevronDownIcon,
  MoreIcon,
  PlusIcon,
} from "@/components/home/HomeIcons";

export default function HomeHeader() {
  return (
    <header className="home-header">
      <div className="home-header__title-group">
        <button
          type="button"
          className="home-header__title-button"
          aria-label={`${homeOwnerNickname} 홈`}
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
