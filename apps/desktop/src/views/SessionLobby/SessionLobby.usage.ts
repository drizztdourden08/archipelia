/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The lobby phase of a session tab as a framed LobbyStage: the name with the phase, the place, the player count and the changes from saved, Close lobby and Run, the session code, a grid of roomy seats for the players of the host, the held seats and the players who joined, an Add player tile, and the config line with Edit.',
  useWhen: [
    'Inside the tab of a session that has not run yet.',
  ],
  avoidWhen: [
    { case: 'The name, Where, direct connections, the room password and the world settings.', use: 'SessionBuilder' },
    { case: 'The list of sessions and runs.', use: 'Sessions' },
  ],
  rules: [
    'Pass the live tab and its saved session, and draw the stage it hands to its children; the tab loads the saved session and says when it is gone, with a way to close the tab.',
    'Players added or changed here belong to this run only: they become overrides of the tab, sent when Run starts, and the saved session stays as it was.',
    'Show how many changes differ from the saved session as a chip, with the list in its tooltip.',
    'Draw the seats in a LobbySeatGrid inside a LobbyStage: a filled seat per player of the host with the art or initials of its game, its slot, game, origin and preset, a dashed held seat for a direct player who has not joined, and the Add player tile last.',
    'Say Saved or Added here in the meta of each seat, mark it Ready or Needs a fix, and keep Edit, Duplicate and Remove as small tools in its corner; an added seat offers Keep in session, which writes the player into the saved session.',
    'End the stage with the config line: hint cost, release, race, password, how players join and the allowed games, with Edit opening the setup of the session.',
    'Show the players who joined as seats from LobbyMembers after the seats of the host while direct connections are on; a waiting player is an attention seat with Approve and Refuse.',
    'Open a seat on pick in an editor under the grid with the name, the game, the preset and the overrides of the player.',
    'Run is off with a plain reason until at least one player is ready, own or joined and approved; a Run with player problems shows the list under the header, each with a link that opens its slot, and runs nothing.',
    'Close lobby asks only when someone joined, closes the lobby and the tab.',
    'Once the tab has a run, the tab keeps this stage mounted and swaps its content for the room, with LobbyState for a session whose room runs on an Archipelia server.',
  ],
  a11y: [
    'The seats are a group named Seats inside a Players region; each seat is a card named after the player, and its buttons carry that name.',
    'An off Run is described by its reason.',
    'An error is an alert with one plain sentence, and Retry when a load failed.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'a session that started, with its lobby and players'],
    rule: 'The lobby and the players of one started session.',
  },
  example: `import { LobbyStage } from '@archipelia/design';
import type { SessionTemplate } from '@archipelia/model';
import type { LiveTab } from '../../live/live.type';
import { SessionLobby } from '../SessionLobby';

const SessionLobbySample = ({ tab, saved }: { tab: LiveTab; saved: SessionTemplate }) => (
  <SessionLobby tab={tab} saved={saved}>{(stage) => <LobbyStage {...stage} />}</SessionLobby>
);
`,
  propsHash: 'pending',
} satisfies ComponentUsage;

export { usage };
