/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The direct connection of a session: the switch that lets Archipelia clients connect as players, Host approval, Allow unlisted clients, where to host, how players join, and the results of the room.',
  useWhen: [
    'The session editor, under the generation and server options.',
  ],
  avoidWhen: [
    { case: 'The players who connected.', use: 'LobbyMembers' },
    { case: 'Joining a session of another host as a player.', use: 'JoinSession' },
  ],
  rules: [
    'Turning Allow direct connection on opens a lobby on the server picked under Where to host and saves the session with it.',
    'Turning it off asks first, then closes the lobby.',
    'Host approval is on by default; turning it off accepts every player at once.',
    'Allow unlisted clients is off by default.',
    'Where to host shows only once direct connection is on, so nothing listens on the network before. Picking another server moves the lobby there; while players are connected the server stays.',
    'Show the session code with a copy button, the server address and the Archipelago version players must run.',
    'Show the room address, seed, files and any failure once the session ran.',
  ],
  a11y: [
    'Each setting is a labelled toggle.',
    'Every copy button is named by what it copies.',
    'A failure is an alert with one plain sentence.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the direct connection of a session'],
    rule: 'One lobby per session.',
  },
  example: `import { DirectConnection } from '../DirectConnection';

const DirectConnectionSample = () => (
  <DirectConnection busy={false} onEnable={() => undefined} onDisable={() => undefined} onOptions={() => undefined} />
);
`,
  propsHash: '30fe0d74afce83ae',
} satisfies ComponentUsage;

export { usage };
