console.log("Hello");
const URL = "http://www.last.fm/api/auth/?api_key=fc7e1572ebc98d1718f5aba67915fe76";

const origin = window.location.href;

if (!origin.includes("token=")) {
  window.location.replace(URL);
}

const KEY = "fc7e1572ebc98d1718f5aba67915fe76";
const content = document.getElementById("main-content");
const header = document.getElementById("header");

const tags = [
  { name: "1", link: "1" },
  { name: "2", link: "2" },
  { name: "3", link: "3" },
];

const createTagItem = (tag, last) => {
  return `
      <li class="tag-item">
        <a class="tag-item-link" href=${tag.url}>${tag.name}</a>
      </li>
      ${last ? "" : `<i class="fa-solid fa-circle tag-item-dot"> </i>`}
      `;
};

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
    .catch((error) => console.error(error));
};

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
    .catch((error) => console.error(error));
};

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

    .catch((error) => console.error(error));
};

const fillHotItems = (items) => {
  fetchArtist()
    .then((data) => {
      items.innerHTML = data.map((artist) => createHotItem(artist)).join(" ");
    })
    .finally(fillHotItemsTags);
};

const fillHotItemsTags = () => {
  const elements = [...document.querySelectorAll(".hot-artist-tags")];
  elements.forEach((item) => {
    fetchTagsById(item.id).then((data) => {
      item.innerHTML = data
        .map((tag, index) => createTagItem(tag, index + 1 === data.length))
        .join(" ");
    });
  });
};

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
    .catch((error) => console.error(error));
};

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
    );
};

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
    );
};

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
    );
};

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
    });
};

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

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function convertMsToHM(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

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

    <span class="search-track-time">${convertMsToHM(search.duration)}</span>
  </div>
  </div>
  `;
};

const fillArtistSearch = (items, text) => {
  fetchArtistSearch(text).then((data) => {
    items.innerHTML = data.map((artist) => createSearchArtist(artist)).join(" ");
  });
};

const fillAlbumSearch = (items, text) => {
  fetchAlbumSearch(text).then((data) => {
    items.innerHTML = data.map((album) => createSearchAlbum(album)).join(" ");
  });
};

const fillTrackSearch = (items, text) => {
  let search = [];
  let tracks = [];
  fetchTrackSearch(text)
    .then((data) => {
      search = [...data];
    })
    .finally(() => {
      search.map((track) => {
        fetchTrackDuration(track.artist, track.name)
          .then((data) => {
            tracks.push(data);
          })
          .finally(() => {
            items.innerHTML = tracks.map((i) => createSearchTrack(i)).join(" ");
          });
      });
    });
};

const fillPopularItemsTags = () => {
  const elements = [...document.querySelectorAll(".popular-track-tags")];
  elements.forEach((item) => {
    const artist = item.id.split(`&`)[0].trim();
    const track = item.id.split(`&`)[1].trim();

    fetchTagsNames(artist, track).then((data) => {
      item.innerHTML = data
        .map((tag, index) => createTagItem(tag, index + 1 === data.length))
        .join(" ");
    });
  });
};

const fillPopularItems = (items) => {
  fetchTracks()
    .then((data) => {
      items.innerHTML = data.map((track) => createPopularItem(track)).join(" ");
    })
    .finally(fillPopularItemsTags);
};

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
          <div class="search-content-left">
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

            <div class="search-section">
              <a class="search-sub-title" href="https://www.last.fm/search/artists?q=${text}">Artists</a>
              <div id="search-artists-section" class="search-image-block"></div>
              <div class="search-more-item">
                <a class="search-more-link" href="https://www.last.fm/search/artists?q=${text}">More artists</a>
                <i class="fa-solid fa-chevron-right search-more-icon"></i>
              </div>
            </div>

            <div class="search-section">
              <a class="search-sub-title" href="https://www.last.fm/search/albums?q=${text}">Albums</a>

              <div id="search-albums-section" class="search-image-block"></div>

              <div class="search-more-item">
                <a class="search-more-link" href="https://www.last.fm/search/albums?q=${text}">More albums</a>
                <i class="fa-solid fa-chevron-right search-more-icon"></i>
              </div>
            </div>

            <div class="search-section">
              <a class="search-sub-title" href="https://www.last.fm/search/tracks?q=${text}">Tracks</a>

              <div id="search-tracks-section" class="search-image-block"></div>
              
              <div class="search-more-item">
                <a class="search-more-link" href="https://www.last.fm/search/tracks?q=${text}">More tracks</a>
                <i class="fa-solid fa-chevron-right search-more-icon"></i>
              </div>
            </div>
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

const showSearch = (button) => {
  button.addEventListener("click", () => {
    createAltHeader();
    const apply = document.getElementById("nav-search-alt");
    const cancel = document.getElementById("nav-search-cancel");
    apply.addEventListener("click", () => {
      const text = document.getElementById("nav-search-input").value;
      createAltContent(text);
      createMainHeader();
      console.log(text);
      const searchArtists = document.getElementById("search-artists-section");
      fillArtistSearch(searchArtists, text);
      const searchAlbums = document.getElementById("search-albums-section");
      fillAlbumSearch(searchAlbums, text);
      const searchTracks = document.getElementById("search-tracks-section");
      fillTrackSearch(searchTracks, text);
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
