/* @layer renderer-app @kind logic */
import type { SettingsItem } from '@drizztdourden08/tessera/composites';
import type { ReleaseMode, RemainingMode, ServerSettings } from '@archipelia/model';
import type { ServerOptionsFormProps } from '../ServerOptionsForm.type';
import { HINT_COST_RANGE, RELEASE_OPTIONS, REMAINING_OPTIONS, SERVER_TEXT, SHUTDOWN_RANGE } from '../ServerOptionsForm.constants';
import { percentText } from './percent-text';
import { rowOf } from './row-of';
import { wholeNumber } from './whole-number';

const serverRuleRows = (server: ServerSettings, onServer: ServerOptionsFormProps['onServer']): SettingsItem[] => [
  {
    ...rowOf('hintCost', SERVER_TEXT.hintCost),
    input: {
      kind: 'slider', ...HINT_COST_RANGE, value: server.hintCost, formatValue: percentText,
      onChange: (value) => onServer({ hintCost: wholeNumber(value, HINT_COST_RANGE.max) }),
    },
  },
  {
    ...rowOf('releaseMode', SERVER_TEXT.releaseMode),
    input: { kind: 'select', value: server.releaseMode, options: RELEASE_OPTIONS, onChange: (value) => onServer({ releaseMode: value as ReleaseMode }) },
  },
  {
    ...rowOf('collectMode', SERVER_TEXT.collectMode),
    input: { kind: 'select', value: server.collectMode, options: RELEASE_OPTIONS, onChange: (value) => onServer({ collectMode: value as ReleaseMode }) },
  },
  {
    ...rowOf('remainingMode', SERVER_TEXT.remainingMode),
    input: { kind: 'segmented', value: server.remainingMode, options: REMAINING_OPTIONS, onChange: (value) => onServer({ remainingMode: value as RemainingMode }) },
  },
  {
    ...rowOf('autoShutdownMinutes', SERVER_TEXT.autoShutdownMinutes),
    input: { kind: 'number', ...SHUTDOWN_RANGE, value: server.autoShutdownMinutes, onChange: (value) => onServer({ autoShutdownMinutes: wholeNumber(value) }) },
  },
];

export { serverRuleRows };
