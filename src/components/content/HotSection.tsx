import { useEffect, useState } from "react";
import { Artist, Tag, fetchArtist, fetchTagsById } from "../API";
import HotItem from "./HotItem";

import "./hotSection.css";

const HotSection = () => {
  const [data, setData] = useState<Artist[]>([]);

  useEffect(() => {
    fetchArtist()
      .then((data: Artist[]) => data)
      .then((data) => {
        const promises: Promise<Tag[]>[] = data.map((item) =>
          fetchTagsById(item.mbid).then((data) => data)
        );

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
            <div className="hot-item" key={`hot-item-${index}`}>
              <HotItem artist={item} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HotSection;
