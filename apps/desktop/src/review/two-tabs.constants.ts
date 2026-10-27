/* @layer renderer-app @kind config */
const LOBBY_WIDGETS: [string, RegExp][] = [['players', /has not run yet/], ['room', /has not run yet/]];

const HOSTING_WIDGETS: [string, RegExp][] = [['players', /Ana[\s\S]*Bo/], ['room', /Seed[\s\S]*Output|Address|Hosting/]];

export { HOSTING_WIDGETS, LOBBY_WIDGETS };
