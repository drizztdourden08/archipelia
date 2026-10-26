/* @layer renderer-app @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { PORT_RANGE, SERVER_TEXT } from '@archipelia/design';
import type { JoinRowsInput, SessionPlace } from '../SessionBuilder.type';
import { DIRECT_TEXT, PLACE_TEXT, REMOTE_TEXT } from './place.constants';

const spotRow = ({ draft, place, remoteOptions, remoteValue, busy, onRemote, onPort }: JoinRowsInput): SettingsSectionRow[] => {
  if (place === 'remote') return [{ id: 'server', ...REMOTE_TEXT.row, disabled: busy, input: { kind: 'select', value: remoteValue, options: remoteOptions, onChange: onRemote } }];
  const { host } = draft;
  const text = SERVER_TEXT.localPort;
  if (host.kind !== 'local') return [];
  return [{
    id: 'port', title: text.label, description: text.description, hint: text.hint, keywords: text.keywords,
    input: { kind: 'number', ...PORT_RANGE, value: host.port, onChange: onPort },
  }];
};

const directRows = ({ draft, busy, onAllow, onOptions }: JoinRowsInput): SettingsSectionRow[] => {
  const { direct } = draft;
  const allow: SettingsSectionRow = { id: 'allow', ...DIRECT_TEXT.allow, disabled: busy, input: { kind: 'toggle', value: direct !== undefined, onChange: onAllow } };
  if (!direct) return [allow];
  return [
    allow,
    { id: 'approval', ...DIRECT_TEXT.approval, disabled: busy, input: { kind: 'toggle', value: direct.admission === 'host-approval', onChange: (on) => onOptions({ admission: on ? 'host-approval' : 'open' }) } },
    { id: 'unlisted', ...DIRECT_TEXT.unlisted, disabled: busy, input: { kind: 'toggle', value: direct.allowUnlisted, onChange: (allowUnlisted) => onOptions({ allowUnlisted }) } },
  ];
};

const joinRows = (input: JoinRowsInput): SettingsSectionRow[] => {
  const { place, placeOptions, busy, password, draft, onPlace } = input;
  const passwordHint = draft.server.passwordRef ? DIRECT_TEXT.passwordStored : DIRECT_TEXT.password.hint;
  return [
    { id: 'where', ...PLACE_TEXT.where, disabled: busy, input: { kind: 'segmented', value: place, options: placeOptions, onChange: (value) => onPlace(value as SessionPlace) } },
    ...spotRow(input),
    ...directRows(input),
    { id: 'password', ...DIRECT_TEXT.password, hint: passwordHint, input: { kind: 'custom', control: password } },
  ];
};

export { joinRows };
