import { useEffect, useState } from "react";
import { Artist, Tag, fetchArtist, fetchTagsById } from "../API";
import HotItem from "./HotItem";

const HotSection = () => {
  const [data, setData] = useState<Artist[]>([]);

  useEffect(() => {
    let artists: Promise<Artist[]>;
    artists = fetchArtist().then((data: Artist[]) => data);

    Promise.resolve(artists).then((data) => {
      let promises: Promise<Tag[]>[] = [];

      data.map((item) => {
        promises.push(fetchTagsById(item.mbid).then((data) => data));
      });

      Promise.all(promises).then((tags) => {
        data.map((_, index) => (data[index].tags = tags[index]));
        setData(data);
      });
    });
  }, []);

  return (
    <>
      <h3 className="sub-title">Hot right now</h3>
      <div id="hot-items-section" className="wrapper">
        {data.map((item, index) => {
          return (
            <div className="hot-item" key={index}>
              {HotItem(item)}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HotSection;
