import menuArrowIcon from "@/assets/icon_image/keyboard_arrow_right_black.png";

interface MenuItemProps {
  iconSrc: string;
  label: string;
}

export default function MenuItem({ iconSrc, label }: MenuItemProps) {
  return (
    <button className="menu-item" type="button">
      <span className="menu-item__icon" aria-hidden="true">
        <img className="menu-item__icon-image" src={iconSrc} alt="" />
      </span>
      <span className="menu-item__label">{label}</span>
      <span className="menu-item__arrow" aria-hidden="true">
        <img className="menu-item__arrow-image" src={menuArrowIcon} alt="" />
      </span>
    </button>
  );
}
