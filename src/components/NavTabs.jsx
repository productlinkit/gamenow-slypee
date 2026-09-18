import { NAV } from "./icons.jsx";
import { useT } from "../i18n/index.jsx";

export default function NavTabs({ view, go, loggedIn }) {
  const t = useT();
  return NAV.map(n => (
    <button key={n.id} type="button" className="tab" aria-current={n.id === view ? "page" : undefined} onClick={() => go(n.id)}>
      <span className="ic">{n.icon}</span><span>{t(n.id === "profile" && !loggedIn ? "nav.login" : `nav.${n.id}`)}</span>
    </button>
  ));
}
