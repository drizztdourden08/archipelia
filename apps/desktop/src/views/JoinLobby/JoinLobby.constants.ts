/* @layer renderer-app @kind config */
const TEXT = {
  intro: 'Join a lobby that runs on another computer. Look for servers on your network, or type the address and the lobby code you were given.',
  empty: 'No other server found on your network yet. A server shows up here when its host chose My local network (LAN).',
  looking: 'Looking for servers on your network.',
  notLooking: 'Archipelia listens on your network only while you look for servers.',
  next: 'Joining from Archipelia comes next. Until then, join with a client such as Relic of the Past, using this address and the code.',
  joinable: 'Open for players',
  notJoinable: 'Not open for players now',
  open: 'Open lobbies',
  closed: 'No open lobby',
} as const;

const FAILURE = { probe: 'Could not look at the lobby.' } as const;

export { FAILURE, TEXT };
