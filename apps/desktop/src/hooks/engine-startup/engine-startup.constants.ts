/* @layer renderer-app @kind config */
const SIZE_TEXT = 'About 90 MB';

const FIRST_RUN_TEXT = {
  title: 'Set up the engine',
  message: 'Archipelia makes seeds and runs servers with a private engine: a Python and the Archipelago release you pick. Only stable releases are listed. Archipelago has no long-term support line.',
  confirmLabel: 'Install',
  cancelLabel: 'Not now',
  noList: 'Archipelia could not read the release list from GitHub, so it offers the version it was tested with. Installing needs the network.',
  archipelago: (ap: string) => `${ap}, the newest stable one`,
  python: (python: string) => `${python}, or the newest that fits`,
  requirements: 'Installed with pip',
  noPython: (ap: string) => `No Python build fits Archipelago ${ap}. Pick another release in Settings, Engine.`,
} as const;

const OFFER_TEXT = {
  title: (to: string) => `Archipelago ${to} is out`,
  message: (from: string, python: string) => `You run Archipelago ${from}. Upgrade now? It installs beside the current engine with Python ${python} and switches after a test. You will not be asked again for this version. Settings, Engine has every version.`,
  confirmLabel: 'Upgrade',
  cancelLabel: 'Not now',
  notes: 'Release notes',
} as const;

export { FIRST_RUN_TEXT, OFFER_TEXT, SIZE_TEXT };
