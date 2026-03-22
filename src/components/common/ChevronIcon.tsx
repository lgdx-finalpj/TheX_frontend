import type { SVGProps } from "react";

interface ChevronIconProps extends SVGProps<SVGSVGElement> {
  direction?: "left" | "right";
}

export default function ChevronIcon({
  direction = "left",
  ...props
}: ChevronIconProps) {
  const points = direction === "left" ? "15 6 9 12 15 18" : "9 6 15 12 9 18";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      focusable="false"
      aria-hidden="true"
      {...props}
    >
      <polyline
        points={points}
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
