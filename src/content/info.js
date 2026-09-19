/* Help & legal pages. English only for now — the menu labels are translated.
   Subscription terms (price, UNSUB 9825) are copied from Slypee's own subscription notice.
   Privacy/terms are a draft describing what this site actually does; have them reviewed before launch. */
export const UPDATED = "19 September 2026";

export const INFO = {
  faq: {
    title: "Frequently asked questions",
    intro: "Quick answers about playing on Slypee.",
    faq: [
      ["What is Slypee?", "Slypee is a games portal from Jazz, brought to you with GameNow. You can play HTML5 games instantly in your browser or download app games through Slypee."],
      ["Do I need to install anything?", "HTML5 games open straight in your browser — no install or download. Games marked “App” are downloaded through Slypee."],
      ["How much does it cost?", "New players get 1 day of free play. After that the subscription renews automatically at up to PKR 12 per day (including tax)."],
      ["How do I stop my subscription?", "You can stop it any time from the Slypee menu, or by sending UNSUB to 9825."],
      ["Why should I log in?", "Logging in with your mobile number lets you save games, keep your play history and unlock the free day."],
      ["A game won't load. What can I do?", "Check your internet connection, then reload the page. If it still doesn't start, try another browser or come back a little later."],
      ["Where is my play history kept?", "Your play history, saved games and language are stored on this device only. Clearing your browser data removes them."]
    ]
  },
  help: {
    title: "Help & support",
    intro: "Having trouble? These steps fix most problems.",
    sections: [
      ["Game not starting", ["Make sure you have a stable internet connection.", "Reload the page, then tap Play Now again.", "Try a different browser (Chrome, Safari or Firefox)."]],
      ["Login code not arriving", ["Check the phone number and country code.", "Wait 30 seconds, then tap “Resend code”.", "Make sure your phone can receive SMS."]],
      ["Subscription & billing", ["The first day is free, then up to PKR 12/day (incl. tax) with auto-renewal.", "To stop the subscription, send UNSUB to 9825 or use the Slypee menu."]],
      ["Still need help?", ["Read the FAQ for more answers."]]
    ]
  },
  privacy: {
    title: "Privacy policy",
    intro: "This policy explains what information this site uses and why.",
    sections: [
      ["Information we use", ["Your mobile number, when you log in, to send your login code and identify your account.", "Games you play, how long you play them and your ratings, to show your history and suggest games.", "Your saved games, recent searches and language choice."]],
      ["Where it is stored", ["Your play history, saved games, searches and language are stored in your browser on this device. They are not uploaded to our servers."]],
      ["Services we rely on", ["Games are served by Slypee (jazz.slypee.pk). When you open a game, that site receives your visit.", "Fonts are loaded from Google Fonts and flag images from flagcdn.com. These services see your IP address when your browser downloads them.", "The site is hosted on Vercel."]],
      ["We do not", ["sell your personal information.", "show you third-party advertising on this site."]],
      ["Your choices", ["You can log out at any time from your profile.", "You can remove everything this site stored on this device with the button below."]]
    ],
    clear: true
  },
  terms: {
    title: "Terms of use",
    intro: "By using Slypee you agree to these terms.",
    sections: [
      ["The service", ["Slypee lets you discover and play games from Jazz and GameNow. Games may be added, changed or removed at any time."]],
      ["Subscription & billing", ["New players get a 1-day free trial.", "After the trial, the subscription renews automatically at up to PKR 12 per day (including tax), charged to your Jazz account.", "You can stop the subscription at any time via the Slypee menu or by sending UNSUB to 9825."]],
      ["Your account", ["Log in only with a mobile number you own and keep your login code private.", "You are responsible for activity on your account."]],
      ["Fair use", ["Don't misuse the service, try to break it, or interfere with other players."]],
      ["Games from partners", ["Some games are provided by third parties. Their content and availability are their responsibility."]],
      ["Changes", ["We may update these terms. The date at the top shows the latest version."]]
    ]
  }
};

export const INFO_PAGES = Object.keys(INFO);
