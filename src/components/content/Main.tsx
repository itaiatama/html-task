import HotSection from "./HotSection";
import PopularSection from "./PopularSection";
import SearchItem from "./SearchItem";

interface MainProps {
  isSearch: boolean;
  text: string;
}

const Main = (props: MainProps) => {
  {
    return props.isSearch ? (
      <SearchItem text={props.text} />
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
