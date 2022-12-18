import { useEffect, useState } from "react";
import { Tag, Track, fetchTracks, fetchTagsNames } from "../API";
import PopularItem from "./PopularItem";

const PopularSection = () => {
  const [data, setData] = useState<Track[]>([]);

  useEffect(() => {
    let artists: Promise<Track[]>;
    artists = fetchTracks().then((data: Track[]) => data);

    Promise.resolve(artists).then((data) => {
      let promises: Promise<Tag[]>[] = [];

      data.map((item) => {
        promises.push(fetchTagsNames(item.artist.name, item.name).then((data) => data));
      });

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
              {PopularItem(item)}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PopularSection;
