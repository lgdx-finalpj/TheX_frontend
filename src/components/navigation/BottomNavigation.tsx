import "./BottomNavigation.css";
import {
  CareTabIcon,
  DeviceTabIcon,
  HomeTabIcon,
  MenuTabIcon,
} from "@/components/home/HomeIcons";
import { useNavigate } from "react-router-dom";

type BottomNavigationTab = "home" | "devices" | "care" | "menu";

interface BottomNavigationProps {
  activeTab: BottomNavigationTab;
}

interface NavigationItem {
  id: BottomNavigationTab;
  label: string;
  icon: typeof HomeTabIcon;
  path?: string;
}

const navigationItems: NavigationItem[] = [
  { id: "home", label: "홈", icon: HomeTabIcon, path: "/" },
  { id: "devices", label: "디바이스", icon: DeviceTabIcon, path: "/devices" },
  { id: "care", label: "케어", icon: CareTabIcon },
  { id: "menu", label: "메뉴", icon: MenuTabIcon },
];

export default function BottomNavigation({
  activeTab,
}: BottomNavigationProps) {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav" aria-label="하단 탭">
      {navigationItems.map(({ id, label, icon: Icon, path }) => {
        const isActive = activeTab === id;
        const isInteractive = path !== undefined && !isActive;

        return (
          <button
            key={id}
            type="button"
            className={`bottom-nav__item${
              isActive ? " bottom-nav__item--active" : ""
            }${isInteractive ? " bottom-nav__item--interactive" : ""}`}
            onClick={isInteractive ? () => navigate(path) : undefined}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="bottom-nav__icon">
              <Icon />
            </span>
            <span className="bottom-nav__label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
