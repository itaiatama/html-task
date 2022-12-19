import React from "react";
import { capitalize } from "../API";

import "./search.css";

interface SearchSectionProps {
  name: string;
  text: string;
  content: React.ReactNode;
}

const SearchSection = (props: SearchSectionProps) => {
  return (
    <div className="search-section">
      <a
        className="search-sub-title"
        href={`https://www.last.fm/search/${props.name}?q=${props.text}`}
      >
        {capitalize(props.name)}
      </a>
      <div id="search-${name}-section" className="search-image-block">
        {props.content}
      </div>
      <div className="search-more-item">
        <a
          className="search-more-link"
          href={`https://www.last.fm/search/${props.name}?q=${props.text}`}
        >
          More {props.name}
        </a>
        <i className="fa-solid fa-chevron-right search-more-icon" />
      </div>
    </div>
  );
};

export default SearchSection;
