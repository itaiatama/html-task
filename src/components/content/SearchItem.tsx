import React, { useEffect, useState } from "react";
import {
  Album,
  Artist,
  convertMsToMS,
  fetchAlbumSearch,
  fetchArtistSearch,
  fetchTrackSearch,
} from "../API";
import SearchLink from "./SearchLink";
import SearchSection from "./SearchSection";

interface SearchProps {
  text: string;
}

const SearchItem = (props: SearchProps) => {
  const [artists, setArtists] = useState<React.ReactNode[]>([]);
  const [albums, setAlbums] = useState<React.ReactNode[]>([]);
  const [tracks, setTracks] = useState<React.ReactNode[]>([]);

  const links = ["Top Results", "Artists", "Albums", "Tracks"];

  useEffect(() => {
    let shuoldUpdate = true;
    fetchArtistSearch(props.text).then((data: Artist[]) => {
      const elements = data.map((item, index) => {
        return (
          <div key={`search-artist-${index}`} className="search-image-item">
            <img src={item.image} />
            <div className="search-image-item-inner">
              <a href={`${item.url}`} className="search-image-item-link">
                {item.name}
              </a>
              <small className="search-image-item-text">{item.listeners} listners</small>
            </div>
          </div>
        );
      });
      if (shuoldUpdate) setArtists(elements);
    });

    return () => {
      shuoldUpdate = false;
    };
  }, [props.text]);

  useEffect(() => {
    let shuoldUpdate = true;
    fetchAlbumSearch(props.text).then((data: Album[]) => {
      const elements = data.map((item, index) => {
        return (
          <div key={`search-album-${index}`} className="search-image-item">
            <img src={item.image} />
            <div className="search-image-item-inner">
              <a href={`${item.url}`} className="search-image-item-link">
                {item.name}
              </a>
              <a href={`${item.url}`} className="search-image-item-link search-image-item-link-sm">
                {item.artist}
              </a>
            </div>
          </div>
        );
      });
      if (shuoldUpdate) setAlbums(elements);
    });

    return () => {
      shuoldUpdate = false;
    };
  }, [props.text]);

  useEffect(() => {
    let shuoldUpdate = true;

    fetchTrackSearch(props.text).then((data) => {
      const elements = data.map((item, index) => {
        const time = item.duration ? convertMsToMS(item.duration) : 0;

        return (
          <div className="search-track" key={`search-track-${index}`}>
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
        );
      });
      if (shuoldUpdate) setTracks(elements);
    });

    return () => {
      shuoldUpdate = false;
    };
  }, [props.text]);

  return (
    <>
      <div className="filler" />
      <main className="translated">
        <div className="container">
          <h1 className="search-title">Search result for {props.text}</h1>

          <div className="search-menu">
            <SearchLink links={links} active={0} />
          </div>
        </div>
        <div className="search-spacer" />

        <div className="container">
          <div className="search-wrapper">
            <div id="search-content" className="search-content-left">
              {/* <form className="search-form">
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
              </form> */}

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
