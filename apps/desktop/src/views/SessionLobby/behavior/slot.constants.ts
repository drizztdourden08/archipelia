/* @layer renderer-app @kind config */
import type { LobbySeatStatus } from '@archipelia/design';
import { SEAT_STATUS } from '../SessionLobby.constants';

const SLOT_TEXT = {
  slot: 'Slot',
  unnamed: 'Unnamed',
  noGame: 'no game yet',
  anyGame: 'any allowed game',
  newName: 'New slot',
  newMeta: 'Choose how this slot is filled',
  openName: 'Open slot',
  openMeta: 'Waiting for anyone to join',
  setItUp: 'Set it up to make it ready',
  profile: 'Profile',
  importedFile: 'Imported file',
  addedHere: 'Added here',
  keepConfirmTitle: 'Make this slot Direct?',
  keepConfirmMessage: 'The name, the game and the settings of this slot are dropped. A player can then join it from their own client.',
  keepConfirmLabel: 'Make it Direct',
  sideLabel: (slot: number) => `Who fills slot ${slot}`,
  changes: (count: number) => `${count} ${count === 1 ? 'change' : 'changes'}`,
} as const;

const SLOT_STATUS = {
  ready: SEAT_STATUS.ready,
  needsFix: SEAT_STATUS.needsFix,
  open: { label: 'Open', tone: 'neutral', title: 'No player has joined this slot yet.' },
  needsSetup: { label: 'Needs setup', tone: 'warning', title: 'A set slot needs a name and a game before Run.' },
  needsFile: { label: "Needs its app's file", tone: 'danger', title: 'This game makes its player file in its own app. Import that file, or make the slot Direct.' },
} as const satisfies Record<string, LobbySeatStatus>;

const SLOT_DIALOG = {
  title: (slot: number, name: string) => `${SLOT_TEXT.slot} ${slot} · ${name}`,
  name: 'Name',
  game: 'Game',
  profile: 'Profile',
  playerFile: 'Player file',
  importFile: 'Import file',
  settings: 'Settings',
  settingsFromFile: 'Settings · from the file',
  resetToPreset: 'Reset to preset',
  cancel: 'Cancel',
  save: 'Save slot',
  appFile: (game: string) => `${game} writes its own player file. Save the Archipelago files in its app and import them here, or make this slot Direct and join from the app.`,
} as const;

export { SLOT_DIALOG, SLOT_STATUS, SLOT_TEXT };
