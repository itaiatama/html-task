import React from "react";
import { Tag, Track } from "../API";
import TagItem from "../TagItem";

const PopularItem = (track: Track) => {
  return (
    <>
      <img className="popular-item-image" src={track.image} />
      <div className="popular-item-wrapper">
        <a className="content-link content-title" href={track.name}>
          {track.name}
        </a>
        <a className="content-link content-sub-title" href={track.artist.name}>
          {track.artist.name}
        </a>

        <ul id={`${track.artist.name}&${track.name}`} className="popular-track-tags">
          {track.tags?.map((item: Tag, index) => {
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

export default PopularItem;
