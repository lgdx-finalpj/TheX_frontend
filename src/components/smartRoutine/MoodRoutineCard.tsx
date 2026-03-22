import type { ReactNode } from "react";

import type { MoodCardTheme, MoodRoutineCardItem } from "@/types/smartRoutine";

interface MoodRoutineCardProps {
  title: string;
  items: MoodRoutineCardItem[];
  theme: MoodCardTheme;
  actionSlot: ReactNode;
  isExecuting?: boolean;
}

export default function MoodRoutineCard({
  title,
  items,
  theme,
  actionSlot,
  isExecuting = false,
}: MoodRoutineCardProps) {
  return (
    <article
      className={`saved-mood-card ${isExecuting ? "executing" : ""}`}
      style={{ backgroundColor: theme.cardColor }}
    >
      <div className="saved-mood-card-header">
        <span
          className="saved-mood-badge"
          style={{ backgroundColor: theme.badgeColor }}
        >
          무드
        </span>
        <strong className="saved-mood-title">{title}</strong>
        {actionSlot}
      </div>

      <div className="saved-mood-settings">
        {items.map((item) => (
          <div
            key={item.key}
            className="saved-mood-setting-chip"
            style={{ backgroundColor: theme.itemColor }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </article>
  );
}
