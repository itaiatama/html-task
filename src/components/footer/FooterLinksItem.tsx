interface FooterLinksItemProps {
  title: string;
  links: string[];
}

const FooterLinksItem = (props: FooterLinksItemProps) => {
  return (
    <div className="footer-link-item">
      <span className="footer-link-title">{props.title}</span>
      {props.links.map((item, index) => {
        return (
          <a key={`footer-link-${index}`} className="footer-link" href="#">
            {item}
          </a>
        );
      })}
    </div>
  );
};

export default FooterLinksItem;
