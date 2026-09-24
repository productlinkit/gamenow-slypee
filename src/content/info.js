/* Help & legal pages. English only for now — the menu labels are translated.
   The free day and UNSUB 9825 are copied from Slypee's own subscription notice. No prices are
   stated here on purpose: the charge belongs to the subscription page, and a price
   copied into this repo would only go stale. See lib/subscription.js for the hand-over.
   Privacy/terms are a draft describing what this site actually does; have them reviewed before launch. */
export const UPDATED = "22 September 2026";

export const INFO = {
  faq: {
    title: "Frequently asked questions",
    intro: "Quick answers about playing on Slypee.",
    faq: [
      ["What is Slypee?", "Slypee is a games portal from Jazz, brought to you with GameNow. You can play HTML5 games instantly in your browser or download app games through Slypee. It is a Jazz value-added service on shortcode 9825, charged to your Jazz balance."],
      ["Do I need to install anything?", "HTML5 games open straight in your browser — no install or download. Games marked “App” are downloaded through Slypee."],
      ["How much does it cost?", "New players get 1 day of free play. After that the subscription is charged to your mobile balance, and the exact charge including tax is shown on the subscription page before you confirm. It renews on its own until you stop it."],
      ["What does a plan include?", "Every game on Slypee — the HTML5 games that open in your browser and the app games you download — with no ads on the portal and nothing to pay per game. One plan works on any device you log in to with your number."],
      ["How do I subscribe?", "Tap Subscribe on the portal. A pop-up shows the ways to subscribe — today that is “Subscribe through Jazz”. Choosing it opens the subscription page in its own window, where you enter your mobile number and confirm. When it's done the window closes and you are back on Slypee, subscribed."],
      ["Does Slypee take my payment?", "No. The portal never asks for a card, a PIN or a password for payment. The whole subscription is completed on the subscription page and charged to your Jazz account, and Jazz texts you from 9825 to confirm it."],
      ["How do I stop my subscription?", "Send UNSUB to 9825, or open Profile → Subscription → “Stop my subscription”, which takes you to Jazz to confirm. Renewal stops straight away and you keep playing until the period you already paid for ends."],
      ["Can I change my package?", "There is nothing to change — Slypee is one subscription charged to your balance, not a set of packages. Stop it any time with UNSUB to 9825 and subscribe again whenever you like."],
      ["What if my balance is too low at renewal?", "Renewals are handled by Jazz. If a renewal can't be charged, keep some balance on your number and it will go through on a later attempt; if it keeps failing the service stops and you can subscribe again from the portal."],
      ["Which SMS commands work on 9825?", "SUB starts the service, UNSUB stops it, STATUS tells you your plan and renewal date, and HELP gives pricing and support details."],
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
      ["Subscription & billing", ["Subscribing happens on the subscription page: tap Subscribe here, choose “Subscribe through Jazz”, enter your number and confirm — then you are sent back.", "The first day is free, then the subscription renews on its own, taken from your mobile balance. The charge is shown on the subscription page before you confirm.", "Keep balance on your number so renewals go through.", "Stop any time with UNSUB to 9825. Stopping keeps your access until the period you paid for ends."]],
      ["The Jazz page didn't finish", ["If you came back without subscribing, nothing was started and nothing was charged — tap Subscribe and try again.", "Make sure you are using the Jazz number you want the subscription on.", "Send STATUS to 9825 to see whether the service is already running."]],
      ["Still need help?", ["Send HELP to 9825, or read the FAQ for more answers."]]
    ]
  },
  privacy: {
    title: "Privacy policy",
    intro: "This policy explains what information this site uses and why.",
    sections: [
      ["Information we use", ["Your mobile number, when you log in, to send your login code, confirm a plan and identify your account.", "Games you play, how long you play them and your ratings, to show your history and suggest games.", "Your saved games, recent searches and language choice."]],
      ["Where it is stored", ["Your play history, saved games, searches and language are stored in your browser on this device. They are not uploaded to our servers.", "Your subscription status and renewal date are mirrored in this browser so the portal can show them. In this demo they are only kept here — no real subscription is created and nothing is charged."]],
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
      ["The service", ["Slypee lets you discover and play games from Jazz and GameNow. Games may be added, changed or removed at any time.", "Slypee is a value-added service provided over the Jazz network on shortcode 9825 and is available to Jazz subscribers."]],
      ["Subscription & billing", ["New players get a 1-day free trial, once per device.", "After the trial the subscription renews automatically, taken from your mobile balance. The charge and the tax are shown on the subscription page before you confirm; this portal quotes no price of its own.", "The subscription is taken out on the subscription page you reach from the Subscribe button on this portal. It is confirmed there, billed to your Jazz account and notified by SMS; this portal only shows the resulting status.", "Nothing is charged unless you complete the confirmation on that page.", "If a renewal cannot be charged, Jazz may retry and may end the subscription. You can subscribe again at any time.", "You can stop the subscription at any time in Profile → Subscription or by sending UNSUB to 9825. Access continues until the end of the period you paid for.", "Charges already made are not refunded when you stop the service."]],
      ["Your account", ["Log in only with a mobile number you own and keep your login code private.", "You are responsible for activity on your account."]],
      ["Fair use", ["Don't misuse the service, try to break it, or interfere with other players."]],
      ["Games from partners", ["Some games are provided by third parties. Their content and availability are their responsibility."]],
      ["Changes", ["We may update these terms. The date at the top shows the latest version."]]
    ]
  }
};

export const INFO_PAGES = Object.keys(INFO);
