/* Custom Slypee-style icons: chunky ink outline, flat fills */
const S = { fill: "none", stroke: "#221A16", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
const N = { ...S, stroke: "currentColor", strokeWidth: 2.2 };

export const PlayIcon = () => (
  <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1.2v7.6L8.6 5z" fill="#FACC3E" /></svg>
);

export const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#221A16" strokeWidth="2.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" fill="#FACC3E" /><path d="M15.5 15.5 21 21" /></svg>
);

export const AvatarIcon = () => (
  <svg viewBox="0 0 44 44" fill="none" stroke="#221A16" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 38c1.5-7 6.5-10.5 13-10.5S33.5 31 35 38" fill="#DB2417" /><circle cx="22" cy="17" r="9" fill="#FFF7E8" /><circle cx="18.5" cy="16" r="1.3" fill="#221A16" stroke="none" /><circle cx="25.5" cy="16" r="1.3" fill="#221A16" stroke="none" /><path d="M18.5 20.5c2 1.8 5 1.8 7 0" /></svg>
);

export const CAT_ICONS = {
  "Top Chart": <svg viewBox="0 0 36 36" {...S}><path className="dim" d="M11 8H6.5c0 5 2 7.5 5.5 8M25 8h4.5c0 5-2 7.5-5.5 8" /><path d="M11 5h14v8.5a7 7 0 0 1-14 0z" fill="#FACC3E" /><path d="M15.5 12l1.6-.3.9-1.7.9 1.7 1.6.3-1.2 1.2.3 1.8-1.6-.8-1.6.8.3-1.8z" fill="#fff" strokeWidth="1.4" /><path d="M18 20.5v4" /><path d="M12 31h12l-1.6-6.5h-8.8z" fill="#DB2417" /></svg>,
  "Arcade": <svg viewBox="0 0 36 36" {...S}><rect x="4" y="22" width="28" height="9" rx="3" fill="#2FA846" /><path d="M18 22v-9" /><circle cx="18" cy="9" r="5" fill="#DB2417" /><circle className="dim" cx="16.3" cy="7.5" r="1.3" fill="#fff" stroke="none" /><circle cx="26" cy="26.5" r="1.8" fill="#FACC3E" strokeWidth="1.8" /><circle cx="9.5" cy="26.5" r="1.8" fill="#FFF7E8" strokeWidth="1.8" /></svg>,
  "Sports": <svg viewBox="0 0 36 36" {...S}><circle cx="18" cy="18" r="13" fill="#fff" /><path d="M18 12.5l5 3.6-1.9 5.9h-6.2l-1.9-5.9z" fill="#221A16" /><path className="dim" d="M18 12.5V5.5M23 16.1l6.3-2.4M21.1 22l3.7 5.8M14.9 22l-3.7 5.8M13 16.1l-6.3-2.4" /></svg>,
  "Card": <svg viewBox="0 0 36 36" {...S}><rect className="dim" x="6" y="7" width="15" height="21" rx="2.5" fill="#FACC3E" transform="rotate(-14 13.5 17.5)" /><rect x="14" y="8" width="15" height="21" rx="2.5" fill="#FFF7E8" transform="rotate(9 21.5 18.5)" /><path d="M21.3 15.6c-1.3-2.3-4.6-1-3.6 1.6.6 1.6 3.3 3.7 3.3 3.7s2.9-1.8 3.7-3.3c1.2-2.5-2-4.2-3.4-2z" fill="#DB2417" strokeWidth="1.6" /></svg>,
  "Strategy": <svg viewBox="0 0 36 36" {...S}><path d="M9 31h18v-3.5l-2.5-2.5V14.5l2.5-2.5V5.5h-4v3h-3v-3h-4v3h-3v-3H9V12l2.5 2.5V25L9 27.5z" fill="#E8B77A" /><path className="dim" d="M15.5 20a2.5 2.5 0 0 1 5 0v5h-5z" fill="#221A16" /><path d="M25 5.5V1.8l5 1.9-5 1.8" fill="#DB2417" strokeWidth="1.8" /></svg>,
  "Puzzle": <svg viewBox="0 0 36 36" {...S}><path d="M6 12h6.3a3.7 3.7 0 1 1 7.4 0H26v6.3a3.7 3.7 0 1 1 0 7.4V31H6z" fill="#2FA846" /><path className="dim" d="M10 16.5v3" stroke="#FFF7E8" /></svg>
};

export const NAV = [
  { id: "home", label: "Home", icon: <svg viewBox="0 0 24 24" {...N}><path d="M3.5 11 12 4l8.5 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" /></svg> },
  { id: "html5", label: "HTML5 Game", icon: <svg viewBox="0 0 24 24" {...N}><path d="M7 8h10a4.5 4.5 0 0 1 4.3 5.8l-1 3.4a2.6 2.6 0 0 1-4.5.9L14 16h-4l-1.8 2.1a2.6 2.6 0 0 1-4.5-.9l-1-3.4A4.5 4.5 0 0 1 7 8z" /><path d="M8 11v3M6.5 12.5h3" /><circle cx="16" cy="11.8" r=".4" fill="currentColor" /><circle cx="17.3" cy="13.4" r=".4" fill="currentColor" /></svg> },
  { id: "library", label: "Library", icon: <svg viewBox="0 0 24 24" {...N}><rect x="4" y="5" width="5" height="15" rx="1.2" /><rect x="10.5" y="5" width="5" height="15" rx="1.2" /><path d="m17 6.6 3-.8 2.6 13.5-3 .8z" /></svg> },
  { id: "profile", label: "Profile", icon: <svg viewBox="0 0 24 24" {...N}><circle cx="12" cy="8.5" r="4" /><path d="M4.5 20.5c.9-4 3.8-6 7.5-6s6.6 2 7.5 6" /></svg> }
];

export const ChevronIcon = ({ dir = "next" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "next" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
  </svg>
);

/* Same house style as the category icons: chunky ink outline, flat fills */
export const PartyIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><path d="M6 30l7-16.5 9.5 9.5z" fill="#DB2417" /><path d="M13.5 13.5l9 9" stroke="none" /><path className="dim" d="M9.5 22.5l4.5 4.5" /><circle cx="26" cy="9" r="2" fill="#FACC3E" strokeWidth="1.8" /><circle cx="30" cy="18" r="1.8" fill="#2FA846" strokeWidth="1.8" /><path d="M22 4.5v3M28.5 14h3" strokeWidth="2" /><path d="M17 8l1.8 1" strokeWidth="2" /></svg>
);
export const FaqIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><path d="M6 9.5A3.5 3.5 0 0 1 9.5 6h17A3.5 3.5 0 0 1 30 9.5v11a3.5 3.5 0 0 1-3.5 3.5H17l-7 6v-6H9.5A3.5 3.5 0 0 1 6 20.5z" fill="#FACC3E" /><path d="M14.5 13a3.5 3.5 0 1 1 3.5 3.5v1.5" strokeWidth="2.6" /><circle cx="18" cy="21.5" r="1.1" fill="#221A16" stroke="none" /></svg>
);
export const SupportIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><circle cx="18" cy="18" r="12.5" fill="#DB2417" /><circle cx="18" cy="18" r="5" fill="#FFF7E8" /><path className="dim" d="M9.5 9.5l5 5M26.5 9.5l-5 5M26.5 26.5l-5-5M9.5 26.5l5-5" stroke="#FFF7E8" strokeWidth="2.6" /></svg>
);
export const LockIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><path d="M12 15v-3.5a6 6 0 0 1 12 0V15" /><rect x="7.5" y="15" width="21" height="14.5" rx="3.5" fill="#2FA846" /><circle cx="18" cy="21" r="2.2" fill="#FFF7E8" strokeWidth="1.8" /><path d="M18 23v3" strokeWidth="2.2" stroke="#FFF7E8" /></svg>
);
export const DocIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><path d="M9 6.5h12l6 6v17a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2v-21a2 2 0 0 1 2-2z" fill="#FFF7E8" /><path d="M20.5 6.5v6.5H27" /><path className="dim" d="M14 19h8M14 24h5" strokeWidth="2.2" /></svg>
);
export const KeyIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><circle cx="12" cy="18" r="6.5" fill="#FACC3E" /><path d="M18.5 18H31M27 18v5M22.5 18v4" /></svg>
);

/* Small inline markers (inherit the surrounding colour) */
const M = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };
export const PadIcon = () => (
  <svg viewBox="0 0 24 24" {...M}><path d="M7 8h10a4.5 4.5 0 0 1 4.3 5.8l-1 3.4a2.6 2.6 0 0 1-4.5.9L14 16h-4l-1.8 2.1a2.6 2.6 0 0 1-4.5-.9l-1-3.4A4.5 4.5 0 0 1 7 8z" /><path d="M8 11.5v2.5M6.8 12.8h2.4" /></svg>
);
export const TimerIcon = () => (
  <svg viewBox="0 0 24 24" {...M}><circle cx="12" cy="13.5" r="7.5" /><path d="M12 10v3.5l2.2 1.6M9.5 3h5M12 3v3" /></svg>
);
export const ClockIcon = () => (
  <svg viewBox="0 0 24 24" {...M}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></svg>
);
export const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#A3180D" strokeWidth="2" strokeLinejoin="round"><path d="M12 3s5.5 4.2 5.5 9.5a5.5 5.5 0 0 1-11 0C6.5 9 9 7 9 7s.5 2.5 2 3c1-1.5 1-5 1-7z" fill="#DB2417" /><path d="M12 19a2.6 2.6 0 0 1-1.4-4.8c.4 1 1.4 1.5 1.4 1.5s.6-1 .4-2c1.3.8 2.2 2 2.2 3.1A2.4 2.4 0 0 1 12 19z" fill="#FACC3E" stroke="none" /></svg>
);
export const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="#DB2417" stroke="#221A16" strokeWidth="2" strokeLinejoin="round"><path d="M13.5 2 4.5 13.5h6.5l-1.5 8.5 9-11.5h-6.5z" /></svg>
);

/* Pickable avatars — same chunky outline style, each on its own colour */
const A = { fill: "none", stroke: "#221A16", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };
const eyes = (x1, x2, y = 20) => <><circle cx={x1} cy={y} r="1.5" fill="#221A16" stroke="none" /><circle cx={x2} cy={y} r="1.5" fill="#221A16" stroke="none" /></>;

export const AVATARS = [
  { id: "player", bg: "#FACC3E", svg: <svg viewBox="0 0 44 44" {...A}><path d="M9 38c1.5-7 6.5-10.5 13-10.5S33.5 31 35 38" fill="#DB2417" /><circle cx="22" cy="17" r="9" fill="#FFF7E8" />{eyes(18.5, 25.5, 16)}<path d="M18.5 20.5c2 1.8 5 1.8 7 0" /></svg> },
  { id: "cat", bg: "#F6A5A0", svg: <svg viewBox="0 0 44 44" {...A}><path d="M11 16l1-8 7 4M33 16l-1-8-7 4" fill="#FFF7E8" /><circle cx="22" cy="24" r="12" fill="#FFF7E8" />{eyes(17.5, 26.5, 22)}<path d="M22 26.5l-2 1.5M22 26.5l2 1.5M13 22h4M27 22h4" /><path d="M22 25.5v1" strokeWidth="2.6" /></svg> },
  { id: "robot", bg: "#7CC4F2", svg: <svg viewBox="0 0 44 44" {...A}><path d="M22 6v5" /><circle cx="22" cy="5" r="2" fill="#DB2417" /><rect x="8" y="11" width="28" height="24" rx="7" fill="#FFF7E8" />{eyes(16.5, 27.5, 21)}<path d="M16 28h12" /><path className="dim" d="M5 20v6M39 20v6" /></svg> },
  { id: "alien", bg: "#2FA846", svg: <svg viewBox="0 0 44 44" {...A}><path d="M22 7c8 0 13 6 13 13s-6 17-13 17S9 26 9 20 14 7 22 7z" fill="#FFF7E8" /><path d="M14.5 18.5c2.5-.5 5 1 5.5 3.5-2.5.8-5-.8-5.5-3.5zM29.5 18.5c-2.5-.5-5 1-5.5 3.5 2.5.8 5-.8 5.5-3.5z" fill="#221A16" stroke="none" /><path d="M19 29h6" /></svg> },
  { id: "ninja", bg: "#221A16", svg: <svg viewBox="0 0 44 44" {...A}><circle cx="22" cy="22" r="13" fill="#DB2417" /><path d="M9.5 19.5c4-3 9-4.5 12.5-4.5s8.5 1.5 12.5 4.5v5c-4 3-9 4.5-12.5 4.5S13.5 27.5 9.5 24.5z" fill="#FFF7E8" />{eyes(17.5, 26.5, 22)}<path d="M34.5 19.5l5-3v10l-5-3" fill="#DB2417" /></svg> },
  { id: "dino", bg: "#B7E36A", svg: <svg viewBox="0 0 44 44" {...A}><path d="M10 20c0-7 5.5-12 12-12s12 5 12 12v6c0 5-4 8-9 8h-9c-4 0-6-2.5-6-6z" fill="#2FA846" /><path d="M14 8l3 4M22 5l2.5 5M30 8l-2.5 4" fill="#2FA846" />{eyes(17.5, 26.5, 20)}<path d="M17 28h10" /><path d="M19.5 28v3M24.5 28v3" strokeWidth="1.8" /></svg> },
  { id: "bear", bg: "#E8B77A", svg: <svg viewBox="0 0 44 44" {...A}><circle cx="12" cy="12.5" r="5" fill="#B4793C" /><circle cx="32" cy="12.5" r="5" fill="#B4793C" /><circle cx="22" cy="23" r="13" fill="#E0A45F" /><ellipse cx="22" cy="27" rx="7" ry="5.5" fill="#FFF7E8" />{eyes(17.5, 26.5, 20)}<path d="M22 25.5c-1.2 0-2 .8-2 1.5s.8 1.5 2 1.5 2-.8 2-1.5-.8-1.5-2-1.5z" fill="#221A16" /></svg> },
  { id: "astro", bg: "#C9B8FF", svg: <svg viewBox="0 0 44 44" {...A}><rect x="7" y="9" width="30" height="27" rx="13" fill="#FFF7E8" /><path d="M13 22a9 9 0 0 1 18 0v3a9 9 0 0 1-18 0z" fill="#221A16" /><path d="M17 23.5c.5-2 2.2-3.2 4-3.4" stroke="#7CC4F2" strokeWidth="2.6" /><path className="dim" d="M4 19v7M40 19v7" /></svg> }
];
export const AVATAR_BY_ID = Object.fromEntries(AVATARS.map(a => [a.id, a]));

export const PencilIcon = () => (
  <svg viewBox="0 0 24 24" {...M}><path d="M4 20h4L20 8l-4-4L4 16z" /><path d="M14.5 5.5l4 4" /></svg>
);

/* Plan & billing */
export const CrownIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><path d="M5 12l5.5 4L18 7l7.5 9L31 12l-2.5 16h-21z" fill="#FACC3E" /><path className="dim" d="M12.5 22.5h11" strokeWidth="2.2" /><circle cx="18" cy="19" r="1.6" fill="#DB2417" strokeWidth="1.6" /></svg>
);
export const WalletIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><path d="M6 11.5A3.5 3.5 0 0 1 9.5 8h17a3.5 3.5 0 0 1 3.5 3.5V27a2 2 0 0 1-2 2h-20a2 2 0 0 1-2-2z" fill="#2FA846" /><path d="M6 13h19a2 2 0 0 1 2 2v2h-6a2.5 2.5 0 0 0 0 5h6v2a2 2 0 0 1-2 2H6z" fill="#FFF7E8" /><circle cx="22.5" cy="19.5" r="1.4" fill="#221A16" stroke="none" /></svg>
);

/* SIM card — stands in for "subscribe on your mobile account" */
export const SimIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><path d="M9 6.5h11L27 13v16.5a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2v-21a2 2 0 0 1 2-2z" fill="#DB2417" /><rect x="13" y="16" width="10" height="10" rx="2" fill="#FFF7E8" /><path className="dim" d="M18 16v10M13 21h10" strokeWidth="1.8" /></svg>
);

export const BellIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><path d="M9 25v-8a9 9 0 0 1 18 0v8l2.5 3h-23z" fill="#FACC3E" /><path d="M18 8V5" /><path d="M14.5 28a3.5 3.5 0 0 0 7 0" fill="#DB2417" /></svg>
);
export const StopIcon = () => (
  <svg viewBox="0 0 36 36" {...S}><circle cx="18" cy="18" r="12.5" fill="#DB2417" /><path d="M12.5 18h11" stroke="#FFF7E8" strokeWidth="3" /></svg>
);
