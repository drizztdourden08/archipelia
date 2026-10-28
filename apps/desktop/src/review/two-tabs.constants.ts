/* @layer renderer-app @kind config */
const NETWORK_CONTENT = /Lobby server on this computer[\s\S]*Network mode[\s\S]*This session/;

const LOBBY_WIDGETS: [string, RegExp][] = [
  ['network', NETWORK_CONTENT],
  ['players', /Seats \(2\)[\s\S]*Ana[\s\S]*Bo/],
  ['room', /not running yet/],
  ['log', /The lobby opened/],
];

const HOSTING_WIDGETS: [string, RegExp][] = [['network', NETWORK_CONTENT], ['players', /Ana[\s\S]*Bo/], ['room', /Seed[\s\S]*Output|Address|Hosting/]];

export { HOSTING_WIDGETS, LOBBY_WIDGETS };
