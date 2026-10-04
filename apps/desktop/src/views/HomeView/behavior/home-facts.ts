/* @layer renderer-app @kind logic */
import type { FactsPanelGroup } from '@drizztdourden08/tessera/composites';
import { RUN_STATUS } from '@archipelia/design';
import type { HomeFactsInput } from '../HomeView.type';
import { engineMeta } from './engine-meta';
import { engineValue } from './engine-value';
import { gamesMeta } from './games-meta';
import { presetsMeta } from './presets-meta';
import { sessionMeta } from './session-meta';

const homeFacts = ({ last, now, status, counts, installed, presets }: HomeFactsInput): FactsPanelGroup[] => [
  [{ label: 'Last session', value: last?.snapshot.name ?? 'None yet', title: last ? `${RUN_STATUS[last.status].label} · ${sessionMeta(last, now)}` : 'Build one in Sessions' }],
  [
    { label: 'Games', value: String(counts.games), title: gamesMeta(installed) },
    { label: 'Presets', value: String(counts.presets), title: presetsMeta(presets) },
    { label: 'Templates', value: String(counts.templates), title: 'saved sessions' },
  ],
  [{ label: 'Engine', value: engineValue(status), title: engineMeta(status), mono: true }],
];

export { homeFacts };
