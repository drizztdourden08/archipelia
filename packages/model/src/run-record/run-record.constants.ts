/* @layer core @kind config */
import type { SessionTemplate } from '../session.type';
import type { OverrideField } from './run-record.type';

const UNKNOWN_SOURCE_NAME = 'Unknown source';

const NOT_SET = 'none';

const onOff = (value: boolean | undefined): string => (value ? 'on' : 'off');

const passwordOf = (template: SessionTemplate): string => (template.server.passwordRef ? 'set' : NOT_SET);

const hostOf = ({ host }: SessionTemplate): string => {
  if (host.kind === 'local') return `local :${host.port}`;
  if (host.kind === 'archipelago-gg') return 'archipelago.gg';
  return `server ${host.serverId}`;
};

const OVERRIDE_FIELDS: readonly OverrideField[] = [
  { field: 'host', label: 'Where', read: hostOf },
  { field: 'lan', label: 'Open to the LAN', read: ({ lan }) => onOff(lan) },
  { field: 'lobby.serverId', label: 'Lobby server', read: ({ lobby }) => lobby?.serverId ?? NOT_SET },
  { field: 'direct.admission', label: 'Direct connections', read: ({ direct }) => direct?.admission ?? 'off' },
  { field: 'direct.allowUnlisted', label: 'Unlisted clients', read: ({ direct }) => onOff(direct?.allowUnlisted) },
  { field: 'server.password', label: 'Room password', read: passwordOf },
  { field: 'server.hintCost', label: 'Hint cost', read: ({ server }) => String(server.hintCost) },
  { field: 'server.releaseMode', label: 'Release', read: ({ server }) => server.releaseMode },
  { field: 'server.collectMode', label: 'Collect', read: ({ server }) => server.collectMode },
  { field: 'server.remainingMode', label: 'Remaining', read: ({ server }) => server.remainingMode },
  { field: 'server.autoShutdownMinutes', label: 'Auto shutdown (minutes)', read: ({ server }) => String(server.autoShutdownMinutes) },
  { field: 'generator.spoiler', label: 'Spoiler level', read: ({ generator }) => String(generator.spoiler) },
  { field: 'generator.race', label: 'Race mode', read: ({ generator }) => onOff(generator.race) },
  { field: 'generator.progressionBalancing', label: 'Progression balancing', read: ({ generator }) => onOff(generator.progressionBalancing) },
];

export { OVERRIDE_FIELDS, UNKNOWN_SOURCE_NAME };
