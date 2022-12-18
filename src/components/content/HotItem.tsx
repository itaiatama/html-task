import React from "react";
import { Artist, Tag } from "../API";
import TagItem from "../TagItem";

const HotItem = (artist: Artist) => {
  return (
    <>
      <img className="hot-item-image" src={`${artist.image}`} />
      <div className="hot-item-wrapper">
        <a className="content-link content-title" href={`${artist.url}`}>
          {artist.name}
        </a>
        <ul id={`${artist.mbid}`} className="hot-artist-tags">
          {artist.tags?.map((item: Tag, index) => {
            return (
              <React.Fragment key={index}>
                <TagItem tag={item} last={index === 2} />
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default HotItem;
