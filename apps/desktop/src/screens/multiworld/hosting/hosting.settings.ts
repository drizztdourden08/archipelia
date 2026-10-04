/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { RELEASE_OPTIONS, REMAINING_OPTIONS } from '@archipelia/design';

const meta: ScreenMeta = { title: 'Hosting', icon: 'radio', order: 2, keywords: ['defaults', 'port', 'server', 'release', 'collect', 'hints'] };

const hosts = [
  { value: 'local', label: 'This computer', hint: 'Runs the server here; players connect to this computer.' },
  { value: 'archipelago-gg', label: 'archipelago.gg', hint: 'Uploads the seed and the website hosts the room.' },
];

const asPercent = (value: number): string => `${value}%`;

const sections: Section[] = [
  {
    id: 'new-sessions',
    title: 'New sessions',
    items: [
      {
        key: 'hostingDefaultHost',
        label: 'Default host',
        description: 'Where a new session runs its server.',
        hint: 'Each session keeps its own copy, so changing this never rewrites one.',
        keywords: 'local archipelago.gg',
        control: { kind: 'choice', options: hosts },
      },
      {
        key: 'hostingLocalPort',
        label: 'Local port',
        description: 'Players connect to this computer on this port.',
        hint: 'Between 1024 and 65535; open it in the firewall for players outside this network.',
        keywords: 'network firewall',
        control: { kind: 'number', min: 1024, max: 65535, step: 1 },
      },
    ],
  },
  {
    id: 'server-rules',
    title: 'Server rules',
    items: [
      {
        key: 'hostingHintCost',
        label: 'Hint cost',
        description: "Percent of a player's checks that one hint costs.",
        hint: 'At 0 every hint is free.',
        control: { kind: 'range', min: 0, max: 100, step: 1, format: asPercent },
      },
      {
        key: 'hostingReleaseMode',
        label: 'Release mode',
        description: 'When a player may send out every item left in their world.',
        hint: 'Auto releases once the player reaches their goal.',
        control: { kind: 'choice', options: RELEASE_OPTIONS },
      },
      {
        key: 'hostingCollectMode',
        label: 'Collect mode',
        description: 'When a player may take back every item of theirs left in other worlds.',
        hint: 'Auto collects once the player reaches their goal.',
        control: { kind: 'choice', options: RELEASE_OPTIONS },
      },
      {
        key: 'hostingRemainingMode',
        label: 'Remaining mode',
        description: 'When a player may list the items still missing from their world.',
        hint: 'After goal allows it once the player reaches their goal.',
        control: { kind: 'choice', options: REMAINING_OPTIONS },
      },
      {
        key: 'hostingAutoShutdownMinutes',
        label: 'Auto shutdown',
        description: 'Minutes without activity before the server stops. 0 keeps it up.',
        hint: 'Counts from the last location check any player sent.',
        keywords: 'idle timeout stop',
        control: { kind: 'number', min: 0, step: 1, unit: 'minutes' },
      },
    ],
  },
];

export default sections;
export { meta };
