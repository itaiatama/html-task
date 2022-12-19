import HotSection from "./HotSection";
import PopularSection from "./PopularSection";
import SearchItem from "./SearchItem";

interface MainProps {
  search: string;
}

const Main = (props: MainProps) => {
  {
    return props.search ? (
      <SearchItem text={props.search} />
    ) : (
      <div className="container">
        <h1 className="title">Music</h1>
        <HotSection />
        <PopularSection />
      </div>
    );
  }
};

export default Main;
