import { useEffect, useState } from "react";
import NavTabs from "./NavTabs.jsx";

export default function Header({ view, go, loggedIn }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(scrollY > 8));
    };
    addEventListener("scroll", update, { passive: true });
    update();
    return () => { removeEventListener("scroll", update); cancelAnimationFrame(raf); };
  }, []);

  return (
    <header className={"top" + (scrolled ? " scrolled" : "")}>
      <div className="top-in">
        <a className="brand" href="#home" aria-label="Slypee home" onClick={e => { e.preventDefault(); go("home"); }}>
          <img src="/assets/slypee-logo.png" alt="Slypee" width="310" height="130" />
        </a>
        <nav className="desk-nav" aria-label="Main"><NavTabs view={view} go={go} loggedIn={loggedIn} /></nav>
        <span className="partner"><small>with</small><img src="/assets/gamenow-logo.png" alt="GameNow" width="547" height="65" /></span>
      </div>
    </header>
  );
}
