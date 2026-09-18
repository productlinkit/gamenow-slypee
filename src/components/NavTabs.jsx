import { NAV } from "./icons.jsx";

export default function NavTabs({ view, go, loggedIn }) {
  return NAV.map(n => (
    <button key={n.id} type="button" className="tab" aria-current={n.id === view ? "page" : undefined} onClick={() => go(n.id)}>
      <span className="ic">{n.icon}</span><span>{n.id === "profile" && !loggedIn ? "Log in" : n.label}</span>
    </button>
  ));
}
