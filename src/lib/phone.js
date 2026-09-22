/* "+92 300 ••• 4567" for the numbers the login form makes, still works for older plain ones */
export const mask = n => {
  const m = /^(\+\d+) (\d+)$/.exec(n);
  return m ? `${m[1]} ${m[2].slice(0, 3)} ••• ${m[2].slice(-4)}` : `${n.slice(0, 4)} ••• ${n.slice(-4)}`;
};
