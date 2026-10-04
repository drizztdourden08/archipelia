/* @layer renderer-app @kind config */
const STOPPED_WIDGETS: [string, RegExp][] = [
  ['players', /Ana[\s\S]*Bo[\s\S]*checks/],
  ['hints', /Ana[\s\S]*Bo|Bo[\s\S]*Ana/],
  ['room', /Seed[\s\S]*Output/],
  ['log', /Hosting game at/],
  ['console', /Commands need a hosting room\./],
];

const SPOILER_WIDGET: [string, RegExp][] = [['spoiler', /Archipelago/]];

const LIVE_WIDGETS: [string, RegExp][] = [
  ['players', /Ana[\s\S]*connected|Ana[\s\S]*playing/],
  ['log', /Ana \(Team #1\) playing APQuest has joined/],
  ['hints', /Ana's|Bo's/],
  ['console', /Send/],
];

export { LIVE_WIDGETS, SPOILER_WIDGET, STOPPED_WIDGETS };
