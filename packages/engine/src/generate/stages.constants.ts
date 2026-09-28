/* @layer core @kind config */
import type { StageRule } from './stages.type';

const STAGE_RULES: StageRule[] = [
  { pattern: /Generating for \d+ players?/, stage: 'rolling' },
  { pattern: /Creating MultiWorld\./, stage: 'worlds' },
  { pattern: /Creating Items\./, stage: 'items' },
  { pattern: /Calculating Access Rules\./, stage: 'rules' },
  { pattern: /Filling the multiworld with \d+ items/, stage: 'fill' },
  { pattern: /Current fill step \(.*\) at (\d+)\/(\d+) items placed/, stage: 'fill', counts: true },
  { pattern: /Balancing multiworld progression|Skipping multiworld progression balancing|Progression balancing skipped/, stage: 'balance' },
  { pattern: /Beginning output/, stage: 'output' },
  { pattern: /Generating output files \((\d+)\/(\d+)\)/, stage: 'output', counts: true },
  { pattern: /Creating final archive at (.+)/, stage: 'archive', detail: true },
  { pattern: /Done\. Enjoy\./, stage: 'done' },
];

export { STAGE_RULES };
