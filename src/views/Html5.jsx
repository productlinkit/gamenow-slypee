import CategoryBrowser from "../components/CategoryBrowser.jsx";
import { Reveal } from "../lib/reveal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import InstantBanner from "../components/InstantBanner.jsx";

const H5_CATS = ["Top Chart", "Puzzle", "Arcade"];

export default function Html5({ active, warmAll, openSearch }) {
  return (
    <div className="view" hidden={!active}>
      <section>
        <SearchBar label="Search HTML5 games…" onOpen={() => openSearch("h5")} />
        <Reveal className="head"><h2 className="title">HTML5 <span className="hot">Games</span></h2></Reveal>
        <InstantBanner />
        <CategoryBrowser type="h5" cats={H5_CATS} cap={32} warmAll={warmAll} />
      </section>
    </div>
  );
}
