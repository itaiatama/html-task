import { useState, useRef } from "react";
import NavIcon from "./NavIcon";
import NavLink from "./NavLink";

import "./header.css";

interface HeaderProps {
  setSearch: (value: string | undefined) => void;
}

const Header = (props: HeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [apply, setApply] = useState<boolean>(false);

  return (
    <header id="header" className="header">
      {apply ? (
        <div className="nav-alt">
          <input
            id="nav-search-input"
            className="nav-search-input"
            type="text"
            placeholder="Search for music..."
            ref={inputRef}
          />
          <button
            id="nav-search-cancel"
            className="nav-search-button"
            onClick={() => setApply(false)}
          >
            <i className="fa-sharp fa-solid fa-xmark nav-item nav-icon-alt" />
          </button>
          <button
            id="nav-search-alt"
            className="nav-search-button-alt"
            type="submit"
            onClick={() => {
              props.setSearch(inputRef.current?.value);
              setApply(false);
            }}
          >
            <i className="fa-sharp fa-solid fa-magnifying-glass nav-item nav-icon" />
          </button>
        </div>
      ) : (
        <>
          <div className="music-player">
            <img src="assets/player-icon.png" />

            <div className="music-player-icons">
              <NavIcon icon="fa-solid fa-backward" size="sm" />
              <NavIcon icon="fa-regular fa-circle-play" size="md" />
              <NavIcon icon="fa-solid fa-forward" size="sm" />
              <NavIcon icon="fa-regular fa-heart" size="sm" />
            </div>
          </div>

          <a className="logo" href="#">
            <img src="assets/logo.png" />
          </a>

          <div className="nav">
            <button id="nav-search" className="nav-search-button">
              <i
                className="fa-sharp fa-solid fa-magnifying-glass nav-item nav-icon"
                onClick={() => setApply(true)}
              />
            </button>

            <div className="nav-links">
              <NavLink text="Home" URL="#" />
              <NavLink text="Live" URL="#" />
              <NavLink text="Music" URL="#" />
              <NavLink text="Charts" URL="#" />
              <NavLink text="Events" URL="#" />
              <NavLink text="Features" URL="#" />
            </div>
            <img
              className="nav-user"
              src="https://lastfm.freetls.fastly.net/i/u/avatar42s/818148bf682d429dc215c1705eb27b98.png"
            />
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
