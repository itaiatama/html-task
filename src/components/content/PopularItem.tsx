import React from "react";
import { Tag, Track } from "../API";
import TagItem from "../TagItem";

interface PopularItemProps {
  track: Track;
}

const PopularItem = (props: PopularItemProps) => {
  return (
    <>
      <img className="popular-item-image" src={props.track.image} />
      <div className="popular-item-wrapper">
        <a className="content-link content-title" href={`${props.track.url}`}>
          {props.track.name}
        </a>
        <a className="content-link content-sub-title" href={`${props.track.artist.url}`}>
          {props.track.artist.name}
        </a>

        <ul id={`${props.track.artist.name}&${props.track.name}`} className="popular-track-tags">
          {props.track.tags?.map((item: Tag, index) => {
            return <TagItem key={`popular-item-tag-${index}`} tag={item} last={index === 2} />;
          })}
        </ul>
      </div>
    </>
  );
};

export default PopularItem;
