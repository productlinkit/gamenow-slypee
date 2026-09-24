/* A value-added service: one subscription, taken from the number's balance. There is no
   package to choose — the rate below is the one from Slypee's own subscription notice, and
   it is the only figure on this page. */
export const CHARGE = { amount: 12, per: "day", every: "every day" };

/* Portals this page may send a player back to. The portal is on a host of its own, so
   same-origin is not enough — add its address here, or a blocked pop-up leaves the player
   stranded on this page instead of back where they started. */
export const PORTAL_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
  // , "https://gamenow-slypee.vercel.app"   ← add the deployed portal
];

export const TRIAL_DAYS = 1;
export const DAY = 864e5;

export const COUNTRIES = [
  ["PK", "🇵🇰", "Pakistan", "+92", "300 1234567"],
  ["ID", "🇮🇩", "Indonesia", "+62", "812 3456 7890"],
  ["IN", "🇮🇳", "India", "+91", "98765 43210"],
  ["BD", "🇧🇩", "Bangladesh", "+880", "1712 345678"],
  ["MY", "🇲🇾", "Malaysia", "+60", "12 345 6789"],
  ["SG", "🇸🇬", "Singapore", "+65", "8123 4567"],
  ["PH", "🇵🇭", "Philippines", "+63", "917 123 4567"],
  ["TH", "🇹🇭", "Thailand", "+66", "81 234 5678"],
  ["VN", "🇻🇳", "Vietnam", "+84", "91 234 56 78"],
  ["SA", "🇸🇦", "Saudi Arabia", "+966", "50 123 4567"],
  ["AE", "🇦🇪", "UAE", "+971", "50 123 4567"],
  ["TR", "🇹🇷", "Türkiye", "+90", "532 123 45 67"],
  ["EG", "🇪🇬", "Egypt", "+20", "100 123 4567"],
  ["NG", "🇳🇬", "Nigeria", "+234", "802 123 4567"],
  ["KE", "🇰🇪", "Kenya", "+254", "712 345678"],
  ["GB", "🇬🇧", "United Kingdom", "+44", "7400 123456"],
  ["US", "🇺🇸", "United States", "+1", "201 555 0123"]
].map(([id, flag, name, dial, example]) => ({ id, flag, name, dial, example }));

export const money = n => "PKR " + n.toLocaleString("en-US");
export const onDate = ts => new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
export const txnId = () => "SL" + Math.random().toString(36).slice(2, 8).toUpperCase();
