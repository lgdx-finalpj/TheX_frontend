import type { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="app-shell">
      <div className="mobile-frame">{children}</div>
    </div>
  );
}
