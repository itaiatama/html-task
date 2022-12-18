import { Url } from "url";

const KEY = "fc7e1572ebc98d1718f5aba67915fe76";

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

export const fetchTagsById = async (mbid: string) => {
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
        : data.map((tag: Tag) => {
            return { name: tag.name, url: tag.url };
          })
    )
    .catch((error) => alert(error));
};

export const fetchTagsNames = async (artist: string, track: string) => {
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
        : data.map((tag: Tag) => {
            return { name: tag.name, url: tag.url };
          })
    )
    .catch((error) => alert(error));
};

export const fetchArtist = async () => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${KEY}&format=json&limit=12`
  )
    .then((data) => data.json())
    .then((data) =>
      data.artists.artist.map((artist: Artist) => {
        return {
          name: artist.name,
          mbid: artist.mbid,
          image: artist.image[2]["#text"],
          url: artist.url,
        };
      })
    )
    .catch((error) => alert(error));
};

export const fetchTracks = async () => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${KEY}&format=json&limit=18`
  )
    .then((data) => data.json())
    .then((data) =>
      data.tracks.track.map((track: Track) => {
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

export const fetchArtistSearch = async (artist: string) => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(
      artist
    )}&api_key=${KEY}&format=json&limit=8`
  )
    .then((data) => data.json())
    .then((data) =>
      data.results.artistmatches.artist.map((a: Artist) => {
        return { name: a.name, image: a.image[1]["#text"], listeners: a.listeners, url: a.url };
      })
    )
    .catch((error) => alert(error));
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fetchAlbumSearch = async (album: string) => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(
      album
    )}&api_key=${KEY}&format=json&limit=8`
  )
    .then((data) => data.json())
    .then((data) =>
      data.results.albummatches.album.map((a: Album) => {
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

export const fetchTrackSearch = async (track: string) => {
  return await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
      track
    )}&api_key=${KEY}&format=json&limit=10`
  )
    .then((data) => data.json())
    .then((data) =>
      data.results.trackmatches.track.map((i: { name: string; artist: string }) => {
        return {
          name: i.name,
          artist: i.artist,
        };
      })
    )
    .catch((error) => alert(error));
};

export const fetchTrackDuration = async (artist: string, track: string) => {
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
