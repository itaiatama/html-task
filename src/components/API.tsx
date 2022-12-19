import { Url } from "url";
import { KEY } from "../key";

// FIXME:
// Last.fm API return images as array of JS objects with URL inside of `#text`
// For this reason all `image` properies of type any.
// Property with name `#text` could not exist.
// FIXME:

const API_BASE = "http://ws.audioscrobbler.com/2.0/";

export interface Tag {
  name: string;
  url: Url;
}

export interface Artist {
  name: string;
  mbid: string;
  url: Url;
  tags?: Tag[];
  listeners?: number;
  image: any;
}

export interface Track {
  name: string;
  artist: Artist;
  tags?: Tag[];
  url: Url;
  image: any;
  duration?: number;
  album?: Album;
}

export interface Album {
  name: string;
  artist: string;
  image: any;
  url: Url;
}

const fetchAPIData = async (params: { [key: string]: string }) => {
  let encoded =
    "?" +
    Object.entries(params)
      // item[0] => key | item[1] => value
      .map((item) => item[0] + "=" + encodeURIComponent(item[1]))
      .join("&");

  const URL = `${API_BASE}${encoded}&api_key=${KEY}&format=json`;

  return await fetch(URL)
    .then((data) => data.json())
    .catch((error) => alert(error));
};

export const fetchTagsById = async (mbid: string) => {
  return await fetchAPIData({ method: "artist.gettoptags", mbid: mbid })
    .then((data) => data.toptags?.tag?.slice(0, 3))
    .then((data) =>
      data === undefined
        ? []
        : data.map((tag: Tag) => {
            return { name: tag.name, url: tag.url };
          })
    );
};

export const fetchTagsNames = async (artist: string, track: string) => {
  return await fetchAPIData({ method: "track.gettoptags", artist: artist, track: track })
    .then((data) => data.toptags?.tag?.slice(0, 3))
    .then((data) =>
      data === undefined
        ? []
        : data.map((tag: Tag) => {
            return { name: tag.name, url: tag.url };
          })
    );
};

export const fetchArtist = async () => {
  return await fetchAPIData({ method: "chart.gettopartists", limit: "12" }).then((data) =>
    data.artists.artist.map((artist: Artist) => {
      return {
        name: artist.name,
        mbid: artist.mbid,
        image: artist.image[2]["#text"],
        url: artist.url,
      };
    })
  );
};

export const fetchTracks = async () => {
  return await fetchAPIData({ method: "chart.gettoptracks", limit: "18" }).then((data) =>
    data.tracks.track.map((track: Track) => {
      return {
        name: track.name,
        artist: track.artist,
        image: track.image[2]["#text"],
        tags: [],
        url: track.url,
      };
    })
  );
};

export const fetchArtistSearch = async (artist: string) => {
  return await fetchAPIData({ method: "artist.search", artist: artist, limit: "8" }).then((data) =>
    data.results.artistmatches.artist.map((a: Artist) => {
      return { name: a.name, image: a.image[1]["#text"], listeners: a.listeners, url: a.url };
    })
  );
};

export const fetchAlbumSearch = async (album: string) => {
  return await fetchAPIData({ method: "album.search", album: album, limit: "8" }).then((data) =>
    data.results.albummatches.album.map((a: Album) => {
      return {
        name: a.name,
        artist: a.artist,
        image: a.image[1]["#text"],
        url: a.url,
      };
    })
  );
};

export const fetchTrackSearch = async (track: string) => {
  return await fetchAPIData({ method: "track.search", track: track, limit: "8" })
    .then((data) =>
      data.results.trackmatches.track.map((i: { name: string; artist: string }) => {
        return {
          name: i.name,
          artist: i.artist,
        };
      })
    )
    .then((data: { name: string; artist: string }[]) => {
      const promises: Promise<Track>[] = data.map((item) =>
        fetchTrackDuration(item.artist, item.name)
      );

      return Promise.all(promises);
    });
};

const fetchTrackDuration = async (artist: string, track: string): Promise<Track> => {
  return await fetchAPIData({
    method: "track.getInfo",
    artist: artist,
    track: track,
    limit: "8",
  }).then((data) => {
    return {
      name: data.track.name,
      artist: data.track.artist,
      duration: data.track.duration,
      url: data.track.url,
      image: data.track.album.image[1]["#text"],
    };
  });
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const padTo2Digits = (num: number) => num.toString().padStart(2, "0");

export const convertMsToMS = (milliseconds: number) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
};
