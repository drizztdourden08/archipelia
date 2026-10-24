/* @layer renderer-app @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { NO_ENGINE, SLOT_RANGE, TEXT } from '../LobbyCreate.constants';
import type { RowsInput } from '../LobbyCreate.type';
import { roomRows } from './room-rows';

const createRows = (input: RowsInput): SettingsSectionRow[] => {
  const { draft, view, problems, onDraft } = input;
  const problem = (field: string) => problems.find((entry) => entry.field === field)?.message;
  return [
    { id: 'name', ...TEXT.name, problem: problem('name'), input: { kind: 'text', value: draft.name, placeholder: 'Friday seed', onChange: (name) => onDraft({ ...draft, name }) } },
    { id: 'approval', ...TEXT.approval, input: { kind: 'toggle', value: draft.admission === 'host-approval', onChange: (on) => onDraft({ ...draft, admission: on ? 'host-approval' : 'open' }) } },
    { id: 'unlisted', ...TEXT.unlisted, input: { kind: 'toggle', value: draft.allowUnlisted, onChange: (allowUnlisted) => onDraft({ ...draft, allowUnlisted }) } },
    ...roomRows(input),
    { id: 'version', ...TEXT.version, disabled: true, problem: view && !view.engine ? NO_ENGINE : undefined, input: { kind: 'text', value: view ? (view.engine?.ap ?? 'Not installed') : 'Checking', onChange: () => undefined } },
    { id: 'slots', ...TEXT.slots, problem: problem('slots'), input: { kind: 'number', ...SLOT_RANGE, value: draft.maxSlots, onChange: (maxSlots) => onDraft({ ...draft, maxSlots }) } },
  ];
};

export { createRows };
