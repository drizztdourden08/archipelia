/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { Session } from '@archipelia/model';

const filesText = (count: number): string => `${count} ${count === 1 ? 'file' : 'files'}`;

const outputFacts = ({ seed, output }: Session): FactsPanelFact[] => [
  seed ? { label: 'Seed', value: seed, mono: true, copyable: 'seed' } : { label: 'Seed', value: 'None yet' },
  { label: 'Files', value: output ? filesText(output.files.length) : 'No output' },
  { label: 'Spoiler', value: output?.spoiler ?? 'None' },
  ...(output ? [{ label: 'Archive', value: output.zip, mono: true }] : []),
];

export { outputFacts };
