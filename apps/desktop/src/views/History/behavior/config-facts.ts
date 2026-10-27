/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { SessionTemplate } from '@archipelia/model';
import { hostLabel } from '@archipelia/model';
import { SPOILER_LABEL } from '../History.constants';

const onOff = (value: boolean | undefined): string => (value ? 'On' : 'Off');

const plain = (value: string): string => `${value.charAt(0).toUpperCase()}${value.slice(1).replace(/-/g, ' ')}`;

const directText = ({ direct }: SessionTemplate): string => (direct ? plain(direct.admission) : 'Off');

const wherePart = (template: SessionTemplate): FactsPanelFact[] => [
  { label: 'Where', value: hostLabel(template.host) },
  { label: 'Open to the LAN', value: onOff(template.lan) },
  { label: 'Direct connections', value: directText(template) },
];

const generatorPart = ({ generator }: SessionTemplate): FactsPanelFact[] => [
  { label: 'Spoiler', value: SPOILER_LABEL[generator.spoiler] },
  { label: 'Race mode', value: onOff(generator.race) },
  { label: 'Progression balancing', value: onOff(generator.progressionBalancing) },
];

const serverPart = ({ server }: SessionTemplate): FactsPanelFact[] => [
  { label: 'Hint cost', value: `${server.hintCost} percent` },
  { label: 'Release', value: plain(server.releaseMode) },
  { label: 'Collect', value: plain(server.collectMode) },
  { label: 'Remaining', value: plain(server.remainingMode) },
  { label: 'Auto shutdown', value: server.autoShutdownMinutes > 0 ? `${server.autoShutdownMinutes} minutes` : 'Off' },
  { label: 'Room password', value: server.passwordRef ? 'Set' : 'None' },
];

const configFacts = (template: SessionTemplate): FactsPanelFact[][] => [wherePart(template), generatorPart(template), serverPart(template)];

export { configFacts };
