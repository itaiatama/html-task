import { useEffect, useState } from "react";
import { Tag, Track, fetchTracks, fetchTagsNames } from "../API";
import PopularItem from "./PopularItem";

import "./popularSection.css";

const PopularSection = () => {
  const [data, setData] = useState<Track[]>([]);

  useEffect(() => {
    fetchTracks()
      .then((data: Track[]) => data)
      .then((data) => {
        const promises: Promise<Tag[]>[] = data.map((item) =>
          fetchTagsNames(item.artist.name, item.name).then((data) => data)
        );

        Promise.all(promises).then((tags) => {
          data.map((_, index) => (data[index].tags = tags[index]));
          setData(data);
        });
      });
  }, []);

  return (
    <>
      <h3 className="sub-title">Popular tracks</h3>
      <div id="popular-items-section" className="wrapper">
        {data.map((item, index) => {
          return (
            <div className="popular-item" key={index}>
              <PopularItem track={item} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PopularSection;
