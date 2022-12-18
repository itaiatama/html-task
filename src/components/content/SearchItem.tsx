import React, { useEffect, useState } from "react";
import {
  Album,
  Artist,
  convertMsToMS,
  fetchAlbumSearch,
  fetchArtistSearch,
  fetchTrackDuration,
  fetchTrackSearch,
  Track,
} from "../API";
import SearchSection from "./SearchSection";

interface SearchProps {
  text: string;
}

const SearchItem = (props: SearchProps) => {
  const [artists, setArtists] = useState<React.ReactNode[]>([]);
  const [albums, setAlbums] = useState<React.ReactNode[]>([]);
  const [tracks, setTracks] = useState<React.ReactNode[]>([]);

  const links = ["Top Results", "Artists", "Albums", "Tracks"];

  const Links = (links: string[], active: number) => {
    return links.map((item, index) => {
      const style = `search-menu-item ${index === active ? "search-menu-item-active" : ""}`;
      return (
        <a key={index} className={style} href="/#">
          {item}
        </a>
      );
    });
  };

  useEffect(() => {
    fetchArtistSearch(props.text).then((data: Artist[]) => {
      const elements = data.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <div className="search-image-item">
              <img src={item.image} />
              <div className="search-image-item-inner">
                <a href={`${item.url}`} className="search-image-item-link">
                  {item.name}
                </a>
                <small className="search-image-item-text">{item.listeners} listners</small>
              </div>
            </div>
          </React.Fragment>
        );
      });
      setArtists(elements);
    });

    fetchAlbumSearch(props.text).then((data: Album[]) => {
      const elements = data.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <div className="search-image-item">
              <img src={item.image} />
              <div className="search-image-item-inner">
                <a href={`${item.url}`} className="search-image-item-link">
                  {item.name}
                </a>
                <a
                  href={`${item.url}`}
                  className="search-image-item-link search-image-item-link-sm"
                >
                  {item.artist}
                </a>
              </div>
            </div>
          </React.Fragment>
        );
      });
      setAlbums(elements);
    });

    //const items: { name: string; artist: string }[] = [];

    fetchTrackSearch(props.text).then((data) => {
      const el: any[] = [];

      data.map((trackItem: { name: string; artist: string }) => {
        fetchTrackDuration(trackItem.artist, trackItem.name)
          .then((track: any) => {
            if (track !== undefined) el.push(track);
          })
          .finally(() => {
            const elements = el.map((item, index) => {
              const time = item.duration ? convertMsToMS(item.duration) : 0;
              return (
                <React.Fragment key={index}>
                  <div className="search-track">
                    <button className="search-track-button">
                      <i className="fa-regular fa-circle-play search-track-icon"></i>
                    </button>
                    <a href={`${item.url}`}>
                      <img src={item.image} />
                    </a>
                    <i className="fa-regular fa-heart search-track-icon-sm"></i>
                    <a className="search-track-link" href={`${item.url}`}>
                      {item.name}
                    </a>
                    <a className="search-track-link-light" href={`${item.artist.url}`}>
                      {item.artist.name}
                    </a>
                    <div className="search-track-right">
                      <button className="search-track-button">
                        <i className="fa-solid fa-arrow-down search-track-icon-sm"></i>
                      </button>
                      <button className="search-track-button">
                        <i className="fa-solid fa-ellipsis-vertical search-track-icon-sm"></i>
                      </button>
                      <span className="search-track-time">{time}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            });
            setTracks(elements);
          });
      });
    });

    // fetchTrackDuration(track.artist.name, track.name).then((data: Track[]) => {
    //   const elements = data.map((item, index) => {
    //     const time = item.duration ? convertMsToMS(item.duration) : 0;
    //     return (
    //       <React.Fragment key={index}>
    //         <div className="search-track">
    //           <button className="search-track-button">
    //             <i className="fa-regular fa-circle-play search-track-icon"></i>
    //           </button>
    //           <a href={`${item.url}`}>
    //             <img src={item.image} />
    //           </a>

    //           <i className="fa-regular fa-heart search-track-icon-sm"></i>
    //           <a className="search-track-link" href={`${item.url}`}>
    //             {item.name}
    //           </a>
    //           <a className="search-track-link-light" href={`${item.artist.url}`}>
    //             {item.artist.name}
    //           </a>

    //           <div className="search-track-right">
    //             <button className="search-track-button">
    //               <i className="fa-solid fa-arrow-down search-track-icon-sm"></i>
    //             </button>
    //             <button className="search-track-button">
    //               <i className="fa-solid fa-ellipsis-vertical search-track-icon-sm"></i>
    //             </button>

    //             <span className="search-track-time">{time}</span>
    //           </div>
    //         </div>
    //       </React.Fragment>
    //     );
    //   });
    //   //setTracks(elements);
    // });
  }, [props.text]);

  return (
    <>
      <div className="filler" />
      <main className="translated">
        <div className="container">
          <h1 className="search-title">Search result for {props.text}</h1>

          <div className="search-menu">{Links(links, 0)}</div>
        </div>
        <div className="search-spacer" />

        <div className="container">
          <div className="search-wrapper">
            <div id="search-content" className="search-content-left">
              <form className="search-form">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Type here..."
                  value={props.text}
                  readOnly
                />
                <button className="search-button search-reset-button">
                  <i className="fa-regular fa-circle-xmark search-icon" />
                </button>
                <div className="search-input-spacer" />
                <button className="search-button search-find-button">
                  <i className="fa-sharp fa-solid fa-magnifying-glass search-icon" />
                </button>
              </form>

              <SearchSection name={"artists"} text={props.text} content={artists} />
              <SearchSection name={"albums"} text={props.text} content={albums} />
              <SearchSection name={"tracks"} text={props.text} content={tracks} />
            </div>
            <div className="search-content-right">
              <div>
                <span className="search-ad-text">Don't want to see ads?</span>
                <a className="search-ad-link">Upgrade Now</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SearchItem;
