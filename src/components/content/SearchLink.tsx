interface SearchLinkProps {
  links: string[];
  active: number;
}

const SearchLink = (props: SearchLinkProps) => {
  return (
    <>
      {props.links.map((item, index) => {
        const style = `search-menu-item ${index === props.active ? "search-menu-item-active" : ""}`;
        return (
          <a key={`search-link-${index}`} className={style} href="/#">
            {item}
          </a>
        );
      })}
    </>
  );
};
export default SearchLink;
