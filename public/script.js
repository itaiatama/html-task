const URL = "http://www.last.fm/api/auth/?api_key=fc7e1572ebc98d1718f5aba67915fe76";

// FIXME: Ugly solution to token generation will be fixed later using react. Maybe.
if (!window.location.href.includes("token=")) {
  window.location.replace(URL);
}

// Not so private application key
const KEY = "fc7e1572ebc98d1718f5aba67915fe76";
// Query to find main-content element
const content = document.getElementById("main-content");
// Query to find header element
const header = document.getElementById("header");

/**
 * Constructor for abstract tag element
 * @constructor
 * @param  {object}  tag   - JS object with url and name attributes
 * @param  {boolean} last  - indicate that tag last in sequence
 * @return {string}        - static html to append/replace in element
 */
const createTagItem = (tag, last) => {
  return `
      <li class="tag-item">
        <a class="tag-item-link" href=${tag.url}>${tag.name}</a>
      </li>
      ${last ? "" : `<i class="fa-solid fa-circle tag-item-dot"> </i>`}
      `;
};

/**
 * Constructor for hot section item element
 * @constructor
 * @param  {object} artist - JS object with url, image, mbid and name attributes
 * @return {string}        - static html to append/replace in element
 */
const createHotItem = (artist) => {
  return `
    <div class="hot-item">
      <img
        class="hot-item-image"
        src=${artist.image}
      />
      <div class="hot-item-wrapper">
        <a class="content-link content-title" href=${artist.url}>
          ${artist.name}
        </a>
        <ul id="${artist.mbid}" class="hot-artist-tags"></ul>
      </div>
    </div>
  `;
};

/**
 * Constructor for popular section item element
 * @constructor
 * @param  {object} track - JS object with url, image, artist and name attributes
 * @return {string}       - static html to append/replace in element
 */
const createPopularItem = (track) => {
  return `
  <div class="popular-item">
  <img
    class="popular-item-image"
    src="${track.image}"
  />
  <div class="popular-item-wrapper">
    <a class="content-link content-title" href=${track.url}>${track.name}</a>
    <a class="content-link content-sub-title" href=${track.artist.url}>${track.artist.name}</a>

    <ul id="${track.artist.name}&${track.name}" class="popular-track-tags"></ul>
  </div>
</div>
  `;
};

/**
 * Function to fetch and map data about artist top 3 tags from last-fm API
 * @param  {string} mbid - the artist unique id
 * @return {promise}     - mapped data to generate static html from
 */
const fetchTagsById = async (mbid) => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&mbid=${encodeURIComponent(
      mbid
    )}&api_key=${KEY}&format=json`
  )
    .then((data) => data.json())
    .then((data) => data.toptags?.tag?.slice(0, 3))
    .then((data) =>
      data === undefined
        ? []
        : data.map((tag) => {
            return { name: tag.name, url: tag.url };
          })
    )
    .catch((error) => alert(error));
};

/**
 * Function to fetch and map data about track top 3 tags from last-fm API
 * @param  {string} artist - the artist name
 * @param  {string} track  - the track name
 * @return {promise}       - mapped data to generate static html from
 */
const fetchTagsNames = async (artist, track) => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&artist=${encodeURIComponent(
      artist
    )}&track=${encodeURIComponent(track)}&api_key=${KEY}&format=json`
  )
    .then((data) => data.json())
    .then((data) => data.toptags?.tag?.slice(0, 3))
    .then((data) =>
      data === undefined
        ? []
        : data.map((tag) => {
            return { name: tag.name, url: tag.url };
          })
    )
    .catch((error) => alert(error));
};

/**
 * Function to fetch and map data about top 12 artist from last-fm API
 * @return {promise} - mapped data to generate static html from
 */
const fetchArtist = async () => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${KEY}&format=json&limit=12`
  )
    .then((data) => data.json())
    .then((data) =>
      data.artists.artist.map((artist) => {
        return {
          name: artist.name,
          mbid: artist.mbid,
          image: artist.image[2]["#text"],
          tags: [],
          url: artist.url,
        };
      })
    )
    .catch((error) => alert(error));
};

/**
 * Function to fill html of hot items section
 * @param  {element} items - html element to fill
 * @return {void}
 */
const fillHotItems = (items) => {
  fetchArtist()
    .then((data) => {
      items.innerHTML = data.map((artist) => createHotItem(artist)).join(" ");
    })
    .finally(fillHotItemsTags);
};

/**
 * Function to fill html of hot items tags
 * @return {void}
 */
const fillHotItemsTags = () => {
  let promises = [];
  const elements = [...document.querySelectorAll(".hot-artist-tags")];
  elements.forEach((item, index) => {
    promises[index] = fetchTagsById(item.id).then((data) => {
      return data.map((tag, index) => createTagItem(tag, index + 1 === data.length)).join(" ");
    });
  });
  Promise.all(promises).then((values) => {
    values.map((data, index) => (elements[index].innerHTML = data));
  });
};

/**
 * Function to fetch and map data about top 12 tracks from last-fm API
 * @return {promise} - mapped data to generate static html from
 */
const fetchTracks = async () => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${KEY}&format=json&limit=18`
  )
    .then((data) => data.json())
    .then((data) =>
      data.tracks.track.map((track) => {
        return {
          name: track.name,
          artist: track.artist,
          image: track.image[2]["#text"],
          tags: [],
          url: track.url,
        };
      })
    )
    .catch((error) => alert(error));
};

/**
 * Function to fetch and map searched data about 8 artists from last-fm API
 * @param  {string} artist - search artist name
 * @return {promise}       - mapped data to generate static html from
 */
const fetchArtistSearch = async (artist) => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(
      artist
    )}&api_key=${KEY}&format=json&limit=8`
  )
    .then((data) => data.json())
    .then((data) =>
      data.results.artistmatches.artist.map((a) => {
        return { name: a.name, image: a.image[1]["#text"], listeners: a.listeners, url: a.url };
      })
    )
    .catch((error) => alert(error));
};

/**
 * Function to fetch and map searched data about 8 albums from last-fm API
 * @param  {string} album - search album name
 * @return {promise}      - mapped data to generate static html from
 */
const fetchAlbumSearch = async (album) => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(
      album
    )}&api_key=${KEY}&format=json&limit=8`
  )
    .then((data) => data.json())
    .then((data) =>
      data.results.albummatches.album.map((a) => {
        return {
          name: a.name,
          artist: a.artist,
          image: a.image[1]["#text"],
          url: a.url,
        };
      })
    )
    .catch((error) => alert(error));
};

/**
 * Function to fetch and map searched data about 8 tracks from last-fm API
 * @param  {string} track - search track name
 * @return {promise}      - mapped data to generate static html from
 */
const fetchTrackSearch = async (track) => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
      track
    )}&api_key=${KEY}&format=json&limit=10`
  )
    .then((data) => data.json())
    .then((data) =>
      data.results.trackmatches.track.map((i) => {
        return {
          name: i.name,
          artist: i.artist,
        };
      })
    )
    .catch((error) => alert(error));
};

/**
 * Function to fetch and map full data about specific track from last-fm API
 * @param  {string} artist - the artist name
 * @param  {string} track  - the track name
 * @return {promise}       - mapped data to generate static html from
 */
const fetchTrackDuration = async (artist, track) => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${KEY}&artist=${encodeURIComponent(
      artist
    )}&track=${encodeURIComponent(track)}&format=json`
  )
    .then((data) => data.json())
    .then((data) => {
      return {
        name: data.track.name,
        artist: data.track.artist,
        duration: data.track.duration,
        url: data.track.url,
        image: data.track.album.image[1]["#text"],
      };
    })
    .catch((error) => alert(error));
};

/**
 * Constructor for searched artist element
 * @constructor
 * @param  {object} search - JS object with url, image, listeners and name attributes
 * @return {string}        - static html to append/replace in element
 */
const createSearchArtist = (search) => {
  return `<div class="search-image-item">
  <img
    src="${search.image}"
  />
  <div class="search-image-item-inner">
    <a href="${search.url}" class="search-image-item-link">
    ${search.name}
    </a>
    <small class="search-image-item-text">${search.listeners} listners</small>
  </div>
</div>`;
};

/**
 * Constructor for searched album element
 * @constructor
 * @param  {object} search - JS object with url, image, artist and name attributes
 * @return {string}        - static html to append/replace in element
 */
const createSearchAlbum = (search) => {
  return ` <div class="search-image-item">
  <img
    src="${search.image}"
  />
  <div class="search-image-item-inner">
    <a href="${search.url}" class="search-image-item-link">
    ${search.name}
    </a>
    <a
      href="${search.url}"
      class="search-image-item-link search-image-item-link-sm">
    ${search.artist}
    </a>
  </div>
</div>`;
};

/**
 * Function to pad 2 digits of a number
 * @param  {number} num - number to pad
 * @return {string}     - string of padded number
 */
const padTo2Digits = (num) => num.toString().padStart(2, "0");

/**
 * Function to convert and format milliseconds to MM:SS
 * @param  {number} milliseconds - number of milliseconds
 * @return {string}     - string of converted and formatted time
 */
const convertMsToMS = (milliseconds) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
};

/**
 * Constructor for searched track element
 * @constructor
 * @param  {object} search - JS object with url, image, artist, duration and name attributes
 * @return {string}        - static html to append/replace in element
 */
const createSearchTrack = (search) => {
  return `
  <div class="search-track">
  <button class="search-track-button">
    <i class="fa-regular fa-circle-play search-track-icon"></i>
  </button>
  <a href="${search.url}">
    <img
      src="${search.image}"
    />
  </a>

  <i class="fa-regular fa-heart search-track-icon-sm"></i>
  <a class="search-track-link" href="${search.url}"
    >${search.name}</a
  >
  <a class="search-track-link-light" href="${search.artist.url}">${search.artist.name}</a>

  <div class="search-track-right">
    <button class="search-track-button">
      <i
        class="fa-solid fa-arrow-down search-track-icon-sm"
      ></i>
    </button>
    <button class="search-track-button">
      <i
        class="fa-solid fa-ellipsis-vertical search-track-icon-sm"
      ></i>
    </button>

    <span class="search-track-time">${convertMsToMS(search.duration)}</span>
  </div>
  </div>
  `;
};

/**
 * Function to capitalize word
 * @param  {string} string - string to capitalize
 * @return {string}        - capitalized string
 */
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Function to fill html of search item by provided name
 * @param  {string} name   - name of section
 * @param  {string} text   - search text
 * @return {object}        - inner html object to append data
 */
const fillSearchItem = (name, text) => {
  document.getElementById("search-content").insertAdjacentHTML(
    "beforeend",
    `
    <div class="search-section">
    <a class="search-sub-title" href="https://www.last.fm/search/${name}?q=${text}">${capitalize(
      name
    )}</a>
    <div id="search-${name}-section" class="search-image-block"></div>
    <div class="search-more-item">
      <a class="search-more-link" href="https://www.last.fm/search/${name}?q=${text}">More ${name}</a>
      <i class="fa-solid fa-chevron-right search-more-icon"></i>
    </div>
    </div>
  `
  );

  return document.getElementById(`search-${name}-section`);
};

/**
 * Function to fill html of search artists section
 * @param  {string} text - search text
 * @return {void}
 */
const fillArtistSearch = (text) => {
  const parent = fillSearchItem("artists", text);
  fetchArtistSearch(text).then((data) => {
    parent.innerHTML = data.map((artist) => createSearchArtist(artist)).join(" ");
  });
};

/**
 * Function to fill html of search albums section
 * @param  {string} text - search text
 * @return {void}
 */
const fillAlbumSearch = (text) => {
  const parent = fillSearchItem("albums", text);

  fetchAlbumSearch(text).then((data) => {
    parent.innerHTML = data.map((album) => createSearchAlbum(album)).join(" ");
  });
};

/**
 * Function to fill html of search tracks section
 * @param  {string} text - search text
 * @return {void}
 */
const fillTrackSearch = (text) => {
  const parent = fillSearchItem("tracks", text);

  let search = [];
  let tracks = [];
  fetchTrackSearch(text)
    .then((data) => {
      search = [...data];
    })
    .finally(() => {
      search.map((track) => {
        if (track !== undefined)
          fetchTrackDuration(track.artist, track.name)
            .then((data) => {
              if (data !== undefined) tracks.push(data);
            })
            .finally(() => {
              parent.innerHTML = tracks.map((i) => createSearchTrack(i)).join(" ");
            });
      });
    });
};

/**
 * Function to fill html of popular item tags
 * @return {void}
 */
const fillPopularItemsTags = () => {
  let promises = [];
  const elements = [...document.querySelectorAll(".popular-track-tags")];
  elements.forEach((item, index) => {
    const artist = item.id.split(`&`)[0].trim();
    const track = item.id.split(`&`)[1].trim();
    promises[index] = fetchTagsNames(artist, track).then((data) => {
      return data.map((tag, index) => createTagItem(tag, index + 1 === data.length)).join(" ");
    });
  });
  Promise.all(promises).then((values) => {
    values.map((data, index) => (elements[index].innerHTML = data));
  });
};

/**
 * Function to fill html of popular items
 * @param  {object} items - element to append/replace static html
 * @return {void}
 */
const fillPopularItems = (items) => {
  fetchTracks()
    .then((data) => {
      items.innerHTML = data.map((track) => createPopularItem(track)).join(" ");
    })
    .finally(fillPopularItemsTags);
};

/**
 * Function to fill main content static html
 * @return {void}
 */
const createMainContent = () => {
  content.innerHTML = `
  <div class="container">
  <h1 class="title">Music</h1>
  <h3 class="sub-title">Hot right now</h3>
  <div id="hot-items-section" class="wrapper"></div>
  <h3 class="sub-title">Popular tracks</h3>
  <div id="popular-items-section" class="wrapper"></div>
  </div>
  `;
};

/**
 * Function to fill alternative content static html
 * @return {void}
 */
const createAltContent = (text) => {
  content.innerHTML = `
  <div class="filler"></div>
  <main class="translated">
      <div class="container">
        <h1 class="search-title">
          Search result for ${text}
        </h1>

        <div class="search-menu">
          <a class="search-menu-item search-menu-item-active" href="/#"
            >Top Results</a
          >
          <a class="search-menu-item" href="/#">Artists</a>
          <a class="search-menu-item" href="/#">Albums</a>
          <a class="search-menu-item" href="/#">Tracks</a>
        </div>
      </div>
      <div class="search-spacer"></div>

      <div class="container">
        <div class="search-wrapper">
          <div id="search-content" class="search-content-left">
            <form class="search-form">
              <input
                class="search-input"
                type="text"
                placeholder="Type here..."
                value="${text}"
              />
              <button class="search-button search-reset-button">
                <i class="fa-regular fa-circle-xmark search-icon"></i>
              </button>
              <div class="search-input-spacer"></div>
              <button class="search-button search-find-button">
                <i
                  class="fa-sharp fa-solid fa-magnifying-glass search-icon"
                ></i>
              </button>
            </form>
        </div>
          <div class="search-content-right">
            <div>
              <span class="search-ad-text">Don't want to see ads?</span>
              <a class="search-ad-link">Upgrade Now</a>
            </div>
          </div>
        </div>
      </div>
    </main>`;
};

/**
 * Function to fill main header static html
 * @return {void}
 */
const createMainHeader = () => {
  header.innerHTML = `<div class="music-player">
  <img src="assets/player-icon.png" />
  
  <div class="music-player-icons">
    <i class="fa-solid fa-backward music-player-icon-sm"></i>
    <i class="fa-regular fa-circle-play music-player-icon"></i>
    <i class="fa-solid fa-forward music-player-icon-sm"></i>
    <i class="fa-regular fa-heart music-player-icon-sm"></i>
  </div>
  </div>
  
  <a class="logo" href="#">
  <img src="assets/logo.png" />
  </a>
  
  <div class="nav">
  <button id="nav-search" class="nav-search-button">
    <i class="fa-sharp fa-solid fa-magnifying-glass nav-item nav-icon"> </i>
  </button>
  <div class="nav-links">
    <a class="nav-item nav-link" href="#">Home</a>
    <a class="nav-item nav-link" href="#">Live</a>
    <a class="nav-item nav-link" href="#">Music</a>
    <a class="nav-item nav-link" href="#">Charts</a>
    <a class="nav-item nav-link" href="#">Events</a>
    <a class="nav-item nav-link" href="#">Features</a>
  </div>
  <img
    class="nav-user"
    src="https://lastfm.freetls.fastly.net/i/u/avatar42s/818148bf682d429dc215c1705eb27b98.png"
  />
  </div>`;
};

/**
 * Function to fill alternative header static html
 * @return {void}
 */
const createAltHeader = () => {
  header.innerHTML = `<div class="nav-alt">
  <input
    id="nav-search-input"
    class="nav-search-input"
    type="text"
    placeholder="Search for music..."
  />
  <button id="nav-search-cancel" class="nav-search-button">
    <i class="fa-sharp fa-solid fa-xmark nav-item nav-icon-alt"> </i>
  </button>
  <button id="nav-search-alt" class="nav-search-button-alt" type="submit">
    <i class="fa-sharp fa-solid fa-magnifying-glass nav-item nav-icon"> </i>
  </button>
  </div>`;
};

createMainHeader();
createMainContent();

/**
 * Function to toggle content between alt and normal depending on seach button click
 * @param  {object} button - button to toggle search
 * @return {void}
 */
const showSearch = (button) => {
  button.addEventListener("click", () => {
    createAltHeader();
    const apply = document.getElementById("nav-search-alt");
    const cancel = document.getElementById("nav-search-cancel");
    apply.addEventListener("click", () => {
      const text = document.getElementById("nav-search-input").value;
      createAltContent(text);
      createMainHeader();
      fillArtistSearch(text);
      fillAlbumSearch(text);
      fillTrackSearch(text);
    });

    cancel.addEventListener("click", () => {
      createMainHeader();
      showSearch(document.getElementById("nav-search"));
    });
  });
};

const hotItemsSection = document.getElementById("hot-items-section");
const popularItemsSection = document.getElementById("popular-items-section");

fillHotItems(hotItemsSection);
fillPopularItems(popularItemsSection);
showSearch(document.getElementById("nav-search"));
