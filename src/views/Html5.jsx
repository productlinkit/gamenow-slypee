import CategoryBrowser from "../components/CategoryBrowser.jsx";
import { Reveal } from "../lib/reveal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import InstantBanner from "../components/InstantBanner.jsx";
import { Title, useT } from "../i18n/index.jsx";

const H5_CATS = ["Top Chart", "Puzzle", "Arcade"];

export default function Html5({ active, warmAll, openSearch }) {
  const t = useT();
  return (
    <div className="view" hidden={!active}>
      <section>
        <SearchBar label={t("search.html5")} onOpen={() => openSearch("h5")} />
        <Reveal className="head"><h2 className="title"><Title k="title.html5" /></h2></Reveal>
        <InstantBanner />
        <CategoryBrowser type="h5" cats={H5_CATS} cap={36} warmAll={warmAll} />
      </section>
    </div>
  );
}
