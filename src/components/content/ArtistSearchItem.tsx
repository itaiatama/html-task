interface ArtistSearchItemProps {
  name: string;
  listeners: number;
}

const ArtistSearchItem = (props: ArtistSearchItemProps) => {
  return (
    <div className="search-image-item">
      <img src="${search.image}" />
      <div className="search-image-item-inner">
        <a href="${search.url}" className="search-image-item-link">
          {props.name}
        </a>
        <small className="search-image-item-text">${props.listeners} listners</small>
      </div>
    </div>
  );
};

export default ArtistSearchItem;
