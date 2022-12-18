import Header from "./components/header/Header";
import Main from "./components/content/Main";
import Footer from "./components/footer/Footer";

import { useState } from "react";

const App = () => {
  const [search, setSearch] = useState<string>("");

  const URL = "http://www.last.fm/api/auth/?api_key=fc7e1572ebc98d1718f5aba67915fe76";

  // FIXME: Ugly solution to token generation will be fixed later using react. Maybe.
  if (!window.location.href.includes("token=")) {
    window.location.replace(URL);
  }

  return (
    <div className="App">
      <Header
        setSearch={(value: string | undefined) => {
          if (value) setSearch(value);
        }}
      />
      <Main isSearch={search !== ""} text={search} />
      <Footer />
    </div>
  );
};

export default App;
