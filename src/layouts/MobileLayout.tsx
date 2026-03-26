import "./MobileLayout.css";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import backgroundColor1 from "@/assets/bg_color/background_color1.png";
import backgroundColor2 from "@/assets/bg_color/backgroud_color2.png";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();
  const isBackground2Page =
    location.pathname.startsWith("/smartroutine") ||
    location.pathname === "/devices/coffee-machine" ||
    location.pathname === "/devices/speaker" ||
    location.pathname === "/devices/lighting" ||
    location.pathname.startsWith("/devices/coffee-machine/view-") ||
    location.pathname.startsWith("/devices/coffee-machine/create-recipe") ||
    location.pathname.startsWith("/devices/coffee-machine/ai-recommended");
  const backgroundImage = isBackground2Page ? backgroundColor2 : backgroundColor1;
  const backgroundBaseColor = isBackground2Page ? "#f5f5f7" : "#eef7fb";

  useEffect(() => {
    const composedBackground =
      `url(${backgroundImage}) center top / cover no-repeat, ${backgroundBaseColor}`;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", backgroundBaseColor);
    }

    document.documentElement.style.background = composedBackground;
    document.body.style.background = composedBackground;
  }, [backgroundBaseColor, backgroundImage]);

  return (
    <div
      className="app-shell"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundColor: backgroundBaseColor,
      }}
    >
      <div
        className="mobile-frame"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundColor: backgroundBaseColor,
        }}
      >
        {children}
      </div>
    </div>
  );
}
