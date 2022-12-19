import { Tag } from "./API";

interface TagItemProps {
  tag: Tag;
  last: boolean;
}

const TagItem = (props: TagItemProps) => {
  return (
    <>
      <li className="tag-item">
        <a className="tag-item-link" href={`${props.tag.url}`}>
          {props.tag.name}
        </a>
      </li>
      {props.last ? null : <i className="fa-solid fa-circle tag-item-dot" />}
    </>
  );
};

export default TagItem;
