/* @layer renderer-app @kind logic */
import type { SettingsOption, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { PORT_RANGE } from '@archipelia/design';
import { NO_MACHINE, ROOM_OPTIONS, TEXT } from '../LobbyCreate.constants';
import type { RoomKind, RowsInput } from '../LobbyCreate.type';
import { roomOfKind } from './room-of-kind';

const roomOptions = ({ local, machines }: RowsInput): SettingsOption[] =>
  ROOM_OPTIONS.filter((option) => local || option.value !== 'remote').map((option) =>
    (option.value === 'remote' && machines.length === 0 ? { ...option, disabled: NO_MACHINE } : option));

const placeRow = (input: RowsInput): SettingsSectionRow | null => {
  const { draft, machines, defaults, onDraft } = input;
  const { room } = draft;
  const problem = (field: string) => input.problems.find((entry) => entry.field === field)?.message;
  if (room.kind === 'local') {
    return { id: 'port', ...TEXT.port, problem: problem('port'), input: { kind: 'number', ...PORT_RANGE, value: room.port, onChange: (port) => onDraft({ ...draft, room: { kind: 'local', port } }) } };
  }
  if (room.kind === 'remote') {
    const options = machines.map((machine) => ({ value: machine.id, label: machine.label }));
    return { id: 'machine', ...TEXT.machine, problem: problem('machine'), input: { kind: 'select', value: room.serverId, options, onChange: (serverId) => onDraft({ ...draft, room: { kind: 'remote', serverId } }) } };
  }
  return { id: 'website', ...TEXT.gg, disabled: true, input: { kind: 'text', value: room.baseUrl ?? defaults.ggBaseUrl, onChange: () => undefined } };
};

const roomRows = (input: RowsInput): SettingsSectionRow[] => {
  const { draft, machines, defaults, onDraft } = input;
  const place = placeRow(input);
  const choose = (kind: string) => onDraft({ ...draft, room: roomOfKind(kind as RoomKind, draft.room, machines, defaults) });
  return [
    { id: 'room', ...TEXT.room, input: { kind: 'segmented', value: draft.room.kind, options: roomOptions(input), onChange: choose } },
    ...(place ? [place] : []),
  ];
};

export { roomRows };
