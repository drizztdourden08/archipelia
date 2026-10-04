/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import {
  HINT_COST_RANGE, HOST_OPTIONS, PORT_RANGE, RELEASE_OPTIONS, REMAINING_OPTIONS, SERVER_TEXT, SHUTDOWN_RANGE, percentText,
} from '@archipelia/design';

const meta: ScreenMeta = { title: 'Hosting', icon: 'radio', order: 2, keywords: ['defaults', 'port', 'server', 'release', 'collect', 'hints'] };

const hosts = HOST_OPTIONS.filter((option) => option.value !== 'remote');

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
        control: { kind: 'choice', options: hosts, look: 'segmented' },
      },
      { key: 'hostingLocalPort', ...SERVER_TEXT.localPort, control: { kind: 'number', ...PORT_RANGE } },
    ],
  },
  {
    id: 'server-rules',
    title: 'Server rules',
    items: [
      { key: 'hostingHintCost', ...SERVER_TEXT.hintCost, control: { kind: 'range', ...HINT_COST_RANGE, format: percentText } },
      { key: 'hostingReleaseMode', ...SERVER_TEXT.releaseMode, control: { kind: 'choice', options: RELEASE_OPTIONS, look: 'select' } },
      { key: 'hostingCollectMode', ...SERVER_TEXT.collectMode, control: { kind: 'choice', options: RELEASE_OPTIONS, look: 'select' } },
      { key: 'hostingRemainingMode', ...SERVER_TEXT.remainingMode, control: { kind: 'choice', options: REMAINING_OPTIONS, look: 'segmented' } },
      { key: 'hostingAutoShutdownMinutes', ...SERVER_TEXT.autoShutdownMinutes, control: { kind: 'number', ...SHUTDOWN_RANGE } },
    ],
  },
];

export default sections;
export { meta };
