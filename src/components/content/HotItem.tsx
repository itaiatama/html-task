import React from "react";
import { Artist, Tag } from "../API";
import TagItem from "../TagItem";

interface HotItemProps {
  artist: Artist;
}

const HotItem = (props: HotItemProps) => {
  return (
    <>
      <img className="hot-item-image" src={props.artist.image} />
      <div className="hot-item-wrapper">
        <a className="content-link content-title" href={`${props.artist.url}`}>
          {props.artist.name}
        </a>
        <ul id={`${props.artist.mbid}`} className="hot-artist-tags">
          {props.artist.tags?.map((item: Tag, index) => {
            return <TagItem key={`hot-item-tag-${index}`} tag={item} last={index === 2} />;
          })}
        </ul>
      </div>
    </>
  );
};

export default HotItem;
