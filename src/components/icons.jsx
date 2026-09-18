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
