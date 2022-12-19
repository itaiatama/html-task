interface NavLinkProps {
  text: string;
  URL: string;
}

const NavLink = (props: NavLinkProps) => {
  return (
    <a className="nav-item nav-link" href={props.URL}>
      {props.text}
    </a>
  );
};

export default NavLink;
