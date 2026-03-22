import { useMemo, useRef, type TouchEvent } from "react";

interface UseHorizontalSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface SwipePoint {
  x: number;
  y: number;
}

const MIN_SWIPE_DISTANCE = 56;
const MAX_VERTICAL_DRIFT = 44;

export default function useHorizontalSwipe({
  onSwipeLeft,
  onSwipeRight,
}: UseHorizontalSwipeOptions) {
  const startPointRef = useRef<SwipePoint | null>(null);

  return useMemo(
    () => ({
      onTouchStart: (event: TouchEvent<HTMLElement>) => {
        const touch = event.touches[0];
        if (!touch) {
          return;
        }

        startPointRef.current = { x: touch.clientX, y: touch.clientY };
      },
      onTouchEnd: (event: TouchEvent<HTMLElement>) => {
        const startPoint = startPointRef.current;
        startPointRef.current = null;

        const touch = event.changedTouches[0];
        if (!startPoint || !touch) {
          return;
        }

        const deltaX = touch.clientX - startPoint.x;
        const deltaY = touch.clientY - startPoint.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX < MIN_SWIPE_DISTANCE || absY > MAX_VERTICAL_DRIFT || absX <= absY) {
          return;
        }

        if (deltaX < 0) {
          onSwipeLeft?.();
          return;
        }

        onSwipeRight?.();
      },
    }),
    [onSwipeLeft, onSwipeRight],
  );
}
