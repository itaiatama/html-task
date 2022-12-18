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
          <a key={index} className="footer-link" href="#">
            {item}
          </a>
        );
      })}

      {/* <a className="footer-link" href="#">
        Facebook
      </a>
      <a className="footer-link" href="#">
        Twitter
      </a>
      <a className="footer-link" href="#">
        Instagram
      </a>
      <a className="footer-link" href="#">
        YouTube
      </a> */}
    </div>
  );
};

export default FooterLinksItem;
