import type { ReactNode } from "react";
import backgroundColor1 from "@/assets/bg_color/background_color1.png";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="app-shell">
      <div
        className="mobile-frame"
        style={{ backgroundImage: `url(${backgroundColor1})` }}
      >
        {children}
      </div>
    </div>
  );
}
