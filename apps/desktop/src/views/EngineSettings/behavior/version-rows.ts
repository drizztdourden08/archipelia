/* @layer renderer-app @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { CHANGE_HINT, CHECK_ACTION, ROW_TEXT } from '../EngineSettings.constants';
import type { RowText, VersionRowsInput } from '../EngineSettings.type';
import { changeActions } from './change-actions';
import { feedLine } from './feed-line';
import { feedNotice } from './feed-notice';
import { pythonOptions } from './python-options';
import { releaseOptions } from './release-options';

const rowOf = (id: string, text: RowText) => ({ id, title: text.label, description: text.description, hint: text.hint, keywords: text.keywords });

const versionRows = (input: VersionRowsInput): SettingsSectionRow[] => {
  const { overview, chosen, plan, busy, checking, tag, when } = input;
  const change = rowOf('change', ROW_TEXT.change);
  return [
    {
      ...rowOf('archipelago', ROW_TEXT.archipelago), badge: tag, disabled: busy,
      input: { kind: 'select', searchable: true, value: chosen.ap ?? '', options: releaseOptions(overview), onChange: input.onAp },
    },
    {
      ...rowOf('python', ROW_TEXT.python), badge: tag, disabled: busy,
      input: { kind: 'select', searchable: true, value: chosen.python ?? '', options: pythonOptions(overview), onChange: input.onPython },
    },
    {
      ...rowOf('list', ROW_TEXT.list), hint: feedLine(overview.feed, when), problem: feedNotice(overview.feed, when),
      actions: [{ ...CHECK_ACTION, loading: checking, disabled: busy || checking, onSelect: input.onCheck }],
    },
    { ...change, hint: CHANGE_HINT[plan.kind], actions: changeActions(plan, busy, input.onApply) },
  ];
};

export { versionRows };
