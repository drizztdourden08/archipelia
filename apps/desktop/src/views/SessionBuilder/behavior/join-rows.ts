/* @layer renderer-app @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { PORT_RANGE, SERVER_TEXT } from '@archipelia/design';
import { sessionReach } from '../../../lobbies/session-reach';
import type { JoinRowsInput, SessionPlace } from '../SessionBuilder.type';
import { DIRECT_TEXT, PLACE_TEXT, REMOTE_TEXT } from './place.constants';

const spotRow = ({ draft, live, place, remoteOptions, remoteValue, busy, onRemote, onPort }: JoinRowsInput): SettingsSectionRow[] => {
  if (place === 'remote') {
    return [{ id: 'server', ...REMOTE_TEXT.row, disabled: busy, lock: live ? PLACE_TEXT.live : null, input: { kind: 'select', value: remoteValue, options: remoteOptions, onChange: onRemote } }];
  }
  const { host } = draft;
  const text = SERVER_TEXT.localPort;
  if (host.kind !== 'local') return [];
  return [{
    id: 'port', title: text.label, description: text.description, hint: text.hint, keywords: text.keywords,
    input: { kind: 'number', ...PORT_RANGE, value: host.port, onChange: onPort },
  }];
};

const allowRow = ({ draft, live, busy, onAllow }: JoinRowsInput): SettingsSectionRow => {
  const reach = sessionReach(draft);
  const remote = reach === 'gg' || reach === 'ssh';
  const on = draft.direct !== undefined;
  const lock = live ? DIRECT_TEXT.live : null;
  return {
    id: 'allow', ...DIRECT_TEXT.allow, hint: DIRECT_TEXT.reach[reach], disabled: busy || (remote && !on), lock,
    ...(remote && on ? { problem: DIRECT_TEXT.mismatch } : {}),
    input: { kind: 'toggle', value: on, onChange: onAllow },
  };
};

const worldsRows = ({ directWorlds, worlds, draft }: JoinRowsInput): SettingsSectionRow[] => {
  if (directWorlds.length === 0) return [];
  const blocked = !draft.direct?.allowUnlisted && directWorlds.some((world) => !world.listed);
  const { title, description, hint, unlisted } = DIRECT_TEXT.worlds;
  return [{ id: 'worlds', title, description, hint: blocked ? unlisted : hint, content: worlds }];
};

const directRows = (input: JoinRowsInput): SettingsSectionRow[] => {
  const { direct } = input.draft;
  const { busy, onOptions } = input;
  if (!direct) return [allowRow(input)];
  return [
    allowRow(input),
    ...worldsRows(input),
    { id: 'approval', ...DIRECT_TEXT.approval, disabled: busy, input: { kind: 'toggle', value: direct.admission === 'host-approval', onChange: (on) => onOptions({ admission: on ? 'host-approval' : 'open' }) } },
    { id: 'unlisted', ...DIRECT_TEXT.unlisted, disabled: busy, input: { kind: 'toggle', value: direct.allowUnlisted, onChange: (allowUnlisted) => onOptions({ allowUnlisted }) } },
  ];
};

const passwordHint = ({ draft }: JoinRowsInput): string => {
  if (sessionReach(draft) === 'archipelia') return DIRECT_TEXT.passwordRemote;
  return draft.server.passwordRef ? DIRECT_TEXT.passwordStored : DIRECT_TEXT.password.hint;
};

const joinRows = (input: JoinRowsInput): SettingsSectionRow[] => {
  const { place, placeOptions, busy, password, onPlace } = input;
  return [
    { id: 'where', ...PLACE_TEXT.where, disabled: busy, input: { kind: 'segmented', value: place, options: placeOptions, onChange: (value) => onPlace(value as SessionPlace) } },
    ...spotRow(input),
    ...directRows(input),
    { id: 'password', ...DIRECT_TEXT.password, hint: passwordHint(input), input: { kind: 'custom', control: password } },
  ];
};

export { joinRows };
