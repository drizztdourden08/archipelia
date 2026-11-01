/* @layer renderer-app @kind logic */
import { RELEASE_OPTIONS } from '@archipelia/design';
import type { LobbyStageFact } from '@archipelia/design';
import type { DirectConnection, SessionTemplate } from '@archipelia/model';
import { CONFIG_TEXT } from '../SessionLobby.constants';

const joiningOf = (direct: DirectConnection | undefined): string => {
  if (!direct) return CONFIG_TEXT.hostOnly;
  return direct.admission === 'host-approval' ? CONFIG_TEXT.withApproval : CONFIG_TEXT.open;
};

const configFacts = ({ server, generator, direct }: SessionTemplate): LobbyStageFact[] => [
  { label: CONFIG_TEXT.hintCost, value: `${server.hintCost}%` },
  { label: CONFIG_TEXT.release, value: RELEASE_OPTIONS.find((option) => option.value === server.releaseMode)?.label ?? server.releaseMode },
  { label: CONFIG_TEXT.race, value: generator.race ? CONFIG_TEXT.on : CONFIG_TEXT.off },
  { label: CONFIG_TEXT.password, value: server.passwordRef ? CONFIG_TEXT.set : CONFIG_TEXT.none },
  { label: CONFIG_TEXT.joining, value: joiningOf(direct) },
];

export { configFacts };
