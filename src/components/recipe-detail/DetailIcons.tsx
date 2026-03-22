import { FaTemperatureHigh } from "react-icons/fa6";
import { GiCoffeeBeans } from "react-icons/gi";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function DetailStarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m12 2.8 2.9 5.9 6.5 1-4.7 4.6 1.1 6.5L12 17.7 6.2 20.8l1.1-6.5L2.6 9.7l6.5-1L12 2.8Z" />
    </svg>
  );
}

export function DetailThermometerIcon(props: IconProps) {
  return <FaTemperatureHigh {...props} />;
}

export function DetailBeanIcon(props: IconProps) {
  return <GiCoffeeBeans {...props} />;
}
