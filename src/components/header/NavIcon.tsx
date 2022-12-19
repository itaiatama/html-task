interface NavIconProps {
  icon: string;
  size: string;
}

const NavIcon = (props: NavIconProps) => {
  return <i className={`${props.icon} music-player-icon-${props.size}`} />;
};

export default NavIcon;
