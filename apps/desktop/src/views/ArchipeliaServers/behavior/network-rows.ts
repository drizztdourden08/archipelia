/* @layer renderer-app @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { LobbyServerOptions } from '../../../lobbies/lobbies.type';
import { MODE_OPTIONS, MODE_VALUES, NETWORK_TEXT } from '../ArchipeliaServers.constants';

const networkRows = (options: LobbyServerOptions, busy: boolean, onApply: (patch: Partial<LobbyServerOptions>) => void): SettingsSectionRow[] => [
  {
    id: 'mode', ...NETWORK_TEXT.mode, disabled: busy,
    input: { kind: 'segmented', value: options.mode, options: MODE_OPTIONS, onChange: (value) => { const mode = MODE_VALUES.find((known) => known === value); if (mode) onApply({ mode }); } },
  },
  {
    id: 'lookup', ...NETWORK_TEXT.lookup, disabled: busy,
    input: { kind: 'toggle', value: options.publicLookup, onChange: (publicLookup) => onApply({ publicLookup }) },
  },
];

export { networkRows };
