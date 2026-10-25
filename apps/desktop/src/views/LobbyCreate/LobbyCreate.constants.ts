/* @layer renderer-app @kind config */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';

const DEFAULT_MAX_SLOTS = 16;

const SLOT_RANGE = { min: 1, max: 500, step: 1 };

const DEFAULT_GG_SITE = 'https://archipelago.gg';

const ROOM_OPTIONS: SettingsOption[] = [
  { value: 'local', label: 'On the server', hint: 'The room runs on the computer of the server; players connect to it there.' },
  { value: 'remote', label: 'Remote machine', hint: 'The room runs on a saved machine you reach over SSH.' },
  { value: 'archipelago-gg', label: 'archipelago.gg', hint: 'The seed is uploaded and the website hosts the room.' },
];

const TEXT = {
  name: { title: 'Name', description: 'What players see when they ask the server about this lobby.', hint: 'Any name you like, such as Friday seed.' },
  approval: { title: 'Host approval', description: 'You approve each player before the server parses or runs anything they sent.', hint: 'Keep it on: a lobby code can leak.' },
  unlisted: { title: 'Allow unlisted clients', description: 'Let clients that are not in the registry join. Each of their worlds needs your consent before it runs.', hint: 'An unlisted world runs its Python code with your user rights.' },
  room: { title: 'Room host', description: 'Where the Archipelago room of this lobby runs once it starts.', hint: 'The room runs on the server computer unless you pick another place.' },
  port: { title: 'Room port', description: 'Players connect to the room on this port.', hint: 'Between 1024 and 65535; open it on the router for players outside your network.' },
  machine: { title: 'Machine', description: 'The saved machine that hosts the room.', hint: 'Add or edit machines in Servers.' },
  gg: { title: 'Website', description: 'The website that hosts the room.', hint: 'Change the site in the archipelago.gg settings.' },
  version: { title: 'Archipelago version', description: 'The version of the engine on this server. Players must run the same one.', hint: 'Change the engine in Engine.' },
  slots: { title: 'Maximum slots', description: 'How many slots all players together may bring.', hint: 'A player with several slots uses several.' },
} as const;

const PRIVATE_NOTE = 'This lobby is private: only this computer can join it. To let other computers join, choose My local network (LAN) under Where to host on the Lobbies page.';

const NO_ENGINE = 'This server has no Archipelago engine yet, so it cannot open a lobby. Set one up in Engine first.';

const NO_MACHINE = 'No remote machine yet. Add one in Servers.';

const PROBLEM = {
  name: 'Give the lobby a name.',
  machine: 'Pick the machine that hosts the room.',
  slots: 'The maximum must be between 1 and 500.',
} as const;

const FAILURE = { create: 'Could not open the lobby.', view: 'Could not read the engine of the server.' } as const;

export { DEFAULT_GG_SITE, DEFAULT_MAX_SLOTS, FAILURE, NO_ENGINE, PRIVATE_NOTE, NO_MACHINE, PROBLEM, ROOM_OPTIONS, SLOT_RANGE, TEXT };
