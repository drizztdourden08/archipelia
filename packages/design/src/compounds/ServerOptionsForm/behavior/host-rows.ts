/* @layer renderer-app @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { HostKind, HostRowsInput } from '../ServerOptionsForm.type';
import { HOST_OPTIONS, HOST_TEXT, NO_SERVER_TEXT, PASSWORD_STORED_HINT, PORT_RANGE, SERVER_TEXT } from '../ServerOptionsForm.constants';
import { rowOf } from './row-of';

const placeRow = ({ host, serverOptions, onPort, onRemoteServer }: HostRowsInput): SettingsSectionRow | null => {
  if (host.kind === 'local') {
    return { ...rowOf('localPort', SERVER_TEXT.localPort), input: { kind: 'number', ...PORT_RANGE, value: host.port, onChange: onPort } };
  }
  if (host.kind !== 'remote') return null;
  if (serverOptions.length === 0) return { ...rowOf('server', HOST_TEXT.server), content: NO_SERVER_TEXT };
  return { ...rowOf('server', HOST_TEXT.server), input: { kind: 'select', value: host.serverId, options: serverOptions, onChange: onRemoteServer } };
};

const hostRows = (input: HostRowsInput): SettingsSectionRow[] => {
  const { host, hasPassword, room, onHostKind } = input;
  const place = placeRow(input);
  const password = rowOf('password', HOST_TEXT.password);
  return [
    { ...rowOf('host', HOST_TEXT.host), input: { kind: 'segmented', value: host.kind, options: HOST_OPTIONS, onChange: (value) => onHostKind(value as HostKind) } },
    ...(place ? [place] : []),
    { ...password, hint: hasPassword ? PASSWORD_STORED_HINT : password.hint, input: { kind: 'custom', control: room } },
  ];
};

export { hostRows };
